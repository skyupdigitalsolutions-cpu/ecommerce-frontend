import { EM, val, fitFontSize } from "./text-fit";

/* Label / sticker templates (100x70mm, single-sided). Same contract as the other
 * template files: build(scheme, g, data) returns a fabric JSON scene.
 *
 * Labels are die-cut, so everything readable stays inside safeBox and only the
 * colour blocks run to the canvas edge. */

export const LB_SCHEMES = [
  { id: "navy", primary: "#0B2E59", accent: "#F2A93B" },
  { id: "maroon", primary: "#7A1F2B", accent: "#E8B04B" },
  { id: "plum", primary: "#5B2A5E", accent: "#E4A0C8" },
  { id: "forest", primary: "#12402E", accent: "#8ED0A8" },
  { id: "steel", primary: "#2B4C6F", accent: "#9CC4E4" },
];

const txt = (t, fill, opts) => ({
  type: "textbox",
  text: t,
  fontFamily: "Arial",
  fill,
  originX: "left",
  originY: "top",
  ...opts,
});

const rect = (opts) => ({
  type: "rect",
  originX: "left",
  originY: "top",
  ...opts,
});

/* ---- Banded: colour band carries the brand, product name below ---- */
function banded(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;
  const cw = g.canvasW,
    ch = g.canvasH;
  const bandH = ch * 0.3;

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      rect({ left: 0, top: 0, width: cw, height: bandH, fill: s.primary }),
      rect({ left: 0, top: bandH, width: cw, height: 4, fill: s.accent }),

      txt(val(d, "brandName", "BRAND").toUpperCase(), "#ffffff", {
        left: L,
        top: T + bandH * 0.22,
        width: W,
        fontSize: fitFontSize(val(d, "brandName", "BRAND"), W, 20, {
          minSize: 10,
          em: EM.upperBold,
          charSpacing: 220,
        }),
        fontWeight: "bold",
        charSpacing: 220,
      }),

      txt(val(d, "productName", "Product Name"), s.primary, {
        left: L,
        top: bandH + 18,
        width: W * 0.66,
        fontSize: fitFontSize(
          val(d, "productName", "Product Name"),
          W * 0.66,
          17,
          {
            minSize: 9,
            em: EM.bold,
          },
        ),
        fontWeight: "bold",
      }),
      txt(val(d, "variant", "Original"), "#667085", {
        left: L,
        top: bandH + 40,
        width: W * 0.66,
        fontSize: 12,
      }),

      // net weight sits in its own corner so it reads at a glance on shelf
      rect({
        left: L + W * 0.68,
        top: bandH + 16,
        width: W * 0.32,
        height: 30,
        rx: 4,
        ry: 4,
        fill: s.accent,
      }),
      txt(val(d, "netWeight", "Net wt. 250 g"), s.primary, {
        left: L + W * 0.68,
        top: bandH + 25,
        width: W * 0.32,
        fontSize: fitFontSize(
          val(d, "netWeight", "Net wt. 250 g"),
          W * 0.32,
          11,
          {
            minSize: 7,
            em: EM.bold,
          },
        ),
        fontWeight: "bold",
        textAlign: "center",
      }),

      txt(
        "INGREDIENTS: " +
          val(
            d,
            "ingredients",
            "List the ingredients here, separated by commas.",
          ),
        "#475467",
        {
          left: L,
          top: T + H * 0.62,
          width: W,
          fontSize: 8,
          lineHeight: 1.35,
        },
      ),

      rect({
        left: L,
        top: T + H - 26,
        width: W,
        height: 1,
        fill: "#D1D5DB",
      }),
      txt(val(d, "batchInfo", "Batch 000 · Best before 12 months"), "#667085", {
        left: L,
        top: T + H - 20,
        width: W * 0.6,
        fontSize: 8,
      }),
      txt(val(d, "website", "www.yourcompany.com"), s.primary, {
        left: L + W * 0.6,
        top: T + H - 20,
        width: W * 0.4,
        fontSize: 8,
        fontWeight: "bold",
        textAlign: "right",
      }),
    ],
  };
}

/* ---- Outline: centred lockup inside a hairline frame ---- */
function outline(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;

  return {
    version: "6.0.0",
    background: "#FAF8F3",
    objects: [
      rect({ left: L, top: T, width: W, height: 1.5, fill: s.primary }),
      rect({
        left: L,
        top: T + H - 1.5,
        width: W,
        height: 1.5,
        fill: s.primary,
      }),

      txt(val(d, "brandName", "BRAND").toUpperCase(), s.primary, {
        left: L,
        top: T + 12,
        width: W,
        fontSize: fitFontSize(val(d, "brandName", "BRAND"), W, 13, {
          minSize: 7,
          em: EM.upperBold,
          charSpacing: 420,
        }),
        fontWeight: "bold",
        textAlign: "center",
        charSpacing: 420,
      }),

      txt(val(d, "productName", "Product Name"), s.primary, {
        left: L,
        top: T + H * 0.3,
        width: W,
        fontSize: fitFontSize(val(d, "productName", "Product Name"), W, 22, {
          minSize: 11,
          em: EM.serif,
        }),
        textAlign: "center",
        fontFamily: "Georgia",
      }),
      txt(val(d, "variant", "Original"), "#8A8A7E", {
        left: L,
        top: T + H * 0.3 + 28,
        width: W,
        fontSize: 11,
        textAlign: "center",
        fontFamily: "Georgia",
        fontStyle: "italic",
        charSpacing: 150,
      }),

      rect({
        left: L + W * 0.42,
        top: T + H * 0.58,
        width: W * 0.16,
        height: 1,
        fill: s.accent,
      }),

      txt(val(d, "netWeight", "Net wt. 250 g"), s.primary, {
        left: L,
        top: T + H * 0.63,
        width: W,
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "center",
      }),
      txt(
        val(
          d,
          "ingredients",
          "List the ingredients here, separated by commas.",
        ),
        "#8A8A7E",
        {
          left: L + W * 0.1,
          top: T + H * 0.72,
          width: W * 0.8,
          fontSize: 7.5,
          lineHeight: 1.35,
          textAlign: "center",
        },
      ),
      txt(
        [
          val(d, "batchInfo", "Batch 000"),
          val(d, "website", "www.yourcompany.com"),
        ]
          .filter(Boolean)
          .join("   ·   "),
        s.primary,
        {
          left: L,
          top: T + H - 16,
          width: W,
          fontSize: 7.5,
          textAlign: "center",
        },
      ),
    ],
  };
}

export const LB_TEMPLATES = [
  {
    id: "banded",
    name: "Banded",
    industry: "Food & Retail",
    doubleSided: false,
    build: banded,
  },
  {
    id: "outline",
    name: "Outline",
    industry: "Artisan",
    doubleSided: false,
    build: outline,
  },
];

export function getLbTemplate(id) {
  return LB_TEMPLATES.find((t) => t.id === id) || LB_TEMPLATES[0];
}
export function getLbScheme(id) {
  return LB_SCHEMES.find((s) => s.id === id) || LB_SCHEMES[0];
}