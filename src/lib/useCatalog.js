import { useEffect, useState } from "react";
import { getCategories, getAllProducts } from "./api";

let _cats = null;
let _prods = null;

export function useCategories() {
  const [data, setData] = useState(_cats || []);
  const [loading, setLoading] = useState(!_cats);
  useEffect(() => {
    if (_cats) return;
    let alive = true;
    getCategories()
      .then((c) => { _cats = c; if (alive) { setData(c); setLoading(false); } })
      .catch(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);
  return { categories: data, loading };
}

export function useProducts() {
  const [data, setData] = useState(_prods || []);
  const [loading, setLoading] = useState(!_prods);
  useEffect(() => {
    if (_prods) return;
    let alive = true;
    getAllProducts(500)
      .then((p) => { _prods = p; if (alive) { setData(p); setLoading(false); } })
      .catch(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);
  return { products: data, loading };
}