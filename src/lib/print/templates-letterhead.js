/* Letterhead templates (A4, single-sided). Each build(scheme, g) returns a
 * fabric JSON scene. Positioning is safeBox-relative so it scales with the
 * product geometry. Same scheme shape as visiting cards: { id, primary, accent }. */

export const LH_SCHEMES = [
  { id: "navy", primary: "#0B2E59", accent: "#1E5DA8" },
  { id: "maroon", primary: "#7A1F2B", accent: "#B03A48" },
  { id: "plum", primary: "#5B2A5E", accent: "#8E4A92" },
  { id: "forest", primary: "#12402E", accent: "#2E7D5B" },
  { id: "steel", primary: "#2B4C6F", accent: "#6E93B8" },
];

const txt = (t, fill, opts) => ({
  type: "textbox",
  text: t,
  fontFamily: "Georgia",
  fill,
  originX: "left",
  originY: "top",
  ...opts,
});

const BODY =
  "Date: __________\n\nDear Sir / Madam,\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. " +
  "Praesent euismod, nisl eget consectetur sagittis, nisl nunc consectetur nisi, " +
  "euismod aliquam nisl nunc eget.\n\nProin gravida nibh vel velit auctor aliquet. " +
  "Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum.\n\n" +
  "Sincerely,\n\n____________________";

const path = (d, fill, opts) => ({ type: "path", path: d, fill, ...opts });

