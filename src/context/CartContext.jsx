import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null); // { items, coupon }
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);

  const apply = (data) => {
    setCart(data?.cart || null);
    setTotals(data?.totals || null);
  };

  const refresh = useCallback(async () => {
    if (!user) {
      apply(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      apply(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load the cart whenever the logged-in user changes.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId, quantity = 1, designId = null) => {
    const body = { productId, quantity };
    if (designId) body.designId = designId;
    const { data } = await api.post("/cart", body);
    apply(data);
  };
  const updateItem = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    apply(data);
  };
  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    apply(data);
  };
  const applyCoupon = async (code) => {
    const { data } = await api.post("/cart/coupon", { code });
    apply(data);
  };
  const removeCoupon = async () => {
    const { data } = await api.delete("/cart/coupon");
    apply(data);
  };
  const clearLocal = () => apply(null);

  const count =
    cart?.items?.reduce((n, i) => n + (i.quantity || 0), 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart, totals, loading, count,
        refresh, addToCart, updateItem, removeItem,
        applyCoupon, removeCoupon, clearLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
