import { useEffect, useMemo, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { ShoppingCart } from "lucide-react";
import {
  getCategoryBySlug,
  getProductsByCategory,
  categoryHref,
} from "../../../data/catalog";

/* fractional star rating */
const Star = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5Z" />
  </svg>
);
function Stars({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = () => [0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 flex-none" />);
  return (
    <span className="relative inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
      <span className="flex text-slate-300">{row()}</span>
      <span className="absolute inset-0 flex overflow-hidden text-[#F5A623]" style={{ width: `${pct}%` }}>
        {row()}
      </span>
    </span>
  );
}

function ProductCard({ p }) {
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-[0_18px_45px_-24px_rgba(15,23,41,0.35)]">
      <div className="relative overflow-hidden bg-[#F2F1EE]">
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#0037CA] px-2.5 py-1 text-[11px] font-bold text-white">
            {off}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold text-[#1F2937]">{p.title}</h3>

        <div className="mt-1.5 flex items-center gap-1.5">
          <Stars value={p.rating} />
          <span className="text-[13px] text-[#98A2B3]">({p.rating})</span>
        </div>

        <div className="mt-2 text-[15px]">
          <span className="font-bold text-[#111827]">₹{p.price}</span>
          <span className="ml-2 text-[#B0B7C3] line-through">₹{p.mrp}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <a
            href={`/product/${p.id}`}
            className="flex flex-1 items-center justify-center rounded-full bg-[#0037CA] py-3 text-[14px] font-semibold text-white transition hover:bg-black"
          >
            Shop now
          </a>
          <button
            type="button"
            aria-label={`Add ${p.title} to cart`}
            className="grid h-11 w-11 flex-none place-items-center rounded-full border-2 border-slate-200 text-[#f87613] transition hover:border-black hover:bg-black hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Page() {
  const pageContext = usePageContext();
  const slug = pageContext.routeParams.category;
  const subParam = pageContext.urlParsed?.search?.sub;

  const category = getCategoryBySlug(slug);
  const products = useMemo(() => getProductsByCategory(slug), [slug]);

  const [sub, setSub] = useState(subParam || "All");

  // keep the active chip in sync with the URL (?sub=…) on every navigation
  useEffect(() => {
    setSub(subParam || "All");
  }, [subParam]);

  const visible = sub === "All" ? products : products.filter((p) => p.sub === sub);

  // unknown category slug
  if (!category) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8 lg:px-12">
        <h1 className="text-2xl font-bold text-[#0F1729]">Category not found</h1>
        <p className="mt-3 text-[#667085]">
          We couldn’t find a category called “{slug}”.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Back to home
        </a>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        {/* breadcrumb */}
        <nav className="mb-4 text-[13px] text-[#98A2B3]">
          <a href="/" className="hover:text-[#0037CA]">Home</a>
          <span className="mx-1.5">/</span>
          <span className="text-[#475467]">{category.short}</span>
        </nav>

        {/* header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[38px]">
              {category.name}
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] text-[#667085]">{category.blurb}</p>
          </div>
          <p className="flex-none text-[14px] font-medium text-[#98A2B3]">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* subcategory filter chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...category.items].map((chip) => {
            const on = sub === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setSub(chip)}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                  on
                    ? "border-[#0037CA] bg-[#0037CA] text-white"
                    : "border-slate-200 bg-white text-[#475467] hover:border-[#0037CA] hover:text-[#0037CA]"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* product grid */}
        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <p className="text-[17px] font-semibold text-[#0F1729]">
              No products in “{sub}” yet
            </p>
            <p className="mt-2 text-[#667085]">Try another filter or browse all.</p>
            <button
              type="button"
              onClick={() => setSub("All")}
              className="mt-5 rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Show all {category.short}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}