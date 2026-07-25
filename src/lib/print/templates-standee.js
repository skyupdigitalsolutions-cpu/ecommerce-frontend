/* Roll-up standee templates (850x2000mm portrait, single-sided).
 *
 * Two things drive these layouts. The bottom ~150mm rolls into the cassette and
 * the very top can curl, so nothing that must be read goes there — the product's
 * generous safeMm already pulls the safe box in, and these keep the headline in
 * the upper-middle where it sits at eye level. And it is read from several
 * metres, so type is proportionally much larger than on any paper format. */

import { EM, val, fitFontSize, fitBlockFontSize } from "./text-fit";
import { hasLogo, logoObject, logoInitial } from "./logo-slot";

export const ST_SCHEMES = [
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

const bulletBlock = (raw, fallback) =>
  String(raw && String(raw).trim() ? raw : fallback)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => "•  " + l)
    .join("\n");

/* Guide marking the cassette area, preview only. */
const cassetteGuide = (g) => {
  const hMm = 150; // roughly what a standard roll-up base swallows
  const h = (hMm / 2000) * g.trim.height;
  return [
    rect({
      left: g.trim.left,
      top: g.trim.top + g.trim.height - h,
      width: g.trim.width,
      height: h,
      fill: "rgba(148,163,184,0.16)",
      selectable: false,
      evented: false,
      excludeFromExport: true,
    }),
    txt("Rolls into the base — keep clear", "#94A3B8", {
      left: g.trim.left + 6,
      top: g.trim.top + g.trim.height - h + 6,
      width: g.trim.width - 12,
      fontSize: 7,
      textAlign: "center",
      selectable: false,
      evented: false,
      excludeFromExport: true,
    }),
  ];
};

/* ---- Column: full-bleed colour top, headline at eye level, points beneath ---- */
function column(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width;
  const cw = g.canvasW,
    ch = g.canvasH;
  const topH = ch * 0.42;
  const headline = val(d, "headline", "YOUR HEADLINE").toUpperCase();
  const logo = hasLogo(d);

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      rect({ left: 0, top: 0, width: cw, height: topH, fill: s.primary }),
      rect({
        left: 0,
        top: topH,
        width: cw,
        height: ch * 0.008,
        fill: s.accent,
      }),

      ...(logo
        ? [
            logoObject(d, {
              cx: cw / 2,
              cy: T + ch * 0.05,
              w: W * 0.62,
              h: ch * 0.07,
            }),
          ]
        : [
            txt(val(d, "brandName", "Brand Name").toUpperCase(), s.accent, {
              left: L,
              top: T + ch * 0.03,
              width: W,
              fontSize: 9,
              fontWeight: "bold",
              textAlign: "center",
              charSpacing: 300,
            }),
          ]),

      txt(headline, "#ffffff", {
        left: L,
        top: topH * 0.42,
        width: W,
        fontSize: fitFontSize(headline, W, 30, {
          minSize: 14,
          lines: 3,
          em: EM.upperBold,
        }),
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 1.08,
      }),
      txt(val(d, "subheadline", "A short supporting line"), "#ffffff", {
        left: L,
        top: topH * 0.8,
        width: W,
        fontSize: 11,
        textAlign: "center",
        opacity: 0.92,
        lineHeight: 1.4,
      }),

      (() => {
        // The bullets have from below the colour block down to the contact rule.
        // Shrink to fit that box rather than running into it.
        const text = bulletBlock(
          d?.bulletPoints,
          "First key point\nSecond key point\nThird key point\nFourth key point",
        );
        const top = topH + ch * 0.06;
        return txt(text, "#1F2937", {
          left: L,
          top,
          width: W,
          fontSize: fitBlockFontSize(text, W, ch * 0.82 - top - 8, 12, {
            minSize: 6,
            lineHeight: 2.1,
          }),
          lineHeight: 2.1,
        });
      })(),

      rect({
        left: L,
        top: ch * 0.82,
        width: W,
        height: 2,
        fill: s.accent,
      }),
      txt(val(d, "phone", "+91 98765 43210"), s.primary, {
        left: L,
        top: ch * 0.84,
        width: W,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
      }),
      txt(val(d, "website", "www.yourcompany.com"), "#475467", {
        left: L,
        top: ch * 0.87,
        width: W,
        fontSize: 11,
        textAlign: "center",
      }),

      ...cassetteGuide(g),
    ],
  };
}

