import { useEffect, useState } from "react";
import api, { errMsg } from "../api/client";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const params = { page, limit: 12, sort };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;

    api
      .get("/products", { params })
      .then((r) => {
        if (!active) return;
        setProducts(r.data.products);
        setMeta({ page: r.data.page, pages: r.data.pages, total: r.data.total });
      })
      .catch((e) => active && setError(errMsg(e)))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [keyword, category, sort, page]);

  // Reset to page 1 whenever a filter changes.
  const onKeyword = (v) => { setPage(1); setKeyword(v); };
  const onCategory = (v) => { setPage(1); setCategory(v); };
  const onSort = (v) => { setPage(1); setSort(v); };

  return (
    <>
      <section className="hero container">
        <div className="hero-marks">
          <span className="regmark"><span /></span>
          <span className="regmark"><span /></span>
        </div>
        <p className="eyebrow">Custom print · made to order</p>
        <h1>Your brand, pressed onto paper.</h1>
        <p>
          Business cards, flyers, stickers and more — designed by you, printed
          properly. Browse the catalog and send it to press.
        </p>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search products…"
            value={keyword}
            onChange={(e) => onKeyword(e.target.value)}
          />
          <select className="input" style={{ maxWidth: 200 }} value={category} onChange={(e) => onCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select className="input" style={{ maxWidth: 170 }} value={sort} onChange={(e) => onSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <span className="eyebrow" style={{ marginLeft: "auto" }}>{meta.total} items</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="empty">
            <h2>Nothing here yet</h2>
            <p>No products match this view. Try clearing the search or category.</p>
          </div>
        ) : (
          <>
            <div className="grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            {meta.pages > 1 && (
              <div className="pagination">
                <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span>{meta.page} / {meta.pages}</span>
                <button className="btn btn-outline btn-sm" disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
