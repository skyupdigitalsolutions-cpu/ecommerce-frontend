import { useState } from "react";
import { Headset, Search } from "lucide-react";
import { useCategories } from "../../lib/useCatalog";
import { useCart } from "../../lib/cart";

/* ------------------------------------------------------------------ *
 * Inline SVG icons
 * ------------------------------------------------------------------ */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const Ic = {
  Bag: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" {...stroke} strokeWidth="2.4" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};

const NAV_LABELS = {
  "stationery-letterhead-and-notebooks": "Stationery",
  "signs-posters-and-marketing-materials": "Signs & Posters",
  "labels-stickers-and-packaging": "Labels & Packaging",
  "clothing-bags-and-caps": "Clothing & Bags",
  "mug-albums-and-gifts": "Mugs & Gifts",
  "stamps-and-ink": "Stamps & Ink",
  "custom-polo-t-shirts": "Polo T-Shirts",
};

export function Header() {
  const { categories: CATEGORIES } = useCategories();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState(null); // mobile accordion
  const { count } = useCart();
  return (
    <div className="contents font-sans">
      {/* ---------- announcement bar ---------- */}
      <div className="flex items-center justify-center bg-[#0A0E1A] px-4 py-2.5 text-center text-[12px] lg:text-[14px]">
        <span className="font-semibold text-white">
          Summer drop is live —&nbsp;
        </span>
        <a href="#" className="font-medium text-[#5B8DEF] hover:text-[#7BA4F2]">
          free shipping on orders over $75
        </a>
        <a
          href="#"
          className="ml-2 hidden font-semibold text-white hover:opacity-80 sm:inline"
        >
          Shop now →
        </a>
      </div>

      {/* ---------- main bar ---------- */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-4 flex items-center gap-4 py-2 lg:mx-10 lg:gap-10">
          {/* logo */}
          <a href="/">
            <img
              src="/images/logo_skyup.svg"
              alt="SkyUp"
              className="w-28 lg:w-42"
            />
          </a>

          {/* search (desktop) */}
          <div className="hidden flex-1 items-center overflow-hidden rounded-full bg-gray-200/60 focus-within:bg-gray-200 lg:flex">
            <input
              type="text"
              placeholder="Search products, categories…"
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[15px] text-[#0F1729] outline-none placeholder:text-[#98A2B3]"
            />
            <button className="hidden flex-none bg-[#f9942f] px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer  sm:block">
              <Search />
            </button>
          </div>

          {/* spacer pushes actions to the right on mobile (search fills this role on desktop) */}
          <div className="flex-1 lg:hidden" />

          <a
            href="tel:+919876543210"
            className="hidden flex-none items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 lg:flex"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EAF0FF] text-[#2F6BFF]">
              <Headset size={20} />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-[#98A2B3]">
                Help is here
              </span>
              <span className="block text-[15px] font-bold text-[#0F1729]">
                +91 98765 43210
              </span>
            </span>
          </a>

          {/* account */}
          <a
            href="/account"
            className="hidden flex-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#0F1729] transition hover:bg-slate-100 sm:flex"
          >
            <Ic.User width="20" height="20" />
            <span className="hidden lg:inline">Account</span>
          </a>

          {/* cart */}
          <a
            href="/cart"
            className="relative flex flex-none items-center gap-2 rounded-lg px-3 py-2 ..."
          >
            <span className="relative">
              <Ic.Bag width="22" height="22" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#2F6BFF] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden lg:inline">Cart</span>
          </a>

          {/* hamburger (mobile / tablet) */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 flex-none place-items-center rounded-lg text-[#0F1729] transition hover:bg-slate-100 lg:hidden"
          >
            <Ic.Menu width="24" height="24" />
          </button>
        </div>
      </div>

      {/* ---------- search (mobile / tablet) ---------- */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center overflow-hidden rounded-full border border-slate-300 bg-white focus-within:border-[#2F6BFF] focus-within:ring-2 focus-within:ring-[#2F6BFF]/20">
          <span className="pl-3.5 text-[#98A2B3]">
            <Ic.Search width="19" height="19" />
          </span>
          <input
            type="text"
            placeholder="Search products, categories…"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[15px] text-[#0F1729] outline-none placeholder:text-[#98A2B3]"
          />
          <button
            aria-label="Search"
            className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#0A0E1A] text-white transition hover:bg-[#1a2030] mr-1"
          >
            <Ic.Search width="18" height="18" />
          </button>
        </div>
      </div>

      {/* ---------- category nav (desktop) ---------- */}
      <nav className="hidden border-b border-slate-200 bg-white lg:block ">
        <div className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-x-2 px-6">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.slug} className="group relative">
              <a
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1 border-b-2 border-transparent px-3 py-3 text-[16px] font-semibold text-[#344054] transition group-hover:border-[#2F6BFF] group-hover:text-[#2F6BFF]"
              >
                {NAV_LABELS[cat.slug] || cat.short}
                <Ic.Chevron
                  width="14"
                  height="14"
                  className="text-[#98A2B3] transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#2F6BFF]"
                />
              </a>

              {/* dropdown */}
              <div
                className={`invisible absolute top-full z-50 pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 ${
                  i >= CATEGORIES.length / 2 ? "right-0" : "left-0"
                }`}
              >
                <div className="min-w-[240px] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_20px_45px_-20px_rgba(16,24,40,0.35)]">
                  <div
                    className={
                      cat.items.length > 6
                        ? "grid grid-cols-2 gap-x-2"
                        : "flex flex-col"
                    }
                  >
                    {cat.items.map((it) => (
                      <a
                        key={it}
                        href={`/category/${cat.slug}?sub=${encodeURIComponent(it)}`}
                        className="rounded-lg px-3 py-2 text-[14px] text-[#344054] transition hover:bg-[#F4F6FA] hover:text-[#2F6BFF]"
                      >
                        {it}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* ---------- mobile drawer ---------- */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[330px] max-w-[86vw] flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <a href="/" onClick={() => setDrawerOpen(false)}>
            <img src="/images/logo_skyup.svg" alt="SkyUp" className="w-28" />
          </a>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
            className="text-[#0F1729]"
          >
            <Ic.Close width="22" height="22" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <a
            href="/account"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-[#0F1729]"
          >
            <Ic.User width="18" height="18" /> Account
          </a>
          <a
            href="/cart"
            className="relative flex items-center gap-2 rounded-lg bg-[#0A0E1A] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Ic.Bag width="18" height="18" /> Cart
            {count > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-[#2F6BFF] px-1 text-[11px] font-bold">
                {count}
              </span>
            )}
          </a>
        </div>

        <nav className="flex-1 overflow-y-auto py-1">
          {CATEGORIES.map((cat) => {
            const open = openAcc === cat.slug;
            return (
              <div key={cat.slug} className="border-b border-slate-100">
                <div className="flex items-center justify-between px-5">
                  <a
                    href={`/category/${cat.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="flex-1 py-3.5 text-left text-[15px] font-semibold text-[#0F1729]"
                  >
                    {cat.name}
                  </a>
                  <button
                    onClick={() => setOpenAcc(open ? null : cat.slug)}
                    aria-label={`Toggle ${NAV_LABELS[cat.slug] || cat.short}`}
                    className="p-2"
                  >
                    <Ic.Chevron
                      width="18"
                      height="18"
                      className={`text-[#98A2B3] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}
                >
                  <div className="flex flex-col pb-2">
                    {cat.items.map((it) => (
                      <a
                        key={it}
                        href={`/category/${cat.slug}?sub=${encodeURIComponent(it)}`}
                        onClick={() => setDrawerOpen(false)}
                        className="px-8 py-2 text-[14px] text-[#667085] hover:text-[#2F6BFF]"
                      >
                        {it}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

export default Header;
