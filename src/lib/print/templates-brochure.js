/* Brochure templates (A4 landscape 297x210mm, tri-fold, two sides).
 *
 * The sheet is divided into equal panels by fold position, and every element is
 * placed inside one panel — text straddling a fold is the one thing that ruins a
 * folded piece. Fold guides are drawn but excluded from the export.
 *
 * Panel order on the OUTER face of a standard tri-fold (letter fold):
 *   panel 1 = inside flap (tucks in), panel 2 = back cover, panel 3 = front cover
 * The inner face reads left-to-right as one three-column spread. */

import { EM, val, fitFontSize, fitBlockFontSize } from "./text-fit";
import { hasLogo, logoObject, logoInitial } from "./logo-slot";

export const BR_SCHEMES = [
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

/* Panel geometry: equal columns across the trim, with an inner gutter so nothing
 * sits right against a fold. */
function panels(g, count = 3, gutter = 12) {
  const pw = g.trim.width / count;
  return Array.from({ length: count }, (_, i) => {
    const left = g.trim.left + pw * i;
    return {
      left,
      right: left + pw,
      width: pw,
      // usable box inside this panel
      x: left + gutter,
      w: pw - gutter * 2,
      y: g.trim.top + gutter,
      h: g.trim.height - gutter * 2,
      cx: left + pw / 2,
    };
  });
}

/* Dashed fold lines, preview only. */
function foldGuides(g, count = 3) {
  const pw = g.trim.width / count;
  const out = [];
  for (let i = 1; i < count; i++) {
    out.push(
      rect({
        left: g.trim.left + pw * i,
        top: g.trim.top,
        width: 1,
        height: g.trim.height,
        fill: "#C6CCD6",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
      }),
    );
  }
  return out;
}

/* Turn a newline-separated field into bullet lines. */
const bullets = (raw, fallback) => {
  const src = val(null, "", raw && String(raw).trim() ? raw : fallback);
  return String(src)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => "•  " + l)
    .join("\n");
};

