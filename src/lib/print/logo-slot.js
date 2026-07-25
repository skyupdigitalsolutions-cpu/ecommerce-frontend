/* Placing an uploaded logo into a template.
 *
 * The form stores an uploaded logo as three values on the same data object:
 *   logo   a data URL (the form downscales and re-encodes before storing)
 *   logoW  natural pixel width of that image
 *   logoH  natural pixel height
 *
 * The dimensions matter because templates are built as plain fabric JSON with no
 * canvas around, so there is nothing to measure the bitmap against. Without them
 * there is no way to know the aspect ratio, and the logo cannot be fitted to its
 * slot — so a logo missing its dimensions is treated as no logo at all rather
 * than rendered at some arbitrary size. */

/* True when `data` carries a usable logo. Templates branch on this to decide
 * between the uploaded logo and their own lettermark. */
export function hasLogo(d) {
  return !!(d?.logo && Number(d.logoW) > 0 && Number(d.logoH) > 0);
}

/* A fabric image object scaled to sit inside `box` without distortion or
 * cropping, centred on (box.cx, box.cy). Returns null when there is no logo, so
 * callers can spread it into an objects array and filter falsy entries.
 *
 *   box = { cx, cy, w, h }   the slot to fit within, in canvas units */
export function logoObject(d, box) {
  if (!hasLogo(d)) return null;
  const w = Number(d.logoW);
  const h = Number(d.logoH);
  // contain, never cover: the whole logo stays visible and its ratio is kept
  const k = Math.min(box.w / w, box.h / h);
  return {
    type: "image",
    src: d.logo,
    left: box.cx,
    top: box.cy,
    originX: "center",
    originY: "center",
    scaleX: k,
    scaleY: k,
    // data URLs are same-origin; setting this avoids a needless CORS attribute
    crossOrigin: null,
  };
}

/* The lettermark to fall back on when no logo is uploaded: the first letter of
 * the company name, or `fallback` when the field is empty. Keeping the fallback
 * per-template means the from-scratch editor (which passes no data at all) still
 * renders the exact letter each design was drawn with. */
export function logoInitial(d, fallback = "") {
  const name = String(d?.companyName ?? "").trim();
  const ch = name.charAt(0);
  return (ch || fallback).toUpperCase();
}