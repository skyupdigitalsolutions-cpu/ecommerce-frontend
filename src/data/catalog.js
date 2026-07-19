/* ------------------------------------------------------------------ *
 * Catalog — single source of truth for categories and products.
 * Homepage links and the category page both read from here, so a
 * click on any category routes to /category/<slug> and this data
 * drives what that page shows. Add products by pushing to PRODUCTS
 * with a `category` that matches a CATEGORIES slug.
 * ------------------------------------------------------------------ */

export const CATEGORIES = [
  {
    slug: "visiting-cards",
    short: "Visiting Cards",
    name: "Visiting Cards",
    blurb: "Standard, premium, matte, glossy, foil-stamped & more.",
    img: "/images/visiting_cards.jpg",
    tint: "#EEF2FF",
    items: ["Standard", "Premium", "Matte", "Glossy", "Rounded Corner", "Foil Stamped", "Double-Sided"],
  },
  {
    slug: "stationery",
    short: "Stationery",
    name: "Stationery, Letterhead & Notebooks",
    blurb: "Letterheads, envelopes, notebooks, bill books & more.",
    img: "/images/stationary.jpg",
    tint: "#ECFDF5",
    items: ["Letterheads", "Envelopes", "Notebooks", "Notepads", "Sticky Notes", "Bill Books"],
  },
  {
    slug: "stamps-ink",
    short: "Stamps & Ink",
    name: "Stamps & Ink",
    blurb: "Self-inking, pre-inked, date stamps, ink pads & refills.",
    img: "/images/stamps&inks.jpg",
    tint: "#FFF1F2",
    items: ["Self-Inking Stamps", "Pre-Inked Stamps", "Date Stamps", "Ink Pads", "Refill Ink"],
  },
  {
    slug: "signs-posters",
    short: "Signs & Posters",
    name: "Signs, Posters & Marketing Materials",
    blurb: "Posters, banners, flyers, brochures, standees & flex boards.",
    img: "/images/posters.jpg",
    tint: "#FFF7ED",
    items: ["Posters", "Banners", "Flyers", "Brochures", "Standees", "Flex Boards"],
  },
  {
    slug: "labels-packaging",
    short: "Labels & Packaging",
    name: "Labels, Stickers & Packaging",
    blurb: "Product labels, stickers, boxes, pouches, tape & hang tags.",
    img: "/images/lables&packages.jpg",
    tint: "#F0F9FF",
    items: ["Product Labels", "Stickers", "Packaging Boxes", "Pouches", "Custom Tape", "Hang Tags"],
  },
  {
    slug: "clothing-bags",
    short: "Clothing & Bags",
    name: "Clothing, Bags & Caps",
    blurb: "T-shirts, hoodies, tote bags, backpacks, caps & aprons.",
    img: "/images/clothing.jpg",
    tint: "#FDF4FF",
    items: ["T-Shirts", "Hoodies", "Tote Bags", "Backpacks", "Caps", "Aprons"],
  },
  {
    slug: "mugs-gifts",
    short: "Mugs & Gifts",
    name: "Mug, Albums & Gifts",
    blurb: "Photo mugs, magic mugs, albums, frames, keychains & cushions.",
    img: "/images/mugs&gifts.jpg",
    tint: "#FEFCE8",
    items: ["Photo Mugs", "Magic Mugs", "Photo Albums", "Frames", "Keychains", "Cushions"],
  },
  {
    slug: "pens",
    short: "Pens",
    name: "Pens",
    blurb: "Ballpoint, gel, metal, printed pens & gift sets.",
    img: "/images/custom_pens.jpg",
    tint: "#F0FDFA",
    items: ["Ballpoint", "Gel", "Metal Pens", "Printed Pens", "Gift Sets"],
  },
  {
    slug: "drinkware",
    short: "Drinkware",
    name: "Drinkware",
    blurb: "Water bottles, sippers, tumblers, coffee mugs & flasks.",
    img: "/images/custom_drinkware.jpg",
    tint: "#FAF5FF",
    items: ["Water Bottles", "Sippers", "Tumblers", "Coffee Mugs", "Flasks"],
  },
  {
    slug: "polo-tshirts",
    short: "Polo T-Shirts",
    name: "Custom Polo T-Shirts",
    blurb: "Cotton, dri-fit, collared, embroidered & team sets.",
    img: "/images/custom_polo-tshirt.jpg",
    tint: "#FEF2F2",
    items: ["Cotton Polo", "Dri-Fit Polo", "Collared Tee", "Embroidered", "Team Sets"],
  },
];

