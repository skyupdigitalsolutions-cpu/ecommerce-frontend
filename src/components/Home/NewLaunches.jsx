import { useRef } from "react";

/* ------------------------------------------------------------------ *
 * NewLaunches — "New Launches"
 * Elevated take on the reference card:
 *   gradient deal badge + "NEW" tag → tinted image tile with
 *   hover zoom → centered name → hover-reveal "Shop now →".
 *
 * Snap carousel: 5 per view on lg, arrows + native swipe.
 * Swap `img`/`href` for real assets & routes.
 * ------------------------------------------------------------------ */

const ArrowLeft = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Spark = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2l1.6 4.9L18.5 8l-4.9 1.6L12 14.5l-1.6-4.9L5.5 8l4.9-1.1L12 2Z" />
    <path d="M19 13l.8 2.4L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.6L19 13Z" />
  </svg>
);

const LAUNCHES = [
  { name: "Custom Tissue Paper", deal: "Buy 150 Pkt @ ₹6372", img: "/images/custom-tissue-paper.jpg", tint: "#F3F1FA", href: "/product/custom-tissue-paper" },
  { name: "Premium Finish Stationery", deal: "Buy 100 @ ₹4130", img: "/images/stationery.jpg", tint: "#EEF2FF", href: "/product/premium-finish-stationery" },
  { name: "Premium Business Stationery", deal: "Buy 100 @ ₹4720", img: "/images/premium-stationary.jpg", tint: "#F0F9FF", href: "/product/premium-business-stationery" },
  { name: "Premium Sipper Bottles", deal: "Buy 1 @ ₹329", img: "/images/premium-sipper.jpg", tint: "#F5F3FF", href: "/product/premium-sipper-bottles" },
  { name: "Pocket Photo Album", deal: "Buy 1 @ ₹500", img: "/images/acrylic-photo.jpg", tint: "#FDF4FF", href: "/product/pocket-photo-album" },
  { name: "Men's Polo T-shirt", deal: "Buy 1 @ ₹499", img: "/images/custom-printed-tee.jpg", tint: "#FEF2F2", href: "/product/mens-polo-tshirt" },
  { name: "Magic Photo Mug", deal: "Buy 1 @ ₹399", img: "/images/printed_mug.jpg", tint: "#ECFDF5", href: "/product/magic-photo-mug" },
  { name: "Foil Visiting Cards", deal: "Buy 100 @ ₹899", img: "/images/visiting_cards.jpg", tint: "#FFF7ED", href: "/product/foil-visiting-cards" },
];

export function NewLaunches() {
  const railRef = useRef(null);

  const scroll = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className="mx-12 px-5 sm:px-8 lg:px-12">
        {/* heading + arrows */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-widest text-[#0037CA]">
              <Spark className="h-4 w-4" /> Just dropped
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[42px]">
              New Launches
            </h2>
          </div>
          <div className="flex flex-none items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-[#0F1729] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-[#0F1729] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* carousel rail */}
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {LAUNCHES.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="group flex shrink-0 basis-[78%] snap-start flex-col sm:basis-[46%] md:basis-[31%] lg:basis-[calc((100%-5rem)/5)]"
            >
              {/* image tile */}
              <div
                className="relative overflow-hidden rounded-3xl p-4 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_-24px_rgba(15,23,41,0.35)]"
                style={{ backgroundColor: p.tint }}
              >
                {/* deal badge */}
                <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-[#0037CA] to-[#7C3AED] px-3 py-1.5 text-[12px] font-bold text-white shadow-md">
                  {p.deal}
                </span>
                {/* NEW tag */}
                <span className="absolute right-3 top-3 z-10 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] shadow-sm backdrop-blur">
                  New
                </span>

                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                  />
                </div>
              </div>

              {/* name + hover CTA */}
              <div className="px-1 pt-4 text-center">
                <h3 className="text-[16px] font-bold text-[#141414] transition group-hover:text-[#0037CA]">
                  {p.name}
                </h3>
                <span className="mt-1 inline-block text-[13px] font-semibold text-[#0037CA] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Shop now →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewLaunches;