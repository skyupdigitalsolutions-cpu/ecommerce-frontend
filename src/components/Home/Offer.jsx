import { Tag } from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------ *
 * OfferBanner — full-width promotional strip.
 * Dark field + tag icon + headline on the left, dashed coupon chip on
 * the right. Confetti ticks are decorative. Click the code to copy.
 * Tweak the OFFER object to change copy / code / colours.
 * ------------------------------------------------------------------ */

const OFFER = {
  eyebrow: "Exclusive offer just for you!",
  headline: "GET 15% OFF",
  sub: "On your next order",
  codeLabel: "Use code:",
  code: "WELCOME15",
  fine: "Offer valid for the next 7 days only.",
  href: "/shop",
};

/* decorative confetti ticks — {x,y} in %, r = rotation, big = long dash */
const CONFETTI = [
  { x: 4, y: 30, r: 24, big: true },
  { x: 3, y: 78, r: 20, big: true },
  { x: 6, y: 55, r: 0, big: false },
  { x: 41, y: 18, r: 28, big: true },
  { x: 45, y: 82, r: 22, big: true },
  { x: 62, y: 42, r: 0, big: false },
  { x: 66, y: 88, r: 0, big: false },
  { x: 95, y: 34, r: 24, big: true },
  { x: 96, y: 62, r: 0, big: false },
];

export function Offers() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(OFFER.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  };

  return (
    <section className="w-full bg-white py-8 sm:py-10">
      <div className=" px-5 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl bg-[#051c5a] px-5 py-6 sm:px-10 sm:py-8">
          {/* confetti */}
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute rounded-full ${
                c.big ? "h-[3px] w-4 bg-[#E4A02C]" : "h-1.5 w-1.5 bg-white/70"
              }`}
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: `translate(-50%, -50%) rotate(${c.r}deg)`,
              }}
            />
          ))}

          {/* content */}
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:gap-8 sm:text-left">
            {/* left: icon + headline */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Tag
                className="h-14 w-14 flex-none -rotate-12 fill-white text-[#f79227] sm:h-20 sm:w-20"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 sm:text-[13px]">
                  {OFFER.eyebrow}
                </p>
                <h2 className="mt-1 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {OFFER.headline}
                </h2>
                <p className="mt-1 text-[15px] text-white/85 sm:text-lg">
                  {OFFER.sub}
                </p>
              </div>
            </div>

            {/* right: coupon chip */}
            <div className="flex flex-none flex-col items-center gap-2">
              <button
                type="button"
                onClick={copyCode}
                aria-label={`Copy code ${OFFER.code}`}
                className="group rounded-lg border-2 border-dashed border-white/50 px-6 py-3 text-center transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-10 sm:py-4 cursor-pointer"
              >
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-[11px]">
                  {OFFER.codeLabel}
                </span>
                <span className="mt-0.5 block text-lg font-extrabold tracking-wide text-white sm:text-2xl">
                  {copied ? "Copied!" : OFFER.code}
                </span>
              </button>
              <p className="text-[11px] text-white/60 sm:text-[12px]">
                {OFFER.fine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Offers;