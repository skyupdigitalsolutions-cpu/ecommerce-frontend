import { EM, val, fitFontSize } from "./text-fit";
const txt = (t, fill, opts) => ({
  type: "textbox",
  text: t,
  fill,
  originX: "left",
  originY: "top",
  ...opts,
});
/* fabric v7 defaults originX/originY to "center", so a bare { left, top } on a
 * rect is read as its centre point and the shape lands half its own size up and
 * to the left. Every rect goes through this helper to pin it to top-left, the
 * same way txt() already does for text. */
const rect = (opts) => ({
  type: "rect",
  originX: "left",
  originY: "top",
  ...opts,
});

/* ---- Elegant (maroon + cream, script flourish) ---- */
export function elegant(g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;
  const MAROON = "#5E1622",
    CREAM = "#F2E4C9";
  return {
    front: {
      version: "6.0.0",
      background: MAROON,
      objects: [
        txt(val(d, "companyName", "Lina"), CREAM, {
          left: L,
          top: T + H * 0.22,
          width: W,
          fontSize: fitFontSize(val(d, "companyName", "Lina"), W, 54, {
            minSize: 22,
            em: EM.serif,
          }),
          fontFamily: "Georgia",
          fontStyle: "italic",
          textAlign: "center",
        }),
        txt(val(d, "fullName", "LINA HARB").toUpperCase(), CREAM, {
          left: L,
          top: T + H * 0.62,
          width: W,
          fontSize: fitFontSize(val(d, "fullName", "LINA HARB"), W, 22, {
            minSize: 11,
            em: EM.upper,
            charSpacing: 300,
          }),
          fontFamily: "Georgia",
          textAlign: "center",
          charSpacing: 300,
        }),
        txt(val(d, "jobTitle", "Graphic designer"), CREAM, {
          left: L,
          top: T + H * 0.62 + 30,
          width: W,
          fontSize: 13,
          fontFamily: "Georgia",
          textAlign: "center",
          charSpacing: 200,
        }),
      ],
    },
    back: {
      version: "6.0.0",
      background: CREAM,
      objects: [
        txt(val(d, "companyName", "Lina"), MAROON, {
          left: L,
          top: T + 6,
          width: W * 0.4,
          fontSize: fitFontSize(val(d, "companyName", "Lina"), W * 0.4, 30, {
            minSize: 11,
            lines: 2,
            em: EM.serif,
          }),
          fontFamily: "Georgia",
          fontStyle: "italic",
        }),
        txt(val(d, "fullName", "LINA HARB").toUpperCase(), MAROON, {
          left: L + W * 0.34,
          top: T + 6,
          width: W * 0.66,
          fontSize: fitFontSize(val(d, "fullName", "LINA HARB"), W * 0.66, 26, {
            minSize: 11,
            em: EM.upper,
            charSpacing: 250,
          }),
          fontFamily: "Georgia",
          charSpacing: 250,
        }),
        txt(val(d, "jobTitle", "Graphic designer"), MAROON, {
          left: L + W * 0.34,
          top: T + 40,
          width: W * 0.66,
          fontSize: 13,
          fontFamily: "Georgia",
          charSpacing: 150,
        }),
        txt(val(d, "phone", "+962 7 88898722"), MAROON, {
          left: L + W * 0.3,
          top: T + H * 0.52,
          width: W * 0.7,
          fontSize: 13,
          fontFamily: "Georgia",
          textAlign: "right",
        }),
        txt(val(d, "email", "linaharb297@gmail.com"), MAROON, {
          left: L + W * 0.3,
          top: T + H * 0.52 + 22,
          width: W * 0.7,
          fontSize: 13,
          fontFamily: "Georgia",
          textAlign: "right",
        }),
        txt(val(d, "website", "lina_harb7"), MAROON, {
          left: L + W * 0.3,
          top: T + H * 0.52 + 44,
          width: W * 0.7,
          fontSize: 13,
          fontFamily: "Georgia",
          textAlign: "right",
        }),
        rect({
          left: L,
          top: T + H * 0.62,
          width: 64,
          height: 64,
          fill: "#E5D7B8",
          rx: 4,
          ry: 4,
        }),
        txt("QR / Logo", MAROON, {
          left: L,
          top: T + H * 0.62 + 24,
          width: 64,
          fontSize: 8,
          textAlign: "center",
          fontFamily: "Georgia",
        }),
        txt(
          val(d, "address", "Freelancer Lina Harb").replace(/\n/g, " "),
          MAROON,
          {
            left: L,
            top: T + H * 0.62 + 70,
            width: 90,
            fontSize: 8,
            textAlign: "center",
            fontFamily: "Georgia",
          },
        ),
      ],
    },
  };
}

