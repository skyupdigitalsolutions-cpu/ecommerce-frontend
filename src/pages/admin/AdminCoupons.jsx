import { useEffect, useState } from "react";
import api, { errMsg } from "../../api/client";
import { useToast } from "../../components/Toast";
import { formatINR } from "../../utils/pricing";
import Loader from "../../components/Loader";

const blank = { code: "", type: "percentage", value: "", minOrderAmount: "", maxDiscount: "", usageLimit: "", expiresAt: "" };

export default function AdminCoupons() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get("/coupons").then((r) => setCoupons(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code, type: form.type, value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscount: Number(form.maxDiscount || 0),
        usageLimit: Number(form.usageLimit || 0),
      };
      if (form.expiresAt) payload.expiresAt = form.expiresAt;
      await api.post("/coupons", payload);
      toast("Coupon created");
      setForm(blank);
      load();
    } catch (err) {
      toast(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast("Coupon deleted");
      load();
    } catch (err) {
      toast(errMsg(err));
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Coupons</h1>

      <form className="admin-form card" onSubmit={create}>
        <h3>New coupon</h3>
        <div className="grid-2">
          <div className="field"><label>Code</label><input className="input" value={form.code} onChange={set("code")} required placeholder="SAVE10" /></div>
          <div className="field">
            <label>Type</label>
            <select className="input" value={form.type} onChange={set("type")}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </div>
        </div>
        <div className="grid-3">
          <div className="field"><label>Value</label><input className="input" type="number" min="0" value={form.value} onChange={set("value")} required /></div>
          <div className="field"><label>Min order (₹)</label><input className="input" type="number" min="0" value={form.minOrderAmount} onChange={set("minOrderAmount")} /></div>
          <div className="field"><label>Max discount (₹)</label><input className="input" type="number" min="0" value={form.maxDiscount} onChange={set("maxDiscount")} /></div>
        </div>
        <div className="grid-2">
          <div className="field"><label>Usage limit (0 = unlimited)</label><input className="input" type="number" min="0" value={form.usageLimit} onChange={set("usageLimit")} /></div>
          <div className="field"><label>Expires at (optional)</label><input className="input" type="date" value={form.expiresAt} onChange={set("expiresAt")} /></div>
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Create coupon"}</button>
      </form>

      {loading ? <Loader /> : (
        <table className="admin-table">
          <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Used</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td className="mono">{c.code}</td>
                <td>{c.type}</td>
                <td className="mono">{c.type === "percentage" ? `${c.value}%` : formatINR(c.value)}</td>
                <td className="mono">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td>{c.isActive ? "Yes" : "No"}</td>
                <td style={{ textAlign: "right" }}><button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}>Delete</button></td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan="6" style={{ color: "var(--muted)" }}>No coupons yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