/* ---- Trifold: colour cover panel, back panel with contact, flap with services ---- */
function trifold(s, g, d) {
  const P = panels(g, 3);
  const [flapP, backP, coverP] = P;
  const company = val(d, "companyName", "Brand Name");
  const headline = val(d, "headline", "What You Do");

  const logo = hasLogo(d);
  const logoImg = logoObject(d, {
    cx: coverP.cx,
    cy: coverP.y + 40,
    w: coverP.w * 0.7,
    h: 46,
  });

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      // cover panel is the only one that carries a full colour field
      rect({
        left: coverP.left,
        top: g.trim.top,
        width: coverP.width,
        height: g.trim.height,
        fill: s.primary,
      }),
      rect({
        left: coverP.left,
        top: g.trim.top + g.trim.height * 0.62,
        width: coverP.width,
        height: 4,
        fill: s.accent,
      }),

      // ---- cover ----
      ...(logo
        ? [logoImg]
        : [
            txt(logoInitial(d, "B"), s.accent, {
              left: coverP.x,
              top: coverP.y + 20,
              width: coverP.w,
              fontSize: 34,
              fontWeight: "bold",
              textAlign: "center",
            }),
          ]),
      txt(company.toUpperCase(), "#ffffff", {
        left: coverP.x,
        top: coverP.y + 78,
        width: coverP.w,
        fontSize: fitFontSize(company, coverP.w, 15, {
          minSize: 8,
          em: EM.upperBold,
          charSpacing: 180,
        }),
        fontWeight: "bold",
        textAlign: "center",
        charSpacing: 180,
      }),
      txt(headline, "#ffffff", {
        left: coverP.x,
        top: g.trim.top + g.trim.height * 0.4,
        width: coverP.w,
        fontSize: fitFontSize(headline, coverP.w, 24, {
          minSize: 12,
          lines: 3,
          em: EM.bold,
        }),
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 1.15,
      }),
      txt(val(d, "subheadline", "A short supporting line"), "#ffffff", {
        left: coverP.x,
        top: g.trim.top + g.trim.height * 0.68,
        width: coverP.w,
        fontSize: 10,
        textAlign: "center",
        opacity: 0.9,
        lineHeight: 1.4,
      }),

      // ---- back panel: contact block ----
      txt(val(d, "aboutTitle", "About Us"), s.primary, {
        left: backP.x,
        top: backP.y + 8,
        width: backP.w,
        fontSize: 13,
        fontWeight: "bold",
      }),
      rect({
        left: backP.x,
        top: backP.y + 26,
        width: 34,
        height: 3,
        fill: s.accent,
      }),
      (() => {
        const text = val(
          d,
          "aboutText",
          "Two or three sentences about the business, its work and who it serves.",
        );
        const top = backP.y + 38;
        return txt(text, "#475467", {
          left: backP.x,
          top,
          width: backP.w,
          // stop short of the GET IN TOUCH block below
          fontSize: fitBlockFontSize(
            text,
            backP.w,
            backP.y + backP.h - 122 - top,
            9,
            { minSize: 5.5, em: EM.serif, lineHeight: 1.5 },
          ),
          lineHeight: 1.5,
          fontFamily: "Georgia",
        });
      })(),
      txt("GET IN TOUCH", s.primary, {
        left: backP.x,
        top: backP.y + backP.h - 112,
        width: backP.w,
        fontSize: 9,
        fontWeight: "bold",
        charSpacing: 200,
      }),
      (() => {
        // Four contact lines, each of which can wrap. Given the panel foot is
        // fixed, the type shrinks instead of pushing past it.
        const text = [
          val(d, "phone", "+91 98765 43210"),
          val(d, "email", "hello@company.com"),
          val(d, "website", "www.yourcompany.com"),
          val(d, "address", "4th Cross, Indiranagar, Bangalore 560038"),
        ]
          .filter(Boolean)
          .join("\n");
        const top = backP.y + backP.h - 94;
        return txt(text, "#475467", {
          left: backP.x,
          top,
          width: backP.w,
          fontSize: fitBlockFontSize(
            text,
            backP.w,
            backP.y + backP.h - top,
            9,
            {
              minSize: 5.5,
              lineHeight: 1.55,
            },
          ),
          lineHeight: 1.55,
        });
      })(),

      // ---- inside flap: services list ----
      txt("WHAT WE OFFER", s.primary, {
        left: flapP.x,
        top: flapP.y + 8,
        width: flapP.w,
        fontSize: 9,
        fontWeight: "bold",
        charSpacing: 200,
      }),
      rect({
        left: flapP.x,
        top: flapP.y + 24,
        width: 34,
        height: 3,
        fill: s.accent,
      }),
      (() => {
        const text = bullets(
          d?.servicesList,
          "First service\nSecond service\nThird service\nFourth service",
        );
        const top = flapP.y + 38;
        return txt(text, "#475467", {
          left: flapP.x,
          top,
          width: flapP.w,
          fontSize: fitBlockFontSize(
            text,
            flapP.w,
            flapP.y + flapP.h - top,
            9.5,
            { minSize: 5.5, lineHeight: 1.8 },
          ),
          lineHeight: 1.8,
        });
      })(),

      ...foldGuides(g, 3),
    ],
  };
}

