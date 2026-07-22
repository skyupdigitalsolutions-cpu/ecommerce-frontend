import { useBookmarks } from "../../lib/useBookmarks";
import { Bookmark, Trash2 } from "lucide-react";

export default function Page() {
  const { items, ready, remove } = useBookmarks();

  if (ready && items.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8 lg:px-12">
        <Bookmark className="mx-auto h-14 w-14 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-[#0F1729]">No bookmarks yet</h1>
        <p className="mt-2 text-[#667085]">Tap the bookmark icon on a category to save it here.</p>
        <a href="/categories" className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">Browse categories</a>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
        <nav className="mb-4 text-[13px] text-[#98A2B3]"><a href="/" className="hover:text-[#0037CA]">Home</a><span className="mx-1.5">/</span><span className="text-[#475467]">Saved</span></nav>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[32px]">Saved categories</h1>
        <p className="mt-2 text-[15px] text-[#667085]">{items.length} saved</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {items.map((b) => (
            <div key={b.slug} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 transition hover:shadow-[0_22px_50px_-24px_rgba(15,23,41,0.4)]">
              <a href={b.href} className="block">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F2F1EE]">
                  <img src={b.img} alt={b.short} className="h-full w-full object-cover transition group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
                <h3 className="mt-3 truncate px-1 text-[14px] font-bold text-[#0F1729]" title={b.short}>{b.short}</h3>
              </a>
              <button type="button" onClick={() => remove(b.slug)} aria-label="Remove bookmark" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#98A2B3] shadow-sm transition hover:text-[#DC2626]">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}