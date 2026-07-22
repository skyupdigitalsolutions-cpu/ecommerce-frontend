import { useCart } from "../../lib/cart";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function Page() {
  const { items, removeItem, setQty, clear, subtotal, count, hydrated } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8 lg:px-12">
        <ShoppingBag className="mx-auto h-14 w-14 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-[#0F1729]">Your cart is empty</h1>
        <p className="mt-2 text-[#667085]">Browse our products and add something you like.</p>
        <a href="/categories" className="mt-6 inline-block rounded-full bg-[#0037CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">Start shopping</a>
      </section>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12">
        <nav className="mb-4 text-[13px] text-[#98A2B3]"><a href="/" className="hover:text-[#0037CA]">Home</a><span className="mx-1.5">/</span><span className="text-[#475467]">Cart</span></nav>
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F1729] sm:text-[32px]">Shopping cart</h1>
          <span className="text-[14px] text-[#667085]">{count} {count === 1 ? "item" : "items"}</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 p-4">
                <a href={`/product/${it.slug}`} className="h-24 w-24 flex-none overflow-hidden rounded-xl bg-[#F2F1EE]">
                  <img src={it.img} alt={it.title} className="h-full w-full object-contain" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                </a>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <a href={`/product/${it.slug}`} className="text-[15px] font-bold text-[#1F2937] hover:text-[#0037CA]">{it.title}</a>
                    <button type="button" onClick={() => removeItem(it.id)} aria-label="Remove" className="flex-none text-[#98A2B3] transition hover:text-[#DC2626]"><Trash2 className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-1 text-[14px]"><span className="font-bold text-[#111827]">₹{it.price}</span>{it.mrp > it.price && <span className="ml-2 text-[#B0B7C3] line-through">₹{it.mrp}</span>}</div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-slate-200">
                      <button type="button" onClick={() => setQty(it.id, it.qty - 1)} aria-label="Decrease" className="grid h-9 w-9 place-items-center text-[#475467] hover:text-[#0037CA]"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center text-[14px] font-semibold">{it.qty}</span>
                      <button type="button" onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center text-[#475467] hover:text-[#0037CA]"><Plus className="h-4 w-4" /></button>
                    </div>
                    <span className="text-[15px] font-bold text-[#0F1729]">₹{it.price * it.qty}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end p-4">
              <button type="button" onClick={clear} className="text-[13px] font-semibold text-[#DC2626] hover:underline">Clear cart</button>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 p-6">
            <h2 className="text-[17px] font-bold text-[#0F1729]">Order summary</h2>
            <div className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between"><span className="text-[#667085]">Subtotal</span><span className="font-semibold text-[#0F1729]">₹{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-[#667085]">Shipping</span><span className="font-semibold text-[#0F1729]">Calculated at checkout</span></div>
            </div>
            <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-[16px] font-bold text-[#0F1729]"><span>Total</span><span>₹{subtotal}</span></div>
            <button type="button" className="mt-6 w-full rounded-full bg-[#0037CA] py-3.5 text-[15px] font-semibold text-white transition hover:bg-black">Proceed to checkout</button>
            <a href="/categories" className="mt-3 block text-center text-[13px] font-semibold text-[#0037CA] hover:underline">Continue shopping</a>
          </aside>
        </div>
      </div>
    </section>
  );
}