/* Inner spread: one heading band across the top, three columns beneath. */
function trifoldInner(s, g, d) {
  const P = panels(g, 3);
  const bandH = g.trim.height * 0.18;
  const lines = String(
    d?.servicesList && String(d.servicesList).trim()
      ? d.servicesList
      : "First service\nSecond service\nThird service\nFourth service\nFifth service\nSixth service",
  )
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  // deal the services across the three columns so no panel runs long
  const cols = [[], [], []];
  lines.forEach((l, i) => cols[i % 3].push("•  " + l));

  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      rect({
        left: g.trim.left,
        top: g.trim.top,
        width: g.trim.width,
        height: bandH,
        fill: s.primary,
      }),
      txt(val(d, "aboutTitle", "About Us").toUpperCase(), "#ffffff", {
        left: P[0].x,
        top: g.trim.top + bandH * 0.3,
        width: g.trim.width - (P[0].x - g.trim.left) * 2,
        fontSize: 18,
        fontWeight: "bold",
        charSpacing: 150,
      }),
      txt(
        val(
          d,
          "aboutText",
          "Two or three sentences about the business, its work and who it serves.",
        ),
        "#475467",
        {
          left: P[0].x,
          top: g.trim.top + bandH + 18,
          width: g.trim.width - (P[0].x - g.trim.left) * 2,
          fontSize: fitBlockFontSize(
            val(
              d,
              "aboutText",
              "Two or three sentences about the business, its work and who it serves.",
            ),
            g.trim.width - (P[0].x - g.trim.left) * 2,
            46,
            10,
            { minSize: 6, em: EM.serif, lineHeight: 1.6 },
          ),
          lineHeight: 1.6,
          fontFamily: "Georgia",
        },
      ),
      ...P.map((p, i) => {
        const text = cols[i].join("\n");
        const top = g.trim.top + bandH + 78;
        return txt(text, "#1F2937", {
          left: p.x,
          top,
          width: p.w,
          fontSize: fitBlockFontSize(
            text,
            p.w,
            g.trim.top + g.trim.height - 34 - top,
            9.5,
            { minSize: 5.5, lineHeight: 1.9 },
          ),
          lineHeight: 1.9,
        });
      }),
      ...P.map((p) =>
        rect({
          left: p.x,
          top: g.trim.top + bandH + 66,
          width: 26,
          height: 3,
          fill: s.accent,
        }),
      ),
      txt(
        [
          val(d, "phone", "+91 98765 43210"),
          val(d, "website", "www.yourcompany.com"),
        ]
          .filter(Boolean)
          .join("   ·   "),
        s.primary,
        {
          left: P[0].x,
          top: g.trim.top + g.trim.height - 26,
          width: g.trim.width - (P[0].x - g.trim.left) * 2,
          fontSize: 9,
          textAlign: "center",
          fontWeight: "bold",
        },
      ),
      ...foldGuides(g, 3),
    ],
  };
}

