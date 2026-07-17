import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { errMsg } from "../api/client";
import { sellingPrice, formatINR } from "../utils/pricing";
import Loader from "../components/Loader";

export default function Cart() {
  const { cart, totals, loading, updateItem, removeItem, applyCoupon, removeCoupon } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading && !cart) return <Loader />;

  const items = (cart?.items || []).filter((i) => i.product);

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p>Browse the catalog and add something to press.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go to shop</Link>
      </div>
    );
  }

  const onCoupon = async () => {
    if (!code.trim()) return;
    setBusy(true);
    try {
      await applyCoupon(code.trim());
      toast("Coupon applied");
      setCode("");
    } catch (e) {
      toast(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container section">
      <h1 style={{ marginBottom: 24 }}>Cart</h1>
      <div className="two-col">
        <div>
          {items.map(({ product, quantity, design }) => {
            const price = sellingPrice(product);
            const img = product.images?.[0]?.url;
            return (
              <div className="line-item" key={product._id}>
                <div className="line-thumb">
                  {design?.thumbnail ? (
                    <img src={design.thumbnail} alt={design.name || "design"} />
                  ) : img ? (
                    <img src={img} alt={product.name} />
                  ) : null}
                </div>
                <div>
                  <Link to={`/product/${product._id}`} className="product-title">{product.name}</Link>
                  {design && <span className="design-tag">✦ Custom design{design.name ? `: ${design.name}` : ""}</span>}
                  <div className="mono" style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 4 }}>
                    {formatINR(price)} each
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                    <div className="qty">
                      <button onClick={() => updateItem(product._id, quantity - 1)}>−</button>
                      <span>{quantity}</span>
                      <button onClick={() => updateItem(product._id, quantity + 1)} disabled={quantity >= product.stock}>+</button>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeItem(product._id)}>Remove</button>
                  </div>
                </div>
                <div className="mono" style={{ fontWeight: 700 }}>{formatINR(price * quantity)}</div>
              </div>
            );
          })}
        </div>

        <div className="card summary">
          <h3>Summary</h3>

          {cart?.coupon ? (
            <div className="coupon-applied">
              <span>Coupon <b className="mono">{cart.coupon.code}</b></span>
              <button className="btn btn-ghost btn-sm" onClick={removeCoupon}>Remove</button>
            </div>
          ) : (
            <div className="coupon-row">
              <input className="input" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
              <button className="btn btn-outline btn-sm" onClick={onCoupon} disabled={busy}>Apply</button>
            </div>
          )}

          <div className="sum-row"><span>Items</span><span className="mono">{formatINR(totals?.itemsPrice)}</span></div>
          {totals?.discountPrice > 0 && (
            <div className="sum-row"><span>Discount</span><span className="mono" style={{ color: "var(--success)" }}>−{formatINR(totals.discountPrice)}</span></div>
          )}
          <div className="sum-row"><span>Tax (18% GST)</span><span className="mono">{formatINR(totals?.taxPrice)}</span></div>
          <div className="sum-row"><span>Shipping</span><span className="mono">{totals?.shippingPrice ? formatINR(totals.shippingPrice) : "Free"}</span></div>
          <div className="sum-row total"><span>Total</span><span className="mono">{formatINR(totals?.totalPrice)}</span></div>

          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
