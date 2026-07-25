import { useEffect, useState } from "react";
import { geometry } from "./products";
import { templateSet } from "./templates";

/* Renders each template's front to a small PNG dataURL using an offscreen
 * fabric canvas. Works for any product via the template registry. */
export function useTemplateThumbs(product, schemeId = "navy") {
  const [thumbs, setThumbs] = useState({});

  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    (async () => {
      const fabric = await import("fabric");
      const { StaticCanvas } = fabric;
      const g = geometry(product);
      const set = templateSet(product.id);
      const out = {};
      for (const tpl of set.templates) {
        try {
          const el = document.createElement("canvas");
          el.width = g.canvasW; el.height = g.canvasH;
          const c = new StaticCanvas(el, { width: g.canvasW, height: g.canvasH });
          const json = tpl.doubleSided
            ? tpl.buildSides(g).front
            : tpl.build(set.getScheme(schemeId), g);
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