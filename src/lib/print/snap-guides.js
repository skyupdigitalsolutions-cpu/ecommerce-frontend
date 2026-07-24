/* Attach smart alignment guides to a fabric canvas.
 * While an object moves, draws red lines when its center or edges align to the
 * canvas center or to other objects, and snaps to them within `threshold` px.
 * Guides only render during an active drag — they never show on hover and
 * are cleared the instant the drag ends (mouse up) or a new interaction starts. */
export function attachSnapGuides(canvas, g, fabric, threshold = 6) {
  let vLines = [];
  let hLines = [];
  const ctxLineColor = "#F43F5E";

  const clear = () => { vLines = []; hLines = []; };
  const drawLine = (isV, pos) => (isV ? vLines : hLines).push(pos);

  const onMoving = (e) => {
    const obj = e.target;
    if (!obj) return;
    clear();
    const cx = g.canvasW / 2, cy = g.canvasH / 2;
    const b = obj.getBoundingRect();
    const objCX = b.left + b.width / 2;
    const objCY = b.top + b.height / 2;

    if (Math.abs(objCX - cx) < threshold) { obj.set({ left: obj.left + (cx - objCX) }); drawLine(true, cx); }
    if (Math.abs(objCY - cy) < threshold) { obj.set({ top: obj.top + (cy - objCY) }); drawLine(false, cy); }

    canvas.getObjects().forEach((other) => {
      if (other === obj || other.excludeFromExport) return;
      const ob = other.getBoundingRect();
      const oCX = ob.left + ob.width / 2, oCY = ob.top + ob.height / 2;
      if (Math.abs(objCX - oCX) < threshold) { obj.set({ left: obj.left + (oCX - objCX) }); drawLine(true, oCX); }
      if (Math.abs(objCY - oCY) < threshold) { obj.set({ top: obj.top + (oCY - objCY) }); drawLine(false, oCY); }
      if (Math.abs(b.left - ob.left) < threshold) drawLine(true, ob.left);
      if (Math.abs(b.top - ob.top) < threshold) drawLine(false, ob.top);
    });
  };

  const onAfterRender = () => {
    if (!vLines.length && !hLines.length) return;
    const ctx = canvas.getSelectionContext ? canvas.getSelectionContext() : canvas.contextTop;
    if (!ctx) return;
    ctx.save();
    ctx.strokeStyle = ctxLineColor;
    ctx.lineWidth = 1;
    const z = canvas.getZoom();
    vLines.forEach((x) => { ctx.beginPath(); ctx.moveTo(x * z, 0); ctx.lineTo(x * z, canvas.height); ctx.stroke(); });
    hLines.forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y * z); ctx.lineTo(canvas.width, y * z); ctx.stroke(); });
    ctx.restore();
  };

  // Clears any guide lines and forces a repaint (which erases the old lines
  // from the overlay/selection context) whenever a drag isn't actively happening.
  const onClear = () => {
    if (!vLines.length && !hLines.length) return;
    clear();
    canvas.requestRenderAll();
  };

  canvas.on("object:moving", onMoving);
  canvas.on("after:render", onAfterRender);
  canvas.on("object:modified", onClear);
  canvas.on("mouse:up", onClear);
  canvas.on("mouse:down", onClear);
  canvas.on("selection:cleared", onClear);

  return () => {
    canvas.off("object:moving", onMoving);
    canvas.off("after:render", onAfterRender);
    canvas.off("object:modified", onClear);
    canvas.off("mouse:up", onClear);
    canvas.off("mouse:down", onClear);
    canvas.off("selection:cleared", onClear);
  };
}