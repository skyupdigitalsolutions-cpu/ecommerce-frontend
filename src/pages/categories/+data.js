import { getCategories, getAllProducts } from "../../lib/api";
export async function data() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts(500)]);
  const groups = categories
    .map((cat) => ({ cat, products: products.filter((p) => p.category === cat.slug) }))
    .filter((g) => g.products.length > 0);
  return { groups };
}