/* products — `category` matches a CATEGORIES slug, `sub` matches an
 * item within that category (used for the on-page filter chips). */
export const PRODUCTS = [
  // visiting-cards
  { id: "vc-01", title: "Premium Matte Visiting Cards", category: "visiting-cards", sub: "Matte", img: "/images/visiting_cards.jpg", gallery:["/images/posters.jpg","/images/visiting_cards.jpg"], price: 299, mrp: 499, rating: 4.8 },
  { id: "vc-02", title: "Glossy Double-Sided Cards", category: "visiting-cards", sub: "Glossy", img: "/images/visiting_cards.jpg", price: 349, mrp: 549, rating: 4.7 },
  { id: "vc-03", title: "Foil Stamped Luxury Cards", category: "visiting-cards", sub: "Foil Stamped", img: "/images/visiting_cards.jpg", price: 699, mrp: 999, rating: 4.9 },
  { id: "vc-04", title: "Rounded Corner Standard Cards", category: "visiting-cards", sub: "Rounded Corner", img: "/images/visiting_cards.jpg", price: 249, mrp: 399, rating: 4.6 },

  // stationery
  { id: "st-01", title: "Branded A4 Letterheads", category: "stationery", sub: "Letterheads", img: "/images/letter_head.jpg", price: 259, mrp: 429, rating: 4.5 },
  { id: "st-02", title: "Custom Printed Envelopes", category: "stationery", sub: "Envelopes", img: "/images/stationery.jpg", price: 199, mrp: 329, rating: 4.6 },
  { id: "st-03", title: "Hardcover Notebooks", category: "stationery", sub: "Notebooks", img: "/images/premium-stationary.jpg", price: 349, mrp: 549, rating: 4.8 },
  { id: "st-04", title: "Carbonless Bill Books", category: "stationery", sub: "Bill Books", img: "/images/stationery.jpg", price: 399, mrp: 599, rating: 4.4 },

  // stamps-ink
  { id: "sp-01", title: "Self-Inking Round Stamp", category: "stamps-ink", sub: "Self-Inking Stamps", img: "/images/stamps&inks.jpg", price: 199, mrp: 349, rating: 4.7 },
  { id: "sp-02", title: "Pre-Inked Signature Stamp", category: "stamps-ink", sub: "Pre-Inked Stamps", img: "/images/stamps&inks.jpg", price: 249, mrp: 399, rating: 4.6 },
  { id: "sp-03", title: "Adjustable Date Stamp", category: "stamps-ink", sub: "Date Stamps", img: "/images/stamps&inks.jpg", price: 179, mrp: 299, rating: 4.5 },

  // signs-posters
  { id: "sn-01", title: "Matte Finish Posters", category: "signs-posters", sub: "Posters", img: "/images/posters.jpg",  price: 149, mrp: 249, rating: 4.6 },
  { id: "sn-02", title: "Vinyl Outdoor Banners", category: "signs-posters", sub: "Banners", img: "/images/posters.jpg", price: 499, mrp: 799, rating: 4.7 },
  { id: "sn-03", title: "A5 Promotional Flyers", category: "signs-posters", sub: "Flyers", img: "/images/posters.jpg", price: 99, mrp: 179, rating: 4.4 },
  { id: "sn-04", title: "Roll-Up Standees", category: "signs-posters", sub: "Standees", img: "/images/posters.jpg", price: 1299, mrp: 1899, rating: 4.8 },

  // labels-packaging
  { id: "lp-01", title: "Waterproof Product Labels", category: "labels-packaging", sub: "Product Labels", img: "/images/packaging_labels.jpeg", price: 349, mrp: 549, rating: 4.7 },
  { id: "lp-02", title: "Die-Cut Vinyl Stickers", category: "labels-packaging", sub: "Stickers", img: "/images/custom-sticker.jpg", price: 149, mrp: 249, rating: 4.8 },
  { id: "lp-03", title: "Custom Packaging Boxes", category: "labels-packaging", sub: "Packaging Boxes", img: "/images/custom_packaging.jpg", price: 599, mrp: 899, rating: 4.6 },
  { id: "lp-04", title: "Kraft Hang Tags", category: "labels-packaging", sub: "Hang Tags", img: "/images/die-cut-tag.jpg", price: 129, mrp: 219, rating: 4.5 },

  // clothing-bags
  { id: "cb-01", title: "Cotton Crew T-Shirt", category: "clothing-bags", sub: "T-Shirts", img: "/images/custom-printed-tee.jpg", price: 399, mrp: 649, rating: 4.9 },
  { id: "cb-02", title: "Fleece Pullover Hoodie", category: "clothing-bags", sub: "Hoodies", img: "/images/clothing.jpg", price: 899, mrp: 1299, rating: 4.7 },
  { id: "cb-03", title: "Canvas Tote Bag", category: "clothing-bags", sub: "Tote Bags", img: "/images/tote-bag.jpg", price: 199, mrp: 329, rating: 4.6 },
  { id: "cb-04", title: "Embroidered Cap", category: "clothing-bags", sub: "Caps", img: "/images/clothing.jpg", price: 259, mrp: 429, rating: 4.5 },

  // mugs-gifts
  { id: "mg-01", title: "Custom Photo Mug", category: "mugs-gifts", sub: "Photo Mugs", img: "/images/printed_mug.jpg", price: 249, mrp: 399, rating: 4.9 },
  { id: "mg-02", title: "Magic Heat Mug", category: "mugs-gifts", sub: "Magic Mugs", img: "/images/printed_mug.jpg", price: 349, mrp: 499, rating: 4.7 },
  { id: "mg-03", title: "Pocket Photo Album", category: "mugs-gifts", sub: "Photo Albums", img: "/images/acrylic-photo.jpg", price: 500, mrp: 799, rating: 4.6 },
  { id: "mg-04", title: "Acrylic Photo Frame", category: "mugs-gifts", sub: "Frames", img: "/images/acrylic-photo.jpg", price: 349, mrp: 549, rating: 4.7 },

  // pens
  { id: "pn-01", title: "Metal Business Pen", category: "pens", sub: "Metal Pens", img: "/images/custom_pens.jpg", price: 179, mrp: 299, rating: 4.8 },
  { id: "pn-02", title: "Printed Ballpoint Pack", category: "pens", sub: "Ballpoint", img: "/images/custom_pens.jpg", price: 99, mrp: 179, rating: 4.5 },
  { id: "pn-03", title: "Executive Pen Gift Set", category: "pens", sub: "Gift Sets", img: "/images/custom_pens.jpg", price: 499, mrp: 799, rating: 4.9 },

  // drinkware
  { id: "dw-01", title: "Insulated Water Bottle", category: "drinkware", sub: "Water Bottles", img: "/images/insulated-water-bottle.jpg", price: 329, mrp: 499, rating: 4.8 },
  { id: "dw-02", title: "Premium Sipper Bottle", category: "drinkware", sub: "Sippers", img: "/images/premium-sipper.jpg", price: 299, mrp: 449, rating: 4.7 },
  { id: "dw-03", title: "Steel Travel Tumbler", category: "drinkware", sub: "Tumblers", img: "/images/drinkwares.jpg", price: 379, mrp: 579, rating: 4.6 },
  { id: "dw-04", title: "Vacuum Coffee Flask", category: "drinkware", sub: "Flasks", img: "/images/drinkwares.jpg", price: 449, mrp: 699, rating: 4.7 },

  // polo-tshirts
  { id: "pt-01", title: "Cotton Polo T-Shirt", category: "polo-tshirts", sub: "Cotton Polo", img: "/images/t-shirts.jpg", price: 499, mrp: 799, rating: 4.8 },
  { id: "pt-02", title: "Dri-Fit Sports Polo", category: "polo-tshirts", sub: "Dri-Fit Polo", img: "/images/t-shirts.jpg", price: 599, mrp: 899, rating: 4.7 },
  { id: "pt-03", title: "Embroidered Team Polo", category: "polo-tshirts", sub: "Embroidered", img: "/images/t-shirts.jpg", price: 699, mrp: 999, rating: 4.9 },
];

/* helpers */
export const categoryHref = (slug) => `/category/${slug}`;

export const getCategoryBySlug = (slug) =>
  CATEGORIES.find((c) => c.slug === slug) || null;

export const getProductsByCategory = (slug) =>
  PRODUCTS.filter((p) => p.category === slug);

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id) || null;