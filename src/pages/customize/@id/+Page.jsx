import { useEffect, useRef, useState } from "react";
import { useData } from "vike-react/useData";
import { Type, ImagePlus, Trash2, Palette, Download, MapPin, User, Phone, Box, Square } from "lucide-react";
import Product3DPreview from "../../../components/product/Product3DPreview";

const CANVAS = 520; // px, square editor stage

export default function Page() {
  const { product } = useData();

  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const guideRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [textColor, setTextColor] = useState("#111827");
  const [logoUrl, setLogoUrl] = useState(null); // for the 3D preview
  const [view, setView] = useState("2d");        // "2d" | "3d"

  const mockup = product?.mockup || product?.img;
  const printArea = product?.printArea || { x: 0.3, y: 0.3, w: 0.4, h: 0.4 };

useEffect(() => {
    let disposed = false;
    let canvas;

    // guard: if fabric already attached to this element, don't re-init
    if (fabricRef.current) return;

    (async () => {
      const fabric = await import("fabric");
      const { Canvas, FabricImage, Rect } = fabric;

      // element gone or we were torn down before import resolved
      if (disposed || !canvasElRef.current) return;
      // extra guard against StrictMode double-run
      if (fabricRef.current) return;

      canvas = new Canvas(canvasElRef.current, {
        width: CANVAS,
        height: CANVAS,
        backgroundColor: "#F2F1EE",
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      try {
        const img = await FabricImage.fromURL(mockup, { crossOrigin: "anonymous" });
        if (disposed) return;
        const scale = Math.min(CANVAS / img.width, CANVAS / img.height);
        img.set({ scaleX: scale, scaleY: scale, originX: "center", originY: "center", left: CANVAS / 2, top: CANVAS / 2, selectable: false, evented: false });
        canvas.backgroundImage = img;
      } catch {
        /* image failed — editor still works */
      }

      const guide = new Rect({
        left: printArea.x * CANVAS, top: printArea.y * CANVAS,
        width: printArea.w * CANVAS, height: printArea.h * CANVAS,
        fill: "transparent", stroke: "#0037CA", strokeDashArray: [6, 4], strokeWidth: 1.5,
        selectable: false, evented: false, excludeFromExport: true,
      });
      canvas.add(guide);
      guideRef.current = guide;
      canvas.requestRenderAll();

      const sync = () => setHasSelection(!!canvas.getActiveObject());
      canvas.on("selection:created", sync);
      canvas.on("selection:updated", sync);
      canvas.on("selection:cleared", () => setHasSelection(false));

      if (!disposed) setReady(true);
    })();

    const onKey = (e) => {
      const c = fabricRef.current;
      if (!c) return;
      if ((e.key === "Delete" || e.key === "Backspace") && c.getActiveObject() && !c.getActiveObject().isEditing) {
        c.remove(c.getActiveObject());
        c.requestRenderAll();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      disposed = true;
      window.removeEventListener("keydown", onKey);
      const c = fabricRef.current;
      if (c) { c.dispose(); fabricRef.current = null; }  // clear the ref so re-mount can re-init cleanly
    };
  }, [mockup, printArea.x, printArea.y, printArea.w, printArea.h]);

  const centerOfPrint = () => ({
    left: (printArea.x + printArea.w / 2) * CANVAS,
    top: (printArea.y + printArea.h / 2) * CANVAS,
  });

  const addText = async (initial) => {
    const { Textbox } = await import("fabric");
    const c = fabricRef.current;
    const t = new Textbox(initial, {
      ...centerOfPrint(),
      originX: "center",
      originY: "center",
      width: printArea.w * CANVAS * 0.9,
      fontSize: 24,
      fill: textColor,
      textAlign: "center",
      fontFamily: "Poppins, sans-serif",
    });
    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    const { FabricImage } = await import("fabric");
    const c = fabricRef.current;
    const url = URL.createObjectURL(file);
    setLogoUrl(url); // feed the 3D preview
    const img = await FabricImage.fromURL(url);
    const max = printArea.w * CANVAS * 0.7;
    const scale = Math.min(max / img.width, max / img.height);
    img.set({ ...centerOfPrint(), originX: "center", originY: "center", scaleX: scale, scaleY: scale });
    c.add(img);
    c.setActiveObject(img);
    c.requestRenderAll();
  };

  const applyColor = (hex) => {
    setTextColor(hex);
    const c = fabricRef.current;
    const o = c?.getActiveObject();
    if (o && o.type === "textbox") {
      o.set("fill", hex);
      c.requestRenderAll();
    }
  };

  const deleteSelected = () => {
    const c = fabricRef.current;
    if (c?.getActiveObject()) {
      c.remove(c.getActiveObject());
      c.requestRenderAll();
    }
  };

  const saveDesign = () => {
    const c = fabricRef.current;
    if (!c) return;

    const guide = guideRef.current;
    if (guide) { guide.visible = false; c.discardActiveObject(); c.renderAll(); }

    const dataUrl = c.toDataURL({ format: "png", multiplier: 2 });

    if (guide) { guide.visible = true; c.renderAll(); }

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${product?.slug || "design"}.png`;
    a.click();
  };

  if (!product) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0F1729]">Product not found</h1>
        <a href="/" className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white">Back to home</a>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <nav className="mb-5 text-[13px] text-[#98A2B3]">
          <a href="/" className="hover:text-[#0037CA]">Home</a>
          <span className="mx-1.5">/</span>
          <a href={`/product/${product.slug}`} className="hover:text-[#0037CA]">{product.title}</a>
          <span className="mx-1.5">/</span>
          <span className="text-[#475467]">Customize</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-6">
            <div>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-[#98A2B3]">Add text</p>
              <div className="space-y-2">
                <ToolButton icon={Type} label="Add text" onClick={() => addText("Your text")} disabled={!ready} />
                <ToolButton icon={User} label="Add name" onClick={() => addText("Your Name")} disabled={!ready} />
                <ToolButton icon={MapPin} label="Add address" onClick={() => addText("Your Address")} disabled={!ready} />
                <ToolButton icon={Phone} label="Add phone" onClick={() => addText("+91 00000 00000")} disabled={!ready} />
              </div>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-[#98A2B3]">Logo / image</p>
              <label className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 text-[14px] font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA] ${!ready ? "pointer-events-none opacity-40" : ""}`}>
                <ImagePlus className="h-5 w-5" /> Upload logo
                <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => uploadLogo(e.target.files?.[0])} />
              </label>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-[#98A2B3]"><Palette className="h-4 w-4" /> Text color</p>
              <div className="flex flex-wrap gap-2">
                {["#111827", "#FFFFFF", "#0037CA", "#DC2626", "#166534", "#CA8A04"].map((hex) => (
                  <button key={hex} type="button" onClick={() => applyColor(hex)} aria-label={hex}
                    className={`h-8 w-8 rounded-full ring-offset-2 ${textColor === hex ? "ring-2 ring-[#0037CA]" : "ring-1 ring-black/10"}`} style={{ backgroundColor: hex }} />
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-200 pt-4">
              <button type="button" onClick={deleteSelected} disabled={!hasSelection}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-2.5 text-[14px] font-semibold text-[#DC2626] transition hover:border-[#DC2626] disabled:opacity-40">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>

            <button type="button" onClick={saveDesign} disabled={!ready}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0037CA] py-3.5 text-[15px] font-semibold text-white transition hover:bg-black disabled:opacity-40">
              <Download className="h-5 w-5" /> Save design
            </button>
          </aside>

          <div className="flex flex-col items-center">
            {/* 2D / 3D toggle */}
            <div className="mb-4 inline-flex rounded-full border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => setView("2d")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${view === "2d" ? "bg-[#0037CA] text-white" : "text-[#475467]"}`}
              >
                <Square className="h-4 w-4" /> 2D edit
              </button>
              <button
                type="button"
                onClick={() => setView("3d")}
                disabled={!product.model3d}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition disabled:opacity-40 ${view === "3d" ? "bg-[#0037CA] text-white" : "text-[#475467]"}`}
                title={product.model3d ? "" : "No 3D model for this product"}
              >
                <Box className="h-4 w-4" /> 3D preview
              </button>
            </div>

            {/* stage — canvas stays mounted (hidden) so fabric state persists */}
            <div className="w-full max-w-[560px]">
              <div className={view === "2d" ? "" : "hidden"}>
                <div className="rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <canvas ref={canvasElRef} width={CANVAS} height={CANVAS} className="rounded-lg" />
                  <p className="mt-3 text-center text-[12px] text-[#98A2B3]">Drag to move · corners to resize · Delete key to remove</p>
                </div>
              </div>

              {view === "3d" && (
                product.model3d ? (
                  <Product3DPreview modelUrl={product.model3d} logoUrl={logoUrl} color="#ffffff" />
                ) : (
                  <div className="flex h-[520px] items-center justify-center rounded-2xl border border-slate-200 text-[#98A2B3]">
                    No 3D model for this product yet.
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="flex w-full items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 text-[14px] font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-40">
      <Icon className="h-5 w-5" /> {label}
    </button>
  );
}