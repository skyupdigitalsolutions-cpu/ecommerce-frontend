import { useEffect, useState } from "react";
import api, { errMsg } from "../../api/client";
import { useToast } from "../../components/Toast";
import { formatINR } from "../../utils/pricing";
import Loader from "../../components/Loader";

const STATUSES = [
  "pending", "confirmed", "processing", "printing", "quality_check",
  "packed", "shipped", "delivered", "cancelled", "returned",
];

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get("/orders").then((r) => setOrders(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast("Status updated");
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)));
    } catch (err) {
      toast(errMsg(err));
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Orders</h1>
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="mono">#{o._id.slice(-8)}<div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{new Date(o.createdAt).toLocaleDateString()}</div></td>
              <td>{o.user?.name || "—"}<div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{o.user?.email}</div></td>
              <td className="mono">{formatINR(o.totalPrice)}</td>
              <td><span className={`status ${o.paymentStatus}`}>{o.paymentStatus}</span></td>
              <td>
                <select className="input" style={{ maxWidth: 160 }} value={o.orderStatus} onChange={(e) => setStatus(o._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan="5" style={{ color: "var(--muted)" }}>No orders yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
