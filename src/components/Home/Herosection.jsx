const CLAY = "#B05C3C";

const PRODUCTS = [
  {
    src: "/images/visiting_cards.jpg",
    alt: "Visiting Cards",
    bg: "#EDE7E1",
    href: "category/visiting-cards",
  },
  {
    src: "/images/brouchure_design.jpg",
    alt: "Brochure Design",
    bg: "#E8ECEF",
    href: "category/signs-posters",
  },
  {
    src: "/images/letter_head.jpg",
    alt: "Letterheads",
    bg: "#EFE6DE",
    href: "category/stationery",
  },
  {
    src: "/images/sticker&packaging.jpg",
    alt: "Stickers & Packaging",
    bg: "#F0E3DC",
    href: "category/labels-packaging",
  },
  {
    src: "/images/custom_packaging.jpg",
    alt: "Custom Packaging",
    bg: "#ECE6DD",
    href: "category/labels-packaging",
  },
  {
    src: "/images/custom_designs.jpg",
    alt: "Custom Designs",
    bg: "#EDE9E3",
    href: "category/clothing-bags",
  },
];

const AVATARS = [
  { src: "/images/letter_head.jpg", bg: "#C8A98C" },
  { src: "/images/brouchure_design.jpg", bg: "#B67B58" },
  { src: "/images/custom_packaging.jpg", bg: "#D8C1AC" },
];

const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowUpRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M7 17 17 7M8 7h9v9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function HeroSection() {
  return (
    <section className="w-full font-sans">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-10">
        {/* ---------------- image column ---------------- */}
        <div className="relative order-1">
          <div className="relative overflow-hidden rounded-[28px]">
            <img
              src="/images/hero.jpg"
              alt="Two models in contemporary tailored outfits"
              className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[560px]"
            />
          </div>

          {/* testimonial glass card */}
          <div className="absolute bottom-4 right-4 w-[70%] max-w-[300px] rounded-2xl border border-white/30 bg-white/10 p-4 shadow-[0_20px_45px_-25px_rgba(24,16,12,0.5)] ring-1 ring-white/20 backdrop-blur-xl sm:bottom-6 sm:right-6 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a, i) => (
                  <span
                    key={i}
                    className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/80"
                    style={{ backgroundColor: a.bg }}
                  >
                    <img
                      src={a.src}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </span>
                ))}
              </div>
              <span className="grid h-8 min-w-[42px] place-items-center rounded-full px-2 text-[11px] font-bold text-white bg-[#0037ca]">
                15K+
              </span>
            </div>
            <p className="text-[13px] font-medium italic leading-snug text-[#2A2622] sm:text-sm">
              “Design unique products that reflect your brand or personality.
              From business essentials to personalized gifts, we bring your
              ideas to life with precision printing.”
            </p>
          </div>
        </div>

        {/* ---------------- content column ---------------- */}
        <div className="order-2 flex flex-col">
          <h1 className="text-[28px] font-bold text-[#131110] sm:text-[42px] lg:text-[52px]">
            Print Anything <span className="text-[#0037ca]">Personalize</span>{" "}
            Everything.
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#5C554F] sm:mt-6 sm:text-base">
            Bring your ideas to life with premium custom printing for business,
            branding, events, and personal gifts. Design, personalize, and order
            with confidence - all from one trusted platform.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <a
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white bg-[#0037ca] hover:bg-[#0037ca]/80 transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Shop the drop
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/collections"
              className="inline-flex items-center rounded-full border-2 border-[#131110] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#131110] transition hover:bg-[#131110] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#131110]"
            >
              Collections
            </a>
          </div>

          {/* product rail */}
          <div className="mt-9 flex items-center sm:mt-12">
            <div className="flex -space-x-3">
              {PRODUCTS.map((p, i) => (
                <a
                  key={i}
                  href={p.href}
                  aria-label={p.alt}
                  className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border-[3px] border-[#FAF9F7] transition hover:z-10 hover:-translate-y-1 sm:h-16 sm:w-16"
                  style={{ backgroundColor: p.bg }}
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </a>
              ))}
            </div>
            <a
              href="/categories"
              aria-label="View all products"
              className="-ml-3 grid h-14 w-14 place-items-center rounded-full border-[3px] border-[#FAF9F7] text-white transition hover:brightness-95 sm:h-16 sm:w-16 bg-black"
            >
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
