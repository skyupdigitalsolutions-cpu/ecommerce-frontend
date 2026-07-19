import { getCategoryBySlug } from "../../../data/catalog";

export default function title(pageContext) {
  const category = getCategoryBySlug(pageContext.routeParams.category);
  return category ? `${category.name} – SkyUp` : "Shop – SkyUp";
}