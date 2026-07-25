import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";
import {
  ArrowLeft,
  Download,
  Check,
  Pencil,
  RotateCcw,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { getPrintProduct, geometry } from "../../../lib/print/products";
import { templateSet, buildScenes } from "../../../lib/print/templates";
import {
  fieldsFor,
  blankValues,
  filledCount,
} from "../../../lib/print/design-fields";

const FONTS = ["Poppins", "Arial", "Georgia", "Courier New", "Times New Roman"];

export default function Page() {
  const { routeParams } = usePageContext();
  const product = getPrintProduct(routeParams.product);
  const fields = fieldsFor(routeParams.product);
  const set = templateSet(routeParams.product);

  const elRef = useRef(null);
  const canvasRef = useRef(null);
  const renderSeq = useRef(0);

  const [values, setValues] = useState(() => blankValues(routeParams.product));
  const [templateId, setTemplateId] = useState(set.templates[0]?.id || null);
  const [schemeId, setSchemeId] = useState(set.defaultScheme);
  const [side, setSide] = useState("front");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const g = useMemo(() => (product ? geometry(product) : null), [product]);
  const tpl = templateId ? set.getTemplate(templateId) : null;
  const doubleSided = !!tpl?.doubleSided;
  // Most double-sided templates bake their own palette (the visiting cards), but
  // some accept a scheme, so the picker follows the template rather than the side
  // count.
  const showSchemes =
    set.schemes.length > 1 && (!doubleSided || !!tpl?.schemeAware);

  // Preview is scaled to fit its column; the export always renders at full
  // print resolution regardless of what the preview is showing.
  const previewW = 420;
  const previewScale = g ? Math.min(1, previewW / g.canvasW) : 1;

  const scenes = useMemo(
    () =>
      product && g && templateId
        ? buildScenes(product.id, templateId, schemeId, g, values)
        : null,
    [product, g, templateId, schemeId, values],
  );

  /* ---- create the preview canvas once ---- */
  useEffect(() => {
    if (!product || !g) return;
    let disposed = false;
    let canvas;
    (async () => {
      const fabric = await import("fabric");
      if (disposed || !elRef.current) return;
      const { StaticCanvas } = fabric;
      canvas = new StaticCanvas(elRef.current, {
        width: g.canvasW,
        height: g.canvasH,
      });
      canvas.__fabric = fabric;
      canvasRef.current = canvas;
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await Promise.all(
            FONTS.map((f) => document.fonts.load(`16px "${f}"`)),
          );
          await document.fonts.ready;
        } catch {}
      }
      if (!disposed) setReady(true);
    })();
    return () => {
      disposed = true;
      canvas?.dispose();
      canvasRef.current = null;
    };
  }, [product, g]);

  /* ---- re-render whenever a field, template, scheme or side changes ---- */
  useEffect(() => {
    const c = canvasRef.current;
    if (!ready || !c || !scenes) return;
    const scene = side === "back" && scenes.back ? scenes.back : scenes.front;
    if (!scene) return;
    // loadFromJSON is async; a fast typist can queue several. Only the newest
    // render is allowed to paint, otherwise an older one can land last.
    const seq = ++renderSeq.current;
    (async () => {
      try {
        await c.loadFromJSON(scene);
        if (seq !== renderSeq.current) return;
        c.renderAll();
      } catch (e) {
        console.error("preview render failed:", e);
      }
    })();
  }, [ready, scenes, side]);

  const setField = (key, v) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setSaved(false);
  };

  /* Read an uploaded logo, downscale it, and record its size.
   *
   * Two reasons not to store the file as-is: the data URL travels into
   * localStorage on the hand-off to the editor (a few MB is enough to blow the
   * quota), and the logo is only ever printed into a slot a couple of centimetres
   * wide. LOGO_MAX_PX is comfortably above what 300 DPI needs for that slot.
   * The natural size is kept because templates have no canvas to measure with. */
  const LOGO_MAX_PX = 800;
  const readLogo = (key, file) => {
    if (!file) return;
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("That file isn't an image.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setUploadError("Couldn't read that file.");
    reader.onload = () => {
      const src = String(reader.result || "");
      const img = new Image();
      img.onerror = () =>
        setUploadError("That image couldn't be loaded — try a PNG or JPG.");
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) {
          // SVGs without intrinsic dimensions land here; there is nothing to
          // scale against, so ask for a raster version instead of guessing.
          setUploadError(
            "That image has no fixed size — please upload a PNG or JPG.",
          );
          return;
        }
        const k = Math.min(1, LOGO_MAX_PX / Math.max(w, h));
        if (k === 1 && src.length < 400_000) {
          // Already small enough; keep the original bytes rather than re-encoding
          // (re-encoding a clean PNG only adds artefacts and size).
          setValues((prev) => ({
            ...prev,
            [key]: src,
            [`${key}W`]: w,
            [`${key}H`]: h,
          }));
          setSaved(false);
          return;
        }
        const cw = Math.max(1, Math.round(w * k));
        const chh = Math.max(1, Math.round(h * k));
        const off = document.createElement("canvas");
        off.width = cw;
        off.height = chh;
        const ctx = off.getContext("2d");
        ctx.drawImage(img, 0, 0, cw, chh);
        // PNG keeps transparency, which matters on the coloured header band.
        const out = off.toDataURL("image/png");
        setValues((prev) => ({
          ...prev,
          [key]: out,
          [`${key}W`]: cw,
          [`${key}H`]: chh,
        }));
        setSaved(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = (key) => {
    setUploadError("");
    setValues((prev) => ({
      ...prev,
      [key]: "",
      [`${key}W`]: 0,
      [`${key}H`]: 0,
    }));
    setSaved(false);
  };

  const resetFields = () => {
    setValues(blankValues(routeParams.product));
    setUploadError("");
    setSaved(false);
  };

  /* ---- download the current side at full print resolution ---- */
  const download = useCallback(
    async (which) => {
      const c = canvasRef.current;
      if (!c || !scenes || !g) return;
      const scene = which === "back" ? scenes.back : scenes.front;
      if (!scene) return;
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {}
      }
      // Render the requested side, export, then restore whatever was on screen.
      await c.loadFromJSON(scene);
      c.renderAll();
      const data = c.toDataURL({
        format: "png",
        multiplier: g.exportMultiplier,
      });
      const a = document.createElement("a");
      a.href = data;
      a.download = `${product.id}-${templateId}-${which}.png`;
      a.click();
      const back = side === "back" && scenes.back ? scenes.back : scenes.front;
      await c.loadFromJSON(back);
      c.renderAll();
    },
    [scenes, g, product, templateId, side],
  );

  /* ---- hand off to the full editor, keeping what was typed ---- */
  const openInEditor = () => {
    if (!scenes || !product) return;
    try {
      localStorage.setItem(
        `design:${product.id}:v2:front`,
        JSON.stringify(scenes.front),
      );
      if (scenes.back) {
        localStorage.setItem(
          `design:${product.id}:v2:back`,
          JSON.stringify(scenes.back),
        );
      } else {
        localStorage.removeItem(`design:${product.id}:v2:back`);
      }
      setSaved(true);
    } catch (e) {
      // An embedded logo pushes the scene JSON past the storage quota on some
      // browsers. Say so rather than navigating to an editor showing stale work.
      setUploadError(
        "Couldn't carry this into the editor — the logo is too large to store. Try a smaller image, or download from here instead.",
      );
      return;
    }
    // No ?template= — the editor loads the stored scene, which is the
    // personalized one rather than the untouched template.
    window.location.href = `/design/${product.id}`;
  };

  if (!product || fields.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0F1729]">
          This product can't be personalized
        </h1>
        <p className="mt-3 text-[15px] text-[#667085]">
          Personalizing is available for visiting cards, stationery, signs &
          posters, and labels & packaging.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white"
        >
          Home
        </a>
      </section>
    );
  }

  const done = filledCount(routeParams.product, values);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <a
          href={product.backHref || "/"}
          className="grid h-9 w-9 place-items-center rounded-lg text-[#475467] transition hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div className="leading-none">
          <p className="text-[15px] font-bold text-[#0F1729]">
            Personalize your {product.name}
          </p>
          <p className="text-[11px] text-[#98A2B3]">
            {product.widthMm}×{product.heightMm} mm · {product.dpi} DPI · {done}
            /{fields.length} fields filled
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={resetFields}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-semibold text-[#475467] transition hover:border-[#0037CA] hover:text-[#0037CA]"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            onClick={openInEditor}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-semibold text-[#475467] transition hover:border-[#0037CA] hover:text-[#0037CA]"
          >
            {saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}{" "}
            Fine-tune in editor
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_480px]">
        {/* ---------------- form ---------------- */}
        <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <h2 className="text-[17px] font-bold text-[#0F1729]">Your details</h2>
          <p className="mt-1 text-[13px] text-[#667085]">
            Fill in the fields below — the preview updates as you type. Anything
            you leave blank keeps the design's own sample text.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.key}
                className={
                  f.type === "textarea" || f.type === "image"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <label
                  htmlFor={`f-${f.key}`}
                  className="block text-[12px] font-semibold text-[#344054]"
                >
                  {f.label}
                </label>
                {f.type === "image" ? (
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-[repeating-conic-gradient(#F1F3F7_0%_25%,#ffffff_0%_50%)] bg-[length:12px_12px]">
                      {values[f.key] ? (
                        <img
                          src={values[f.key]}
                          alt="Logo preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <ImagePlus className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-[13px] font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA]">
                          {values[f.key] ? "Replace logo" : "Upload logo"}
                          <input
                            id={`f-${f.key}`}
                            type="file"
                            accept={f.accept || "image/*"}
                            className="hidden"
                            onChange={(e) => {
                              readLogo(f.key, e.target.files?.[0]);
                              // allow re-picking the same file
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {values[f.key] && (
                          <button
                            type="button"
                            onClick={() => clearLogo(f.key)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-semibold text-[#B42318] transition hover:border-[#B42318]"
                          >
                            <Trash2 className="h-4 w-4" /> Remove
                          </button>
                        )}
                      </div>
                      {values[f.key] && values[`${f.key}W`] ? (
                        <p className="mt-1.5 truncate text-[11px] text-[#98A2B3]">
                          {values[`${f.key}W`]}×{values[`${f.key}H`]} px ·
                          scaled to fit the logo area
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : f.type === "textarea" ? (
                  <textarea
                    id={`f-${f.key}`}
                    rows={f.rows || 3}
                    maxLength={f.maxLength}
                    value={values[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-[#0F1729] outline-none transition focus:border-[#0037CA]"
                  />
                ) : (
                  <input
                    id={`f-${f.key}`}
                    type={f.type || "text"}
                    maxLength={f.maxLength}
                    value={values[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-[#0F1729] outline-none transition focus:border-[#0037CA]"
                  />
                )}
                <div className="mt-1 flex items-start justify-between gap-2">
                  <span
                    className={`text-[11px] ${f.type === "image" && uploadError ? "text-[#B42318]" : "text-[#98A2B3]"}`}
                  >
                    {f.type === "image" && uploadError
                      ? uploadError
                      : f.hint || ""}
                  </span>
                  {f.maxLength && f.type !== "image" ? (
                    <span className="shrink-0 text-[11px] text-[#CBD2DC]">
                      {(values[f.key] ?? "").length}/{f.maxLength}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- preview ---------------- */}
        <section className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#0F1729]">Preview</h2>
              {doubleSided && (
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {["front", "back"].map((sd) => (
                    <button
                      key={sd}
                      type="button"
                      onClick={() => setSide(sd)}
                      className={`rounded-md px-3 py-1 text-[12px] font-semibold capitalize transition ${side === sd ? "bg-white text-[#0037CA] shadow-sm" : "text-[#667085]"}`}
                    >
                      {sd}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="mx-auto overflow-hidden bg-white shadow-[0_18px_50px_-20px_rgba(15,23,41,0.35)] ring-1 ring-black/10"
              style={{
                width: g.canvasW * previewScale,
                height: g.canvasH * previewScale,
              }}
            >
              <canvas
                ref={elRef}
                width={g.canvasW}
                height={g.canvasH}
                style={{
                  width: g.canvasW * previewScale,
                  height: g.canvasH * previewScale,
                  display: "block",
                }}
              />
            </div>
            {!ready && (
              <p className="mt-3 text-center text-[12px] text-[#98A2B3]">
                Loading preview…
              </p>
            )}

            {set.templates.length > 1 && (
              <>
                <p className="mt-5 text-[12px] font-semibold text-[#344054]">
                  Layout
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {set.templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplateId(t.id)}
                      className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition ${templateId === t.id ? "border-[#0037CA] text-[#0037CA]" : "border-slate-200 text-[#475467] hover:border-[#0037CA]"}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {showSchemes && (
              <>
                <p className="mt-4 text-[12px] font-semibold text-[#344054]">
                  Colour
                </p>
                <div className="mt-2 flex gap-2">
                  {set.schemes.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSchemeId(sc.id)}
                      aria-label={sc.id}
                      className={`h-8 w-8 rounded-full ring-1 ring-black/10 transition hover:scale-110 ${schemeId === sc.id ? "ring-2 ring-[#0037CA] ring-offset-2" : ""}`}
                      style={{ backgroundColor: sc.primary }}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => download(side)}
                disabled={!ready}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0037CA] py-3.5 text-[15px] font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
                Download {doubleSided ? side : "design"} (PNG)
              </button>
              {doubleSided && scenes?.back && (
                <button
                  type="button"
                  onClick={() => download(side === "front" ? "back" : "front")}
                  disabled={!ready}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-3 text-[14px] font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA] disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download {side === "front" ? "back" : "front"} too
                </button>
              )}
              <p className="pt-1 text-center text-[11px] text-[#98A2B3]">
                Exports at {g.exportDpi} DPI, print ready with bleed
                {g.exportDpi < product.dpi
                  ? ` (capped from ${product.dpi} — the full-size file is too large for a browser to render)`
                  : ""}
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}