import { getProductBySlug, getProductsByCategory } from "../../../lib/api";
export async function data(pageContext) {
  const product = await getProductBySlug(pageContext.routeParams.id);
  const related = product ? (await getProductsByCategory(product.category)).filter((p) => p.id !== product.id).slice(0, 6) : [];
  return { product, related };
}