import { useBookmarks } from "../../lib/useBookmarks";
import { Bookmark } from "lucide-react";

/* Drop <SaveButton product={p} /> into any product card.
 * `floating` renders it as an absolute top-right chip over the image. */
export default function SaveButton({ product, floating = false, className = "" }) {
  const { isSaved, toggle } = useBookmarks();
  const key = product.id || product.slug;
  const saved = isSaved(key);

  const onToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      id: product.id,
      slug: product.slug,
      short: product.title,
      img: product.img,
      price: product.price,
      href: `/product/${product.slug}`,
      type: "product",
    });
  };

  const base = floating
    ? "absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition"
    : "grid h-11 w-11 flex-none place-items-center rounded-full border-2 transition";
  const state = saved
    ? "text-[#2F6BFF] border-[#2F6BFF]"
    : "text-[#98A2B3] border-slate-200 hover:text-[#2F6BFF] hover:border-[#2F6BFF]";

  return (
    <button type="button" onClick={onToggle} aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save product"}
      className={`${base} ${state} ${className}`}>
      <Bookmark className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}