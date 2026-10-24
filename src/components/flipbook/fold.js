// Paper fold geometry for the flipbook.
//
// Everything is worked out in one "canonical" picture: the turning sheet lies on the right of the
// spine (x = 0), W wide and H tall, and its free corner C0 = (W, H) (or (W, 0) for the top corner)
// is pulled to the point P. The fold is the perpendicular bisector of C0-P: the part of the sheet on
// the corner side flips over that line and shows its back. A sheet turning back (left to right) is
// the same picture mirrored, so the caller only swaps which element gets which result.

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// The sheet is bound at the spine, so the corner can only travel within reach of both spine ends.
const reach = (W, H, top, x, y) => {
  const near = { x: 0, y: top ? 0 : H };
  const far = { x: 0, y: top ? H : 0 };
  const diag = Math.hypot(W, H);
  for (let k = 0; k < 2; k += 1) {
    let dx = x - near.x;
    let dy = y - near.y;
    let d = Math.hypot(dx, dy);
    if (d > W) {
      x = near.x + (dx / d) * W;
      y = near.y + (dy / d) * W;
    }
    dx = x - far.x;
    dy = y - far.y;
    d = Math.hypot(dx, dy);
    if (d > diag) {
      x = far.x + (dx / d) * diag;
      y = far.y + (dy / d) * diag;
    }
  }
  return { x, y };
};

// Fold for corner point (x, y). Returns null while the sheet lies flat.
//   P: the (reachable) corner position   A: a point on the fold line
//   n: unit normal of the fold, pointing to the corner side   depth: corner to fold distance
//   progress: 0 flat on the right ... 1 lying on the left
export const foldAt = (W, H, top, x, y) => {
  const P = reach(W, H, top, x, y);
  const cx = W;
  const cy = top ? 0 : H;
  const vx = cx - P.x;
  const vy = cy - P.y;
  const len = Math.hypot(vx, vy);
  if (len < 0.5) return null;
  return {
    P,
    A: { x: (cx + P.x) / 2, y: (cy + P.y) / 2 },
    n: { x: vx / len, y: vy / len },
    depth: len / 2,
    progress: clamp((W - P.x) / (2 * W), 0, 1),
  };
};

// Split the sheet rectangle along the fold: `flat` stays where it was, `folded` flips over.
export const splitSheet = (W, H, { A, n }) => {
  const pts = [[0, 0], [W, 0], [W, H], [0, H]];
  const side = ([x, y]) => (x - A.x) * n.x + (y - A.y) * n.y;
  const flat = [];
  const folded = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % 4];
    const sp = side(p);
    const sq = side(q);
    (sp > 0 ? folded : flat).push(p);
    if (sp > 0 !== sq > 0) {
      const t = sp / (sp - sq);
      const m = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      flat.push(m);
      folded.push(m);
    }
  });
  return { flat, folded };
};

export const mirror = (W, pts) => pts.map(([x, y]) => [W - x, y]);

export const polygon = (pts) =>
  pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(", ")})`;

// CSS matrix placing the back of the sheet over its folded position: a reflection across the fold
// composed with the reflection across the spine (where the back would lie once turned), which is a
// plain rotation + translation.
//   forward: the element starts on the left page (local x shifted by -W)
//   back:    mirrored picture; the element starts on the right page
export const flapMatrix = ({ A, n }, W, back) => {
  const dx = -n.y;
  const dy = n.x;
  const xx = dx * dx - dy * dy;
  const xy = 2 * dx * dy;
  const tx = A.x - (xx * A.x + xy * A.y);
  const ty = A.y - (xy * A.x - xx * A.y);
  const m = back ? [-xx, xy, -xy, -xx, -tx, ty] : [-xx, -xy, xy, -xx, tx + xx * W, ty + xy * W];
  return `matrix(${m.map((v) => v.toFixed(5)).join(", ")})`;
};

// Lay a shading strip along the fold line, reaching `size` px into the side `normal` points to.
// `flip` = the element's local x runs mirrored (W - x).
export const placeStrip = (el, W, H, { A }, normal, flip, size, alpha) => {
  if (!el) return;
  const px = flip ? W - A.x : A.x;
  const nx = flip ? -normal.x : normal.x;
  const L = 2 * Math.hypot(W, H);
  el.style.width = `${L}px`;
  el.style.height = `${Math.max(1, size).toFixed(1)}px`;
  el.style.transform = `translate(${px.toFixed(2)}px, ${A.y.toFixed(2)}px) rotate(${Math.atan2(-nx, normal.y).toFixed(5)}rad) translate(${(-L / 2).toFixed(1)}px, 0)`;
  el.style.opacity = alpha.toFixed(3);
};

export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
