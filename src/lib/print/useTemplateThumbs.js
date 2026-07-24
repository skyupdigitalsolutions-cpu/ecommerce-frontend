import { useEffect, useState } from "react";
import { geometry } from "./products";
import { getVcScheme, VC_TEMPLATES } from "./templates-vc";

/* Renders each template's front to a small PNG dataURL using an offscreen
 * fabric canvas. Runs once on the client; returns { [templateId]: dataUrl }. */
export function useTemplateThumbs(product, schemeId = "navy") {
  const [thumbs, setThumbs] = useState({});

  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    (async () => {
      const fabric = await import("fabric");
      const { StaticCanvas } = fabric;
      const g = geometry(product);
      const out = {};
      for (const tpl of VC_TEMPLATES) {
        try {
          const el = document.createElement("canvas");
          el.width = g.canvasW; el.height = g.canvasH;
          const c = new StaticCanvas(el, { width: g.canvasW, height: g.canvasH });
          const json = tpl.doubleSided ? tpl.buildSides(g).front : tpl.build(getVcScheme(schemeId), g);
          await c.loadFromJSON(json);
          c.renderAll();
          out[tpl.id] = c.toDataURL({ format: "png", multiplier: 0.5 });
          c.dispose();
        } catch (e) { /* skip a bad template, keep the rest */ }
      }
      if (!cancelled) setThumbs(out);
    })();
    return () => { cancelled = true; };
  }, [product, schemeId]);

  return thumbs;
}