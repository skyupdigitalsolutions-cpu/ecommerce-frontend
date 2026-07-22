import { Star, ShoppingCart } from "lucide-react";
import { useData } from "vike-react/useData";
import { useCart } from "../../lib/cart";

function Stars({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = () =>
    [0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-4 w-4 flex-none" fill="currentColor" />
    ));
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${value} out of 5`}
    >
      <span className="flex text-slate-300">{row()}</span>
      <span
        className="absolute inset-0 flex overflow-hidden text-[#F5A623]"
        style={{ width: `${pct}%` }}
      >
        {row()}
      </span>
    </span>
  );
}
function ProductCard({ p }) {
  const { addItem } = useCart(); 
  const off =
    p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <article className="group flex h-full shrink-0 basis-[70%] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-[0_18px_45px_-24px_rgba(15,23,41,0.35)] sm:basis-[42%] md:basis-[30%] lg:basis-[calc((100%-5rem)/6)]">
      <a
        href={`/product/${p.slug}`}
        className="relative block h-52 flex-none overflow-hidden bg-[#F2F1EE]"
      >
        <img
          src={p.img}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#0037CA] px-2.5 py-1 text-[11px] font-bold text-white">
            {off}% OFF
          </span>
        )}
      </a>
      <div className="flex min-w-0 flex-1 flex-col p-4 text-center">
        <h3
          className="truncate text-[14px] font-bold text-[#1F2937]"
          title={p.title}
        >
          {p.title}
        </h3>
        <div className="mt-1.5 flex items-center justify-center gap-1.5">
          <Stars value={p.rating} />
          <span className="text-[13px] text-[#98A2B3]">({p.rating})</span>
        </div>
        <div className="mt-1.5 text-[15px]">
          <span className="font-bold text-[#111827]">₹{p.price}</span>
          {off > 0 && (
            <span className="ml-2 text-[#B0B7C3] line-through">₹{p.mrp}</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-center gap-2 pt-3">
          <a
            href={`/product/${p.slug}`}
            className="flex-1 rounded-full bg-[#0037CA] py-2.5 text-[13px] font-bold text-white transition hover:bg-black"
          >
            Shop now
          </a>
          <button
            type="button"
            onClick={() => addItem(p)}
            aria-label={`Add ${p.title} to cart`}
            className="grid h-11 w-11 flex-none place-items-center cursor-pointer rounded-full border-2 border-slate-200 text-[#f87613] transition hover:border-black hover:bg-black hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
export default function Page() {
  const { groups } = useData();
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <nav className="mb-4 text-[13px] text-[#98A2B3]">
          <a href="/" className="hover:text-[#0037CA]">
            Home
          </a>
          <span className="mx-1.5">/</span>
          <span className="text-[#475467]">All Categories</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[38px]">
          All Categories
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[#667085]">
          Browse everything we print — pick a category to see the full range.
        </p>
        <div className="mt-8 space-y-12">
          {groups.map(({ cat, products }) => (
            <div key={cat.slug}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-full ring-1 ring-black/5"
                    style={{ backgroundColor: cat.tint }}
                  >
                    <img
                      src={cat.img}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#0F1729] sm:text-2xl">
                      {cat.short}
                    </h2>
                    <p className="hidden text-[13px] text-[#98A2B3] sm:block">
                      {cat.blurb}
                    </p>
                  </div>
                </div>
                <a
                  href={`/category/${cat.slug}`}
                  className="flex-none text-sm font-semibold text-[#0037CA] hover:text-[#1c4fd6]"
                >
                  View all →
                </a>
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
