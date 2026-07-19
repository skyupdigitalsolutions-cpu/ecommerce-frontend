import { ShoppingCartIcon } from "lucide-react";
import { useRef } from "react";

const GREEN = "#1C3D2B";

const Star = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95L12 2.5Z" />
  </svg>
);

/* fractional star rating: grey row underneath, gold row clipped to % */
function Stars({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = (cls) =>
    [0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className={`h-4 w-4 flex-none ${cls}`} />
    ));
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <span className="flex text-slate-300">{row("")}</span>
      <span
        className="absolute inset-0 flex overflow-hidden text-[#F5A623]"
        style={{ width: `${pct}%` }}
      >
        {row("")}
      </span>
    </span>
  );
}

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

const PRODUCTS = [
  {
    title: "Premium Visiting Cards",
    img: "/images/visiting_cards.jpg",
    rating: 4.8,
    price: "₹299",
    original: "₹499",
    href: "/product/visiting-cards",
  },
  {
    title: "Custom Photo Mug",
    img: "/images/printed_mug.jpg",
    rating: 4.9,
    price: "₹249",
    original: "₹399",
    href: "/product/photo-mug",
  },
  {
    title: "Vinyl Sticker Pack",
    img: "/images/custom-sticker.jpg",
    rating: 4.7,
    price: "₹149",
    original: "₹249",
    href: "/product/vinyl-stickers",
  },
  {
    title: "Cotton Tote Bag",
    img: "/images/tote-bag.jpg",
    rating: 4.6,
    price: "₹199",
    original: "₹329",
    href: "/product/tote-bag",
  },
  {
    title: "Metal Business Pen",
    img: "/images/custom_pens.jpg",
    rating: 4.8,
    price: "₹179",
    original: "₹299",
    href: "/product/metal-pen",
  },
  {
    title: "Acrylic Photo Frame",
    img: "/images/acrylic-photo.jpg",
    rating: 4.7,
    price: "₹349",
    original: "₹549",
    href: "/product/photo-frame",
  },
  {
    title: "Custom Printed Tee",
    img: "/images/custom-printed-tee.jpg",
    rating: 4.9,
    price: "₹399",
    original: "₹649",
    href: "/product/custom-tshirt",
  },
  {
    title: "Foil Letterhead",
    img: "/images/letter_head.jpg",
    rating: 4.5,
    price: "₹259",
    original: "₹429",
    href: "/product/foil-letterhead",
  },
  {
    title: "Insulated Water Bottle",
    img: "/images/insulated-water-bottle.jpg",
    rating: 4.8,
    price: "₹329",
    original: "₹499",
    href: "/product/water-bottle",
  },
  {
    title: "Die-cut Hang Tags",
    img: "/images/die-cut-tag.jpg",
    rating: 4.6,
    price: "₹129",
    original: "₹219",
    href: "/product/hang-tags",
  },
];

export function DiscoverTrending() {
  const railRef = useRef(null);

  const scroll = (dir) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-14 sm:py-12">
      <div className="mx-12 px-5 sm:px-8 lg:px-12">
        {/* heading + arrows */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-[12px] lg:text-[14px] font-bold uppercase tracking-widest text-[#2F6BFF]">
              Trending now
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[42px]">
              Discover What&apos;s Trending
            </h2>
          </div>
          <div className="flex flex-none items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-[#0F1729] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6BFF]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-[#0F1729] transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6BFF]"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* carousel rail */}
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PRODUCTS.map((p) => (
            <article
              key={p.title}
              className="flex shrink-0 basis-[78%] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition sm:basis-[46%] md:basis-[30.5%] lg:basis-[calc((100%-5rem)/6)]"
            >
              {/* image tile */}
              <div className="bg-[#F2F1EE]">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col  px-3 pb-4 pt-3 text-center">
                <h3 className="text-[14px] lg:text-[16px] font-bold text-[#1F2937]">
                  {p.title}
                </h3>

                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  <Stars value={p.rating} />
                  <span className="text-[13px] text-[#98A2B3]">
                    ({p.rating})
                  </span>
                </div>

                <div className="mt-1.5 text-[15px]">
                  <span className="font-bold text-[#111827]">{p.price}</span>
                  <span className="ml-2 text-[#B0B7C3] line-through">
                    {p.original}
                  </span>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <a
                    href={p.href}
                    className="mt-3 inline-block rounded-full px-6 py-3 text-[14px] font-bold  text-white hover:bg-black transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-[#0037CA]"
                  >
                    Shop now
                  </a>
                  <a
                    href={p.href}
                    className="mt-3 inline-block px-3 py-3 text-[12px] font-bold rounded-full border-2 border-slate-200 text-[#f87613] hover:text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-black"
                  >
                    <ShoppingCartIcon />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DiscoverTrending;
