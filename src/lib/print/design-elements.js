/* Reusable design elements for the editor. All generic vector shapes + a QR
 * generator. Each function receives (fabric, g) and returns a fabric object
 * (or Promise of one) ready to add to the canvas. */

export function makeWave(fabric, g, fill = "#3B82F6") {
  const { Path } = fabric;
  const w = g.trim.width, x = g.trim.left, yTop = g.trim.top + g.trim.height * 0.55;
  const d = `M ${x} ${yTop}
             C ${x + w * 0.3} ${yTop - 40}, ${x + w * 0.6} ${yTop + 40}, ${x + w} ${yTop - 10}
             L ${x + w} ${g.trim.top + g.trim.height}
             L ${x} ${g.trim.top + g.trim.height} Z`;
  return new Path(d, { fill, selectable: true, opacity: 0.9 });
}

export function makeCornerBand(fabric, g, fill = "#2E7D6E") {
  const { Rect } = fabric;
  return new Rect({
    left: g.trim.left, top: g.trim.top,
    width: g.trim.width, height: g.trim.height * 0.62,
    fill, selectable: true,
  });
}

export function makeDivider(fabric, g, fill = "#C9A94E") {
  const { Rect } = fabric;
  return new Rect({
    left: g.trim.left + g.trim.width / 2, top: g.trim.top + g.trim.height * 0.2,
    width: 2, height: g.trim.height * 0.6, fill, selectable: true,
  });
}

export function makeIconRow(fabric, g, label, glyph, color = "#2E7D6E") {
  const { Group, Circle, Textbox } = fabric;
  const dot = new Circle({ radius: 9, left: 0, top: 0, fill: color, originX: "center", originY: "center" });
  const ic = new Textbox(glyph, { left: -6, top: -7, width: 14, fontSize: 10, fill: "#fff", textAlign: "center", fontFamily: "Arial" });
  const tx = new Textbox(label, { left: 18, top: -8, width: 160, fontSize: 12, fill: "#333", fontFamily: "Arial" });
  return new Group([dot, ic, tx], { left: g.safeBox.left, top: g.safeBox.top + g.safeBox.height / 2 });
}

export async function makeQR(fabric, g, text = "https://example.com") {
  const QR = (await import("qrcode")).default;
  const dataUrl = await QR.toDataURL(text, { margin: 1, width: 256 });
  const { FabricImage } = fabric;
  const img = await FabricImage.fromURL(dataUrl);
  const size = Math.min(g.trim.width, g.trim.height) * 0.3;
  img.set({ left: g.safeBox.left, top: g.safeBox.top, scaleX: size / img.width, scaleY: size / img.height });
  return img;
}
export function makeStar(fabric, g, fill = "#F5A623") {
  const { Path } = fabric;
  const d = "M 50 5 L 61 39 L 98 39 L 68 61 L 79 95 L 50 74 L 21 95 L 32 61 L 2 39 L 39 39 Z";
  return new Path(d, { fill, scaleX: 0.8, scaleY: 0.8 });
}
export function makeBadge(fabric, g, fill = "#0037CA") {
  const { Rect } = fabric;
  return new Rect({ width: 120, height: 34, fill, rx: 17, ry: 17 });
}
export function makeArrow(fabric, g, fill = "#111827") {
  const { Path } = fabric;
  return new Path("M 0 10 L 40 10 L 40 4 L 54 15 L 40 26 L 40 20 L 0 20 Z", { fill });
}
export function makeDotGrid(fabric, g, fill = "#C9CCD4") {
  const { Group, Circle } = fabric;
  const dots = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
    dots.push(new Circle({ left: c * 10, top: r * 10, radius: 1.6, fill }));
  return new Group(dots);
}