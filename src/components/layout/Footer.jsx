import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Globe,
  ChevronDown,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 * Footer — feature strip + brand/links/newsletter + bottom bar.
 * Data-driven: edit FEATURES / COLUMNS / SOCIALS below.
 * Responsive: features 1→2→4 cols, link columns stack on mobile.
 * ------------------------------------------------------------------ */

const FEATURES = [
  { icon: Truck, title: "Fast & Secure Delivery", sub: "Across India, on time." },
  { icon: ShieldCheck, title: "Quality Guarantee", sub: "Premium print, every order." },
  { icon: RotateCcw, title: "Easy Reprints", sub: "Not happy? We redo it." },
  { icon: Headset, title: "Pro Design Support", sub: "Real humans, real help." },
];

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Visiting Cards", href: "/category/visiting-cards" },
      { label: "Stationery", href: "/category/stationery" },
      { label: "Signs & Posters", href: "/category/signs-and-posters" },
      { label: "Clothing & Bags", href: "/category/clothing-and-bags" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Track Order", href: "/track-order" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const SocialIcon = {
  Facebook: (p) => (
    <img src="/images/facebook.svg"/>
  ),
 
  Instagram: (p) => (
    <img src="/images/instagram.svg"/>
  ),
  Linkedin: (p) => (
    <img src="/images/Linkedin.svg"/>
  ),
};

const SOCIALS = [
  { icon: SocialIcon.Facebook, label: "Facebook", href: "https://www.facebook.com/people/SKYUP-Digital-Solutions/61584820941998/" },
  { icon: SocialIcon.Instagram, label: "Instagram", href: "https://www.instagram.com/skyupdigitalsolutions" },
  { icon: SocialIcon.Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/skyup-digital-solutions" },
];

export function Footer() {
  return (
    <footer className="w-full bg-white font-sans">
      {/* ---------- feature strip ---------- */}
      <div className="border-t border-slate-200">
        <div className="mx-auto  px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-[#EAF0FF] text-[#0037CA]">
                  <f.icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[18px] font-bold text-[#0F1729]">{f.title}</p>
                  <p className="text-[14px] text-[#333436]">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- main ---------- */}
      <div className="border-t border-slate-200">
        <div className="mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* brand */}
            <div className="lg:col-span-4">
              <a href="/" className="inline-flex items-center gap-2">
                <img src="/images/logo_skyup.svg" alt="SkyUp" className="w-36" />
              </a>
              <p className="mt-5 max-w- text-[15px] leading-relaxed font-semibold text-justify">
                Premium custom printing for business, branding, events, and
                personal gifts — design, personalize, and order with confidence.
              </p>

              <p className="mt-8 text-[18px] font-bold text-[#0F1729]">
                Follow us on
              </p>
              <div className="mt-3 flex items-center gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-8 w-8 place-items-center"
                  >
                    <s.icon />
                  </a>
                ))}
              </div>
            </div>

            {/* link columns */}
            {COLUMNS.map((col) => (
              <div key={col.heading} className="lg:col-span-2">
                <h3 className="text-[18px] font-bold text-[#0F1729]">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[15px] font-semibold transition hover:text-[#0037CA]"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* newsletter */}
            <div className="md:col-span-4 lg:col-span-6 lg:col-start-11">
              <h3 className="text-[18px] font-bold text-[#0F1729]">
                Subscribe to our Newsletter
              </h3>
              <p className="mt-3 text-[14px] font-medium">
                Get the latest drops, offers, and design tips from SkyUp.
              </p>
              <div className="mt-4 flex overflow-hidden rounded-xl border-2 border-blue-800 focus-within:border-[#0037CA] focus-within:ring-2 focus-within:ring-[#0037CA]/20">
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-white px-3.5 py-3 text-[14px] text-[#0F1729] outline-none placeholder:text-[#98A2B3]"
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  className="flex-none bg-[#0037CA] px-4 text-white transition hover:bg-[#0037CA]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0037CA]"
                >
                  <Send className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- bottom bar ---------- */}
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-5 py-6 text-center md:flex-row md:justify-between md:text-left">

            {/* copyright */}
            <p className="text-[16px] font-semibold text-[#0037CA]">
              © {new Date().getFullYear()} SkyUp Digital Solutions. All rights
              reserved.
            </p>

            {/* payment methods */}
            <div className="flex items-center gap-2.5 text-[#39393a]">
              {["VISA", "MC", "UPI", "RuPay"].map((p) => (
                <span
                  key={p}
                  className="grid h-7 min-w-[42px] place-items-center rounded border border-slate-400 px-1.5 text-[10px] font-bold text-[#475467]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;