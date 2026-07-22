import { getProductBySlug } from "../../../lib/api";
export async function data(pageContext) {
  const product = await getProductBySlug(pageContext.routeParams.id);
  return { product };
}