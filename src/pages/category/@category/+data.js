import {
  getCategoryBySlug,
  getProductsByCategory,
  getTrendingByCategory,
  getNewByCategory,
} from "../../../lib/api";

export async function data(pageContext) {
  const slug = pageContext.routeParams.category;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);
  return {
    slug,
    category,
    products,
    trending: getTrendingByCategory(products, null, 6),
    newLaunches: getNewByCategory(products, null, 6),
  };
}