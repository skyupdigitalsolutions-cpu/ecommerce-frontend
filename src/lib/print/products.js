export const PX_PER_MM_SCREEN = 6;   // default on-screen render scale (small formats)
export const PRINT_DPI = 300;        // export resolution

export const PRINT_PRODUCTS = {
  "visiting-card": {
    id: "visiting-card",
    name: "Visiting Card",
    widthMm: 89,
    heightMm: 54,
    bleedMm: 3,
    safeMm: 3,
    dpi: 300,
    sides: ["front", "back"],
    background: "#ffffff",
    backHref: "/category/visiting-cards",
    // uses default PX_PER_MM_SCREEN
  },
  "letterhead": {
    id: "letterhead",
    name: "Letterhead",
    widthMm: 210,          // A4
    heightMm: 297,
    bleedMm: 3,
    safeMm: 12,            // letterheads keep a generous margin
    dpi: 300,
    sides: ["front"],      // single-sided
    background: "#ffffff",
    backHref: "/category/stationery-letterhead-and-notebooks",
    screenScale: 2.3,      // A4 would be huge at scale 6 — shrink to fit the editor
  },
  // future: sticker, standee, banner, brochure …
};

export function getPrintProduct(id) {
  return PRINT_PRODUCTS[id] || null;
}

export function geometry(p, scale) {
  // per-product screen scale wins; else the passed scale; else the default
  const s = scale ?? p.screenScale ?? PX_PER_MM_SCREEN;
  const bleed = p.bleedMm * s;
  const safe = p.safeMm * s;
  const trimW = p.widthMm * s;
  const trimH = p.heightMm * s;
  return {
    bleed, safe, trimW, trimH,
    canvasW: trimW + bleed * 2,
    canvasH: trimH + bleed * 2,
    trim: { left: bleed, top: bleed, width: trimW, height: trimH },
    safeBox: { left: bleed + safe, top: bleed + safe, width: trimW - safe * 2, height: trimH - safe * 2 },
    exportMultiplier: (p.dpi / 25.4) / s,
  };
}