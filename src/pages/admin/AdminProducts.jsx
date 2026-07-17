import { useEffect, useState } from "react";
import api, { errMsg } from "../../api/client";
import { useToast } from "../../components/Toast";
import { formatINR } from "../../utils/pricing";
import Loader from "../../components/Loader";

const blank = {
  name: "", category: "", price: "", discount: "", stock: "",
  description: "", material: "", paperType: "", printType: "",
  dimensions: "", colorOptions: "", customizable: false,
};

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [files, setFiles] = useState([]);
  const [editing, setEditing] = useState(null); // product id or null
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get("/products", { params: { limit: 100 } })
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));

  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data)).catch(() => {});
    load();
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const reset = () => { setForm(blank); setFiles([]); setEditing(null); };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name || "", category: p.category?._id || p.category || "",
      price: p.price ?? "", discount: p.discount ?? "", stock: p.stock ?? "",
      description: p.description || "", material: p.material || "",
      paperType: p.paperType || "", printType: p.printType || "",
      dimensions: p.dimensions || "", colorOptions: (p.colorOptions || []).join(", "),
      customizable: !!p.customizable,
    });
    setFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Multipart, because the backend product route runs through multer.
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
      });
      files.forEach((f) => fd.append("images", f));

      if (editing) {
        await api.put(`/products/${editing}`, fd);
        toast("Product updated");
      } else {
        await api.post("/products", fd);
        toast("Product created");
      }
      reset();
      load();
    } catch (err) {
      toast(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast("Product deleted");
      load();
    } catch (err) {
      toast(errMsg(err));
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Products</h1>

      <form className="admin-form card" onSubmit={submit}>
        <h3>{editing ? "Edit product" : "New product"}</h3>
        <div className="grid-2">
          <div className="field"><label>Name</label><input className="input" value={form.name} onChange={set("name")} required /></div>
          <div className="field">
            <label>Category</label>
            <select className="input" value={form.category} onChange={set("category")} required>
              <option value="">— choose —</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid-3">
          <div className="field"><label>Price (₹)</label><input className="input" type="number" min="0" value={form.price} onChange={set("price")} required /></div>
          <div className="field"><label>Discount (%)</label><input className="input" type="number" min="0" max="100" value={form.discount} onChange={set("discount")} /></div>
          <div className="field"><label>Stock</label><input className="input" type="number" min="0" value={form.stock} onChange={set("stock")} /></div>
        </div>
        <div className="field"><label>Description</label><textarea className="input" rows="2" value={form.description} onChange={set("description")} /></div>
        <div className="grid-2">
          <div className="field"><label>Material</label><input className="input" value={form.material} onChange={set("material")} /></div>
          <div className="field"><label>Paper type</label><input className="input" value={form.paperType} onChange={set("paperType")} /></div>
        </div>
        <div className="grid-3">
          <div className="field"><label>Print type</label><input className="input" value={form.printType} onChange={set("printType")} /></div>
          <div className="field"><label>Dimensions</label><input className="input" value={form.dimensions} onChange={set("dimensions")} placeholder="90mm x 55mm" /></div>
          <div className="field"><label>Colors (comma)</label><input className="input" value={form.colorOptions} onChange={set("colorOptions")} placeholder="White, Cream" /></div>
        </div>
        <label style={{ display: "flex", gap: 10, alignItems: "center", margin: "6px 0 14px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.customizable}
            onChange={(e) => setForm({ ...form, customizable: e.target.checked })}
          />
          <span>Customizable — buyers must design this in the editor before ordering</span>
        </label>

        <div className="field">
          <label>Images {editing && <span style={{ color: "var(--muted)", fontWeight: 400 }}>(new ones are added)</span>}</label>
          <input className="input" type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} />
          <small style={{ color: "var(--muted)" }}>Needs Cloudinary keys on the backend. You can create a product without images and add them later.</small>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update product" : "Create product"}</button>
          {editing && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel edit</button>}
        </div>
      </form>

      {loading ? <Loader /> : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category?.name || "—"}</td>
                <td className="mono">{formatINR(p.price)}{p.discount > 0 ? ` (-${p.discount}%)` : ""}</td>
                <td className="mono">{p.stock}</td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>{" "}
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="5" style={{ color: "var(--muted)" }}>No products yet — create one above.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
