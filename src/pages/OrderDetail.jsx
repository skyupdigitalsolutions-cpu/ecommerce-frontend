import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { formatINR } from "../utils/pricing";
import Loader from "../components/Loader";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><div className="alert alert-error">{error}</div></div>;
  if (!order) return null;

  const a = order.shippingAddress || {};

  return (
    <div className="container section">
      <Link to="/orders" className="eyebrow" style={{ display: "inline-block", marginBottom: 16 }}>← All orders</Link>

      <div className="order-head">
        <h1>Order #{order._id.slice(-8)}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <span className={`status ${order.paymentStatus}`}>{order.paymentStatus}</span>
          <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
        </div>
      </div>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>Placed {new Date(order.createdAt).toLocaleString()}</p>

      <div className="two-col">
        <div className="card" style={{ padding: 20 }}>
          {order.items.map((it) => (
            <div className="line-item" key={it.product} style={{ gridTemplateColumns: "56px 1fr auto" }}>
              <div className="line-thumb" style={{ width: 56, height: 56 }}>
                {it.designThumbnail ? <img src={it.designThumbnail} alt="design" /> : it.image ? <img src={it.image} alt={it.name} /> : null}
              </div>
              <div>
                <div className="product-title" style={{ fontSize: "0.95rem" }}>{it.name}</div>
                {it.design && <span className="design-tag">✦ Custom design</span>}
                <div className="mono" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{formatINR(it.price)} × {it.quantity}</div>
              </div>
              <div className="mono" style={{ fontWeight: 700 }}>{formatINR(it.price * it.quantity)}</div>
            </div>
          ))}

          <h3 style={{ fontSize: "1rem", margin: "20px 0 8px" }}>Shipping to</h3>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
            {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
            {a.city}, {a.state} {a.postalCode}<br />
            {a.country}{a.phone ? ` · ${a.phone}` : ""}
          </p>
        </div>

        <div className="card summary">
          <h3>Payment</h3>
          <div className="sum-row"><span>Method</span><span className="mono">{order.paymentMethod}</span></div>
          <div className="sum-row"><span>Items</span><span className="mono">{formatINR(order.itemsPrice)}</span></div>
          {order.discountPrice > 0 && <div className="sum-row"><span>Discount</span><span className="mono" style={{ color: "var(--success)" }}>−{formatINR(order.discountPrice)}</span></div>}
          <div className="sum-row"><span>Tax</span><span className="mono">{formatINR(order.taxPrice)}</span></div>
          <div className="sum-row"><span>Shipping</span><span className="mono">{order.shippingPrice ? formatINR(order.shippingPrice) : "Free"}</span></div>
          <div className="sum-row total"><span>Total</span><span className="mono">{formatINR(order.totalPrice)}</span></div>
        </div>
      </div>
    </div>
  );
}
