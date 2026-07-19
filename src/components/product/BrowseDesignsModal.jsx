import { useState } from "react";
import { X, Heart } from "lucide-react";
import { DESIGN_TABS, DESIGNS } from "../../data/designs";

function DesignTile({ d, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(d)}
      className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl bg-[#F1F1F0] p-4 text-center transition hover:ring-2 hover:ring-[#0037CA]/50"
    >
      <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-[#98A2B3] shadow-sm">
        <Heart className="h-4 w-4" />
      </span>
      {d.boxed && (
        <span className="mb-2 grid h-16 w-16 place-items-center rounded border border-dashed border-slate-400 text-[9px] leading-tight text-slate-500">
          Upload Your Design
        </span>
      )}
      <span className="text-[13px] font-semibold text-[#475467]">{d.overlay}</span>
    </button>
  );
}

export default function BrowseDesignsModal({ open, onClose, onSelect }) {
  const [tab, setTab] = useState("All");
  if (!open) return null;
  const visible = tab === "All" ? DESIGNS : DESIGNS.filter((d) => d.tab === tab);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-[#0F1729]">Browse designs</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#475467] hover:text-[#0F1729]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-5 py-3">
          {DESIGN_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-none rounded-full border px-4 py-1.5 text-[13px] font-semibold transition ${
                tab === t ? "border-[#0037CA] bg-[#0037CA] text-white" : "border-slate-200 text-[#475467] hover:border-[#0037CA]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto p-5 sm:grid-cols-4">
          {visible.map((d) => (
            <DesignTile key={d.id} d={d} onPick={(picked) => { onSelect(picked); onClose(); }} />
          ))}
        </div>
      </div>
    </div>
  );
}