import {
  RiCompass3Line,
  RiRouteLine,
  RiLayoutMasonryLine,
  RiCodeSSlashLine,
  RiShieldCheckLine,
  RiRocketLine,
  RiLifebuoyLine,
} from "react-icons/ri";
import { PROCESS_PHASES } from "../../data/siteCopy";

export const pad = (n) => String(n).padStart(2, "0");

// The seven phases: copy lives in src/data/siteCopy.js (shared with the crawlable copy); icons stay here, in order.
const PHASE_ICONS = [RiCompass3Line, RiRouteLine, RiLayoutMasonryLine, RiCodeSSlashLine, RiShieldCheckLine, RiRocketLine, RiLifebuoyLine];
export const PHASES = PROCESS_PHASES.map((p, i) => ({ ...p, icon: PHASE_ICONS[i] }));

// A smooth path through one point per phase (Catmull-Rom -> cubic Bezier), in a 1000 x 200 box.
// The same points position the stops in the hero, so labels sit exactly on the line.
export const ROUTE_W = 1000;
export const ROUTE_H = 200;
export const routePoints = (n) =>
  Array.from({ length: n }, (_, i) => ({
    x: 50 + (i * (ROUTE_W - 100)) / Math.max(1, n - 1),
    y: i % 2 === 0 ? 135 : 62,
  }));

export const routePath = (pts) => {
  const f = (v) => v.toFixed(1);
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${f(c1.x)} ${f(c1.y)}, ${f(c2.x)} ${f(c2.y)}, ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
};
