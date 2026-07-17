import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { useToast } from "../components/Toast";
import Loader from "../components/Loader";

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const load = () =>
    api
      .get("/designs")
      .then((r) => setDesigns(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this design?")) return;
    try {
      await api.delete(`/designs/${id}`);
      toast("Design deleted");
      setDesigns((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      toast(errMsg(e));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container section">
      <div className="order-head" style={{ marginBottom: 24 }}>
        <h1>My designs</h1>
        <button className="btn btn-primary" onClick={() => navigate("/designs/new")}>New design</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {designs.length === 0 ? (
        <div className="empty">
          <h2>No designs yet</h2>
          <p>Start a new design and send it to press.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/designs/new")}>
            Create your first design
          </button>
        </div>
      ) : (
        <div className="grid">
          {designs.map((d) => (
            <div className="card product-card" key={d._id}>
              <Link to={`/designs/${d._id}`} className="product-thumb" style={{ display: "block" }}>
                {d.thumbnail ? <img src={d.thumbnail} alt={d.name} /> : <span className="ph">NO PREVIEW</span>}
              </Link>
              <div className="product-body">
                <span className="product-title">{d.name}</span>
                <span className="product-cat">{d.status} · {new Date(d.updatedAt).toLocaleDateString()}</span>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Link to={`/designs/${d._id}`} className="btn btn-outline btn-sm">Open</Link>
                  <button className="btn btn-ghost btn-sm" onClick={() => remove(d._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
