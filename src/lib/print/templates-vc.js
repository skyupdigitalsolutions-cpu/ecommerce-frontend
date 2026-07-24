export const VC_SCHEMES = [
  { id: "navy",   primary: "#0B2E59", accent: "#1E5DA8" },
  { id: "maroon", primary: "#7A1F2B", accent: "#B03A48" },
  { id: "plum",   primary: "#5B2A5E", accent: "#8E4A92" },
  { id: "forest", primary: "#12402E", accent: "#2E7D5B" },
  { id: "steel",  primary: "#2B4C6F", accent: "#6E93B8" },
];

const txt = (t, fill, opts) => ({ type: "textbox", text: t, fontFamily: "Georgia", fill, originX: "left", originY: "top", ...opts });

function classic(s, g) {
  const L = g.safeBox.left, T = g.safeBox.top, W = g.safeBox.width, H = g.safeBox.height;
  return { version: "6.0.0", background: "#ffffff", objects: [
    { type: "rect", left: L, top: T, width: 70, height: 70, fill: "#E5E7EB", rx: 4, ry: 4 },
    txt("Company Name", s.accent, { left: L + 85, top: T + 4, width: W - 85, fontSize: 26, fontWeight: "bold" }),
    txt("Company Message", s.primary, { left: L + 85, top: T + 36, width: W - 85, fontSize: 13 }),
    txt("Full Name", s.primary, { left: L, top: T + H * 0.38, width: W, fontSize: 20, fontWeight: "bold", textAlign: "right" }),
    txt("Job Title", s.accent, { left: L, top: T + H * 0.38 + 26, width: W, fontSize: 13, textAlign: "right" }),
    { type: "rect", left: L, top: T + H * 0.62, width: W, height: 4, fill: s.primary, rx: 2, ry: 2 },
    txt("Address Line 1", s.primary, { left: L, top: T + H * 0.70, width: W * 0.6, fontSize: 12 }),
    txt("Phone / Other", s.accent, { left: L + W * 0.55, top: T + H * 0.78, width: W * 0.45, fontSize: 12, textAlign: "right" }),
  ]};
}
function banded(s, g) {
  const L = g.safeBox.left, T = g.safeBox.top, W = g.safeBox.width, H = g.safeBox.height;
  return { version: "6.0.0", background: "#ffffff", objects: [
    { type: "rect", left: g.trim.left, top: g.trim.top, width: g.trim.width, height: H * 0.42 + g.safe, fill: s.primary },
    txt("COMPANY NAME", "#ffffff", { left: L, top: T + 10, width: W, fontSize: 24, fontWeight: "bold", fontFamily: "Arial" }),
    txt("Web / Other", "#ffffff", { left: L, top: T + 40, width: W, fontSize: 12, fontFamily: "Arial" }),
    txt("FULL NAME", s.primary, { left: L, top: T + H * 0.55, width: W, fontSize: 18, fontWeight: "bold", fontFamily: "Arial" }),
    txt("Job Title", s.accent, { left: L, top: T + H * 0.55 + 22, width: W, fontSize: 12, fontFamily: "Arial" }),
    txt("Email / Other\nMobile / Other\nAddress Line 1", s.primary, { left: L, top: T + H * 0.72, width: W, fontSize: 11, fontFamily: "Arial", lineHeight: 1.4 }),
  ]};
}
function monogram(s, g) {
  const L = g.safeBox.left, T = g.safeBox.top, W = g.safeBox.width, H = g.safeBox.height;
  return { version: "6.0.0", background: "#F7F6F2", objects: [
    { type: "circle", left: L + W / 2, top: T + H * 0.28, radius: 34, originX: "center", originY: "center", fill: "transparent", stroke: s.primary, strokeWidth: 2 },
    txt("H", s.primary, { left: L + W / 2 - 12, top: T + H * 0.28 - 20, width: 24, fontSize: 34, fontWeight: "bold", textAlign: "center" }),
    txt("FULL NAME", s.primary, { left: L, top: T + H * 0.58, width: W, fontSize: 20, fontWeight: "bold", textAlign: "center", fontFamily: "Georgia" }),
    txt("job title", s.accent, { left: L, top: T + H * 0.58 + 26, width: W, fontSize: 12, textAlign: "center", fontFamily: "Georgia" }),
    txt("email  ·  phone  ·  web", s.primary, { left: L, top: T + H * 0.82, width: W, fontSize: 11, textAlign: "center", fontFamily: "Georgia" }),
  ]};
}

export const VC_TEMPLATES = [
  { id: "classic",  name: "Classic",  industry: "Corporate", build: classic },
  { id: "banded",   name: "Banded",   industry: "Corporate", build: banded },
  { id: "monogram", name: "Monogram", industry: "Creative",  build: monogram },
];

export function getVcTemplate(id) { return VC_TEMPLATES.find((t) => t.id === id) || VC_TEMPLATES[0]; }
export function getVcScheme(id) { return VC_SCHEMES.find((s) => s.id === id) || VC_SCHEMES[0]; }