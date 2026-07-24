import { useEffect, useRef, useState, useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";
import {
  Type,
  Square,
  Circle as CircleIcon,
  ImagePlus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowLeft,
  Layers,
  Palette,
  Sliders,
  Triangle,
  Minus,
  Lock,
  Unlock,
} from "lucide-react";
import { getPrintProduct, geometry } from "../../../lib/print/products";
import {
  getVcTemplate,
  getVcScheme,
  VC_SCHEMES,
  VC_TEMPLATES,
} from "../../../lib/print/templates-vc";
import { useTemplateThumbs } from "../../../lib/print/useTemplateThumbs";
import {
  makeWave,
  makeCornerBand,
  makeDivider,
  makeIconRow,
  makeQR,
  makeStar,
  makeBadge,
  makeArrow,
  makeDotGrid,
} from "../../../lib/print/design-elements";
import { attachSnapGuides } from "../../../lib/print/snap-guides";

const FONTS = ["Poppins", "Arial", "Georgia", "Courier New", "Times New Roman"];
const SWATCHES = [
  "#111827",
  "#ffffff",
  "#0037CA",
  "#DC2626",
  "#166534",
  "#CA8A04",
  "#7C3AED",
  "#EC4899",
];
const BACKGROUNDS = [
  "#ffffff",
  "#F7F6F2",
  "#0B2E59",
  "#111827",
  "#7A1F2B",
  "#12402E",
  "#F5F8FF",
  "#FEF3C7",
];

export default function Page() {
  const { routeParams, urlParsed } = usePageContext();
  const product = getPrintProduct(routeParams.product);
  const templateId = urlParsed?.search?.template || null;

  const elRef = useRef(null);
  const fabricRef = useRef(null);
  const guidesRef = useRef([]);
  const historyRef = useRef({ stack: [], i: -1, muted: false });
  const sidesRef = useRef({ front: null, back: null });
  const clipboardRef = useRef(null);
  const nudgeTimerRef = useRef(null);
  const sideRef = useRef("front");

  const [ready, setReady] = useState(false);
  const [side, setSide] = useState("front");
  const [zoom, setZoom] = useState(1);
  const [sel, setSel] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [schemeId, setSchemeId] = useState(urlParsed?.search?.scheme || "navy");
  const [galleryOpen, setGalleryOpen] = useState(false);

  const g = product ? geometry(product) : null;
  const thumbs = useTemplateThumbs(product, schemeId);
  const lsKey = (s) => `design:${product?.id}:v2:${s}`;

  const syncSel = useCallback(() => {
    const o = fabricRef.current?.getActiveObject();
    setSel(
      o
        ? {
            type: o.type,
            fill: o.fill,
            opacity: o.opacity,
            fontFamily: o.fontFamily,
            fontSize: o.fontSize,
            fontWeight: o.fontWeight,
            textAlign: o.textAlign,
            charSpacing: o.charSpacing,
            lineHeight: o.lineHeight,
            fontStyle: o.fontStyle,
            underline: o.underline,
            locked: !!o.lockMovementX,
          }
        : null,
    );
  }, []);

  const snapshot = useCallback(() => {
    const c = fabricRef.current;
    if (!c || historyRef.current.muted) return;
    const json = JSON.stringify(c.toJSON());
    const h = historyRef.current;
    h.stack = h.stack.slice(0, h.i + 1);
    h.stack.push(json);
    h.i = h.stack.length - 1;
    setCanUndo(h.i > 0);
    setCanRedo(false);
    try {
      localStorage.setItem(lsKey(sideRef.current), json);
    } catch {}
  }, [product]);

  const drawGuides = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    guidesRef.current.forEach((o) => c.remove(o));
    guidesRef.current = [];
    c.requestRenderAll();
  }, []);

  const applyJson = useCallback(
    async (json) => {
      const c = fabricRef.current;
      if (!c) return;
      historyRef.current.muted = true;
      try {
        await c.loadFromJSON(json);
        drawGuides();
        c.requestRenderAll();
      } finally {
        historyRef.current.muted = false;
      }
    },
    [drawGuides],
  );

  const undo = () => {
    const h = historyRef.current;
    if (h.i <= 0) return;
    h.i -= 1;
    applyJson(h.stack[h.i]);
    setCanUndo(h.i > 0);
    setCanRedo(true);
  };
  const redo = () => {
    const h = historyRef.current;
    if (h.i >= h.stack.length - 1) return;
    h.i += 1;
    applyJson(h.stack[h.i]);
    setCanRedo(h.i < h.stack.length - 1);
    setCanUndo(true);
  };

  const loadTemplate = async (tplId, schemeIdArg) => {
    const tpl = getVcTemplate(tplId);
    sidesRef.current = { front: null, back: null };
    try {
      localStorage.removeItem(lsKey("front"));
      localStorage.removeItem(lsKey("back"));
    } catch {}
    if (tpl.doubleSided) {
      const both = tpl.buildSides(g);
      sidesRef.current.front = JSON.stringify(both.front);
      sidesRef.current.back = JSON.stringify(both.back);
      sideRef.current = "front";
      setSide("front");
      await applyJson(sidesRef.current.front);
    } else {
      const blank = {
        version: "6.0.0",
        background: product.background,
        objects: [],
      };
      sidesRef.current.back = JSON.stringify(blank);
      sideRef.current = "front";
      setSide("front");
      await applyJson(
        JSON.stringify(tpl.build(getVcScheme(schemeIdArg || schemeId), g)),
      );
      setSchemeId(schemeIdArg || schemeId);
    }
    snapshot();
  };

  useEffect(() => {
    if (!product) return;
    let disposed = false;
    let canvas;
    (async () => {
      const fabric = await import("fabric");
      if (disposed || !elRef.current) return;
      const { Canvas } = fabric;
      canvas = new Canvas(elRef.current, {
        width: g.canvasW,
        height: g.canvasH,
        backgroundColor: product.background,
        preserveObjectStacking: true,
      });
      canvas.setDimensions({ width: g.canvasW, height: g.canvasH });
      canvas.__fabric = fabric;
      fabricRef.current = canvas;
      attachSnapGuides(canvas, g, fabric);

      if (typeof document !== "undefined" && document.fonts) {
        try {
          await Promise.all(FONTS.map((f) => document.fonts.load(`16px "${f}"`)));
          await document.fonts.ready;
        } catch {}
      }
      if (disposed) return;

      if (!disposed) setReady(true);
      try {
        drawGuides();
      } catch (e) {
        console.error("drawGuides failed:", e);
      }

      const stored = (() => {
        try {
          return localStorage.getItem(lsKey("front"));
        } catch {
          return null;
        }
      })();
      try {
        if (templateId) {
          await loadTemplate(templateId, schemeId);
        } else if (stored) {
          await applyJson(stored);
        }
      } catch (err) {
        console.error("template/stored load failed:", err);
        historyRef.current.muted = false;
      }

      const onChange = () => snapshot();
      canvas.on("object:modified", () => {
        onChange();
        syncSel();
      });
      canvas.on("object:added", (e) => {
        if (!e.target?.excludeFromExport) onChange();
      });
      canvas.on("object:removed", onChange);
      canvas.on("selection:created", syncSel);
      canvas.on("selection:updated", syncSel);
      canvas.on("selection:cleared", () => setSel(null));
      snapshot();
    })();
    const onKey = async (e) => {
      const c = fabricRef.current;
      if (!c) return;
      const active = c.getActiveObject();
      const editing = active?.isEditing;
      const meta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Delete
      if ((e.key === "Delete" || e.key === "Backspace") && active && !editing) {
        e.preventDefault();
        c.remove(active);
        c.discardActiveObject();
        c.requestRenderAll();
        syncSel();
        return;
      }
      // Undo
      if (meta && key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      // Redo
      if (meta && (key === "y" || (e.shiftKey && key === "z"))) {
        e.preventDefault();
        redo();
        return;
      }
      // Copy
      if (meta && key === "c" && active && !editing) {
        e.preventDefault();
        clipboardRef.current = await active.clone();
        return;
      }
      // Paste
      if (meta && key === "v" && clipboardRef.current && !editing) {
        e.preventDefault();
        const clone = await clipboardRef.current.clone();
        clone.set({ left: clone.left + 18, top: clone.top + 18 });
        c.add(clone);
        c.setActiveObject(clone);
        c.requestRenderAll();
        syncSel();
        return;
      }
      // Duplicate
      if (meta && key === "d" && active && !editing) {
        e.preventDefault();
        const clone = await active.clone();
        clone.set({ left: active.left + 18, top: active.top + 18 });
        c.add(clone);
        c.setActiveObject(clone);
        c.requestRenderAll();
        syncSel();
        return;
      }
      // Arrow-key nudge (1px, 10px with Shift)
      if (active && !editing && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") active.set("left", active.left - step);
        if (e.key === "ArrowRight") active.set("left", active.left + step);
        if (e.key === "ArrowUp") active.set("top", active.top - step);
        if (e.key === "ArrowDown") active.set("top", active.top + step);
        active.setCoords();
        c.requestRenderAll();
        // Collapse a run of nudges into one history entry
        clearTimeout(nudgeTimerRef.current);
        nudgeTimerRef.current = setTimeout(() => snapshot(), 400);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      disposed = true;
      clearTimeout(nudgeTimerRef.current);
      window.removeEventListener("keydown", onKey);
      canvas?.dispose();
      fabricRef.current = null;
    };
  }, [product]);

  const center = () => ({
    left: g.canvasW / 2,
    top: g.canvasH / 2,
    originX: "center",
    originY: "center",
  });
  const addText = async (text, size, weight) => {
    const { Textbox } = fabricRef.current.__fabric;
    const t = new Textbox(text, {
      ...center(),
      width: g.trim.width * 0.7,
      fontSize: size,
      fontWeight: weight,
      fontFamily: "Poppins",
      fill: "#111827",
      textAlign: "center",
    });
    fabricRef.current.add(t);
    fabricRef.current.setActiveObject(t);
    fabricRef.current.requestRenderAll();
    syncSel();
  };
  const addRect = () => {
    const { Rect } = fabricRef.current.__fabric;
    const r = new Rect({
      ...center(),
      width: 120,
      height: 70,
      fill: "#0037CA",
      rx: 6,
      ry: 6,
    });
    fabricRef.current.add(r);
    fabricRef.current.setActiveObject(r);
    syncSel();
  };
  const addCircle = () => {
    const { Circle } = fabricRef.current.__fabric;
    const o = new Circle({ ...center(), radius: 45, fill: "#CA8A04" });
    fabricRef.current.add(o);
    fabricRef.current.setActiveObject(o);
    syncSel();
  };
  const addTriangle = () => {
    const { Triangle: FTriangle } = fabricRef.current.__fabric;
    const t = new FTriangle({
      ...center(),
      width: 90,
      height: 80,
      fill: "#0037CA",
    });
    fabricRef.current.add(t);
    fabricRef.current.setActiveObject(t);
    syncSel();
  };
  const addLineH = () => {
    const { Rect } = fabricRef.current.__fabric;
    const r = new Rect({
      ...center(),
      width: g.trim.width * 0.7,
      height: 3,
      fill: "#111827",
    });
    fabricRef.current.add(r);
    fabricRef.current.setActiveObject(r);
    syncSel();
  };
  const addLineV = () => {
    const { Rect } = fabricRef.current.__fabric;
    const r = new Rect({
      ...center(),
      width: 3,
      height: g.trim.height * 0.7,
      fill: "#111827",
    });
    fabricRef.current.add(r);
    fabricRef.current.setActiveObject(r);
    syncSel();
  };
  const uploadImage = async (file) => {
    if (!file) return;
    const { FabricImage } = fabricRef.current.__fabric;
    const url = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(url);
    const max = g.trim.width * 0.6;
    const s = Math.min(max / img.width, max / img.height);
    img.set({ ...center(), scaleX: s, scaleY: s });
    fabricRef.current.add(img);
    fabricRef.current.setActiveObject(img);
    fabricRef.current.requestRenderAll();
    syncSel();
  };

  const addWave = () => {
    const o = makeWave(fabricRef.current.__fabric, g);
    o.set(center());
    fabricRef.current.add(o);
    fabricRef.current.setActiveObject(o);
    syncSel();
  };
  const addCornerBand = () => {
    const o = makeCornerBand(fabricRef.current.__fabric, g);
    fabricRef.current.add(o);
    fabricRef.current.sendObjectToBack?.(o);
    fabricRef.current.setActiveObject(o);
    syncSel();
  };
  const addDivider = () => {
    const o = makeDivider(fabricRef.current.__fabric, g);
    fabricRef.current.add(o);
    fabricRef.current.setActiveObject(o);
    syncSel();
  };
  const addIcon = (label, glyph) => {
    const o = makeIconRow(fabricRef.current.__fabric, g, label, glyph);
    o.set(center());
    fabricRef.current.add(o);
    fabricRef.current.setActiveObject(o);
    syncSel();
  };
  const addQR = async () => {
    const url = prompt("QR links to:", "https://example.com");
    if (url === null) return;
    const o = await makeQR(
      fabricRef.current.__fabric,
      g,
      url || "https://example.com",
    );
    o.set(center());
    fabricRef.current.add(o);
    fabricRef.current.setActiveObject(o);
    fabricRef.current.requestRenderAll();
    syncSel();
  };
  const addElement = (maker) => {
    const o = maker(fabricRef.current.__fabric, g);
    o.set(center());
    fabricRef.current.add(o);
    fabricRef.current.setActiveObject(o);
    syncSel();
  };

  const groupSelection = () => {
    const c = fabricRef.current;
    const active = c.getActiveObject();
    if (!active || active.type !== "activeselection") return;
    const grp = active.toGroup ? active.toGroup() : null;
    if (grp) {
      c.requestRenderAll();
      syncSel();
      snapshot();
    }
  };
  const ungroupSelection = () => {
    const c = fabricRef.current;
    const active = c.getActiveObject();
    if (!active || active.type !== "group") return;
    if (active.toActiveSelection) active.toActiveSelection();
    c.requestRenderAll();
    syncSel();
    snapshot();
  };
  const setBackground = (color) => {
    const c = fabricRef.current;
    if (!c) return;
    c.backgroundColor = color;
    c.requestRenderAll();
    snapshot();
  };

  const withSel = (fn) => {
    const c = fabricRef.current;
    const o = c?.getActiveObject();
    if (o) {
      fn(o, c);
      c.requestRenderAll();
      syncSel();
      snapshot();
    }
  };
  const setProp = (k, v) => withSel((o) => o.set(k, v));
  const del = () => withSel((o, c) => c.remove(o));
  const duplicate = () =>
    withSel(async (o, c) => {
      const cl = await o.clone();
      cl.set({ left: o.left + 15, top: o.top + 15 });
      c.add(cl);
      c.setActiveObject(cl);
    });
  const forward = () =>
    withSel((o, c) => {
      if (typeof c.bringObjectForward === "function") c.bringObjectForward(o);
    });
  const backward = () =>
    withSel((o, c) => {
      if (typeof c.sendObjectBackwards === "function") c.sendObjectBackwards(o);
    });
  const alignObj = (mode) =>
    withSel((o) => {
      const b = o.getBoundingRect();
      if (mode === "left") o.set("left", o.left + (g.trim.left - b.left));
      if (mode === "hcenter")
        o.set("left", o.left + (g.canvasW / 2 - (b.left + b.width / 2)));
      if (mode === "right")
        o.set("left", o.left + (g.trim.left + g.trim.width - (b.left + b.width)));
      if (mode === "top") o.set("top", o.top + (g.trim.top - b.top));
      if (mode === "vcenter")
        o.set("top", o.top + (g.canvasH / 2 - (b.top + b.height / 2)));
      if (mode === "bottom")
        o.set("top", o.top + (g.trim.top + g.trim.height - (b.top + b.height)));
      o.setCoords();
    });
  const toggleLock = () =>
    withSel((o, c) => {
      const lock = !o.lockMovementX;
      o.set({
        lockMovementX: lock,
        lockMovementY: lock,
        lockRotation: lock,
        lockScalingX: lock,
        lockScalingY: lock,
        hasControls: !lock,
      });
      if (lock) c.discardActiveObject();
    });
  const applyZoom = (z) => {
    const c = fabricRef.current;
    c.setZoom(z);
    c.setDimensions({ width: g.canvasW * z, height: g.canvasH * z });
    setZoom(z);
  };
  const download = async () => {
    const c = fabricRef.current;
    if (typeof document !== "undefined" && document.fonts) {
      try {
        await document.fonts.ready;
      } catch {}
    }
    const pz = c.getZoom();
    c.setZoom(1);
    c.setDimensions({ width: g.canvasW, height: g.canvasH });
    const data = c.toDataURL({ format: "png", multiplier: g.exportMultiplier });
    c.setZoom(pz);
    c.setDimensions({ width: g.canvasW * pz, height: g.canvasH * pz });
    const a = document.createElement("a");
    a.href = data;
    a.download = `${product.id}-${side}.png`;
    a.click();
  };
  const switchSide = async (next) => {
    const cur = sideRef.current;
    if (next === cur) return;
    const c = fabricRef.current;
    sidesRef.current[cur] = JSON.stringify(c.toJSON());
    sideRef.current = next;
    setSide(next);
    historyRef.current = { stack: [], i: -1, muted: false };
    const target =
      sidesRef.current[next] ||
      (() => {
        try {
          return localStorage.getItem(lsKey(next));
        } catch {
          return null;
        }
      })();
    if (target) await applyJson(target);
    else {
      c.clear();
      c.backgroundColor = product.background;
      drawGuides();
      c.requestRenderAll();
    }
    snapshot();
  };
  const applyScheme = async (id) => {
    setSchemeId(id);
    if (!templateId) return;
    const tpl = getVcTemplate(templateId);
    if (tpl.doubleSided) return;
    await applyJson(JSON.stringify(tpl.build(getVcScheme(id), g)));
    snapshot();
  };
  const useTemplate = async (tplId, schemeIdArg) => {
    await loadTemplate(tplId, schemeIdArg);
    setGalleryOpen(false);
  };

  if (!product)
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0F1729]">Unknown product</h1>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white"
        >
          Home
        </a>
      </section>
    );

  return (
    <div className="flex h-screen flex-col bg-[#EEF0F4]">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <a
          href="/category/visiting-cards"
          className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] transition hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div className="leading-none">
          <p className="text-[15px] font-bold text-[#0F1729]">{product.name}</p>
          <p className="text-[11px] text-[#98A2B3]">
            {product.widthMm}×{product.heightMm} mm · {product.dpi} DPI
          </p>
        </div>
        <div className="mx-3 h-7 w-px bg-slate-200" />
        <button
          onClick={() => setGalleryOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA]"
        >
          <Layers className="h-4 w-4" /> Templates
        </button>
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <IconBtn onClick={undo} disabled={!canUndo} label="Undo">
            <Undo2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={redo} disabled={!canRedo} label="Redo">
            <Redo2 className="h-4 w-4" />
          </IconBtn>
        </div>
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <IconBtn
            onClick={() => applyZoom(Math.max(0.4, +(zoom - 0.15).toFixed(2)))}
            label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </IconBtn>
          <span className="w-12 text-center text-[12px] font-bold text-[#475467]">
            {Math.round(zoom * 100)}%
          </span>
          <IconBtn
            onClick={() => applyZoom(Math.min(2.5, +(zoom + 0.15).toFixed(2)))}
            label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </IconBtn>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            {product.sides.map((s) => (
              <button
                key={s}
                onClick={() => switchSide(s)}
                className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold capitalize transition ${side === s ? "bg-white text-[#0037CA] shadow-sm" : "text-[#667085] hover:text-[#0F1729]"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={download}
            disabled={!ready}
            className="flex items-center gap-2 rounded-xl bg-[#0037CA] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-black disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 flex-none space-y-6 overflow-y-auto border-r border-slate-200 bg-white p-4">
          {templateId && !getVcTemplate(templateId)?.doubleSided && (
            <Section icon={Palette} title="Colour scheme">
              <div className="flex flex-wrap gap-2">
                {VC_SCHEMES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => applyScheme(s.id)}
                    aria-label={s.id}
                    className={`h-9 w-9 rounded-full ring-1 ring-black/10 transition hover:scale-110 ${schemeId === s.id ? "ring-2 ring-[#0037CA] ring-offset-2" : ""}`}
                    style={{
                      background: `linear-gradient(135deg, ${s.primary} 50%, ${s.accent} 50%)`,
                    }}
                  />
                ))}
              </div>
            </Section>
          )}
          <Section icon={Type} title="Text">
            <Tile
              onClick={() => addText("Your Name", 34, "bold")}
              disabled={!ready}
              title="Add heading"
              sub="Large title"
              size="text-[19px] font-bold"
            />
            <Tile
              onClick={() => addText("Job Title", 20, "normal")}
              disabled={!ready}
              title="Add subheading"
              sub="Medium"
              size="text-[15px] font-semibold"
            />
            <Tile
              onClick={() => addText("email@company.com", 14, "normal")}
              disabled={!ready}
              title="Add body text"
              sub="Small"
              size="text-[13px]"
            />
          </Section>
          <Section icon={Square} title="Shapes & lines">
            <div className="grid grid-cols-3 gap-2">
              <ShapeTile
                onClick={addRect}
                disabled={!ready}
                icon={Square}
                label="Box"
              />
              <ShapeTile
                onClick={addCircle}
                disabled={!ready}
                icon={CircleIcon}
                label="Circle"
              />
              <ShapeTile
                onClick={addTriangle}
                disabled={!ready}
                icon={Triangle}
                label="Triangle"
              />
              <ShapeTile
                onClick={addLineH}
                disabled={!ready}
                icon={Minus}
                label="H-line"
              />
              <ShapeTile
                onClick={addLineV}
                disabled={!ready}
                icon={Minus}
                label="V-line"
              />
            </div>
          </Section>
          <Section icon={Square} title="Design elements">
            <div className="grid grid-cols-3 gap-2">
              <ShapeTile
                onClick={addWave}
                disabled={!ready}
                icon={Minus}
                label="Wave"
              />
              <ShapeTile
                onClick={addCornerBand}
                disabled={!ready}
                icon={Square}
                label="Band"
              />
              <ShapeTile
                onClick={addDivider}
                disabled={!ready}
                icon={Minus}
                label="Divider"
              />
            </div>
          </Section>
          <Section icon={Layers} title="Contact icons">
            <div className="grid grid-cols-2 gap-2">
              <ShapeTile
                onClick={() => addIcon("+91 98765 43210", "☎")}
                disabled={!ready}
                icon={Type}
                label="Phone"
              />
              <ShapeTile
                onClick={() => addIcon("hello@email.com", "✉")}
                disabled={!ready}
                icon={Type}
                label="Email"
              />
              <ShapeTile
                onClick={() => addIcon("www.site.com", "🌐")}
                disabled={!ready}
                icon={Type}
                label="Website"
              />
              <ShapeTile
                onClick={() => addIcon("City, Country", "⚲")}
                disabled={!ready}
                icon={Type}
                label="Location"
              />
            </div>
          </Section>
          <Section icon={Square} title="QR code">
            <ToolBtnWide
              onClick={addQR}
              disabled={!ready}
              label="Add QR code"
            />
          </Section>

          <Section icon={Square} title="More elements">
            <div className="grid grid-cols-2 gap-2">
              <ShapeTile
                onClick={() => addElement(makeStar)}
                disabled={!ready}
                icon={Triangle}
                label="Star"
              />
              <ShapeTile
                onClick={() => addElement(makeBadge)}
                disabled={!ready}
                icon={Square}
                label="Badge"
              />
              <ShapeTile
                onClick={() => addElement(makeArrow)}
                disabled={!ready}
                icon={Minus}
                label="Arrow"
              />
              <ShapeTile
                onClick={() => addElement(makeDotGrid)}
                disabled={!ready}
                icon={CircleIcon}
                label="Dot grid"
              />
            </div>
          </Section>
          <Section icon={Palette} title="Background">
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((c) => (
                <button
                  key={c}
                  onClick={() => setBackground(c)}
                  aria-label={c}
                  className="h-8 w-8 rounded-lg ring-1 ring-black/10 transition hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              ))}
              <label
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg ring-1 ring-black/10"
                style={{
                  background:
                    "conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)",
                }}
              >
                <input
                  type="color"
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-0 w-0 opacity-0"
                />
              </label>
            </div>
          </Section>
          <Section icon={ImagePlus} title="Uploads">
            <label
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center transition hover:border-[#0037CA] hover:bg-[#F5F8FF] ${!ready ? "pointer-events-none opacity-40" : ""}`}
            >
              <ImagePlus className="h-7 w-7 text-[#98A2B3]" />
              <span className="text-[13px] font-semibold text-[#0F1729]">
                Upload image
              </span>
              <span className="text-[11px] text-[#98A2B3]">PNG, JPG, SVG</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files?.[0])}
              />
            </label>
          </Section>
        </aside>

        <main
          className="relative flex flex-1 items-center justify-center overflow-auto p-10"
          style={{
            backgroundImage: "radial-gradient(#d5d9e0 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        >
          <div
            className="rounded-xl bg-white shadow-[0_20px_60px_-18px_rgba(15,23,41,0.35)] ring-1 ring-black/5"
            style={{ width: g.canvasW * zoom, height: g.canvasH * zoom }}
          >
            <canvas
              ref={elRef}
              width={g.canvasW}
              height={g.canvasH}
              className="block rounded-xl"
              style={{ width: g.canvasW, height: g.canvasH }}
            />
          </div>
        </main>

        <aside className="w-72 flex-none overflow-y-auto border-l border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#0037CA]" />
            <p className="text-[13px] font-bold text-[#0F1729]">Properties</p>
          </div>
          {!sel ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
              <Palette className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-[13px] text-[#98A2B3]">
                Select an element to edit it, or add one from the left panel.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {(sel.type === "textbox" || sel.type === "i-text") && (
                <div className="space-y-4 rounded-xl bg-slate-50 p-3">
                  <Field label="Font family">
                    <select
                      value={sel.fontFamily}
                      onChange={(e) => setProp("fontFamily", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[13px]"
                    >
                      {FONTS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={`Font size — ${Math.round(sel.fontSize)}px`}>
                    <input
                      type="range"
                      min="8"
                      max="96"
                      value={sel.fontSize}
                      onChange={(e) => setProp("fontSize", +e.target.value)}
                      className="w-full accent-[#0037CA]"
                    />
                  </Field>
                  <Field
                    label={`Letter spacing — ${Math.round(sel.charSpacing ?? 0)}`}
                  >
                    <input
                      type="range"
                      min="-100"
                      max="800"
                      step="10"
                      value={sel.charSpacing ?? 0}
                      onChange={(e) => setProp("charSpacing", +e.target.value)}
                      className="w-full accent-[#0037CA]"
                    />
                  </Field>
                  <Field
                    label={`Line height — ${(sel.lineHeight ?? 1.16).toFixed(2)}`}
                  >
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.05"
                      value={sel.lineHeight ?? 1.16}
                      onChange={(e) => setProp("lineHeight", +e.target.value)}
                      className="w-full accent-[#0037CA]"
                    />
                  </Field>
                  <div className="flex gap-1.5">
                    <IconToggle
                      active={sel.fontWeight === "bold"}
                      onClick={() =>
                        setProp(
                          "fontWeight",
                          sel.fontWeight === "bold" ? "normal" : "bold",
                        )
                      }
                    >
                      <Bold className="h-4 w-4" />
                    </IconToggle>
                    <IconToggle
                      active={sel.fontStyle === "italic"}
                      onClick={() =>
                        setProp(
                          "fontStyle",
                          sel.fontStyle === "italic" ? "normal" : "italic",
                        )
                      }
                    >
                      <span className="font-serif text-[15px] italic leading-none">
                        I
                      </span>
                    </IconToggle>
                    <IconToggle
                      active={!!sel.underline}
                      onClick={() => setProp("underline", !sel.underline)}
                    >
                      <span className="text-[15px] leading-none underline">
                        U
                      </span>
                    </IconToggle>
                  </div>
                  <div className="flex gap-1.5">
                    <IconToggle
                      active={sel.textAlign === "left"}
                      onClick={() => setProp("textAlign", "left")}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </IconToggle>
                    <IconToggle
                      active={sel.textAlign === "center"}
                      onClick={() => setProp("textAlign", "center")}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </IconToggle>
                    <IconToggle
                      active={sel.textAlign === "right"}
                      onClick={() => setProp("textAlign", "right")}
                    >
                      <AlignRight className="h-4 w-4" />
                    </IconToggle>
                  </div>
                </div>
              )}
              <Field label="Colour">
                <div className="flex flex-wrap gap-2">
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setProp("fill", c)}
                      className={`h-8 w-8 rounded-lg ring-1 ring-black/10 transition hover:scale-110 ${sel.fill === c ? "ring-2 ring-[#0037CA] ring-offset-2" : ""}`}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                    />
                  ))}
                  <label
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg ring-1 ring-black/10"
                    style={{
                      background:
                        "conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)",
                    }}
                  >
                    <input
                      type="color"
                      value={
                        typeof sel.fill === "string" ? sel.fill : "#000000"
                      }
                      onChange={(e) => setProp("fill", e.target.value)}
                      className="h-0 w-0 opacity-0"
                    />
                  </label>
                </div>
              </Field>
              <Field
                label={`Opacity — ${Math.round((sel.opacity ?? 1) * 100)}%`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sel.opacity ?? 1}
                  onChange={(e) => setProp("opacity", +e.target.value)}
                  className="w-full accent-[#0037CA]"
                />
              </Field>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#475467]">
                  <AlignCenter className="h-3.5 w-3.5" /> Align to card
                </p>
                <div className="flex gap-1.5">
                  <AlignBtn onClick={() => alignObj("left")} label="Align left">
                    <AlignLeft className="h-4 w-4" />
                  </AlignBtn>
                  <AlignBtn
                    onClick={() => alignObj("hcenter")}
                    label="Align horizontal center"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </AlignBtn>
                  <AlignBtn onClick={() => alignObj("right")} label="Align right">
                    <AlignRight className="h-4 w-4" />
                  </AlignBtn>
                  <AlignBtn onClick={() => alignObj("top")} label="Align top">
                    <AlignLeft className="h-4 w-4 rotate-90" />
                  </AlignBtn>
                  <AlignBtn
                    onClick={() => alignObj("vcenter")}
                    label="Align vertical center"
                  >
                    <AlignCenter className="h-4 w-4 rotate-90" />
                  </AlignBtn>
                  <AlignBtn
                    onClick={() => alignObj("bottom")}
                    label="Align bottom"
                  >
                    <AlignRight className="h-4 w-4 rotate-90" />
                  </AlignBtn>
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#475467]">
                  <Layers className="h-3.5 w-3.5" /> Arrange & actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <PanelBtn
                    icon={ChevronUp}
                    label="Forward"
                    onClick={forward}
                  />
                  <PanelBtn
                    icon={ChevronDown}
                    label="Backward"
                    onClick={backward}
                  />
                  <PanelBtn icon={Copy} label="Duplicate" onClick={duplicate} />
                  <PanelBtn icon={Trash2} label="Delete" onClick={del} danger />
                  <PanelBtn icon={Layers} label="Group" onClick={groupSelection} />
                  <PanelBtn icon={Layers} label="Ungroup" onClick={ungroupSelection} />
                  <PanelBtn
                    icon={sel.locked ? Lock : Unlock}
                    label={sel.locked ? "Unlock" : "Lock"}
                    onClick={toggleLock}
                  />
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setGalleryOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F1729]">
                Change template
              </h2>
              <button
                onClick={() => setGalleryOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-[14px] text-[#667085]">
              Choose a template to start editing.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {VC_TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <button
                    onClick={() => useTemplate(t.id)}
                    className="block w-full overflow-hidden rounded-lg bg-slate-50 ring-1 ring-black/5"
                  >
                    {thumbs[t.id] ? (
                      <img
                        src={thumbs[t.id]}
                        alt={t.name}
                        className="aspect-[95/60] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[95/60] items-center justify-center text-[13px] font-semibold text-[#475467]">
                        {t.name}
                      </div>
                    )}
                  </button>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-[#98A2B3]">
                    {t.industry}
                  </p>
                  {!t.doubleSided && (
                    <div className="mt-1 flex gap-1.5">
                      {VC_SCHEMES.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => useTemplate(t.id, s.id)}
                          aria-label={`${t.name} ${s.id}`}
                          className="h-5 w-5 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: s.primary }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ onClick, disabled, label, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-lg text-[#475467] transition hover:bg-white hover:text-[#0F1729] hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
    >
      {children}
    </button>
  );
}
function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
        <Icon className="h-3.5 w-3.5" /> {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Tile({ onClick, disabled, title, sub, size }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-left transition hover:border-[#0037CA] hover:bg-[#F5F8FF] disabled:opacity-40"
    >
      <span className={`text-[#0F1729] ${size}`}>
        {title.replace("Add ", "")}
      </span>
      <span className="text-[11px] text-[#98A2B3]">{sub}</span>
    </button>
  );
}
function ShapeTile({ onClick, disabled, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 py-4 text-[12px] font-semibold text-[#475467] transition hover:border-[#0037CA] hover:bg-[#F5F8FF] hover:text-[#0037CA] disabled:opacity-40"
    >
      <Icon className="h-6 w-6" /> {label}
    </button>
  );
}
function ToolBtnWide({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-[13px] font-semibold text-[#475467] transition hover:border-[#0037CA] hover:bg-[#F5F8FF] hover:text-[#0037CA] disabled:opacity-40"
    >
      {label}
    </button>
  );
}
function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-[#475467]">
        {label}
      </label>
      {children}
    </div>
  );
}
function IconToggle({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`grid h-9 flex-1 place-items-center rounded-lg border transition ${active ? "border-[#0037CA] bg-[#0037CA] text-white" : "border-slate-200 bg-white text-[#475467] hover:border-[#0037CA]"}`}
    >
      {children}
    </button>
  );
}
function AlignBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-9 flex-1 place-items-center rounded-lg border border-slate-200 bg-white text-[#475467] transition hover:border-[#0037CA] hover:text-[#0037CA]"
    >
      {children}
    </button>
  );
}
function PanelBtn({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[12px] font-semibold transition ${danger ? "border-slate-200 text-[#DC2626] hover:border-[#DC2626] hover:bg-red-50" : "border-slate-200 text-[#475467] hover:border-[#0037CA]"}`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}