import { useCategories } from "../../lib/useCatalog";
import { useBookmarks } from "../../lib/useBookmarks";
import { Tag, Layers, Bookmark } from "lucide-react";

function CategoryCard({ cat }) {
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(cat.slug);

  const toggleBookmark = () =>
    toggle({ slug: cat.slug, short: cat.short, img: cat.img, href: `/category/${cat.slug}` });

  return (
    <div className="flex h-full flex-col rounded-[28px] bg-white p-3 shadow-[0_18px_50px_-22px_rgba(15,23,41,0.30)] ring-1 ring-slate-100">
      <div className="relative overflow-hidden rounded-[22px]" style={{ backgroundColor: cat.tint }}>
        <img src={cat.img} alt={cat.short} loading="lazy" className="h-56 w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4">
        <h3 className="line-clamp-2 text-[24px] font-bold leading-tight tracking-tight text-[#0F1729]">{cat.short}</h3>
        <p className="mt-1 line-clamp-1 text-[15px] text-[#98A2B3]">{cat.blurb ? cat.blurb.split(",")[0] : "Custom printing"}</p>

        <div className="mt-4 flex items-center gap-6 text-[15px] text-[#475467]">
          <span className="inline-flex items-center gap-2">
            <Tag className="h-[18px] w-[18px] text-[#98A2B3]" />
            {cat.items?.length > 0 ? <><span>from</span><b className="text-[#0F1729]">{cat.items.length} types</b></> : <b className="text-[#0F1729]">Custom</b>}
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers className="h-[18px] w-[18px] text-[#98A2B3]" />
            <b className="text-[#0F1729]">Bulk</b>
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-5">
          <a href={`/category/${cat.slug}`} className="flex flex-1 items-center justify-center rounded-full bg-[#0A0E1A] py-4 text-[15px] font-semibold text-white transition hover:bg-[#2F6BFF]">Explore</a>
          <button
            type="button"
            onClick={toggleBookmark}
            aria-label={saved ? "Remove bookmark" : "Bookmark this category"}
            aria-pressed={saved}
            className={`grid h-14 w-14 flex-none place-items-center rounded-full border transition ${saved ? "border-[#2F6BFF] bg-[#2F6BFF] text-white" : "border-slate-200 text-[#2F6BFF] hover:border-[#2F6BFF]"}`}
          >
            <Bookmark className="h-6 w-6" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BusinessProducts() {
  const { categories } = useCategories();
  if (categories.length === 0) return null;
  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8 sm:mb-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#2F6BFF]">For your business</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F1729] sm:text-[40px]">Everything you need, branded</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.slice(0, 8).map((cat) => <CategoryCard key={cat.slug} cat={cat} />)}
        </div>
      </div>
    </section>
  );
}