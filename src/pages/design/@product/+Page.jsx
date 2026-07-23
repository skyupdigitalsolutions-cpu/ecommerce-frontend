import { useEffect, useRef, useState, useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";
import {
  Type, Square, Circle as CircleIcon, ImagePlus, Trash2, Copy,
  ChevronUp, ChevronDown, Undo2, Redo2, ZoomIn, ZoomOut, Download,
  Bold, AlignLeft, AlignCenter, AlignRight, ArrowLeft, Layers, Palette, Sliders,
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
    h.stack = h.stack.slice(0, h.i + 1); h.stack.push(json); h.i = h.stack.length - 1;
    setCanUndo(h.i > 0); setCanRedo(false);
    try { localStorage.setItem(`design:${product.id}:${side}`, json); } catch {}
  }, [product, side]);

  const applyJson = useCallback(async (json) => {
    const c = fabricRef.current; if (!c) return;
    historyRef.current.muted = true;
    await c.loadFromJSON(json); drawGuides(); c.requestRenderAll();
    historyRef.current.muted = false;
  }, []);

  const undo = () => { const h = historyRef.current; if (h.i <= 0) return; h.i -= 1; applyJson(h.stack[h.i]); setCanUndo(h.i > 0); setCanRedo(true); };
  const redo = () => { const h = historyRef.current; if (h.i >= h.stack.length - 1) return; h.i += 1; applyJson(h.stack[h.i]); setCanRedo(h.i < h.stack.length - 1); setCanUndo(true); };

  const drawGuides = useCallback(() => {
    const c = fabricRef.current; if (!c || !g) return;
    guidesRef.current.forEach((o) => c.remove(o)); guidesRef.current = [];
    const { Rect } = c.__fabric;
    const mk = (opts) => new Rect({ selectable: false, evented: false, excludeFromExport: true, fill: "transparent", ...opts });
    const trim = mk({ left: g.trim.left, top: g.trim.top, width: g.trim.width, height: g.trim.height, stroke: "#0037CA", strokeWidth: 1 });
    const safe = mk({ left: g.safeBox.left, top: g.safeBox.top, width: g.safeBox.width, height: g.safeBox.height, stroke: "#22C55E", strokeDashArray: [5, 4], strokeWidth: 1 });
    [trim, safe].forEach((o) => { c.add(o); guidesRef.current.push(o); });
    trim.moveTo(9998); safe.moveTo(9999);
  }, [g]);

  useEffect(() => {
    if (!product) return;
    let disposed = false; let canvas;
    (async () => {
      const fabric = await import("fabric");
      if (disposed || !elRef.current) return;
      const { Canvas } = fabric;
      canvas = new Canvas(elRef.current, { width: g.canvasW, height: g.canvasH, backgroundColor: product.background, preserveObjectStacking: true });
      canvas.setDimensions({ width: g.canvasW, height: g.canvasH });
      canvas.__fabric = fabric; fabricRef.current = canvas;
      drawGuides();
      const stored = (() => { try { return localStorage.getItem(`design:${product.id}:front`); } catch { return null; } })();
      if (stored) await applyJson(stored);
      const onChange = () => snapshot();
      const onSel = () => { const o = canvas.getActiveObject(); setSel(o ? { type: o.type, fill: o.fill, opacity: o.opacity, fontFamily: o.fontFamily, fontSize: o.fontSize, fontWeight: o.fontWeight, textAlign: o.textAlign } : null); };
      canvas.on("object:modified", onChange);
      canvas.on("object:added", (e) => { if (!e.target?.excludeFromExport) onChange(); });
      canvas.on("object:removed", onChange);
      canvas.on("selection:created", onSel); canvas.on("selection:updated", onSel); canvas.on("selection:cleared", () => setSel(null));
      snapshot(); if (!disposed) setReady(true);
    })();
    const onKey = (e) => {
      const c = fabricRef.current; if (!c) return;
      if ((e.key === "Delete" || e.key === "Backspace") && c.getActiveObject() && !c.getActiveObject().isEditing) { c.remove(c.getActiveObject()); c.requestRenderAll(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { disposed = true; window.removeEventListener("keydown", onKey); canvas?.dispose(); fabricRef.current = null; };
  }, [product]);

  const center = () => ({ left: g.canvasW / 2, top: g.canvasH / 2, originX: "center", originY: "center" });
  const addText = async (text, size, weight) => { const { Textbox } = fabricRef.current.__fabric; const t = new Textbox(text, { ...center(), width: g.trim.width * 0.7, fontSize: size, fontWeight: weight, fontFamily: "Poppins", fill: "#111827", textAlign: "center" }); fabricRef.current.add(t); fabricRef.current.setActiveObject(t); fabricRef.current.requestRenderAll(); };
  const addRect = () => { const { Rect } = fabricRef.current.__fabric; const r = new Rect({ ...center(), width: 120, height: 70, fill: "#0037CA", rx: 6, ry: 6 }); fabricRef.current.add(r); fabricRef.current.setActiveObject(r); };
  const addCircle = () => { const { Circle } = fabricRef.current.__fabric; const o = new Circle({ ...center(), radius: 45, fill: "#CA8A04" }); fabricRef.current.add(o); fabricRef.current.setActiveObject(o); };
  const uploadImage = async (file) => { if (!file) return; const { FabricImage } = fabricRef.current.__fabric; const url = URL.createObjectURL(file); const img = await FabricImage.fromURL(url); const max = g.trim.width * 0.6; const s = Math.min(max / img.width, max / img.height); img.set({ ...center(), scaleX: s, scaleY: s }); fabricRef.current.add(img); fabricRef.current.setActiveObject(img); fabricRef.current.requestRenderAll(); };

  const withSel = (fn) => { const c = fabricRef.current; const o = c?.getActiveObject(); if (o) { fn(o, c); c.requestRenderAll(); snapshot(); } };
  const setProp = (k, v) => withSel((o) => o.set(k, v));
  const del = () => withSel((o, c) => c.remove(o));
  const duplicate = () => withSel(async (o, c) => { const cl = await o.clone(); cl.set({ left: o.left + 15, top: o.top + 15 }); c.add(cl); c.setActiveObject(cl); });
  const forward = () => withSel((o) => o.bringForward());
  const backward = () => withSel((o) => o.sendBackwards());
  const applyZoom = (z) => { const c = fabricRef.current; c.setZoom(z); c.setDimensions({ width: g.canvasW * z, height: g.canvasH * z }); setZoom(z); };
  const download = () => { const c = fabricRef.current; const pz = c.getZoom(); c.setZoom(1); c.setDimensions({ width: g.canvasW, height: g.canvasH }); const data = c.toDataURL({ format: "png", multiplier: g.exportMultiplier }); c.setZoom(pz); c.setDimensions({ width: g.canvasW * pz, height: g.canvasH * pz }); const a = document.createElement("a"); a.href = data; a.download = `${product.id}-${side}.png`; a.click(); };
  const switchSide = async (next) => { if (next === side) return; const c = fabricRef.current; sidesRef.current[side] = JSON.stringify(c.toJSON()); setSide(next); historyRef.current = { stack: [], i: -1, muted: false }; const target = sidesRef.current[next] || (() => { try { return localStorage.getItem(`design:${product.id}:${next}`); } catch { return null; } })(); if (target) await applyJson(target); else { c.clear(); c.backgroundColor = product.background; drawGuides(); c.requestRenderAll(); } snapshot(); };

  if (!product) return <section className="mx-auto max-w-[1400px] px-5 py-24 text-center"><h1 className="text-2xl font-bold text-[#0F1729]">Unknown product</h1><a href="/" className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white">Home</a></section>;

  return (
    <div className="flex h-screen flex-col bg-[#EEF0F4]">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <a href="/" className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] transition hover:bg-slate-100" aria-label="Back"><ArrowLeft className="h-5 w-5" /></a>
        <div className="leading-none">
          <p className="text-[15px] font-bold text-[#0F1729]">{product.name}</p>
          <p className="text-[11px] text-[#98A2B3]">{product.widthMm}×{product.heightMm} mm · {product.dpi} DPI</p>
        </div>

        <div className="mx-3 h-7 w-px bg-slate-200" />
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <IconBtn onClick={undo} disabled={!canUndo} label="Undo"><Undo2 className="h-4 w-4" /></IconBtn>
          <IconBtn onClick={redo} disabled={!canRedo} label="Redo"><Redo2 className="h-4 w-4" /></IconBtn>
        </div>
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <IconBtn onClick={() => applyZoom(Math.max(0.4, +(zoom - 0.15).toFixed(2)))} label="Zoom out"><ZoomOut className="h-4 w-4" /></IconBtn>
          <span className="w-12 text-center text-[12px] font-bold text-[#475467]">{Math.round(zoom * 100)}%</span>
          <IconBtn onClick={() => applyZoom(Math.min(2.5, +(zoom + 0.15).toFixed(2)))} label="Zoom in"><ZoomIn className="h-4 w-4" /></IconBtn>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-100 p-1">
            {product.sides.map((s) => (
              <button key={s} onClick={() => switchSide(s)} className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold capitalize transition ${side === s ? "bg-white text-[#0037CA] shadow-sm" : "text-[#667085] hover:text-[#0F1729]"}`}>{s}</button>
            ))}
          </div>
          <button onClick={download} disabled={!ready} className="flex items-center gap-2 rounded-xl bg-[#0037CA] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-black disabled:opacity-40"><Download className="h-4 w-4" /> Download</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 flex-none space-y-6 overflow-y-auto border-r border-slate-200 bg-white p-4">
          <Section icon={Type} title="Text">
            <Tile onClick={() => addText("Your Name", 34, "bold")} disabled={!ready} title="Add heading" sub="Large title" size="text-[19px] font-bold" />
            <Tile onClick={() => addText("Job Title", 20, "normal")} disabled={!ready} title="Add subheading" sub="Medium" size="text-[15px] font-semibold" />
            <Tile onClick={() => addText("email@company.com", 14, "normal")} disabled={!ready} title="Add body text" sub="Small" size="text-[13px]" />
          </Section>

          <Section icon={Square} title="Shapes">
            <div className="grid grid-cols-2 gap-2">
              <ShapeTile onClick={addRect} disabled={!ready} icon={Square} label="Rectangle" />
              <ShapeTile onClick={addCircle} disabled={!ready} icon={CircleIcon} label="Circle" />
            </div>
          </Section>

          <Section icon={ImagePlus} title="Uploads">
            <label className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 text-center transition hover:border-[#0037CA] hover:bg-[#F5F8FF] ${!ready ? "pointer-events-none opacity-40" : ""}`}>
              <ImagePlus className="h-7 w-7 text-[#98A2B3]" />
              <span className="text-[13px] font-semibold text-[#0F1729]">Upload image</span>
              <span className="text-[11px] text-[#98A2B3]">PNG, JPG, SVG</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
            </label>
          </Section>
        </aside>

        <main className="relative flex flex-1 items-center justify-center overflow-auto p-10"
          style={{ backgroundImage: "radial-gradient(#d5d9e0 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
          <div className="rounded-xl bg-white p-0 shadow-[0_20px_60px_-18px_rgba(15,23,41,0.35)] ring-1 ring-black/5">
            <canvas ref={elRef} width={g.canvasW} height={g.canvasH} className="block rounded-xl" style={{ width: g.canvasW, height: g.canvasH }} />
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
              <p className="mt-2 text-[13px] text-[#98A2B3]">Select an element to edit it, or add one from the left panel.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {(sel.type === "textbox" || sel.type === "i-text") && (
                <div className="space-y-4 rounded-xl bg-slate-50 p-3">
                  <Field label="Font family">
                    <select value={sel.fontFamily} onChange={(e) => setProp("fontFamily", e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[13px]">
                      {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>
                  <Field label={`Font size — ${Math.round(sel.fontSize)}px`}>
                    <input type="range" min="8" max="96" value={sel.fontSize} onChange={(e) => setProp("fontSize", +e.target.value)} className="w-full accent-[#0037CA]" />
                  </Field>
                  <div className="flex gap-1.5">
                    <IconToggle active={sel.fontWeight === "bold"} onClick={() => setProp("fontWeight", sel.fontWeight === "bold" ? "normal" : "bold")}><Bold className="h-4 w-4" /></IconToggle>
                    <IconToggle active={sel.textAlign === "left"} onClick={() => setProp("textAlign", "left")}><AlignLeft className="h-4 w-4" /></IconToggle>
                    <IconToggle active={sel.textAlign === "center"} onClick={() => setProp("textAlign", "center")}><AlignCenter className="h-4 w-4" /></IconToggle>
                    <IconToggle active={sel.textAlign === "right"} onClick={() => setProp("textAlign", "right")}><AlignRight className="h-4 w-4" /></IconToggle>
                  </div>
                </div>
              )}

              <Field label="Colour">
                <div className="flex flex-wrap gap-2">
                  {SWATCHES.map((c) => <button key={c} onClick={() => setProp("fill", c)} className={`h-8 w-8 rounded-lg ring-1 ring-black/10 transition hover:scale-110 ${sel.fill === c ? "ring-2 ring-[#0037CA] ring-offset-2" : ""}`} style={{ backgroundColor: c }} aria-label={c} />)}
                  <label className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg ring-1 ring-black/10" style={{ background: "conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)" }}>
                    <input type="color" value={typeof sel.fill === "string" ? sel.fill : "#000000"} onChange={(e) => setProp("fill", e.target.value)} className="h-0 w-0 opacity-0" />
                  </label>
                </div>
              </Field>

              <Field label={`Opacity — ${Math.round((sel.opacity ?? 1) * 100)}%`}>
                <input type="range" min="0" max="1" step="0.05" value={sel.opacity ?? 1} onChange={(e) => setProp("opacity", +e.target.value)} className="w-full accent-[#0037CA]" />
              </Field>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#475467]"><Layers className="h-3.5 w-3.5" /> Arrange & actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <PanelBtn icon={ChevronUp} label="Forward" onClick={forward} />
                  <PanelBtn icon={ChevronDown} label="Backward" onClick={backward} />
                  <PanelBtn icon={Copy} label="Duplicate" onClick={duplicate} />
                  <PanelBtn icon={Trash2} label="Delete" onClick={del} danger />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-slate-100 bg-[#F5F8FF] p-3 text-[12px] leading-relaxed text-[#475467]">
            <p className="font-bold text-[#0F1729]">Print guides</p>
            <p className="mt-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0037CA] align-middle" /> Trim line — the card is cut here.</p>
            <p><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#22C55E] align-middle" /> Safe area — keep text inside.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function IconBtn({ onClick, disabled, label, children }) {
  return <button onClick={onClick} disabled={disabled} aria-label={label} className="grid h-8 w-8 place-items-center rounded-lg text-[#475467] transition hover:bg-white hover:text-[#0F1729] hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none">{children}</button>;
}
function Section({ icon: Icon, title, children }) {
  return <div><p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]"><Icon className="h-3.5 w-3.5" /> {title}</p><div className="space-y-2">{children}</div></div>;
}
function Tile({ onClick, disabled, title, sub, size }) {
  return <button onClick={onClick} disabled={disabled} className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-left transition hover:border-[#0037CA] hover:bg-[#F5F8FF] disabled:opacity-40">
    <span className={`text-[#0F1729] ${size}`}>{title.replace("Add ", "")}</span>
    <span className="text-[11px] text-[#98A2B3]">{sub}</span>
  </button>;
}
function ShapeTile({ onClick, disabled, icon: Icon, label }) {
  return <button onClick={onClick} disabled={disabled} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 py-4 text-[12px] font-semibold text-[#475467] transition hover:border-[#0037CA] hover:bg-[#F5F8FF] hover:text-[#0037CA] disabled:opacity-40"><Icon className="h-6 w-6" /> {label}</button>;
}
function Field({ label, children }) { return <div><label className="mb-1.5 block text-[12px] font-semibold text-[#475467]">{label}</label>{children}</div>; }
function IconToggle({ active, onClick, children }) { return <button onClick={onClick} className={`grid h-9 flex-1 place-items-center rounded-lg border transition ${active ? "border-[#0037CA] bg-[#0037CA] text-white" : "border-slate-200 bg-white text-[#475467] hover:border-[#0037CA]"}`}>{children}</button>; }
function PanelBtn({ icon: Icon, label, onClick, danger }) { return <button onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[12px] font-semibold transition ${danger ? "border-slate-200 text-[#DC2626] hover:border-[#DC2626] hover:bg-red-50" : "border-slate-200 text-[#475467] hover:border-[#0037CA] hover:bg-[#F5F8FF]"}`}><Icon className="h-4 w-4" /> {label}</button>; }