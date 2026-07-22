export default function title(pageContext) {
  const p = pageContext.data?.product;
  return p ? `${p.title} – SkyUp` : "Product – SkyUp";
}