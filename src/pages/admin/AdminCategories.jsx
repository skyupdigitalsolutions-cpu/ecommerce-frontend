import { useEffect, useState } from "react";
import api, { errMsg } from "../../api/client";
import { useToast } from "../../components/Toast";
import Loader from "../../components/Loader";

export default function AdminCategories() {
  const toast = useToast();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", parent: "" });
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get("/categories").then((r) => setCats(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description };
      if (form.parent) payload.parent = form.parent;
      await api.post("/categories", payload);
      toast("Category created");
      setForm({ name: "", description: "", parent: "" });
      load();
    } catch (err) {
      toast(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast("Category deleted");
      load();
    } catch (err) {
      toast(errMsg(err));
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Categories</h1>

      <form className="admin-form card" onSubmit={create}>
        <h3>New category</h3>
        <div className="field"><label>Name</label><input className="input" value={form.name} onChange={set("name")} required /></div>
        <div className="field"><label>Description</label><input className="input" value={form.description} onChange={set("description")} /></div>
        <div className="field">
          <label>Parent (optional)</label>
          <select className="input" value={form.parent} onChange={set("parent")}>
            <option value="">— none (top level) —</option>
            {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Create category"}</button>
      </form>

      {loading ? <Loader /> : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Parent</th><th></th></tr></thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td className="mono">{c.slug}</td>
                <td>{c.parent?.name || "—"}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {cats.length === 0 && <tr><td colSpan="4" style={{ color: "var(--muted)" }}>No categories yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
