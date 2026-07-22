import { useCallback, useEffect, useState } from "react";

const BK_KEY = "skyup_bookmarks_v1";
const EVT = "skyup-bookmarks-changed";

export function readBookmarks() {
  try { return JSON.parse(localStorage.getItem(BK_KEY) || "[]"); } catch { return []; }
}
function writeBookmarks(list) {
  try { localStorage.setItem(BK_KEY, JSON.stringify(list)); } catch {}
  window.dispatchEvent(new Event(EVT));
}

export function useBookmarks() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readBookmarks());
    sync();
    setReady(true);
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback((slug) => items.some((b) => b.slug === slug), [items]);

  const toggle = useCallback((entry) => {
    const list = readBookmarks();
    const exists = list.some((b) => b.slug === entry.slug);
    writeBookmarks(exists ? list.filter((b) => b.slug !== entry.slug) : [...list, entry]);
  }, []);

  const remove = useCallback((slug) => {
    writeBookmarks(readBookmarks().filter((b) => b.slug !== slug));
  }, []);

  return { items, count: items.length, ready, isSaved, toggle, remove };
}