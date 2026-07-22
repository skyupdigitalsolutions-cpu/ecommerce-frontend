import { useCategories } from "../../lib/useCatalog";
import { ArrowRight } from "lucide-react";

export default function BusinessProducts() {
  const { categories } = useCategories();
  if (categories.length === 0) return null;
  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="mx-12 px-5 sm:px-8 lg:px-12">
        <div className="mb-8"><p className="text-[12px] font-bold uppercase tracking-widest text-[#2F6BFF]">For your business</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[38px]">Everything you need, branded</h2></div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat) => (
            <a key={cat.slug} href={`/category/${cat.slug}`} className="group flex flex-col rounded-[20px] border border-slate-100 bg-white p-3 shadow-[0_18px_50px_-24px_rgba(15,23,41,0.28)] transition hover:shadow-[0_22px_55px_-22px_rgba(15,23,41,0.4)]">
              <span className="relative block h-44 overflow-hidden rounded-2xl" style={{ backgroundColor: cat.tint }}>
                <img src={cat.img} alt={cat.short} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = "none")} />
              </span>
              <div className="flex flex-1 flex-col px-1 pt-4">
                <h3 className="text-[16px] font-bold text-[#0F1729]">{cat.short}</h3>
                <p className="mt-1 line-clamp-2 text-[13px] text-[#667085]">{cat.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0037CA] group-hover:gap-2.5 transition-all">Discover collection <ArrowRight className="h-4 w-4" /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}