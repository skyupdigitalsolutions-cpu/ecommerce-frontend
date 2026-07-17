// Mirrors the backend's utils/pricing.js so the UI shows the same numbers.

export const sellingPrice = (product) => {
  if (!product) return 0;
  const off = (product.price * (product.discount || 0)) / 100;
  return Math.round((product.price - off) * 100) / 100;
};

export const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));
