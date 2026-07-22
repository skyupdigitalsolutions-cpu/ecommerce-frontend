export const API_BASE = import.meta.env.VITE_API_BASE || "https://ecommerce-backend-td71.onrender.com/api";

const ENDPOINTS = {
  categories: () => `${API_BASE}/categories`,
  products: (qs = "") => `${API_BASE}/products${qs}`,
  productBySlug: (slug) => `${API_BASE}/products/${encodeURIComponent(slug)}`,
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status} for ${url}`);
  return res.json();
}

// backend gives price + discount(%). We treat `price` as MRP and derive the
// sale price. If your `price` is ALREADY the sale price, use the commented line.
function derivePricing(p) {
  const mrp = p.price;
  const sale = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  return { price: sale, mrp };
  // return { price: p.price, mrp: p.discount ? Math.round(p.price / (1 - p.discount/100)) : p.price };
}

export function normalizeProduct(p) {
  if (!p) return null;
  const { price, mrp } = derivePricing(p);
  return {
    id: p._id,
    slug: p.slug,
    title: p.name,
    img: p.images?.[0]?.url || "",
    gallery: (p.images || []).map((i) => i.url),
    category: p.category?.slug || "",
    categoryName: p.category?.name || "",
    sub: p.subcategory || "",
    price,
    mrp,
    rating: p.ratingsAverage ?? 0,
    ratingsCount: p.ratingsCount ?? 0,
    customizable: !!p.customizable,
    description: p.description || "",
  };
}

const TINTS = ["#EEF2FF", "#ECFDF5", "#FFF1F2", "#FFF7ED", "#F0F9FF", "#FDF4FF", "#FEFCE8", "#F0FDFA", "#FAF5FF", "#FEF2F2"];

export async function getCategories() {
  const all = await fetchJson(ENDPOINTS.categories());
  const tops = all.filter((c) => !c.parent);
  return tops.map((c, i) => ({
    slug: c.slug,
    short: c.name,
    name: c.name,
    blurb: c.description || "",
    img: c.image || "",
    banner: c.image || "",
    tint: TINTS[i % TINTS.length],
    items: all.filter((s) => s.parent && s.parent.slug === c.slug).map((s) => s.name),
  }));
}

export async function getCategoryBySlug(slug) {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) || null;
}

export async function getProductsByCategory(slug, limit = 100) {
  const data = await fetchJson(ENDPOINTS.products(`?category=${encodeURIComponent(slug)}&limit=${limit}`));
  const list = Array.isArray(data) ? data : data.products || [];
  return list.map(normalizeProduct);
}

export async function getAllProducts(limit = 100) {
  const data = await fetchJson(ENDPOINTS.products(`?limit=${limit}`));
  const list = Array.isArray(data) ? data : data.products || [];
  return list.map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  try {
    const data = await fetchJson(ENDPOINTS.productBySlug(slug));
    return normalizeProduct(data.product || data);
  } catch {
    const all = await getAllProducts(200);
    return all.find((p) => p.slug === slug || p.id === slug) || null;
  }
}

export const getTrendingByCategory = (products, excludeId, limit = 6) =>
  products.filter((p) => p.id !== excludeId).sort((a, b) => b.rating - a.rating).slice(0, limit);

export const getNewByCategory = (products, excludeId, limit = 6) =>
  products.filter((p) => p.id !== excludeId)
    .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp).slice(0, limit);