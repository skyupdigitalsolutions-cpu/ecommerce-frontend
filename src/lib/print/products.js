export const PX_PER_MM_SCREEN = 6; // default on-screen render scale (small formats)
export const PRINT_DPI = 300; // export resolution

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
  letterhead: {
    id: "letterhead",
    name: "Letterhead",
    widthMm: 210, // A4
    heightMm: 297,
    bleedMm: 3,
    safeMm: 12, // letterheads keep a generous margin
    dpi: 300,
    sides: ["front"], // single-sided
    background: "#ffffff",
    backHref: "/category/stationery-letterhead-and-notebooks",
    screenScale: 2.3, // A4 would be huge at scale 6 — shrink to fit the editor
  },
  poster: {
    id: "poster",
    name: "Poster",
    widthMm: 297, // A3 portrait — change if your house default differs
    heightMm: 420,
    bleedMm: 3,
    safeMm: 10,
    dpi: 300,
    sides: ["front"], // single-sided
    background: "#ffffff",
    backHref: "/category/signs-posters-and-marketing-materials",
    screenScale: 1.6, // A3 at scale 6 would be ~2500px — shrink to fit
  },
  label: {
    id: "label",
    name: "Label / Sticker",
    widthMm: 100, // a common rectangular product label
    heightMm: 70,
    bleedMm: 2, // labels are die-cut, so a tighter bleed
    safeMm: 4,
    dpi: 300,
    sides: ["front"],
    background: "#ffffff",
    backHref: "/category/labels-stickers-and-packaging",
    screenScale: 5,
  },
  envelope: {
    id: "envelope",
    name: "Envelope",
    widthMm: 220, // DL, the standard business envelope
    heightMm: 110,
    bleedMm: 3,
    safeMm: 8,
    dpi: 300,
    sides: ["front"],
    background: "#ffffff",
    backHref: "/category/stationery-letterhead-and-notebooks",
    screenScale: 2.2,
  },
  brochure: {
    id: "brochure",
    name: "Brochure",
    widthMm: 297, // A4 landscape, tri-fold — flat/unfolded size
    heightMm: 210,
    bleedMm: 3,
    safeMm: 8,
    dpi: 300,
    sides: ["front", "back"], // outer face and inner spread
    background: "#ffffff",
    backHref: "/category/signs-posters-and-marketing-materials",
    screenScale: 1.6,
    panels: 3, // read by the brochure templates to place fold lines
  },
  flyer: {
    id: "flyer",
    name: "Flyer",
    widthMm: 148, // A5 portrait
    heightMm: 210,
    bleedMm: 3,
    safeMm: 8,
    dpi: 300,
    sides: ["front"],
    background: "#ffffff",
    backHref: "/category/signs-posters-and-marketing-materials",
    screenScale: 3.2,
  },
  standee: {
    id: "standee",
    name: "Roll-up Standee",
    widthMm: 850, // standard roll-up cassette width
    heightMm: 2000,
    bleedMm: 10,
    safeMm: 60, // the bottom sits in the cassette; keep art clear
    dpi: 150, // large format is viewed from a distance
    sides: ["front"],
    background: "#ffffff",
    backHref: "/category/signs-posters-and-marketing-materials",
    screenScale: 0.24, // 2m tall at any real scale would not fit an editor
    maxExportPx: 9000, // a browser canvas cannot hold the full 150 DPI file
  },
};

export function getPrintProduct(id) {
  return PRINT_PRODUCTS[id] || null;
}

/* Hard ceiling on the long edge of an exported PNG. Browser canvases fail —
 * silently, on some engines — well before the theoretical limit, and a 2m
 * standee at 300 DPI would be ~24000px. Products can lower this further. */
export const MAX_EXPORT_PX = 12000;

export function geometry(p, scale) {
  // per-product screen scale wins; else the passed scale; else the default
  const s = scale ?? p.screenScale ?? PX_PER_MM_SCREEN;
  const bleed = p.bleedMm * s;
  const safe = p.safeMm * s;
  const trimW = p.widthMm * s;
  const trimH = p.heightMm * s;
  // Clamp the export multiplier to something a canvas can actually render, and
  // report the DPI that clamp leaves us with so the UI can state it honestly
  // instead of promising the nominal figure.
  const idealMultiplier = p.dpi / 25.4 / s;
  const cap = p.maxExportPx ?? MAX_EXPORT_PX;
  const exportMultiplier = Math.min(
    idealMultiplier,
    cap / Math.max(trimW, trimH),
  );
  const exportDpi = Math.round(exportMultiplier * s * 25.4);
  return {
    bleed,
    safe,
    trimW,
    trimH,
    canvasW: trimW + bleed * 2,
    canvasH: trimH + bleed * 2,
    trim: { left: bleed, top: bleed, width: trimW, height: trimH },
    safeBox: {
      left: bleed + safe,
      top: bleed + safe,
      width: trimW - safe * 2,
      height: trimH - safe * 2,
    },
    exportMultiplier,
    exportDpi,
  };
}