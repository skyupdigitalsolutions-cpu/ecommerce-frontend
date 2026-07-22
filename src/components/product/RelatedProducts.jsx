import { Star, ShoppingCart } from "lucide-react";

function Stars({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = () => [0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 flex-none" fill="currentColor" />);
  return (<span className="relative inline-flex" role="img" aria-label={`${value} out of 5`}><span className="flex text-slate-300">{row()}</span><span className="absolute inset-0 flex overflow-hidden text-[#F5A623]" style={{ width: `${pct}%` }}>{row()}</span></span>);
}

export default function RelatedProducts({ items = [], category }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="w-full border-t border-slate-200 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <h2 className="text-xl font-bold tracking-tight text-[#0F1729] sm:text-2xl">You might also like</h2>
          {category && <a href={`/category/${category}`} className="flex-none text-sm font-semibold text-[#0037CA] hover:text-[#1c4fd6]">View all →</a>}
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p) => {
            const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
            return (
              <article key={p.id} className="group flex shrink-0 basis-[70%] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-[0_18px_45px_-24px_rgba(15,23,41,0.35)] sm:basis-[42%] md:basis-[30%] lg:basis-[calc((100%-5rem)/6)]">
                <a href={`/product/${p.slug}`} className="relative block h-52 flex-none overflow-hidden bg-[#F2F1EE]">
                  <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                  {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-[#0037CA] px-2.5 py-1 text-[11px] font-bold text-white">{off}% OFF</span>}
                </a>
                <div className="flex min-w-0 flex-1 flex-col p-4 text-center">
                  <h3 className="truncate text-[14px] font-bold text-[#1F2937]" title={p.title}>{p.title}</h3>
                  <div className="mt-1.5 flex items-center justify-center gap-1.5"><Stars value={p.rating} /><span className="text-[13px] text-[#98A2B3]">({p.rating})</span></div>
                  <div className="mt-1.5 text-[15px]"><span className="font-bold text-[#111827]">₹{p.price}</span>{off > 0 && <span className="ml-2 text-[#B0B7C3] line-through">₹{p.mrp}</span>}</div>
                  <div className="mt-auto flex items-center justify-center gap-2 pt-3">
                    <a href={`/product/${p.slug}`} className="flex-1 rounded-full bg-[#0037CA] py-2.5 text-[13px] font-bold text-white transition hover:bg-black">Shop now</a>
                    <button type="button" aria-label={`Add ${p.title} to cart`} className="grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-slate-200 text-[#f87613] transition hover:border-black hover:bg-black hover:text-white"><ShoppingCart className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}