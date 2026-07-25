/* Flyer templates (A5 portrait 148x210mm, single-sided).
 *
 * A flyer is read at arm's length in a few seconds, so these lean on one loud
 * headline plus an optional offer badge, with the detail underneath. The badge
 * disappears when the offer field is left blank rather than printing an empty
 * circle. */

import { EM, val, fitFontSize } from "./text-fit";
import { hasLogo, logoObject, logoInitial } from "./logo-slot";

export const FL_SCHEMES = [
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

const joinParts = (parts, sep) => parts.filter(Boolean).join(sep);

/* ---- Promo: colour top third, offer badge overlapping the split ---- */
function promo(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width;
  const cw = g.canvasW,
    ch = g.canvasH;
  const blockH = ch * 0.38;
  const footH = 44;

  const headline = val(d, "headline", "BIG ANNOUNCEMENT").toUpperCase();
  const offer = val(d, "offerText", "50% OFF");
  const showOffer = String(d?.offerText ?? "").trim() !== "" || !d;
  const badgeR = 42;
  const badgeCx = cw - L - badgeR * 0.75;
  const badgeCy = blockH;

  const logo = hasLogo(d);

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      rect({ left: 0, top: 0, width: cw, height: blockH, fill: s.primary }),
      rect({ left: 0, top: blockH, width: cw, height: 6, fill: s.accent }),

      // brand row
      ...(logo
        ? [logoObject(d, { cx: L + 40, cy: T + 16, w: 86, h: 32 })]
        : [
            txt(val(d, "brandName", "Brand Name").toUpperCase(), s.accent, {
              left: L,
              top: T + 6,
              width: W * 0.6,
              fontSize: 11,
              fontWeight: "bold",
              charSpacing: 280,
            }),
          ]),

      txt(headline, "#ffffff", {
        left: L,
        top: blockH * 0.36,
        width: W * (showOffer ? 0.72 : 1),
        fontSize: fitFontSize(headline, W * (showOffer ? 0.72 : 1), 40, {
          minSize: 18,
          lines: 2,
          em: EM.upperBold,
        }),
        fontWeight: "bold",
        lineHeight: 1.05,
      }),

      // offer badge, only when there is an offer to show
      ...(showOffer
        ? [
            {
              type: "circle",
              left: badgeCx,
              top: badgeCy,
              radius: badgeR,
              originX: "center",
              originY: "center",
              fill: s.accent,
            },
            txt(offer.toUpperCase(), s.primary, {
              left: badgeCx - badgeR,
              top: badgeCy - 12,
              width: badgeR * 2,
              fontSize: fitFontSize(offer, badgeR * 1.8, 20, {
                minSize: 9,
                lines: 2,
                em: EM.upperBold,
              }),
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: 1.1,
            }),
          ]
        : []),

      txt(val(d, "subheadline", "A short supporting line"), s.primary, {
        left: L,
        top: blockH + 34,
        width: W * 0.72,
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: 1.3,
      }),
      txt(
        val(
          d,
          "bodyText",
          "The details you want people to read after the headline.",
        ),
        "#475467",
        {
          left: L,
          top: blockH + 74,
          width: W,
          fontSize: 11,
          lineHeight: 1.6,
          fontFamily: "Georgia",
        },
      ),

      rect({
        left: L,
        top: ch - footH - 56,
        width: 48,
        height: 3,
        fill: s.accent,
      }),
      txt(val(d, "dateTime", "Saturday 12 April · 6:00 PM"), s.primary, {
        left: L,
        top: ch - footH - 42,
        width: W,
        fontSize: 13,
        fontWeight: "bold",
      }),
      txt(val(d, "venue", "Community Hall, MG Road"), "#667085", {
        left: L,
        top: ch - footH - 24,
        width: W,
        fontSize: 10,
      }),

      rect({
        left: 0,
        top: ch - footH,
        width: cw,
        height: footH,
        fill: s.primary,
      }),
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
          top: ch - footH / 2 - 6,
          width: W,
          fontSize: 11,
          textAlign: "center",
        },
      ),
    ],
  };
}

