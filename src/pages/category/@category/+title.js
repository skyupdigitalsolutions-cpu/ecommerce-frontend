export default function title(pageContext) {
  const c = pageContext.data?.category;
  return c ? `${c.name} – SkyUp` : "Category – SkyUp";
}