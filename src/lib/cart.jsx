import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "skyup_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const addItem = useCallback((product, qty = 1) => {
    if (!product) return;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === product.id);
      if (i !== -1) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { id: product.id, slug: product.slug, title: product.title, img: product.img, price: product.price, mrp: product.mrp, qty }];
    });
  }, []);

  const removeItem = useCallback((id) => setItems((p) => p.filter((x) => x.id !== id)), []);
  const setQty = useCallback((id, qty) => setItems((p) => p.map((x) => x.id === id ? { ...x, qty: Math.max(1, qty) } : x)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, x) => n + x.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, x) => s + x.price * x.qty, 0), [items]);

  const value = useMemo(() => ({ items, addItem, removeItem, setQty, clear, count, subtotal, hydrated }),
    [items, addItem, removeItem, setQty, clear, count, subtotal, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}