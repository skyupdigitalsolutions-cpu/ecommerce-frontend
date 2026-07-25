/* Form field schemas for the personalize flow.
 *
 * Each editor product declares the fields a customer fills in. The same keys are
 * read by the template builders (build(scheme, g, data)), so adding a field here
 * only shows up on the design once a template actually reads that key.
 *
 * Field shape:
 *   key         matches the key template builders read from `data`
 *   label       shown above the input
 *   type        text | tel | email | url | textarea
 *   placeholder the design's own default, so an empty field previews as designed
 *   hint        optional helper line under the input
 *   maxLength   soft guard — long values wrap and can overflow a fixed layout
 *   rows        textarea only
 */

const FIELD_SETS = {
  "visiting-card": [
    {
      key: "fullName",
      label: "Full name",
      type: "text",
      placeholder: "Lina Harb",
      maxLength: 40,
    },
    {
      key: "jobTitle",
      label: "Job title",
      type: "text",
      placeholder: "Graphic designer",
      maxLength: 40,
    },
    {
      key: "companyName",
      label: "Company name",
      type: "text",
      placeholder: "Lina",
      maxLength: 30,
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 98765 43210",
      maxLength: 24,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "hello@company.com",
      maxLength: 40,
    },
    {
      key: "website",
      label: "Website or social handle",
      type: "text",
      placeholder: "@yourhandle",
      maxLength: 34,
    },
    {
      key: "address",
      label: "Address",
      type: "textarea",
      rows: 2,
      placeholder: "123 Business Street, Bangalore 560001",
      maxLength: 90,
    },
  ],

  letterhead: [
    {
      key: "companyName",
      label: "Company name",
      type: "text",
      placeholder: "Brand Name",
      maxLength: 34,
      hint: "First word is highlighted on templates with a two-tone wordmark.",
    },
    {
      key: "tagline",
      label: "Tagline",
      type: "text",
      placeholder: "Your Tagline Space",
      maxLength: 44,
    },
    {
      key: "logo",
      label: "Company logo",
      type: "image",
      accept: "image/png,image/jpeg,image/svg+xml,image/webp",
      hint: "PNG, JPG, SVG or WebP. A transparent PNG sits best on the coloured header.",
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "(+000) 123 456 7899",
      maxLength: 24,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "youremail@gmail.com",
      maxLength: 40,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
    {
      key: "address",
      label: "Address",
      type: "textarea",
      rows: 2,
      placeholder: "youraddressname here",
      maxLength: 90,
    },
  ],

  poster: [
    {
      key: "headline",
      label: "Headline",
      type: "text",
      placeholder: "YOUR HEADLINE",
      maxLength: 34,
      hint: "Keep it short — this is the largest text on the poster.",
    },
    {
      key: "subheadline",
      label: "Subheadline",
      type: "text",
      placeholder: "A short supporting line",
      maxLength: 60,
    },
    {
      key: "bodyText",
      label: "Body text",
      type: "textarea",
      rows: 4,
      placeholder:
        "Add the details you want people to read after the headline.",
      maxLength: 320,
    },
    {
      key: "dateTime",
      label: "Date & time",
      type: "text",
      placeholder: "Saturday 12 April · 6:00 PM",
      maxLength: 44,
    },
    {
      key: "venue",
      label: "Venue",
      type: "text",
      placeholder: "Community Hall, MG Road",
      maxLength: 44,
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 98765 43210",
      maxLength: 24,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
    {
      key: "brandName",
      label: "Brand or organiser",
      type: "text",
      placeholder: "Brand Name",
      maxLength: 30,
    },
  ],

  label: [
    {
      key: "brandName",
      label: "Brand name",
      type: "text",
      placeholder: "BRAND",
      maxLength: 24,
    },
    {
      key: "productName",
      label: "Product name",
      type: "text",
      placeholder: "Product Name",
      maxLength: 30,
    },
    {
      key: "variant",
      label: "Variant or flavour",
      type: "text",
      placeholder: "Original",
      maxLength: 26,
    },
    {
      key: "netWeight",
      label: "Net weight / volume",
      type: "text",
      placeholder: "Net wt. 250 g",
      maxLength: 22,
    },
    {
      key: "ingredients",
      label: "Ingredients",
      type: "textarea",
      rows: 3,
      placeholder: "List the ingredients here, separated by commas.",
      maxLength: 220,
    },
    {
      key: "batchInfo",
      label: "Batch / best before",
      type: "text",
      placeholder: "Batch 000 · Best before 12 months",
      maxLength: 44,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
  ],

  envelope: [
    {
      key: "logo",
      label: "Company logo",
      type: "image",
      accept: "image/png,image/jpeg,image/svg+xml,image/webp",
      hint: "PNG, JPG, SVG or WebP. A transparent PNG sits best on a coloured panel.",
    },
    {
      key: "companyName",
      label: "Company name",
      type: "text",
      placeholder: "Brand Name",
      maxLength: 34,
    },
    {
      key: "tagline",
      label: "Tagline",
      type: "text",
      placeholder: "Your Tagline Space",
      maxLength: 40,
    },
    {
      key: "address",
      label: "Return address",
      type: "textarea",
      rows: 3,
      placeholder: "4th Cross, Indiranagar\nBangalore 560038",
      maxLength: 110,
      hint: "Printed small in the sender corner.",
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 98765 43210",
      maxLength: 24,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "hello@company.com",
      maxLength: 40,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
  ],

  brochure: [
    {
      key: "logo",
      label: "Company logo",
      type: "image",
      accept: "image/png,image/jpeg,image/svg+xml,image/webp",
      hint: "PNG, JPG, SVG or WebP. A transparent PNG sits best on a coloured panel.",
    },
    {
      key: "companyName",
      label: "Company name",
      type: "text",
      placeholder: "Brand Name",
      maxLength: 30,
    },
    {
      key: "headline",
      label: "Cover headline",
      type: "text",
      placeholder: "What You Do",
      maxLength: 34,
    },
    {
      key: "subheadline",
      label: "Cover subheadline",
      type: "text",
      placeholder: "A short supporting line",
      maxLength: 60,
    },
    {
      key: "aboutTitle",
      label: "Section heading",
      type: "text",
      placeholder: "About Us",
      maxLength: 26,
    },
    {
      key: "aboutText",
      label: "Section text",
      type: "textarea",
      rows: 4,
      placeholder:
        "Two or three sentences about the business, its work and who it serves.",
      maxLength: 300,
    },
    {
      key: "servicesList",
      label: "Services",
      type: "textarea",
      rows: 4,
      placeholder: "One service per line",
      maxLength: 220,
      hint: "Each line becomes its own bullet.",
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 98765 43210",
      maxLength: 24,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "hello@company.com",
      maxLength: 40,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
    {
      key: "address",
      label: "Address",
      type: "textarea",
      rows: 2,
      placeholder: "4th Cross, Indiranagar, Bangalore 560038",
      maxLength: 90,
    },
  ],

  flyer: [
    {
      key: "logo",
      label: "Company logo",
      type: "image",
      accept: "image/png,image/jpeg,image/svg+xml,image/webp",
      hint: "PNG, JPG, SVG or WebP. A transparent PNG sits best on a coloured panel.",
    },
    {
      key: "brandName",
      label: "Brand or organiser",
      type: "text",
      placeholder: "Brand Name",
      maxLength: 28,
    },
    {
      key: "headline",
      label: "Headline",
      type: "text",
      placeholder: "BIG ANNOUNCEMENT",
      maxLength: 30,
      hint: "The largest text on the flyer — keep it short.",
    },
    {
      key: "offerText",
      label: "Offer or highlight",
      type: "text",
      placeholder: "50% OFF",
      maxLength: 18,
      hint: "Sits in the highlight badge. Leave blank to hide it.",
    },
    {
      key: "subheadline",
      label: "Subheadline",
      type: "text",
      placeholder: "A short supporting line",
      maxLength: 56,
    },
    {
      key: "bodyText",
      label: "Body text",
      type: "textarea",
      rows: 4,
      placeholder: "The details you want people to read after the headline.",
      maxLength: 260,
    },
    {
      key: "dateTime",
      label: "Date & time",
      type: "text",
      placeholder: "Saturday 12 April · 6:00 PM",
      maxLength: 40,
    },
    {
      key: "venue",
      label: "Venue",
      type: "text",
      placeholder: "Community Hall, MG Road",
      maxLength: 40,
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 98765 43210",
      maxLength: 24,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
  ],

  standee: [
    {
      key: "logo",
      label: "Company logo",
      type: "image",
      accept: "image/png,image/jpeg,image/svg+xml,image/webp",
      hint: "PNG, JPG, SVG or WebP. A transparent PNG sits best on a coloured panel.",
    },
    {
      key: "brandName",
      label: "Brand name",
      type: "text",
      placeholder: "Brand Name",
      maxLength: 26,
    },
    {
      key: "headline",
      label: "Headline",
      type: "text",
      placeholder: "YOUR HEADLINE",
      maxLength: 28,
      hint: "Read from several metres away — fewer words is better.",
    },
    {
      key: "subheadline",
      label: "Subheadline",
      type: "text",
      placeholder: "A short supporting line",
      maxLength: 52,
    },
    {
      key: "bulletPoints",
      label: "Key points",
      type: "textarea",
      rows: 5,
      placeholder: "One point per line",
      maxLength: 260,
      hint: "Each line becomes its own bullet.",
    },
    {
      key: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "+91 98765 43210",
      maxLength: 24,
    },
    {
      key: "website",
      label: "Website",
      type: "url",
      placeholder: "www.yourcompany.com",
      maxLength: 40,
    },
  ],
};
/* The fields for an editor product, or [] when it has none. */
export function fieldsFor(productId) {
  return FIELD_SETS[productId] || [];
}

/* A blank value object keyed by field. Empty strings mean "use the design's own
 * default", which is what keeps the first preview looking like the thumbnail. */
export function blankValues(productId) {
  const out = {};
  for (const f of fieldsFor(productId)) {
    out[f.key] = "";
    // An image field also carries the bitmap's natural size, which templates need
    // to fit it to its slot. These live alongside the schema keys rather than in
    // it, so they never render as form inputs.
    if (f.type === "image") {
      out[`${f.key}W`] = 0;
      out[`${f.key}H`] = 0;
    }
  }
  return out;
}

/* True when a product can be personalized through the form flow at all. */
export function hasFields(productId) {
  return fieldsFor(productId).length > 0;
}

/* How many fields the customer has actually filled — drives the progress line.
 * An image field counts as filled once it holds a data URL. */
export function filledCount(productId, values) {
  return fieldsFor(productId).filter((f) => {
    const v = values?.[f.key];
    if (f.type === "image")
      return typeof v === "string" && v.startsWith("data:");
    return String(v ?? "").trim() !== "";
  }).length;
}

/* Field keys the customer uploads rather than types. */
export function imageFieldKeys(productId) {
  return fieldsFor(productId)
    .filter((f) => f.type === "image")
    .map((f) => f.key);
}