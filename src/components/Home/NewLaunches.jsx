import { useProducts } from "../../lib/useCatalog";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../lib/cart";
import SaveButton from "../product/SaveButton";

function Card({ p }) {
  const { addItem } = useCart(); 
  const off =
    p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  return (
    <article className="group flex h-full shrink-0 basis-[70%] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-[0_18px_45px_-24px_rgba(15,23,41,0.35)] sm:basis-[42%] md:basis-[30%] lg:basis-[calc((100%-5rem)/5)]">
      <a
        href={`/product/${p.slug}`}
        className="relative block h-52 flex-none overflow-hidden bg-[#F2F1EE]"
      >
        <SaveButton className="cursor-pointer" product={p} floating />
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
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3
          className="truncate text-[15px] font-bold text-[#1F2937]"
          title={p.title}
        >
          {p.title}
        </h3>
        <div className="mt-2 text-[15px]">
          <span className="font-bold text-[#111827]">₹{p.price}</span>
          {off > 0 && (
            <span className="ml-2 text-[#B0B7C3] line-through">₹{p.mrp}</span>
          )}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <a
            href={`/product/${p.slug}`}
            className="flex flex-1 items-center justify-center rounded-full bg-[#0037CA] py-3 text-[14px] font-semibold text-white transition hover:bg-black"
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
export default function NewLaunches() {
  const { products } = useProducts();
  const items = [...products]
    .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    .slice(0, 10);
  if (items.length === 0) return null;
  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="mx-12 px-5 sm:px-8 lg:px-12">
        <div className="mb-6">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#2F6BFF]">
            Just dropped
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[38px]">
            New launches
          </h2>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