/* ---- Angular: navy + orange angular header/footer, two-tone wordmark, icon contacts ---- */
function angular(s, g) {
  const NAVY = s.primary,
    ORANGE = "#F2A93B";
  const tx = 0,
    tw = g.canvasW,
    tR = g.canvasW;
  const tT = 0,
    bb = g.canvasH;
  const hh = 108;
  const P = (pct) => tx + tw * pct;
  const bh = 56;

  const logoR = 17;
  const logoCx = tx + 34,
    logoCy = tT + hh * 0.42;
  const wordL = logoCx + logoR * 1.42 + 8;
  const brandW = 74;
  const nameL = wordL + brandW;

  // Position icons near the right edge of the canvas
  const iconSize = 18;
  const gap = 8;
  const rightPadding = 5;

  const icoL = tR - iconSize - rightPadding;

  // Contact text area ends before the icons
  const cL = P(0.71);
  const contactW = icoL - gap - cL;

  const rowTops = [tT + 24, tT + 52, tT + 80];

  // Filled 16x16 glyphs
  const iconGlyph = (d, left, top) =>
    path(d, "#ffffff", {
      left: left + (iconSize - 16) / 2,
      top: top + (iconSize - 16) / 2,
      scaleX: 16 / 22,
      scaleY: 16 / 22,
    });

  const PHONE_D =
    "M3 2c-.6 0-1 .4-1 1v1.2c0 5.9 4.8 10.7 10.7 10.7H14c.6 0 1-.4 1-1v-2.1c0-.5-.3-.9-.8-1l-2.4-.6c-.4-.1-.8 0-1.1.3l-.9.9a8.4 8.4 0 0 1-4-4l.9-.9c.3-.3.4-.7.3-1.1L4.5 2.8c-.1-.5-.5-.8-1-.8H3Z";

  const MAIL_D =
    "M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-7Zm1.4.2 4.1 3.4a1 1 0 0 0 1 0l4.1-3.4H3.4Z";

  const PIN_D =
    "M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.4 4.5 8.5 4.5 8.5S12.5 9.4 12.5 6C12.5 3.5 10.5 1.5 8 1.5Zm0 6.2A1.7 1.7 0 1 1 8 4.3a1.7 1.7 0 0 1 0 3.4Z";

  return {
    version: "6.0.0",
    background: "#ffffff",

    objects: [
      // Top navy section
      path(
        `M ${tx} ${tT} 
         L ${P(0.6)} ${tT} 
         L ${P(0.5)} ${tT + hh} 
         L ${tx} ${tT + hh} Z`,
        NAVY,
      ),

      // Top orange section
      path(
        `M ${P(0.6)} ${tT} 
         L ${P(0.69)} ${tT} 
         L ${P(0.59)} ${tT + hh} 
         L ${P(0.5)} ${tT + hh} Z`,
        ORANGE,
      ),

      // Bottom navy section
      path(
        `M ${P(0.52)} ${bb} 
         L ${P(0.6)} ${bb - bh} 
         L ${tR} ${bb - bh} 
         L ${tR} ${bb} Z`,
        NAVY,
      ),

      // Bottom orange section
      path(
        `M ${P(0.44)} ${bb} 
         L ${P(0.52)} ${bb - bh} 
         L ${P(0.56)} ${bb - bh} 
         L ${P(0.48)} ${bb} Z`,
        ORANGE,
      ),

      // Left bottom orange shape
      path(
        `M ${tx} ${bb - 18} 
         L ${P(0.28)} ${bb - 18} 
         L ${P(0.24)} ${bb} 
         L ${tx} ${bb} Z`,
        ORANGE,
      ),

      // Logo
      {
        type: "rect",
        left: logoCx,
        top: logoCy,
        width: logoR * 2,
        height: logoR * 2,
        angle: 45,
        rx: 5,
        ry: 5,
        fill: ORANGE,
        originX: "center",
        originY: "center",
      },

      txt("S", "#ffffff", {
        left: logoCx - logoR,
        top: logoCy - 12,
        width: logoR * 2,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial",
      }),

      // Brand name
      txt("BRAND", "#ffffff", {
        left: wordL,
        top: tT + hh * 0.26,
        width: brandW,
        fontSize: 19,
        fontWeight: "bold",
        fontFamily: "Arial",
      }),

      txt("NAME", ORANGE, {
        left: nameL,
        top: tT + hh * 0.26,
        width: 70,
        fontSize: 19,
        fontWeight: "bold",
        fontFamily: "Arial",
      }),

      // Tagline
      txt("Your Tagline Space", "#ffffff", {
        left: wordL,
        top: tT + hh * 0.63,
        width: nameL + 70 - wordL,
        fontSize: 9,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial",
        charSpacing: 120,
      }),

      // Contact details
      txt("(+000) 123 456 7899", NAVY, {
        left: cL,
        top: rowTops[0],
        width: contactW,
        fontSize: 9.5,
        fontFamily: "Arial",
        fontWeight: "bold",
      }),

      txt("youremail@gmail.com", NAVY, {
        left: cL,
        top: rowTops[1],
        width: contactW,
        fontSize: 9.5,
        fontFamily: "Arial",
      }),

      txt("youraddressname here", NAVY, {
        left: cL,
        top: rowTops[2],
        width: contactW,
        fontSize: 9.5,
        fontFamily: "Arial",
      }),

      // Orange icon backgrounds
      {
        type: "rect",
        left: icoL,
        top: rowTops[0],
        width: iconSize,
        height: iconSize,
        rx: 4,
        ry: 4,
        fill: ORANGE,
      },

      {
        type: "rect",
        left: icoL,
        top: rowTops[1],
        width: iconSize,
        height: iconSize,
        rx: 4,
        ry: 4,
        fill: ORANGE,
      },

      {
        type: "rect",
        left: icoL,
        top: rowTops[2],
        width: iconSize,
        height: iconSize,
        rx: 4,
        ry: 4,
        fill: ORANGE,
      },

      // White icons
      iconGlyph(PHONE_D, icoL, rowTops[0]),
      iconGlyph(MAIL_D, icoL, rowTops[1]),
      iconGlyph(PIN_D, icoL, rowTops[2]),
    ],
  };
}

