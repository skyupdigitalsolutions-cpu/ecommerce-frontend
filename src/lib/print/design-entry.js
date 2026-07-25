/* Which catalogue categories can be designed from scratch, and which editor
 * product each one opens.
 *
 * This is the gate for the "Design from scratch" entry point. A category that
 * isn't listed here has no editor geometry behind it, so the button is hidden
 * rather than dropping the customer onto a canvas of the wrong size. Adding a
 * new category means adding its slug here AND a matching entry in
 * PRINT_PRODUCTS (products.js) — otherwise /design/<id> renders "Unknown
 * product". */

/* Canonical backend slugs (the ones NAV_LABELS in Header.jsx maps), plus the
 * shorter legacy variants still hardcoded in a few nav links, so both resolve. */
const CATEGORY_TO_EDITOR = {
  // Visiting cards
  "visiting-cards": "visiting-card",
  // Stationery
  "stationery-letterhead-and-notebooks": "letterhead",
  stationery: "letterhead",
  // Signs & posters
  "signs-posters-and-marketing-materials": "poster",
  "signs-and-posters": "poster",
  // Labels & packaging
  "labels-stickers-and-packaging": "label",
};

/* Within an eligible category a product's own name is often more specific than
 * the category itself — a flyer filed under Stationery, say. These only refine
 * WHICH editor opens; they never make an ineligible category eligible. */
/* Order matters: the first match wins, so the specific formats have to be tested
 * before the generic poster catch-all. Getting this wrong is how envelopes,
 * brochures, flyers and standees all ended up on the poster canvas. */
const KEYWORD_TO_EDITOR = [
  [/visiting\s*card|business\s*card/, "visiting-card"],
  [/envelope/, "envelope"],
  [/brochure|leaflet|bi-?fold|tri-?fold|booklet/, "brochure"],
  [/flyer|flier|hand\s*bill|handbill|pamphlet/, "flyer"],
  [/standee|roll[-\s]?up|rollup|backdrop/, "standee"],
  [/letterhead|letter\s*head/, "letterhead"],
  [/poster|banner|signage|sign\s*board|signboard|hoarding/, "poster"],
  [/label|sticker|packaging|carton|pouch/, "label"],
];

/* Returns the editor product id for a catalogue product, or null when the
 * product's category has no editor. */
export function designEditorFor(product) {
  if (!product) return null;
  const base = CATEGORY_TO_EDITOR[product.category];
  if (!base) return null; // category not eligible — no entry point at all
  const hay =
    `${product.slug || ""} ${product.title || ""} ${product.sub || ""}`.toLowerCase();
  for (const [re, id] of KEYWORD_TO_EDITOR) if (re.test(hay)) return id;
  return base;
}

/* Convenience for the product page: the href to link to, or null to hide. */
export function designHrefFor(product) {
  const id = designEditorFor(product);
  return id ? `/design/${id}` : null;
}

/* Where "Customize this product" should go.
 * Eligible categories get the field-form flow, which asks for each field of the
 * product and previews the result. Everything else keeps the existing mockup
 * customizer at /customize/<slug>, unchanged. */
export function customizeHrefFor(product) {
  if (!product) return null;
  const id = designEditorFor(product);
  return id ? `/personalize/${id}` : `/customize/${product.slug}`;
}

/* True when the product routes to the field-form flow rather than the mockup
 * customizer — handy for labelling the button differently. */
export function usesFieldForm(product) {
  return designEditorFor(product) !== null;
}

/* Exposed for tests / debugging. */
export const DESIGNABLE_CATEGORY_SLUGS = Object.keys(CATEGORY_TO_EDITOR);