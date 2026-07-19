import { CATEGORIES, categoryHref } from "../../data/catalog";

/* ------------------------------------------------------------------ *
 * Categories — "Explore all categories"
 * Horizontal image rail: photo thumbnails in tinted circles + labels.
 * - Mobile/tablet: horizontal swipe scroll
 * - lg+: single 10-across row
 * Data comes from the shared catalog, so each circle links to its
 * /category/<slug> page.
 * ------------------------------------------------------------------ */

export function Categories() {
  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="mx-12 px-5 sm:px-8 lg:px-12">
        {/* heading */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-[12px] lg:text-[14px] font-bold uppercase tracking-widest text-[#2F6BFF]">
              Browse
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[42px]">
              Explore all categories
            </h2>
          </div>
         
        </div>

        {/* rail */}
        <ul
          className="flex gap-2 overflow-x-auto pb-3 lg:grid lg:grid-cols-10 lg:gap-3 lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <li key={cat.slug} className="flex-none">
              <a
                href={categoryHref(cat.slug)}
                className="group flex w-28 flex-col items-center gap-3 rounded-xl px-1 py-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF]/40 sm:w-32 lg:w-full"
              >
                {/* SIZE: bump these h-/w- values to resize every circle */}
                <span
                  className="grid h-24 w-24 place-items-center overflow-hidden rounded-full ring-1 ring-black/5 transition duration-200 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-[#2F6BFF]/40 sm:h-28 sm:w-28"
                  style={{ backgroundColor: cat.tint }}
                >
                  <img
                    src={cat.img}
                    alt={cat.short}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </span>
                <span className="text-[14px] font-medium leading-tight text-[#344054] transition group-hover:text-[#2F6BFF]">
                  {cat.short}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Categories;