/* ---- Automotive: outlined shield lockup + top-right contact, header rule, bottom wave ---- */
function automotive(s, g) {
  const L = g.trim.left,
    T = g.trim.top,
    W = g.trim.width;
  const colW = 120; // left logo column
  const ew = 46,
    eh = 54;
  const ex = L + (colW - ew) / 2; // emblem centred in the column
  const ey = T;
  const shield =
    `M ${ex} ${ey} L ${ex + ew} ${ey} L ${ex + ew} ${ey + eh * 0.55} ` +
    `Q ${ex + ew} ${ey + eh * 0.85} ${ex + ew / 2} ${ey + eh} ` +
    `Q ${ex} ${ey + eh * 0.85} ${ex} ${ey + eh * 0.55} Z`;
  const bx = g.trim.left,
    right = g.trim.left + g.trim.width,
    bb = g.trim.top + g.trim.height;
  const grayWave =
    `M ${bx} ${bb - 60} C ${bx + g.trim.width * 0.28} ${bb - 90}, ` +
    `${bx + g.trim.width * 0.55} ${bb - 25}, ${right} ${bb - 65} ` +
    `L ${right} ${bb} L ${bx} ${bb} Z`;
  const darkWave =
    `M ${bx} ${bb - 45} C ${bx + g.trim.width * 0.3} ${bb - 75}, ` +
    `${bx + g.trim.width * 0.58} ${bb - 10}, ${right} ${bb - 55} ` +
    `L ${right} ${bb} L ${bx} ${bb} Z`;
  const ruleY = T + 78; // sits under the whole header lockup
  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      path(grayWave, "#C4C7CF"),
      path(darkWave, s.primary),
      path(shield, "transparent", { stroke: s.primary, strokeWidth: 3 }),
      txt("A", s.primary, {
        left: ex,
        top: ey + 15,
        width: ew,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial",
      }),
      txt("CTS MOTORS", s.primary, {
        left: L,
        top: ey + eh + 6,
        width: colW,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        charSpacing: 150,
        fontFamily: "Arial",
      }),
      txt("Company Name", "#111827", {
        left: L + W - 190,
        top: T + 2,
        width: 190,
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "right",
        fontFamily: "Arial",
      }),
      txt(
        "A : 1000 S. Commons Drive\nUnit 102 PMB 241\nCity, ST 00000\nP : (000) 000-0000",
        "#374151",
        {
          left: L + W - 190,
          top: T + 17,
          width: 190,
          fontSize: 9,
          textAlign: "right",
          fontFamily: "Arial",
          lineHeight: 1.35,
        },
      ),
      {
        type: "rect",
        left: L + colW + 12,
        top: ruleY,
        width: L + W - (L + colW + 12),
        height: 1.5,
        fill: s.primary,
      },
    ],
  };
}

/* ---- Centred crest: outlined house mark, centred name + web, bracketed footer ---- */
function crest(s, g) {
  const L = g.trim.left,
    T = g.trim.top,
    W = g.trim.width,
    H = g.trim.height;
  const cx = L + W / 2;
  const house = (hx) =>
    `M ${hx} ${T + 15} L ${hx + 17} ${T} L ${hx + 34} ${T + 15} ` +
    `L ${hx + 34} ${T + 32} L ${hx} ${T + 32} Z`;
  const footT = T + H * 0.86;
  const addrY = footT + 24;
  const ruleY = addrY + 6; // centred on the address line
  return {
    version: "6.0.0",
    background: "#ffffff",
    objects: [
      path(house(cx - 21), "transparent", {
        stroke: s.accent,
        strokeWidth: 2.5,
      }),
      path(house(cx - 9), "transparent", {
        stroke: s.primary,
        strokeWidth: 2.5,
      }),
      txt("COMPANY NAME", s.primary, {
        left: L,
        top: T + 46,
        width: W,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        charSpacing: 200,
        fontFamily: "Arial",
      }),
      txt("www.yourcompany.com", "#6B7280", {
        left: L,
        top: T + 70,
        width: W,
        fontSize: 10,
        fontStyle: "italic",
        textAlign: "center",
        fontFamily: "Arial",
      }),
      txt("Phone: +00-000-0000", "#111827", {
        left: L,
        top: footT,
        width: W,
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial",
      }),
      txt("Address: 000 Street, City, ST 00000", "#111827", {
        left: L,
        top: addrY,
        width: W,
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial",
      }),
      {
        type: "rect",
        left: L,
        top: ruleY,
        width: W * 0.16,
        height: 1,
        fill: s.accent,
      },
      {
        type: "rect",
        left: L + W * 0.84,
        top: ruleY,
        width: W * 0.16,
        height: 1,
        fill: s.accent,
      },
      txt("Email: hello@yourcompany.com", "#111827", {
        left: L,
        top: footT + 48,
        width: W,
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Arial",
      }),
    ],
  };
}

export const LH_TEMPLATES = [
  {
    id: "angular",
    name: "Angular",
    industry: "Corporate",
    doubleSided: false,
    build: angular,
  },
  {
    id: "automotive",
    name: "Automotive",
    industry: "Auto / Trade",
    doubleSided: false,
    build: automotive,
  },
  {
    id: "crest",
    name: "Crest",
    industry: "Builders",
    doubleSided: false,
    build: crest,
  },
];

export function getLhTemplate(id) {
  return LH_TEMPLATES.find((t) => t.id === id) || LH_TEMPLATES[0];
}
export function getLhScheme(id) {
  return LH_SCHEMES.find((s) => s.id === id) || LH_SCHEMES[0];
}