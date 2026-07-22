import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useData } from "vike-react/useData";              // ← ADD
import { Star, ChevronDown, ImageIcon, UploadCloud, Check } from "lucide-react";
import BrowseDesignsModal from "../../../components/product/BrowseDesignsModal";
import UploadDesignModal from "../../../components/product/UploadDesignModal";
import RelatedProducts from "../../../components/product/RelatedProducts";

const COLORS = [
  { name: "Black", hex: "#1F2937" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Maroon", hex: "#7F1D1D" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Red", hex: "#DC2626" },
  { name: "Royal", hex: "#2563EB" },
  { name: "White", hex: "#F3F4F6" },
  { name: "Green", hex: "#166534" },
  { name: "Teal", hex: "#0D9488" },
  { name: "Sky", hex: "#7DD3FC" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Gold", hex: "#CA8A04" },
];

function Stars({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = () =>
    [0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-4 w-4 flex-none" fill="currentColor" />
    ));
  return (
    <span
      className="relative inline-flex"
      role="img"
      aria-label={`${value} out of 5`}
    >
      <span className="flex text-slate-300">{row()}</span>
      <span
        className="absolute inset-0 flex overflow-hidden text-[#F5A623]"
        style={{ width: `${pct}%` }}
      >
        {row()}
      </span>
    </span>
  );
}

function Accordion({ title }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-slate-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold text-[#0F1729]"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 text-[#98A2B3] transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden text-[14px] text-[#667085] transition-all ${open ? "max-h-40 pb-4" : "max-h-0"}`}
      >
        Detailed information for “{title}” goes here — dimensions, material, and
        print guidelines.
      </div>
    </div>
  );
}

function Gallery({ gallery, title }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-2 sm:flex-col">
        {gallery.slice(0, 6).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`h-14 w-14 flex-none overflow-hidden rounded-lg border-2 transition ${active === i ? "border-[#0037CA]" : "border-slate-200"}`}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-2xl ">
        <img
          src={gallery[active]}
          alt={title}
          className="aspect-square w-full object-cover"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
        />
      </div>
    </div>
  );
}

export default function Page() {
  const { routeParams } = usePageContext();
  const { product, related } = useData();

  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [design, setDesign] = useState(null);

  if (!product) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0F1729]">Product not found</h1>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to home
        </a>
      </section>
    );
  }

  const gallery = product.gallery || [
    product.img,
    product.img,
    product.img,
    product.img,
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12">
        <nav className="mb-5 text-[13px] text-[#98A2B3]">
          <a href="/" className="hover:text-[#0037CA]">
            Home
          </a>
          <span className="mx-1.5">/</span>
          <a
            href={`/category/${product.category}`}
            className="hover:text-[#0037CA]"
          >
            {product.sub}
          </a>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery gallery={gallery} title={product.title} />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[30px]">
              {product.title}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <Stars value={product.rating} />
              <span className="text-[14px] text-[#475467]">
                {product.rating}{" "}
                <span className="text-[#98A2B3] underline">(215)</span>
              </span>
            </div>

            <p className="mt-4 border-b border-slate-200 pb-4 text-[15px] text-[#475467]">
              Customise with your name and logo to create a professional
              impression.
            </p>

            <div className="mt-4">
              <p className="text-[13px] text-[#98A2B3]">
                Price below is MRP (inclusive of all taxes)
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#0F1729]">
                  ₹{product.price}.00
                </span>
                <span className="text-[#B0B7C3] line-through">
                  ₹{product.mrp}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#98A2B3]">
                {qty} unit · No setup fee
              </p>
            </div>

            <div className="mt-6">
              <p className="text-[14px] font-semibold text-[#0F1729]">
                Substrate Color
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(i)}
                    aria-label={c.name}
                    className={`h-7 w-7 rounded-full ring-offset-2 transition ${color === i ? "ring-2 ring-[#0037CA]" : "ring-1 ring-black/10"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[14px] font-semibold text-[#0F1729]">
                Quantity
              </p>
              <div className="mt-2 flex w-full max-w-xs items-center justify-between rounded-lg border border-slate-300 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-lg font-bold text-[#475467]"
                >
                  −
                </button>
                <span className="text-[14px] font-medium text-[#0F1729]">
                  {qty} (₹{product.price}.00 / unit)
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="text-lg font-bold text-[#475467]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setBrowseOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7DD3FC] py-3.5 text-[15px] font-semibold text-[#0F1729] transition hover:brightness-95"
              >
                <ImageIcon className="h-5 w-5" /> Browse designs
              </button>
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 py-3.5 text-[15px] font-semibold text-[#0F1729] transition hover:border-[#0037CA] hover:text-[#0037CA]"
              >
                <UploadCloud className="h-5 w-5" /> Upload design
              </button>
              {product.customizable && (
                <a
                  href={`/customize/${product.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0037CA] py-3.5 text-[15px] font-semibold text-white transition hover:bg-black"
                >
                  Customize this product
                </a>
              )}

              {design && (
                <div className="flex items-center gap-3 rounded-lg bg-[#ECFDF5] px-4 py-3">
                  {design.preview ? (
                    <img
                      src={design.preview}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0037CA] text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#065F46]">
                      Design added
                    </p>
                    <p className="truncate text-[12px] text-[#047857]">
                      {design.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDesign(null)}
                    className="ml-auto text-[13px] font-semibold text-[#0037CA]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Accordion title="Specs & Templates" />
              <Accordion title="Sizes & Dimensions" />
            </div>
          </div>
        </div>
      </div>
      <RelatedProducts items={related} category={product.category} />
      <BrowseDesignsModal
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        onSelect={(d) => setDesign({ type: "template", label: d.name })}
      />
      <UploadDesignModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(u) =>
          setDesign({ type: "upload", label: u.name, preview: u.preview })
        }
      />
    </section>
  );
}
