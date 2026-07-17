import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { errMsg } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { sellingPrice, formatINR } from "../utils/pricing";
import Loader from "../components/Loader";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const onAdd = async () => {
    if (!user) return navigate("/login", { state: { from: `/product/${id}` } });
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      toast("Added to cart");
    } catch (e) {
      toast(errMsg(e));
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container section"><div className="alert alert-error">{error}</div></div>;
  if (!product) return null;

  const img = product.images?.[0]?.url;
  const price = sellingPrice(product);
  const specs = [
    ["Material", product.material],
    ["Paper", product.paperType],
    ["Print", product.printType],
    ["Size", product.dimensions],
    ["Colors", product.colorOptions?.join(", ")],
    ["In stock", product.stock],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");

  return (
    <div className="container section">
      <Link to="/" className="eyebrow" style={{ display: "inline-block", marginBottom: 20 }}>← Back to shop</Link>
      <div className="pdp">
        <div className="pdp-media">
          {img ? <img src={img} alt={product.name} /> : <div className="ph" style={{ display: "grid", placeItems: "center", height: "100%", fontFamily: "var(--font-mono)", color: "#b6b5ad" }}>NO IMAGE</div>}
        </div>

        <div>
          {product.category?.name && <p className="eyebrow">{product.category.name}</p>}
          <h1 style={{ margin: "8px 0 12px" }}>{product.name}</h1>

          <div className="price-row" style={{ marginBottom: 16 }}>
            <span className="price" style={{ fontSize: "1.5rem" }}>{formatINR(price)}</span>
            {product.discount > 0 && (
              <>
                <span className="price-old">{formatINR(product.price)}</span>
                <span className="tag-off">-{product.discount}%</span>
              </>
            )}
          </div>

          {product.description && <p style={{ color: "var(--ink-soft)" }}>{product.description}</p>}

          <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "22px 0" }}>
            {product.customizable ? (
              <>
                <Link to={`/designs/new?product=${product._id}`} className="btn btn-primary">
                  Customize to order
                </Link>
                <span className="eyebrow">Made to order · design required</span>
              </>
            ) : (
              <>
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} disabled={qty >= product.stock}>+</button>
                </div>
                <button className="btn btn-primary" onClick={onAdd} disabled={adding || product.stock < 1}>
                  {product.stock < 1 ? "Out of stock" : adding ? "Adding…" : "Add to cart"}
                </button>
                <Link to={`/designs/new?product=${product._id}`} className="btn btn-outline">Customize</Link>
              </>
            )}
          </div>

          {specs.length > 0 && (
            <div className="spec-list">
              {specs.map(([k, v]) => (
                <div className="spec-row" key={k}>
                  <span className="k">{k}</span>
                  <span>{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
