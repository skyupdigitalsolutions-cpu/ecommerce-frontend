/* Envelope templates (DL 220x110mm, single-sided).
 *
 * An envelope is mostly empty on purpose: the middle-right is where the
 * recipient's address gets written or a window sits, so branding stays in the
 * top-left sender corner and along the bottom edge. Templates here mark that
 * recipient zone with a faint guide that is dropped from the export. */

import { EM, val, fitFontSize } from "./text-fit";
import { hasLogo, logoObject, logoInitial } from "./logo-slot";

export const EN_SCHEMES = [
  { id: "navy", primary: "#0B2E59", accent: "#F2A93B" },
  { id: "maroon", primary: "#7A1F2B", accent: "#E8B04B" },
  { id: "plum", primary: "#5B2A5E", accent: "#C489C8" },
  { id: "forest", primary: "#12402E", accent: "#6FBF95" },
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

const joinLines = (parts) => parts.filter(Boolean).join("\n");

/* ---- Corner: sender block top-left, thin rule along the foot ---- */
function corner(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;
  const cw = g.canvasW,
    ch = g.canvasH;

  const logo = hasLogo(d);
  const markW = 34;
  const logoImg = logoObject(d, {
    cx: L + markW / 2,
    cy: T + markW / 2,
    w: markW + 14,
    h: markW,
  });
  const textL = L + markW + 10;

  const company = val(d, "companyName", "Brand Name");

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      // foot band keeps the branding off the address area
      rect({ left: 0, top: ch - 16, width: cw, height: 16, fill: s.primary }),
      rect({ left: 0, top: ch - 19, width: cw, height: 3, fill: s.accent }),

      // sender mark
      ...(logo
        ? [logoImg]
        : [
            rect({
              left: L,
              top: T,
              width: markW,
              height: markW,
              rx: 6,
              ry: 6,
              fill: s.primary,
            }),
            txt(logoInitial(d, "B"), "#ffffff", {
              left: L,
              top: T + 8,
              width: markW,
              fontSize: 17,
              fontWeight: "bold",
              textAlign: "center",
            }),
          ]),

      txt(company, s.primary, {
        left: textL,
        top: T + 2,
        width: W * 0.5,
        fontSize: fitFontSize(company, W * 0.5, 14, {
          minSize: 8,
          em: EM.bold,
        }),
        fontWeight: "bold",
      }),
      txt(val(d, "tagline", "Your Tagline Space"), "#667085", {
        left: textL,
        top: T + 19,
        width: W * 0.5,
        fontSize: 8,
        charSpacing: 80,
      }),
      txt(
        joinLines([
          val(d, "address", "4th Cross, Indiranagar\nBangalore 560038"),
          val(d, "phone", "+91 98765 43210"),
        ]),
        "#475467",
        {
          left: L,
          top: T + markW + 12,
          width: W * 0.46,
          fontSize: 8,
          lineHeight: 1.4,
        },
      ),

      // recipient zone guide — excluded from the exported artwork
      rect({
        left: L + W * 0.44,
        top: T + H * 0.42,
        width: W * 0.52,
        height: H * 0.44,
        fill: "transparent",
        stroke: "#D1D5DB",
        strokeWidth: 1,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }),
      txt("Recipient address area", "#C6CCD6", {
        left: L + W * 0.44 + 8,
        top: T + H * 0.42 + 8,
        width: W * 0.5,
        fontSize: 7.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }),

      txt(
        [
          val(d, "email", "hello@company.com"),
          val(d, "website", "www.yourcompany.com"),
        ]
          .filter(Boolean)
          .join("   ·   "),
        "#ffffff",
        {
          left: L,
          top: ch - 13,
          width: W,
          fontSize: 8,
          textAlign: "center",
        },
      ),
    ],
  };
}

/* ---- Flap: diagonal colour wedge on the left, sender details over it ---- */
function flap(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;
  const cw = g.canvasW,
    ch = g.canvasH;
  const wedge = cw * 0.42;

  const logo = hasLogo(d);
  const logoImg = logoObject(d, {
    cx: L + 46,
    cy: T + 20,
    w: 92,
    h: 34,
  });
  const company = val(d, "companyName", "Brand Name");

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      {
        type: "path",
        path: `M 0 0 L ${wedge} 0 L ${wedge - 46} ${ch} L 0 ${ch} Z`,
        fill: s.primary,
      },
      {
        type: "path",
        path: `M ${wedge} 0 L ${wedge + 12} 0 L ${wedge - 34} ${ch} L ${wedge - 46} ${ch} Z`,
        fill: s.accent,
      },

      ...(logo
        ? [logoImg]
        : [
            txt(logoInitial(d, "B"), s.accent, {
              left: L,
              top: T,
              width: 40,
              fontSize: 26,
              fontWeight: "bold",
            }),
          ]),

      txt(company, "#ffffff", {
        left: L,
        top: T + 44,
        width: wedge - L - 54,
        fontSize: fitFontSize(company, wedge - L - 54, 15, {
          minSize: 8,
          lines: 2,
          em: EM.bold,
        }),
        fontWeight: "bold",
        lineHeight: 1.15,
      }),
      txt(
        joinLines([
          val(d, "address", "4th Cross, Indiranagar\nBangalore 560038"),
          val(d, "phone", "+91 98765 43210"),
          val(d, "website", "www.yourcompany.com"),
        ]),
        "#ffffff",
        {
          left: L,
          top: T + H - 44,
          width: wedge - L - 54,
          fontSize: 7.5,
          lineHeight: 1.4,
          opacity: 0.92,
        },
      ),

      rect({
        left: cw * 0.5,
        top: T + H * 0.4,
        width: W - (cw * 0.5 - L),
        height: H * 0.46,
        fill: "transparent",
        stroke: "#D1D5DB",
        strokeWidth: 1,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }),
      txt("Recipient address area", "#C6CCD6", {
        left: cw * 0.5 + 8,
        top: T + H * 0.4 + 8,
        width: W * 0.5,
        fontSize: 7.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }),
    ],
  };
}

export const EN_TEMPLATES = [
  {
    id: "corner",
    name: "Sender Corner",
    industry: "Business",
    doubleSided: false,
    build: corner,
  },
  {
    id: "flap",
    name: "Colour Wedge",
    industry: "Corporate",
    doubleSided: false,
    build: flap,
  },
];

export function getEnTemplate(id) {
  return EN_TEMPLATES.find((t) => t.id === id) || EN_TEMPLATES[0];
}
export function getEnScheme(id) {
  return EN_SCHEMES.find((s) => s.id === id) || EN_SCHEMES[0];
}