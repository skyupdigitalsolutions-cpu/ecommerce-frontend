import { useEffect, useRef, useState, useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";
import {
  Type, Square, Circle as CircleIcon, ImagePlus, Trash2, Copy,
  ChevronUp, ChevronDown, Undo2, Redo2, ZoomIn, ZoomOut, Download,
  Bold, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { getPrintProduct, geometry } from "../../../lib/print/products";

const FONTS = ["Poppins", "Arial", "Georgia", "Courier New", "Times New Roman"];
const SWATCHES = ["#111827", "#ffffff", "#0037CA", "#DC2626", "#166534", "#CA8A04", "#7C3AED", "#EC4899"];

export default function Page() {
  const { routeParams } = usePageContext();
  const product = getPrintProduct(routeParams.product);

  const elRef = useRef(null);
  const fabricRef = useRef(null);
  const guidesRef = useRef([]);
  const historyRef = useRef({ stack: [], i: -1, muted: false });
  const sidesRef = useRef({ front: null, back: null });

  const [ready, setReady] = useState(false);
  const [side, setSide] = useState("front");
  const [zoom, setZoom] = useState(1);
  const [sel, setSel] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const g = product ? geometry(product) : null;

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
    try { localStorage.setItem(`design:${product.id}:${side}`, json); } catch {}
  }, [product, side]);

  const applyJson = useCallback(async (json) => {
    const c = fabricRef.current;
    if (!c) return;
    historyRef.current.muted = true;
    await c.loadFromJSON(json);
    drawGuides();
    c.requestRenderAll();
    historyRef.current.muted = false;
  }, []);

  const undo = () => {
    const h = historyRef.current;
    if (h.i <= 0) return;
    h.i -= 1;
    applyJson(h.stack[h.i]);
    setCanUndo(h.i > 0); setCanRedo(true);
  };
  const redo = () => {
    const h = historyRef.current;
    if (h.i >= h.stack.length - 1) return;
    h.i += 1;
    applyJson(h.stack[h.i]);
    setCanRedo(h.i < h.stack.length - 1); setCanUndo(true);
  };

  const drawGuides = useCallback(() => {
    const c = fabricRef.current;
    if (!c || !g) return;
    guidesRef.current.forEach((o) => c.remove(o));
    guidesRef.current = [];
    const { Rect } = c.__fabric;
    const mk = (opts) => new Rect({ selectable: false, evented: false, excludeFromExport: true, fill: "transparent", ...opts });
    const trim = mk({ left: g.trim.left, top: g.trim.top, width: g.trim.width, height: g.trim.height, stroke: "#0037CA", strokeWidth: 1 });
    const safe = mk({ left: g.safeBox.left, top: g.safeBox.top, width: g.safeBox.width, height: g.safeBox.height, stroke: "#22C55E", strokeDashArray: [5, 4], strokeWidth: 1 });
    [trim, safe].forEach((o) => { c.add(o); guidesRef.current.push(o); });
    trim.moveTo(9998); safe.moveTo(9999);
  }, [g]);

  useEffect(() => {
    if (!product) return;
    let disposed = false;
    let canvas;
    (async () => {
      const fabric = await import("fabric");
      if (disposed || !elRef.current) return;
      const { Canvas } = fabric;
      canvas = new Canvas(elRef.current, { width: g.canvasW, height: g.canvasH, backgroundColor: product.background, preserveObjectStacking: true });
      canvas.__fabric = fabric;
      fabricRef.current = canvas;

      drawGuides();

      const stored = (() => { try { return localStorage.getItem(`design:${product.id}:front`); } catch { return null; } })();
      if (stored) await applyJson(stored);

      const onChange = () => { snapshot(); };
      const onSel = () => {
        const o = canvas.getActiveObject();
        setSel(o ? {
          type: o.type, fill: o.fill, opacity: o.opacity,
          fontFamily: o.fontFamily, fontSize: o.fontSize,
          fontWeight: o.fontWeight, textAlign: o.textAlign,
        } : null);
      };
      canvas.on("object:modified", onChange);
      canvas.on("object:added", (e) => { if (!e.target?.excludeFromExport) onChange(); });
      canvas.on("object:removed", onChange);
      canvas.on("selection:created", onSel);
      canvas.on("selection:updated", onSel);
      canvas.on("selection:cleared", () => setSel(null));

      snapshot();
      if (!disposed) setReady(true);
    })();

    const onKey = (e) => {
      const c = fabricRef.current;
      if (!c) return;
      if ((e.key === "Delete" || e.key === "Backspace") && c.getActiveObject() && !c.getActiveObject().isEditing) {
        c.remove(c.getActiveObject()); c.requestRenderAll();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { disposed = true; window.removeEventListener("keydown", onKey); canvas?.dispose(); fabricRef.current = null; };
  }, [product]);

  const center = () => ({ left: g.canvasW / 2, top: g.canvasH / 2, originX: "center", originY: "center" });
  const addText = async (text, size, weight) => {
    const { Textbox } = fabricRef.current.__fabric;
    const t = new Textbox(text, { ...center(), width: g.trim.width * 0.7, fontSize: size, fontWeight: weight, fontFamily: "Poppins", fill: "#111827", textAlign: "center" });
    fabricRef.current.add(t); fabricRef.current.setActiveObject(t); fabricRef.current.requestRenderAll();
  };
  const addRect = () => { const { Rect } = fabricRef.current.__fabric; const r = new Rect({ ...center(), width: 120, height: 70, fill: "#0037CA" }); fabricRef.current.add(r); fabricRef.current.setActiveObject(r); };
  const addCircle = () => { const { Circle } = fabricRef.current.__fabric; const o = new Circle({ ...center(), radius: 45, fill: "#CA8A04" }); fabricRef.current.add(o); fabricRef.current.setActiveObject(o); };
  const uploadImage = async (file) => {
    if (!file) return;
    const { FabricImage } = fabricRef.current.__fabric;
    const url = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(url);
    const max = g.trim.width * 0.6;
    const s = Math.min(max / img.width, max / img.height);
    img.set({ ...center(), scaleX: s, scaleY: s });
    fabricRef.current.add(img); fabricRef.current.setActiveObject(img); fabricRef.current.requestRenderAll();
  };

  const withSel = (fn) => { const c = fabricRef.current; const o = c?.getActiveObject(); if (o) { fn(o, c); c.requestRenderAll(); snapshot(); } };
  const setProp = (k, v) => withSel((o) => o.set(k, v));
  const del = () => withSel((o, c) => c.remove(o));
  const duplicate = () => withSel(async (o, c) => { const cl = await o.clone(); cl.set({ left: o.left + 15, top: o.top + 15 }); c.add(cl); c.setActiveObject(cl); });
  const forward = () => withSel((o) => o.bringForward());
  const backward = () => withSel((o) => o.sendBackwards());

  const applyZoom = (z) => { const c = fabricRef.current; c.setZoom(z); c.setDimensions({ width: g.canvasW * z, height: g.canvasH * z }); setZoom(z); };

  const download = () => {
    const c = fabricRef.current;
    const prevZoom = c.getZoom();
    c.setZoom(1); c.setDimensions({ width: g.canvasW, height: g.canvasH });
    const data = c.toDataURL({ format: "png", multiplier: g.exportMultiplier });
    c.setZoom(prevZoom); c.setDimensions({ width: g.canvasW * prevZoom, height: g.canvasH * prevZoom });
    const a = document.createElement("a"); a.href = data; a.download = `${product.id}-${side}.png`; a.click();
  };

  const switchSide = async (next) => {
    if (next === side) return;
    const c = fabricRef.current;
    sidesRef.current[side] = JSON.stringify(c.toJSON());
    setSide(next);
    historyRef.current = { stack: [], i: -1, muted: false };
    const target = sidesRef.current[next] || (() => { try { return localStorage.getItem(`design:${product.id}:${next}`); } catch { return null; } })();
    if (target) await applyJson(target); else { c.clear(); c.backgroundColor = product.background; drawGuides(); c.requestRenderAll(); }
    snapshot();
  };

  if (!product) {
    return <section className="mx-auto max-w-[1400px] px-5 py-24 text-center"><h1 className="text-2xl font-bold text-[#0F1729]">Unknown product</h1><a href="/" className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white">Home</a></section>;
  }

  return (
    <div className="flex h-screen flex-col bg-[#F4F5F7]">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <span className="mr-2 text-[15px] font-bold text-[#0F1729]">{product.name} Editor</span>
        <div className="mx-2 h-6 w-px bg-slate-200" />
        <button onClick={undo} disabled={!canUndo} className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] hover:bg-slate-100 disabled:opacity-30" aria-label="Undo"><Undo2 className="h-5 w-5" /></button>
        <button onClick={redo} disabled={!canRedo} className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] hover:bg-slate-100 disabled:opacity-30" aria-label="Redo"><Redo2 className="h-5 w-5" /></button>
        <div className="mx-2 h-6 w-px bg-slate-200" />
        <button onClick={() => applyZoom(Math.max(0.4, zoom - 0.15))} className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] hover:bg-slate-100" aria-label="Zoom out"><ZoomOut className="h-5 w-5" /></button>
        <span className="w-12 text-center text-[13px] font-semibold text-[#475467]">{Math.round(zoom * 100)}%</span>
        <button onClick={() => applyZoom(Math.min(2.5, zoom + 0.15))} className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] hover:bg-slate-100" aria-label="Zoom in"><ZoomIn className="h-5 w-5" /></button>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5">
            {product.sides.map((s) => (
              <button key={s} onClick={() => switchSide(s)} className={`rounded-md px-3 py-1.5 text-[13px] font-semibold capitalize ${side === s ? "bg-[#0037CA] text-white" : "text-[#475467]"}`}>{s}</button>
            ))}
          </div>
          <button onClick={download} disabled={!ready} className="flex items-center gap-2 rounded-lg bg-[#0037CA] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-black disabled:opacity-40"><Download className="h-4 w-4" /> Download</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 flex-none space-y-4 overflow-y-auto border-r border-slate-200 bg-white p-4">
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#98A2B3]">Text</p>
            <div className="space-y-1.5">
              <ToolBtn icon={Type} label="Heading" onClick={() => addText("Your Name", 34, "bold")} disabled={!ready} />
              <ToolBtn icon={Type} label="Subheading" onClick={() => addText("Job Title", 20, "normal")} disabled={!ready} />
              <ToolBtn icon={Type} label="Body text" onClick={() => addText("email@company.com", 14, "normal")} disabled={!ready} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#98A2B3]">Shapes</p>
            <div className="space-y-1.5">
              <ToolBtn icon={Square} label="Rectangle" onClick={addRect} disabled={!ready} />
              <ToolBtn icon={CircleIcon} label="Circle" onClick={addCircle} disabled={!ready} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-[#98A2B3]">Uploads</p>
            <label className={`flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] font-semibold text-[#0F1729] hover:border-[#0037CA] hover:text-[#0037CA] ${!ready ? "pointer-events-none opacity-40" : ""}`}>
              <ImagePlus className="h-5 w-5" /> Upload image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
            </label>
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center overflow-auto p-8">
          <div className="rounded-lg bg-white shadow-[0_10px_40px_-12px_rgba(15,23,41,0.3)]">
            <canvas ref={elRef} width={g.canvasW} height={g.canvasH} className="block" style={{ width: g.canvasW, height: g.canvasH }} />
          </div>
        </main>

        <aside className="w-64 flex-none overflow-y-auto border-l border-slate-200 bg-white p-4">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#98A2B3]">Properties</p>
          {!sel ? (
            <p className="text-[13px] text-[#98A2B3]">Select an element to edit it, or add one from the left.</p>
          ) : (
            <div className="space-y-4">
              {(sel.type === "textbox" || sel.type === "i-text") && (
                <>
                  <Field label="Font">
                    <select value={sel.fontFamily} onChange={(e) => setProp("fontFamily", e.target.value)} className="w-full rounded-lg border border-slate-200 px-2 py-2 text-[13px]">
                      {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>
                  <Field label={`Size (${Math.round(sel.fontSize)})`}>
                    <input type="range" min="8" max="96" value={sel.fontSize} onChange={(e) => setProp("fontSize", +e.target.value)} className="w-full" />
                  </Field>
                  <div className="flex gap-2">
                    <IconToggle active={sel.fontWeight === "bold"} onClick={() => setProp("fontWeight", sel.fontWeight === "bold" ? "normal" : "bold")}><Bold className="h-4 w-4" /></IconToggle>
                    <IconToggle active={sel.textAlign === "left"} onClick={() => setProp("textAlign", "left")}><AlignLeft className="h-4 w-4" /></IconToggle>
                    <IconToggle active={sel.textAlign === "center"} onClick={() => setProp("textAlign", "center")}><AlignCenter className="h-4 w-4" /></IconToggle>
                    <IconToggle active={sel.textAlign === "right"} onClick={() => setProp("textAlign", "right")}><AlignRight className="h-4 w-4" /></IconToggle>
                  </div>
                </>
              )}
              <Field label="Colour">
                <div className="flex flex-wrap gap-1.5">
                  {SWATCHES.map((c) => <button key={c} onClick={() => setProp("fill", c)} className={`h-7 w-7 rounded-full ring-1 ring-black/10 ${sel.fill === c ? "ring-2 ring-[#0037CA] ring-offset-1" : ""}`} style={{ backgroundColor: c }} aria-label={c} />)}
                </div>
              </Field>
              <Field label={`Opacity (${Math.round((sel.opacity ?? 1) * 100)}%)`}>
                <input type="range" min="0" max="1" step="0.05" value={sel.opacity ?? 1} onChange={(e) => setProp("opacity", +e.target.value)} className="w-full" />
              </Field>
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <PanelBtn icon={Copy} label="Duplicate" onClick={duplicate} />
                <PanelBtn icon={Trash2} label="Delete" onClick={del} danger />
                <PanelBtn icon={ChevronUp} label="Forward" onClick={forward} />
                <PanelBtn icon={ChevronDown} label="Backward" onClick={backward} />
              </div>
            </div>
          )}
          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-[12px] text-[#667085]">
            <b className="text-[#0F1729]">Print specs</b><br />
            {product.widthMm}×{product.heightMm} mm · {product.dpi} DPI<br />
            <span className="text-[#0037CA]">Blue</span> = trim · <span className="text-[#22C55E]">Green</span> = safe area.<br />
            Keep text inside the green box.
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToolBtn({ icon: Icon, label, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] font-medium text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-40"><Icon className="h-5 w-5" /> {label}</button>;
}
function Field({ label, children }) { return <div><label className="mb-1.5 block text-[12px] font-semibold text-[#475467]">{label}</label>{children}</div>; }
function IconToggle({ active, onClick, children }) { return <button onClick={onClick} className={`grid h-9 flex-1 place-items-center rounded-lg border ${active ? "border-[#0037CA] bg-[#0037CA] text-white" : "border-slate-200 text-[#475467]"}`}>{children}</button>; }
function PanelBtn({ icon: Icon, label, onClick, danger }) { return <button onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[12px] font-semibold ${danger ? "text-[#DC2626] hover:border-[#DC2626]" : "text-[#475467] hover:border-[#0037CA]"}`}><Icon className="h-4 w-4" /> {label}</button>; }