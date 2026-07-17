import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { formatINR } from "../utils/pricing";
import Loader from "../components/Loader";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/my")
      .then((r) => setOrders(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container section">
      <h1 style={{ marginBottom: 24 }}>Your orders</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {orders.length === 0 ? (
        <div className="empty">
          <h2>No orders yet</h2>
          <p>When you place an order it'll show up here.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go to shop</Link>
        </div>
      ) : (
        orders.map((o) => (
          <Link to={`/orders/${o._id}`} key={o._id} className="card order-card" style={{ display: "block" }}>
            <div className="order-head">
              <div>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>#{o._id.slice(-8)}</span>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className={`status ${o.paymentStatus}`}>{o.paymentStatus}</span>
                <span className={`status ${o.orderStatus}`}>{o.orderStatus}</span>
              </div>
            </div>
            <div className="mono" style={{ fontWeight: 700 }}>{formatINR(o.totalPrice)}</div>
          </Link>
        ))
      )}
    </div>
  );
}
