import { getPrintProduct } from "../../../lib/print/products";
export default function title(pageContext) {
  const p = getPrintProduct(pageContext.routeParams.product);
  return p ? `${p.name} Editor – SkyUp` : "Design Editor – SkyUp";
}