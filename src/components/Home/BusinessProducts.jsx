import {
  BookmarkCheckIcon,
  BoxIcon,
  HeartIcon,
  ShoppingCartIcon,
  TagIcon,
} from "lucide-react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const PRODUCTS = [
  { title: "Visiting Cards", subtitle: "Glossy, Premium, Matte & more", img: "/images/visiting_cards.jpg", price: "₹499", meta: "40+ items", href: "/category/visiting-cards" },
  { title: "Custom Stationery", subtitle: "Letterheads, ID Cards & more", img: "/images/stationery.jpg", price: "₹299", meta: "35+ items", href: "/category/stationery-letterhead-and-notebooks" },
  { title: "Stamps & Inks", subtitle: "Self-ink, Pre-ink rubber stamps & more", img: "/images/stamps&inks.jpg", price: "₹199", meta: "28+ items", href: "/category/stamps-and-ink" },
  { title: "Labels & Packaging", subtitle: "products, Packages, Stickers & more", img: "/images/packaging_labels.jpeg", price: "₹349", meta: "50+ items", href: "/category/labels-stickers-and-packaging" },
  { title: "Clothing & Bags", subtitle: "T-shirts, caps, Bags & more", img: "/images/clothing.jpg", price: "₹259", meta: "44+ items", href: "/category/clothing-bags-and-caps" },
  { title: "Mugs, Albums & Gifts", subtitle: "Mugs, Photo Albums, Lamps & more", img: "/images/gifts.webp", price: "₹399", meta: "60+ items", href: "/category/mug-albums-and-gifts"  },
  { title: "Drinkware", subtitle: "Cups, Sippers, Glasses & more", img: "/images/drinkwares.jpg", price: "₹329", meta: "32+ items", href: "/category/drinkware" },
  { title: "Custom Polo T-shirts", subtitle: "Printed, Embroidered, Polyster & more", img: "/images/t-shirts.jpg", price: "₹2799", meta: "38+ items", href: "/category/custom-polo-t-shirts" },
];

export function BusinessProducts() {
  return (
    <section className="w-full bg-[#eeeeee]/40 py-8 sm:py-10">
      <div className="mx-12 px-5 sm:px-8 lg:px-12">
        {/* heading */}
        <div className="mb-8  sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[42px]">
            Find Products for Your Business
          </h2>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="flex flex-col rounded-[20px] border border-slate-100 bg-white p-3 shadow-[0_18px_50px_-24px_rgba(15,23,41,0.28)]"
            >
              {/* image */}
              <div className="overflow-hidden rounded-[20px] bg-slate-100">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-64 w-full object-cover"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                <h3 className="text-[22px] font-bold tracking-tight text-[#141414]">
                  {p.title}
                </h3>
                <p className="mt-1 text-[15px] text-[#98A2B3]">{p.subtitle}</p>

                {/* meta row */}
                <div className="mt-4 flex items-center gap-5 text-[15px]">
                  <span className="flex items-center gap-2 text-[#475467]">
                    <TagIcon className="w-5 h-5" />
                    from{" "}
                    <span className="font-bold text-[#141414]">{p.price}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[#475467]">
                    <BoxIcon />
                    <span className="font-bold text-[#141414]">{p.meta}</span>
                  </span>
                </div>

                {/* actions */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex flex-1 items-center justify-center rounded-full bg-[#0037CA] py-4 text-[15px] font-semibold text-white transition hover:bg-[#2a2a2a]">
                    Discover Collection
                  </span>
                  <button
                    type="button"
                    aria-label={`Save ${p.title}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="grid h-14 w-14 flex-none place-items-center cursor-pointer rounded-full border-2 border-slate-200 text-[#f87613] transition hover:bg-black hover:text-white"
                  >
                    <BookmarkCheckIcon />
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessProducts;