/* ---- Banner: colour spine down one edge, type ranged left ---- */
function banner(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width;
  const cw = g.canvasW,
    ch = g.canvasH;
  const spine = cw * 0.14;
  const headline = val(d, "headline", "YOUR HEADLINE").toUpperCase();
  const logo = hasLogo(d);
  const textL = spine + (L - g.trim.left) + 8;
  const textW = cw - textL - (L - g.trim.left) - 8;

  return {
    version: "6.0.0",
    background: "#FBFAF7",
    objects: [
      rect({ left: 0, top: 0, width: spine, height: ch, fill: s.primary }),
      rect({
        left: spine,
        top: 0,
        width: cw * 0.012,
        height: ch,
        fill: s.accent,
      }),

      ...(logo
        ? [
            logoObject(d, {
              cx: textL + textW / 2,
              cy: T + ch * 0.05,
              w: textW * 0.7,
              h: ch * 0.06,
            }),
          ]
        : [
            txt(val(d, "brandName", "Brand Name").toUpperCase(), s.primary, {
              left: textL,
              top: T + ch * 0.03,
              width: textW,
              fontSize: 9,
              fontWeight: "bold",
              charSpacing: 300,
            }),
          ]),

      txt(headline, s.primary, {
        left: textL,
        top: ch * 0.16,
        width: textW,
        fontSize: fitFontSize(headline, textW, 26, {
          minSize: 12,
          lines: 3,
          em: EM.upperBold,
        }),
        fontWeight: "bold",
        lineHeight: 1.1,
      }),
      rect({
        left: textL,
        top: ch * 0.31,
        width: textW * 0.3,
        height: 3,
        fill: s.accent,
      }),
      txt(val(d, "subheadline", "A short supporting line"), "#6B7280", {
        left: textL,
        top: ch * 0.34,
        width: textW,
        fontSize: 11,
        fontFamily: "Georgia",
        fontStyle: "italic",
        lineHeight: 1.45,
      }),

      (() => {
        const text = bulletBlock(
          d?.bulletPoints,
          "First key point\nSecond key point\nThird key point\nFourth key point",
        );
        const top = ch * 0.46;
        return txt(text, "#1F2937", {
          left: textL,
          top,
          width: textW,
          fontSize: fitBlockFontSize(text, textW, ch * 0.83 - top - 8, 11.5, {
            minSize: 6,
            lineHeight: 2.2,
          }),
          lineHeight: 2.2,
        });
      })(),

      txt(
        [
          val(d, "phone", "+91 98765 43210"),
          val(d, "website", "www.yourcompany.com"),
        ]
          .filter(Boolean)
          .join("\n"),
        s.primary,
        {
          left: textL,
          top: ch * 0.83,
          width: textW,
          fontSize: 12,
          fontWeight: "bold",
          lineHeight: 1.5,
        },
      ),

      ...cassetteGuide(g),
    ],
  };
}

export const ST_TEMPLATES = [
  {
    id: "column",
    name: "Column",
    industry: "Exhibitions",
    doubleSided: false,
    build: column,
  },
  {
    id: "banner",
    name: "Spine",
    industry: "Corporate",
    doubleSided: false,
    build: banner,
  },
];

export function getStTemplate(id) {
  return ST_TEMPLATES.find((t) => t.id === id) || ST_TEMPLATES[0];
}
export function getStScheme(id) {
  return ST_SCHEMES.find((s) => s.id === id) || ST_SCHEMES[0];
}