/* ---- Wellness (sage + gold, minimal) ---- */
export function wellness(g, d) {
  const L = g.safeBox.left,
    T = g.safeBox.top,
    W = g.safeBox.width,
    H = g.safeBox.height;
  const SAGE = "#6B7358",
    GOLD = "#C9A94E",
    OFF = "#F6F4EC",
    DARK = "#4A4A42";
  return {
    front: {
      version: "6.0.0",
      background: SAGE,
      objects: [
        {
          type: "circle",
          left: L + W / 2,
          top: T + H * 0.3,
          radius: 26,
          originX: "center",
          originY: "center",
          fill: "transparent",
          stroke: OFF,
          strokeWidth: 2,
        },
        txt(val(d, "fullName", "Lilian Botelho Marques"), OFF, {
          left: L,
          top: T + H * 0.52,
          width: W,
          fontSize: fitFontSize(
            val(d, "fullName", "Lilian Botelho Marques"),
            W,
            24,
            { minSize: 12, em: EM.serif },
          ),
          fontFamily: "Georgia",
          textAlign: "center",
        }),
        txt(val(d, "jobTitle", "PSICÓLOGA CLÍNICA").toUpperCase(), OFF, {
          left: L,
          top: T + H * 0.52 + 30,
          width: W,
          fontSize: fitFontSize(
            val(d, "jobTitle", "PSICÓLOGA CLÍNICA"),
            W,
            10,
            { minSize: 6, em: EM.upper, charSpacing: 400 },
          ),
          fontFamily: "Georgia",
          textAlign: "center",
          charSpacing: 400,
        }),
        rect({
          left: L + W * 0.15,
          top: T + H * 0.72,
          width: W * 0.7,
          height: 2,
          fill: GOLD,
        }),
      ],
    },
    back: {
      version: "6.0.0",
      background: OFF,
      objects: [
        txt(val(d, "fullName", "Lilian Botelho Marques"), DARK, {
          left: L,
          top: T + 8,
          width: W,
          fontSize: fitFontSize(
            val(d, "fullName", "Lilian Botelho Marques"),
            W,
            20,
            { minSize: 11, em: EM.serif },
          ),
          fontFamily: "Georgia",
        }),
        txt(val(d, "jobTitle", "PSICÓLOGA CLÍNICA").toUpperCase(), SAGE, {
          left: L,
          top: T + 36,
          width: W,
          fontSize: 9,
          fontFamily: "Georgia",
          charSpacing: 300,
        }),
        txt(val(d, "phone", "(00) 00000-0000"), DARK, {
          left: L + 26,
          top: T + H * 0.42,
          width: W * 0.7,
          fontSize: 12,
          fontFamily: "Georgia",
        }),
        txt(val(d, "website", "@instagram"), DARK, {
          left: L + 26,
          top: T + H * 0.42 + 22,
          width: W * 0.7,
          fontSize: 12,
          fontFamily: "Georgia",
        }),
        txt(val(d, "email", "email@email.com.br"), DARK, {
          left: L + 26,
          top: T + H * 0.42 + 44,
          width: W * 0.7,
          fontSize: 12,
          fontFamily: "Georgia",
        }),
        txt(val(d, "address", "www.site.com.br").replace(/\n/g, ", "), DARK, {
          left: L + 26,
          top: T + H * 0.42 + 66,
          width: W * 0.7,
          fontSize: 12,
          fontFamily: "Georgia",
        }),
        {
          type: "circle",
          left: L + 8,
          top: T + H * 0.42 + 6,
          radius: 7,
          originX: "center",
          originY: "center",
          fill: SAGE,
        },
        {
          type: "circle",
          left: L + 8,
          top: T + H * 0.42 + 28,
          radius: 7,
          originX: "center",
          originY: "center",
          fill: SAGE,
        },
        {
          type: "circle",
          left: L + 8,
          top: T + H * 0.42 + 50,
          radius: 7,
          originX: "center",
          originY: "center",
          fill: SAGE,
        },
        {
          type: "circle",
          left: L + 8,
          top: T + H * 0.42 + 72,
          radius: 7,
          originX: "center",
          originY: "center",
          fill: SAGE,
        },
        rect({
          left: L + W * 0.6,
          top: T + H * 0.55,
          width: 52,
          height: 52,
          fill: "#E7E4D6",
          rx: 3,
          ry: 3,
        }),
        txt("QR", SAGE, {
          left: L + W * 0.6,
          top: T + H * 0.55 + 20,
          width: 52,
          fontSize: 9,
          textAlign: "center",
          fontFamily: "Georgia",
        }),
      ],
    },
  };
}