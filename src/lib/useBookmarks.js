import { useCallback, useEffect, useState } from "react";

const BK_KEY = "skyup_bookmarks_v1";
const EVT = "skyup-bookmarks-changed";

const keyOf = (b) => b.id || b.slug;

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

  const isSaved = useCallback((key) => items.some((b) => keyOf(b) === key), [items]);

  const toggle = useCallback((entry) => {
    const list = readBookmarks();
    const k = keyOf(entry);
    const exists = list.some((b) => keyOf(b) === k);
    writeBookmarks(exists ? list.filter((b) => keyOf(b) !== k) : [...list, entry]);
  }, []);

  const remove = useCallback((key) => {
    writeBookmarks(readBookmarks().filter((b) => keyOf(b) !== key));
  }, []);

  return { items, count: items.length, ready, isSaved, toggle, remove };
}