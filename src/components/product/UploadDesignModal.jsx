import { useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";

export default function UploadDesignModal({ open, onClose, onUpload }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  if (!open) return null;

  const handleFile = (file) => {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-[#0F1729]">Upload design</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#475467] hover:text-[#0F1729]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0037CA]/40 bg-[#F8FAFF] p-6 text-center transition hover:border-[#0037CA]"
          >
            {preview ? (
              <img src={preview} alt="Your design" className="max-h-full max-w-full rounded object-contain" />
            ) : (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#0037CA] shadow-sm">
                  <UploadCloud className="h-6 w-6" />
                </span>
                <p className="mt-3 font-semibold text-[#0F1729]">Upload design</p>
                <p className="text-[13px] text-[#667085]">or drag and drop here</p>
                <p className="mt-2 text-[11px] text-[#98A2B3]">PNG, JPG, SVG, PDF · up to 25MB</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {preview && (
            <div className="mt-4 flex items-center justify-between">
              <span className="truncate text-[13px] text-[#475467]">{name}</span>
              <button type="button" onClick={() => { setPreview(null); setName(""); }} className="text-[13px] font-semibold text-[#0037CA]">
                Replace
              </button>
            </div>
          )}
          <button
            type="button"
            disabled={!preview}
            onClick={() => { onUpload({ name, preview }); onClose(); }}
            className="mt-5 w-full rounded-xl bg-[#0037CA] py-3 text-[15px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use this design
          </button>
        </div>
      </div>
    </div>
  );
}