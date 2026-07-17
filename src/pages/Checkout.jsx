import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { openRazorpay } from "../utils/razorpay";
import { formatINR } from "../utils/pricing";
import Loader from "../components/Loader";

const empty = { line1: "", line2: "", city: "", state: "", postalCode: "", phone: "" };

export default function Checkout() {
  const { user } = useAuth();
  const { cart, totals, loading, refresh } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [addr, setAddr] = useState(empty);
  const [method, setMethod] = useState("razorpay");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (loading && !cart) return <Loader />;

  const items = (cart?.items || []).filter((i) => i.product);
  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Nothing to check out</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const set = (k) => (e) => setAddr({ ...addr, [k]: e.target.value });

  const placeOrder = async () => {
    setError("");
    // Minimal client-side check; the server validates too.
    for (const k of ["line1", "city", "state", "postalCode"]) {
      if (!addr[k].trim()) return setError("Please fill in address line 1, city, state and postal code.");
    }

    setPlacing(true);
    try {
      const { data: order } = await api.post("/orders", {
        shippingAddress: addr,
        paymentMethod: method,
      });

      if (method === "cod") {
        await refresh();
        toast("Order placed");
        return navigate(`/orders/${order._id}`);
      }

      // Razorpay: create the gateway order, open checkout, then verify.
      const { data: rp } = await api.post("/payments/create-order", { orderId: order._id });

      const result = await openRazorpay({
        key: rp.key,
        razorpayOrderId: rp.razorpayOrderId,
        amount: rp.amount,
        currency: rp.currency,
        name: user?.name,
        email: user?.email,
        contact: addr.phone,
      });

      await api.post("/payments/verify", {
        orderId: order._id,
        razorpay_order_id: result.razorpay_order_id,
        razorpay_payment_id: result.razorpay_payment_id,
        razorpay_signature: result.razorpay_signature,
      });

      await refresh();
      toast("Payment successful");
      navigate(`/orders/${order._id}`);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container section">
      <h1 style={{ marginBottom: 24 }}>Checkout</h1>
      <div className="two-col">
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Shipping address</h3>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field"><label>Address line 1</label><input className="input" value={addr.line1} onChange={set("line1")} /></div>
          <div className="field"><label>Address line 2 (optional)</label><input className="input" value={addr.line2} onChange={set("line2")} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field"><label>City</label><input className="input" value={addr.city} onChange={set("city")} /></div>
            <div className="field"><label>State</label><input className="input" value={addr.state} onChange={set("state")} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field"><label>Postal code</label><input className="input" value={addr.postalCode} onChange={set("postalCode")} /></div>
            <div className="field"><label>Phone</label><input className="input" value={addr.phone} onChange={set("phone")} /></div>
          </div>

          <h3 style={{ margin: "20px 0 12px" }}>Payment</h3>
          <label style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", cursor: "pointer" }}>
            <input type="radio" name="pm" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} />
            <span>Pay online (Razorpay)</span>
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", cursor: "pointer" }}>
            <input type="radio" name="pm" checked={method === "cod"} onChange={() => setMethod("cod")} />
            <span>Cash on delivery</span>
          </label>
        </div>

        <div className="card summary">
          <h3>Order summary</h3>
          {items.map(({ product, quantity }) => (
            <div className="sum-row" key={product._id}>
              <span>{product.name} × {quantity}</span>
            </div>
          ))}
          <div className="sum-row"><span>Items</span><span className="mono">{formatINR(totals?.itemsPrice)}</span></div>
          {totals?.discountPrice > 0 && <div className="sum-row"><span>Discount</span><span className="mono" style={{ color: "var(--success)" }}>−{formatINR(totals.discountPrice)}</span></div>}
          <div className="sum-row"><span>Tax</span><span className="mono">{formatINR(totals?.taxPrice)}</span></div>
          <div className="sum-row"><span>Shipping</span><span className="mono">{totals?.shippingPrice ? formatINR(totals.shippingPrice) : "Free"}</span></div>
          <div className="sum-row total"><span>Total</span><span className="mono">{formatINR(totals?.totalPrice)}</span></div>

          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={placeOrder} disabled={placing}>
            {placing ? "Processing…" : method === "cod" ? "Place order" : `Pay ${formatINR(totals?.totalPrice)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