/* ---- Notice: quiet all-type flyer, ruled sections ---- */
function notice(s, g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;
  const headline = val(d, "headline", "BIG ANNOUNCEMENT").toUpperCase();
  const offer = val(d, "offerText", "50% OFF");
  const showOffer = String(d?.offerText ?? "").trim() !== "" || !d;
  const logo = hasLogo(d);

  return {
    version: "6.0.0",
    background: "#FBFAF7",
    objects: [
      rect({ left: L, top: T, width: W, height: 4, fill: s.primary }),

      ...(logo
        ? [logoObject(d, { cx: L + W / 2, cy: T + 34, w: W * 0.5, h: 40 })]
        : [
            txt(val(d, "brandName", "Brand Name").toUpperCase(), s.primary, {
              left: L,
              top: T + 20,
              width: W,
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
              charSpacing: 320,
            }),
          ]),

      txt(headline, s.primary, {
        left: L,
        top: T + H * 0.14,
        width: W,
        fontSize: fitFontSize(headline, W, 34, {
          minSize: 16,
          lines: 2,
          em: EM.upperBold,
        }),
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 1.1,
        fontFamily: "Georgia",
      }),

      ...(showOffer
        ? [
            rect({
              left: L + W * 0.25,
              top: T + H * 0.3,
              width: W * 0.5,
              height: 34,
              rx: 17,
              ry: 17,
              fill: s.accent,
            }),
            txt(offer.toUpperCase(), s.primary, {
              left: L + W * 0.25,
              top: T + H * 0.3 + 10,
              width: W * 0.5,
              fontSize: fitFontSize(offer, W * 0.46, 15, {
                minSize: 8,
                em: EM.upperBold,
                charSpacing: 100,
              }),
              fontWeight: "bold",
              textAlign: "center",
              charSpacing: 100,
            }),
          ]
        : []),

      txt(val(d, "subheadline", "A short supporting line"), "#6B7280", {
        left: L,
        top: T + H * 0.4,
        width: W,
        fontSize: 12,
        textAlign: "center",
        fontFamily: "Georgia",
        fontStyle: "italic",
        lineHeight: 1.4,
      }),
      rect({
        left: L + W * 0.42,
        top: T + H * 0.48,
        width: W * 0.16,
        height: 1,
        fill: s.accent,
      }),
      txt(
        val(
          d,
          "bodyText",
          "The details you want people to read after the headline.",
        ),
        "#475467",
        {
          left: L + W * 0.08,
          top: T + H * 0.52,
          width: W * 0.84,
          fontSize: 10.5,
          lineHeight: 1.65,
          textAlign: "center",
          fontFamily: "Georgia",
        },
      ),

      txt(val(d, "dateTime", "Saturday 12 April · 6:00 PM"), s.primary, {
        left: L,
        top: T + H * 0.78,
        width: W,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
      }),
      txt(val(d, "venue", "Community Hall, MG Road"), "#667085", {
        left: L,
        top: T + H * 0.78 + 20,
        width: W,
        fontSize: 10,
        textAlign: "center",
      }),
      rect({ left: L, top: T + H - 26, width: W, height: 1, fill: "#E2E5EA" }),
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
          left: L,
          top: T + H - 18,
          width: W,
          fontSize: 10,
          textAlign: "center",
          fontWeight: "bold",
        },
      ),
    ],
  };
}

export const FL_TEMPLATES = [
  {
    id: "promo",
    name: "Promo",
    industry: "Retail",
    doubleSided: false,
    build: promo,
  },
  {
    id: "notice",
    name: "Notice",
    industry: "Events",
    doubleSided: false,
    build: notice,
  },
];

export function getFlTemplate(id) {
  return FL_TEMPLATES.find((t) => t.id === id) || FL_TEMPLATES[0];
}
export function getFlScheme(id) {
  return FL_SCHEMES.find((s) => s.id === id) || FL_SCHEMES[0];
}