import { getProductById } from "../../../data/catalog";
export default function title(pageContext) {
  const p = getProductById(pageContext.routeParams.id);
  return p ? `${p.title} – SkyUp` : "Product – SkyUp";
}