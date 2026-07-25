/* Text metrics for template layouts.
 *
 * Templates are built as plain fabric JSON, with no canvas available, so there is
 * nothing to measure real text against. That is fine for fixed placeholder text
 * but not for the personalize form, where a customer can type a company name
 * four times longer than the one the layout was drawn around — it wraps, then
 * collides with whatever sits below it.
 *
 * These estimates let a template shrink a headline to fit its box instead. They
 * are approximations: average advance width per character, in em. Real rendering
 * will differ by a few percent, so leave a little slack in the box width. */

/* Average advance per character, as a fraction of font size. Uppercase runs
 * wider than mixed case; bold wider than regular. */
export const EM = {
  regular: 0.52,
  bold: 0.58,
  upper: 0.64,
  upperBold: 0.66,
  serif: 0.5,
};

/* Effective per-character advance, including fabric's charSpacing
 * (expressed in 1/1000 em). */
function advance(em, charSpacing) {
  return em + (charSpacing || 0) / 1000;
}

/* Estimated rendered width of a single line. */
export function estTextWidth(text, fontSize, opts = {}) {
  const { em = EM.regular, charSpacing = 0 } = opts;
  return String(text ?? "").length * fontSize * advance(em, charSpacing);
}

/* Largest font size at which `text` fits `boxWidth` across `lines` lines,
 * clamped to [minSize, maxSize]. Pass the same em/charSpacing the textbox uses. */
export function fitFontSize(text, boxWidth, maxSize, opts = {}) {
  const { minSize = 7, lines = 1, em = EM.regular, charSpacing = 0 } = opts;
  const len = Math.max(String(text ?? "").length, 1);
  const fits = (boxWidth * lines) / (len * advance(em, charSpacing));
  return Math.max(minSize, Math.min(maxSize, Math.floor(fits * 10) / 10));
}

/* Read a form value, falling back to the design's own placeholder when the field
 * is absent or blank, so an untouched form previews exactly as designed. */
export function val(d, key, fallback) {
  const v = d?.[key];
  return v == null || String(v).trim() === "" ? fallback : String(v).trim();
}