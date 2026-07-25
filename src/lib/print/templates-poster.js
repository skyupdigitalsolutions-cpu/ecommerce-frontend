import { EM, val, fitFontSize } from "./text-fit";

/* Poster templates (A3 portrait, single-sided). Same contract as the other
 * template files: build(scheme, g, data) returns a fabric JSON scene, `data`
 * holds personalize-form values and every field falls back to a placeholder. */

export const PO_SCHEMES = [
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

/* Joins the footer details that are present, so an unfilled field doesn't leave
 * a dangling separator. */
const joinParts = (parts, sep) => parts.filter(Boolean).join(sep);

/* ---- Bold: full-bleed colour block, oversized headline, detail bar ---- */
function bold(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width;
  const cw = g.canvasW,
    ch = g.canvasH;
  const blockH = ch * 0.46;
  const footH = ch * 0.14;
  const footT = ch - footH;

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      rect({ left: 0, top: 0, width: cw, height: blockH, fill: s.primary }),
      rect({ left: 0, top: blockH, width: cw, height: 10, fill: s.accent }),

      txt(val(d, "brandName", "Brand Name").toUpperCase(), s.accent, {
        left: L,
        top: T + 6,
        width: W,
        fontSize: 15,
        fontWeight: "bold",
        charSpacing: 300,
      }),
      txt(val(d, "headline", "YOUR HEADLINE").toUpperCase(), "#ffffff", {
        left: L,
        top: T + blockH * 0.28,
        width: W,
        fontSize: fitFontSize(val(d, "headline", "YOUR HEADLINE"), W, 62, {
          minSize: 26,
          lines: 2,
          em: EM.upperBold,
        }),
        fontWeight: "bold",
        lineHeight: 1.02,
      }),
      txt(val(d, "subheadline", "A short supporting line"), "#ffffff", {
        left: L,
        top: blockH - 62,
        width: W,
        fontSize: 19,
        opacity: 0.92,
      }),

      txt(
        val(
          d,
          "bodyText",
          "Add the details you want people to read after the headline.",
        ),
        "#1F2937",
        {
          left: L,
          top: blockH + 44,
          width: W,
          fontSize: 17,
          lineHeight: 1.55,
          fontFamily: "Georgia",
        },
      ),

      rect({ left: L, top: footT - 54, width: 64, height: 4, fill: s.accent }),
      txt(val(d, "dateTime", "Saturday 12 April · 6:00 PM"), s.primary, {
        left: L,
        top: footT - 38,
        width: W,
        fontSize: 20,
        fontWeight: "bold",
      }),
      txt(val(d, "venue", "Community Hall, MG Road"), "#475467", {
        left: L,
        top: footT - 14,
        width: W,
        fontSize: 15,
      }),

      rect({ left: 0, top: footT, width: cw, height: footH, fill: s.primary }),
      txt(
        joinParts(
          [
            val(d, "phone", "+91 98765 43210"),
            val(d, "website", "www.yourcompany.com"),
          ],
          "   ·   ",
        ),
        "#ffffff",
        {
          left: L,
          top: footT + footH / 2 - 9,
          width: W,
          fontSize: 15,
          textAlign: "center",
        },
      ),
    ],
  };
}

/* ---- Framed: white sheet inside a thick rule, centred type ---- */
function framed(s, g, d) {
  const cw = g.canvasW,
    ch = g.canvasH;
  const m = g.bleed + 22; // frame inset from the sheet edge
  const iw = cw - m * 2;
  const cx = m;

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      // frame drawn as four bars so it stays crisp at any scale
      rect({ left: m, top: m, width: iw, height: 6, fill: s.primary }),
      rect({ left: m, top: ch - m - 6, width: iw, height: 6, fill: s.primary }),
      rect({ left: m, top: m, width: 6, height: ch - m * 2, fill: s.primary }),
      rect({
        left: cw - m - 6,
        top: m,
        width: 6,
        height: ch - m * 2,
        fill: s.primary,
      }),

      txt(val(d, "brandName", "Brand Name").toUpperCase(), s.accent, {
        left: cx,
        top: m + 46,
        width: iw,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        charSpacing: 400,
      }),
      txt(val(d, "headline", "YOUR HEADLINE").toUpperCase(), s.primary, {
        left: cx,
        top: ch * 0.2,
        width: iw,
        fontSize: fitFontSize(val(d, "headline", "YOUR HEADLINE"), iw, 54, {
          minSize: 24,
          lines: 2,
          em: EM.upperBold,
        }),
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 1.05,
        fontFamily: "Georgia",
      }),
      rect({
        left: cx + iw * 0.35,
        top: ch * 0.38,
        width: iw * 0.3,
        height: 2,
        fill: s.accent,
      }),
      txt(val(d, "subheadline", "A short supporting line"), "#475467", {
        left: cx + iw * 0.1,
        top: ch * 0.41,
        width: iw * 0.8,
        fontSize: 18,
        textAlign: "center",
        fontFamily: "Georgia",
        fontStyle: "italic",
      }),
      txt(
        val(
          d,
          "bodyText",
          "Add the details you want people to read after the headline.",
        ),
        "#1F2937",
        {
          left: cx + iw * 0.12,
          top: ch * 0.5,
          width: iw * 0.76,
          fontSize: 16,
          lineHeight: 1.6,
          textAlign: "center",
          fontFamily: "Georgia",
        },
      ),

      txt(val(d, "dateTime", "Saturday 12 April · 6:00 PM"), s.primary, {
        left: cx,
        top: ch * 0.74,
        width: iw,
        fontSize: 19,
        fontWeight: "bold",
        textAlign: "center",
      }),
      txt(val(d, "venue", "Community Hall, MG Road"), "#475467", {
        left: cx,
        top: ch * 0.74 + 26,
        width: iw,
        fontSize: 15,
        textAlign: "center",
      }),
      txt(
        joinParts(
          [
            val(d, "phone", "+91 98765 43210"),
            val(d, "website", "www.yourcompany.com"),
          ],
          "   ·   ",
        ),
        s.primary,
        {
          left: cx,
          top: ch - m - 52,
          width: iw,
          fontSize: 14,
          textAlign: "center",
        },
      ),
    ],
  };
}

export const PO_TEMPLATES = [
  {
    id: "bold",
    name: "Bold Block",
    industry: "Events",
    doubleSided: false,
    build: bold,
  },
  {
    id: "framed",
    name: "Framed",
    industry: "Announcements",
    doubleSided: false,
    build: framed,
  },
];

export function getPoTemplate(id) {
  return PO_TEMPLATES.find((t) => t.id === id) || PO_TEMPLATES[0];
}
export function getPoScheme(id) {
  return PO_SCHEMES.find((s) => s.id === id) || PO_SCHEMES[0];
}