/* ---- Editorial: light cover with a rule, quieter typographic treatment ---- */
function editorial(s, g, d) {
  const P = panels(g, 3);
  const [flapP, backP, coverP] = P;
  const company = val(d, "companyName", "Brand Name");
  const headline = val(d, "headline", "What You Do");
  const logo = hasLogo(d);

  return {
    version: "6.0.0",
    background: "#FBFAF7",
    objects: [
      rect({
        left: coverP.left,
        top: g.trim.top,
        width: 3,
        height: g.trim.height,
        fill: s.accent,
      }),
      ...(logo
        ? [
            logoObject(d, {
              cx: coverP.cx,
              cy: coverP.y + 34,
              w: coverP.w * 0.66,
              h: 42,
            }),
          ]
        : [
            txt(logoInitial(d, "B"), s.primary, {
              left: coverP.x,
              top: coverP.y + 16,
              width: coverP.w,
              fontSize: 30,
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "Georgia",
            }),
          ]),
      txt(company.toUpperCase(), s.primary, {
        left: coverP.x,
        top: coverP.y + 70,
        width: coverP.w,
        fontSize: fitFontSize(company, coverP.w, 12, {
          minSize: 7,
          em: EM.upperBold,
          charSpacing: 260,
        }),
        fontWeight: "bold",
        textAlign: "center",
        charSpacing: 260,
      }),
      txt(headline, s.primary, {
        left: coverP.x,
        top: g.trim.top + g.trim.height * 0.36,
        width: coverP.w,
        fontSize: fitFontSize(headline, coverP.w, 26, {
          minSize: 12,
          lines: 3,
          em: EM.serif,
        }),
        textAlign: "center",
        fontFamily: "Georgia",
        lineHeight: 1.2,
      }),
      rect({
        left: coverP.cx - 18,
        top: g.trim.top + g.trim.height * 0.6,
        width: 36,
        height: 1,
        fill: s.accent,
      }),
      txt(val(d, "subheadline", "A short supporting line"), "#6B7280", {
        left: coverP.x,
        top: g.trim.top + g.trim.height * 0.64,
        width: coverP.w,
        fontSize: 10,
        textAlign: "center",
        fontFamily: "Georgia",
        fontStyle: "italic",
        lineHeight: 1.45,
      }),

      txt(val(d, "aboutTitle", "About Us"), s.primary, {
        left: backP.x,
        top: backP.y + 10,
        width: backP.w,
        fontSize: 15,
        fontFamily: "Georgia",
      }),
      txt(
        val(
          d,
          "aboutText",
          "Two or three sentences about the business, its work and who it serves.",
        ),
        "#475467",
        {
          left: backP.x,
          top: backP.y + 36,
          width: backP.w,
          fontSize: 9.5,
          lineHeight: 1.6,
          fontFamily: "Georgia",
        },
      ),
      rect({
        left: backP.x,
        top: backP.y + backP.h - 104,
        width: backP.w,
        height: 1,
        fill: "#E2E5EA",
      }),
      (() => {
        const text = [
          val(d, "phone", "+91 98765 43210"),
          val(d, "email", "hello@company.com"),
          val(d, "website", "www.yourcompany.com"),
          val(d, "address", "4th Cross, Indiranagar, Bangalore 560038"),
        ]
          .filter(Boolean)
          .join("\n");
        const top = backP.y + backP.h - 94;
        return txt(text, "#667085", {
          left: backP.x,
          top,
          width: backP.w,
          fontSize: fitBlockFontSize(
            text,
            backP.w,
            backP.y + backP.h - top,
            9,
            {
              minSize: 5.5,
              lineHeight: 1.55,
            },
          ),
          lineHeight: 1.55,
        });
      })(),

      txt("SERVICES", s.primary, {
        left: flapP.x,
        top: flapP.y + 10,
        width: flapP.w,
        fontSize: 9,
        fontWeight: "bold",
        charSpacing: 240,
      }),
      (() => {
        const text = bullets(
          d?.servicesList,
          "First service\nSecond service\nThird service\nFourth service",
        );
        const top = flapP.y + 34;
        return txt(text, "#475467", {
          left: flapP.x,
          top,
          width: flapP.w,
          fontSize: fitBlockFontSize(
            text,
            flapP.w,
            flapP.y + flapP.h - top,
            9.5,
            { minSize: 5.5, em: EM.serif, lineHeight: 1.85 },
          ),
          lineHeight: 1.85,
          fontFamily: "Georgia",
        });
      })(),

      ...foldGuides(g, 3),
    ],
  };
}

export const BR_TEMPLATES = [
  {
    id: "trifold",
    name: "Tri-fold Bold",
    industry: "Corporate",
    doubleSided: true,
    schemeAware: true,
    build: trifold,
    buildSides: (g, d, scheme) => {
      const s = scheme || BR_SCHEMES[0];
      return { front: trifold(s, g, d), back: trifoldInner(s, g, d) };
    },
  },
  {
    id: "editorial",
    name: "Tri-fold Editorial",
    industry: "Services",
    doubleSided: true,
    schemeAware: true,
    build: editorial,
    buildSides: (g, d, scheme) => {
      const s = scheme || BR_SCHEMES[0];
      return { front: editorial(s, g, d), back: trifoldInner(s, g, d) };
    },
  },
];

export function getBrTemplate(id) {
  return BR_TEMPLATES.find((t) => t.id === id) || BR_TEMPLATES[0];
}
export function getBrScheme(id) {
  return BR_SCHEMES.find((s) => s.id === id) || BR_SCHEMES[0];
}