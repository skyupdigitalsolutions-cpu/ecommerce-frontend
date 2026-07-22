import { Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 4000; // set to 0 to disable autoplay

const BANNERS = [
  {
    title: "Preserve your cherished moments",
    priceFrom: "Rs 650",
    img: "/images/poster-banner.webp",
    tags: [
      { label: "Custom Photo Albums", href: "/category/mug-albums-and-gifts" },
      { label: "Mugs", href: "/category/mug-albums-and-gifts" },
      {
        label: "Canvas Prints",
        href: "/category/signs-posters-and-marketing-materials",
      },
    ],
  },
  {
    title: "Wear your brand with pride",
    priceFrom: "Rs. 320",
    img: "/images/wear-your-brand.jpg",
    tags: [
      {
        label: "Custom Posters",
        href: "/category/signs-posters-and-marketing-materials",
      },
      { label: "Custom T-shirts", href: "/category/clothing-bags-and-caps" },
      { label: "Caps", href: "/category/clothing-bags-and-caps" },
    ],
  },
  {
    title: "Stand out at every event",
    priceFrom: "Rs 199",
    img: "/images/standies-banner.jpg",
    tags: [
      {
        label: "Banners",
        href: "/category/signs-posters-and-marketing-materials",
      },
      {
        label: "Standees",
        href: "/category/signs-posters-and-marketing-materials",
      },
      {
        label: "Flyers",
        href: "/category/signs-posters-and-marketing-materials",
      },
    ],
  },
  {
    title: "Sip in style, every day",
    priceFrom: "Rs 249",
    img: "/images/drinkwares-banner.webp",
    tags: [
      { label: "Water Bottles", href: "/category/drinkware" },
      { label: "Tumblers", href: "/category/drinkware" },
      { label: "Sippers", href: "/category/drinkware" },
    ],
  },
];

const N = BANNERS.length;
const COPIES = [0, 1, 2]; // triple the set for seamless looping

const ArrowLeft = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PromoBanners() {
  const railRef = useRef(null);
  const stepRef = useRef(0); // px between consecutive slides
  const shiftRef = useRef(0); // px width of one full copy (N slides)
  const settleRef = useRef(null);
  const [active, setActive] = useState(0);

  // measure geometry and park scroll in the middle copy
  const measure = () => {
    const el = railRef.current;
    if (!el || el.children.length < 2) return;
    const step = el.children[1].offsetLeft - el.children[0].offsetLeft;
    if (!step) return;
    stepRef.current = step;
    shiftRef.current = step * N;
    el.scrollLeft = shiftRef.current; // start of the middle copy
    setActive(0);
  };

  useEffect(() => {
    // wait a frame so layout (and responsive basis) is settled
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // after any scroll stops, snap back into the middle copy invisibly
  const normalize = () => {
    const el = railRef.current;
    const shift = shiftRef.current;
    const step = stepRef.current;
    if (!el || !shift || !step) return;
    if (el.scrollLeft >= 2 * shift) el.scrollLeft -= shift;
    else if (el.scrollLeft < shift) el.scrollLeft += shift;
  };

  const onScroll = () => {
    const el = railRef.current;
    const step = stepRef.current;
    if (!el || !step) return;
    const idx = Math.round(el.scrollLeft / step);
    setActive(((idx % N) + N) % N);
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(normalize, 120);
  };

  const move = (dir) => {
    const el = railRef.current;
    if (!el || !stepRef.current) return;
    el.scrollBy({ left: dir * stepRef.current, behavior: "smooth" });
  };

  const goTo = (i) => {
    const el = railRef.current;
    if (!el || !stepRef.current) return;
    el.scrollTo({
      left: shiftRef.current + i * stepRef.current,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!AUTOPLAY_MS) return;
    const id = setInterval(() => move(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full bg-white py-8 sm:py-8">
      <div className="px-5 sm:px-8 lg:px-12">
        <div className="relative">
          {/* rail */}
          <div
            ref={railRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto lg:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {COPIES.map((copy) =>
              BANNERS.map((b) => (
                <article
                  key={`${copy}-${b.title}`}
                  aria-hidden={copy !== 1}
                  className="relative basis-full flex-none snap-start overflow-hidden rounded-tr-4xl rounded-bl-4xl bg-slate-100 lg:basis-[calc((100%-1rem)/2)]"
                >
                  {/* background image */}
                  <img
                    src={b.img}
                    alt={b.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.style.visibility = "hidden")
                    }
                  />

                  {/* content panel */}
                  <div className="relative flex min-h-[400px] items-end p-5 sm:min-h-[480px] sm:p-8">
                    <div className="w-[68%] max-w-[400px] rounded-3xl bg-white/75 p-3 shadow-[0_20px_45px_-25px_rgba(15,23,41,0.4)] ring-1 ring-white/40 backdrop-blur-xl sm:p-4">
                      <h3 className="text-[18px] font-bold leading-tight tracking-tight text-[#131110] sm:text-[32px]">
                        {b.title}
                      </h3>

                      <p className="mt-3 flex items-center gap-1.5 text-[14px] text-[#46423f] sm:text-[15px]">
                        <Tag className="h-4 w-4 text-[#0037CA]" />
                        Starting at{" "}
                        <span className="font-semibold text-[#131110]">
                          {b.priceFrom}
                        </span>
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                        {b.tags.map((t) => (
                          <a
                            key={t.label}
                            href={t.href}
                            tabIndex={copy === 1 ? 0 : -1}
                            className="rounded-xl bg-[#0A0E1A] px-2 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#0037CA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0037CA] sm:px-3 sm:text-[14px] lg:py-2"
                          >
                            {t.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )),
            )}
          </div>

          {/* arrows */}
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-[#0F1729] shadow-md backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0037CA] cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-[#0F1729] shadow-md backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0037CA] cursor-pointer"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PromoBanners;
