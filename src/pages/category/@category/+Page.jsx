import { useEffect, useState } from "react";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import { ShoppingCart, ChevronRightIcon } from "lucide-react";

const Star = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5Z" />
  </svg>
);
function Stars({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = () => [0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 flex-none" />);
  return (
    <span className="relative inline-flex">
      <span className="flex text-slate-300">{row()}</span>
      <span className="absolute inset-0 flex overflow-hidden text-[#F5A623]" style={{ width: `${pct}%` }}>{row()}</span>
    </span>
  );
}

function CategoryHero({ category }) {
  const bg = category.banner || category.img;
  return (
    <div className="relative overflow-hidden">
      <img src={bg} alt={category.short} className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative flex min-h-[280px] items-center p-6 sm:min-h-[360px] sm:p-10 lg:min-h-[420px] lg:p-14">
        <div className="max-w-xl">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#93B4FF]">Custom Printing</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-[44px] lg:text-[52px]">{category.name}</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">{category.blurb}</p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p }) {
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-[0_18px_45px_-24px_rgba(15,23,41,0.35)]">
      <a href={`/product/${p.slug}`} className="relative block h-60 flex-none overflow-hidden bg-[#F2F1EE]">
        <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-[#0037CA] px-2.5 py-1 text-[11px] font-bold text-white">{off}% OFF</span>}
      </a>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3 className="truncate text-[15px] font-bold text-[#1F2937]" title={p.title}>{p.title}</h3>
        <div className="mt-1.5 flex items-center gap-1.5"><Stars value={p.rating} /><span className="text-[13px] text-[#98A2B3]">({p.rating})</span></div>
        <div className="mt-2 text-[15px]"><span className="font-bold text-[#111827]">₹{p.price}</span>{off > 0 && <span className="ml-2 text-[#B0B7C3] line-through">₹{p.mrp}</span>}</div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <a href={`/product/${p.slug}`} className="flex flex-1 items-center justify-center rounded-full bg-[#0037CA] py-3 text-[14px] font-semibold text-white transition hover:bg-black">Shop now</a>
          <button type="button" aria-label={`Add ${p.title} to cart`} className="grid h-11 w-11 flex-none place-items-center rounded-full border-2 border-slate-200 text-[#f87613] transition hover:border-black hover:bg-black hover:text-white"><ShoppingCart className="h-5 w-5" /></button>
        </div>
      </div>
    </article>
  );
}

function ProductRail({ title, eyebrow, products }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="mx-12 mt-14">
      <div className="mb-6"><p className="text-[12px] font-bold uppercase tracking-widest text-[#0037CA]">{eyebrow}</p><h2 className="mt-1 text-xl font-bold tracking-tight text-[#0F1729] sm:text-2xl">{title}</h2></div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => <div key={p.id} className="shrink-0 basis-[70%] snap-start sm:basis-[42%] md:basis-[30%] lg:basis-[calc((100%-5rem)/6)]"><ProductCard p={p} /></div>)}
      </div>
    </div>
  );
}

export default function Page() {
  const { category, products, trending, newLaunches } = useData();
  const pageContext = usePageContext();
  const subParam = pageContext.urlParsed?.search?.sub;
  const [sub, setSub] = useState(subParam || "All");
  useEffect(() => { setSub(subParam || "All"); }, [subParam]);

  if (!category) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0F1729]">Category not found</h1>
        <a href="/" className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white">Back to home</a>
      </section>
    );
  }

  const visible = sub === "All" ? products : products.filter((p) => p.sub === sub);

  return (
    <section className="w-full bg-white">
      <div className="px-5 py-10 sm:px-8 sm:py-6 lg:px-0">
        <nav className="flex mb-4 mx-4 text-[14px] font-medium text-[#717171]">
          <a href="/" className="hover:text-[#0037CA]">Home</a>
          <span className="mx-1"><ChevronRightIcon className="w-5 h-5" /></span>
          <span className="text-black">{category.short}</span>
        </nav>

        <CategoryHero category={category} />

        <div id="products" className="mx-12 mt-10 flex items-center justify-between gap-4 scroll-mt-24">
          <h2 className="text-xl font-bold tracking-tight text-[#0F1729] sm:text-2xl">Products</h2>
          <p className="text-[14px] font-medium text-[#98A2B3]">{visible.length} {visible.length === 1 ? "product" : "products"}</p>
        </div>

        <div className="mt-4 mx-12 flex flex-wrap gap-2">
          {["All", ...category.items].map((chip) => {
            const on = sub === chip;
            return (
              <button key={chip} type="button" onClick={() => setSub(chip)} className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${on ? "border-[#0037CA] bg-[#0037CA] text-white" : "border-slate-200 bg-white text-[#475467] hover:border-[#0037CA] hover:text-[#0037CA]"}`}>{chip}</button>
            );
          })}
        </div>

        {visible.length > 0 ? (
          <div className="mt-8 mx-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="mt-16 mx-12 text-center text-[#667085]">No products in “{sub}” yet.</div>
        )}

        <ProductRail eyebrow="Trending now" title="Trending in this category" products={trending} />
        <ProductRail eyebrow="Just dropped" title="New launches" products={newLaunches} />
      </div>
    </section>
  );
}