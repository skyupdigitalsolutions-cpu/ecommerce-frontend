export const PX_PER_MM_SCREEN = 6;   // on-screen render scale
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
  },
  // future: sticker, letterhead, standee, banner, brochure …
};

export function getPrintProduct(id) {
  return PRINT_PRODUCTS[id] || null;
}

export function geometry(p, scale = PX_PER_MM_SCREEN) {
  const bleed = p.bleedMm * scale;
  const safe = p.safeMm * scale;
  const trimW = p.widthMm * scale;
  const trimH = p.heightMm * scale;
  return {
    bleed, safe, trimW, trimH,
    canvasW: trimW + bleed * 2,
    canvasH: trimH + bleed * 2,
    trim: { left: bleed, top: bleed, width: trimW, height: trimH },
    safeBox: { left: bleed + safe, top: bleed + safe, width: trimW - safe * 2, height: trimH - safe * 2 },
    exportMultiplier: (p.dpi / 25.4) / scale,
  };
}