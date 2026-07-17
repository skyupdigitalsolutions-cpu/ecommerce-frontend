import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import * as fabric from "fabric";
import api, { errMsg } from "../api/client";
import { useToast } from "../components/Toast";
import { useCart } from "../context/CartContext";

const PRESETS = [
  { label: "Business card", w: 1050, h: 600 },
  { label: "Square", w: 800, h: 800 },
  { label: "Flyer (A5)", w: 874, h: 1240 },
];

export default function DesignEditor() {
  const { id } = useParams();               // existing design id, or undefined for new
  const [search] = useSearchParams();
  const productId = search.get("product") || null;
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCart();

  const canvasElRef = useRef(null);
  const fcRef = useRef(null);               // the fabric.Canvas instance
  const [name, setName] = useState("Untitled design");
  const [size, setSize] = useState({ w: 1050, h: 600 });
  const [fill, setFill] = useState("#2340e6");
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkedProduct, setLinkedProduct] = useState(productId); // product this design is for

  // Init the fabric canvas once the element is mounted.
  useEffect(() => {
    const fc = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    fcRef.current = fc;

    // Load an existing design, or start blank.
    (async () => {
      if (id) {
        try {
          const { data } = await api.get(`/designs/${id}`);
          setName(data.name || "Untitled design");
          setLinkedProduct(data.product || null);
          setSize({ w: data.width || 1050, h: data.height || 600 });
          fc.setDimensions({ width: data.width || 1050, height: data.height || 600 });
          if (data.canvas && data.canvas.objects) {
            await fc.loadFromJSON(data.canvas);
          }
          fc.requestRenderAll();
        } catch (e) {
          toast(errMsg(e));
        }
      } else {
        fc.setDimensions({ width: size.w, height: size.h });
      }
      setReady(true);
    })();

    return () => {
      fc.dispose();
      fcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canvas = () => fcRef.current;

  const applySize = (w, h) => {
    setSize({ w, h });
    canvas()?.setDimensions({ width: w, height: h });
    canvas()?.requestRenderAll();
  };

  const addText = () => {
    const t = new fabric.Textbox("Double-click to edit", {
      left: 60, top: 60, fontSize: 40, fill: "#17161b", fontFamily: "Inter", width: 300,
    });
    canvas().add(t);
    canvas().setActiveObject(t);
    canvas().requestRenderAll();
  };

  const addRect = () => {
    const r = new fabric.Rect({ left: 80, top: 80, width: 200, height: 120, fill });
    canvas().add(r);
    canvas().setActiveObject(r);
    canvas().requestRenderAll();
  };

  const addCircle = () => {
    const c = new fabric.Circle({ left: 100, top: 100, radius: 70, fill });
    canvas().add(c);
    canvas().setActiveObject(c);
    canvas().requestRenderAll();
  };

  const addImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const img = await fabric.FabricImage.fromURL(reader.result);
        img.scaleToWidth(Math.min(300, size.w * 0.6));
        img.set({ left: 40, top: 40 });
        canvas().add(img);
        canvas().setActiveObject(img);
        canvas().requestRenderAll();
      } catch {
        toast("Could not add image");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const applyFill = (color) => {
    setFill(color);
    const obj = canvas()?.getActiveObject();
    if (obj) {
      obj.set("fill", color);
      canvas().requestRenderAll();
    }
  };

  const deleteSelected = () => {
    const obj = canvas()?.getActiveObject();
    if (obj) {
      canvas().remove(obj);
      canvas().discardActiveObject();
      canvas().requestRenderAll();
    }
  };

  const forward = () => {
    const obj = canvas()?.getActiveObject();
    if (obj) { canvas().bringObjectForward(obj); canvas().requestRenderAll(); }
  };
  const backward = () => {
    const obj = canvas()?.getActiveObject();
    if (obj) { canvas().sendObjectBackwards(obj); canvas().requestRenderAll(); }
  };

  // Serialise the canvas and create/update the design; returns its id.
  const persist = async () => {
    const json = canvas().toJSON();
    let thumbnail;
    try {
      thumbnail = canvas().toDataURL({ format: "png", multiplier: 0.25 });
    } catch {
      thumbnail = undefined; // tainted canvas (cross-origin image) — skip thumb
    }
    const payload = { name, canvas: json, width: size.w, height: size.h, thumbnail };
    if (linkedProduct) payload.product = linkedProduct;

    if (id) {
      await api.put(`/designs/${id}`, payload);
      return id;
    }
    const { data } = await api.post("/designs", payload);
    return data._id;
  };

  const save = async () => {
    setSaving(true);
    try {
      const savedId = await persist();
      toast(id ? "Design saved" : "Design created");
      if (!id) navigate(`/designs/${savedId}`, { replace: true });
    } catch (e) {
      toast(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const addToCartFlow = async () => {
    if (!linkedProduct) {
      toast("Link this design to a product first (open it from a product's Customize button).");
      return;
    }
    setSaving(true);
    try {
      const savedId = await persist();
      await addToCart(linkedProduct, 1, savedId);
      toast("Added to cart");
      navigate("/cart");
    } catch (e) {
      toast(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container section editor-page">
      <div className="editor-head">
        <Link to="/designs" className="eyebrow">← My designs</Link>
        <input className="input editor-name" value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={save} disabled={saving || !ready}>
            {saving ? "Saving…" : "Save"}
          </button>
          {linkedProduct && (
            <button className="btn btn-primary" onClick={addToCartFlow} disabled={saving || !ready}>
              Save &amp; add to cart
            </button>
          )}
        </div>
      </div>

      <div className="editor-body">
        <aside className="editor-tools card">
          <p className="eyebrow">Add</p>
          <button className="btn btn-outline btn-block" onClick={addText}>Text</button>
          <button className="btn btn-outline btn-block" onClick={addRect}>Rectangle</button>
          <button className="btn btn-outline btn-block" onClick={addCircle}>Circle</button>
          <label className="btn btn-outline btn-block" style={{ cursor: "pointer" }}>
            Image
            <input type="file" accept="image/*" hidden onChange={addImage} />
          </label>

          <p className="eyebrow" style={{ marginTop: 16 }}>Selected</p>
          <div className="tool-row">
            <label>Fill</label>
            <input type="color" value={fill} onChange={(e) => applyFill(e.target.value)} />
          </div>
          <button className="btn btn-ghost btn-block btn-sm" onClick={forward}>Bring forward</button>
          <button className="btn btn-ghost btn-block btn-sm" onClick={backward}>Send backward</button>
          <button className="btn btn-danger btn-block btn-sm" onClick={deleteSelected}>Delete selected</button>

          <p className="eyebrow" style={{ marginTop: 16 }}>Canvas size</p>
          {PRESETS.map((p) => (
            <button key={p.label} className="btn btn-ghost btn-block btn-sm" onClick={() => applySize(p.w, p.h)}>
              {p.label} <span className="mono" style={{ color: "var(--muted)" }}>{p.w}×{p.h}</span>
            </button>
          ))}
        </aside>

        <div className="editor-stage">
          <div className="editor-canvas-wrap">
            <canvas ref={canvasElRef} />
          </div>
          <p className="eyebrow" style={{ marginTop: 12 }}>
            Tip: double-click text to edit · drag corners to resize · drag to move
          </p>
        </div>
      </div>
    </div>
  );
}
