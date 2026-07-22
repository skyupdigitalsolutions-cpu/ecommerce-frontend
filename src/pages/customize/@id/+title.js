export default function title(pageContext) {
  const p = pageContext.data?.product;
  return p ? `Customize ${p.title} – SkyUp` : "Customize – SkyUp";
}