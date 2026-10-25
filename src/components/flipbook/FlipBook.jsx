import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArrowsPointingOut,
  HiOutlineArrowsPointingIn,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import { useMediaQuery, usePrefersReducedMotion } from "../../animations/hooks";
import { lockScroll, unlockScroll } from "../../animations/lenis";
import BookFace from "./BookFace";
import { flapMatrix, foldAt, mirror, placeStrip, polygon, smoothstep, splitSheet } from "./fold";
import "../../styles/flipbook.scss";

// A book whose pages turn like paper: the corner lifts, a fold runs across the sheet and the back of
// the page comes over (geometry in fold.js). Landscape shows two pages side by side; portrait shows
// one page that turns away to the left. The layout follows the screen: whichever fits it better is
// picked again on every resize, so turning a phone switches it. Turn by dragging, clicking a page,
// the arrows, the keyboard or the slider; hovering a corner lifts it a little.

const TURN = 0.9; // seconds for a full turn
const TURN_EASE = [0.42, 0, 0.3, 1];
const PAD = 24;
const SPREAD_MIN = 0.8; // two pages only while each keeps at least this share of a single page's size
const REVERSE = -1; // the blank back of a page in portrait

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const useSize = (ref) => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
};

const FlipBook = ({ book }) => {
  const { pages, pageAspect = 210 / 297, pdf } = book;
  const n = pages.length;
  const reduce = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const bookRef = useRef(null);
  const size = useSize(stageRef);

  // ---- Layout and size: the biggest book that fits the stage ---------------------------------
  // A wide stage (desktop, a phone held sideways) holds two pages at full height: landscape. A tall
  // one would shrink them to half its width: portrait, one page as big as the stage allows.
  const side = wide ? 72 : 0; // room for the side arrows
  const pad = Math.min(PAD, Math.round(size.h * 0.05));
  const availW = Math.max(0, size.w - 2 * (pad + side));
  const availH = Math.max(0, size.h - 2 * pad);
  const fit = (c) => Math.floor(Math.min(availW / c, availH * pageAspect));
  const spread = n > 1 && fit(2) >= fit(1) * SPREAD_MIN;
  const cols = spread ? 2 : 1;
  const pw = fit(cols);
  const ph = Math.floor(pw / pageAspect);

  // `page` = first visible page, kept across view switches. `pos` = sheets turned in this view.
  const [page, setPage] = useState(0);
  const maxPos = spread ? Math.floor(n / 2) : n - 1;
  const pos = clamp(spread ? Math.floor((page + 1) / 2) : page, 0, maxPos);

  // ---- The turn in progress ------------------------------------------------------------------
  // turn = { id, dir: 1 | -1, from, to, top, kind: "peek" | "drag" | "run", commit }
  // The corner position lives in a ref and is painted straight onto the DOM every frame.
  const [turn, setTurn] = useState(null);
  const turnRef = useRef(null);
  const corner = useRef({ x: 0, y: 0 });
  const anim = useRef(null);
  const pending = useRef(null);
  const ids = useRef(0);
  const live = useRef({ pos: 0, W: 0, H: 0, spread: true });
  const el = {
    v: useRef(null),
    vShade: useRef(null),
    lift: useRef(null),
    flap: useRef(null),
    flapShade: useRef(null),
    underShade: useRef(null),
  };

  useLayoutEffect(() => {
    live.current = { pos, W: pw, H: ph, spread };
  });

  const putTurn = (t) => {
    turnRef.current = t;
    setTurn(t);
  };

  const paint = () => {
    const t = turnRef.current;
    const { W, H, spread: sp } = live.current;
    const v = el.v.current;
    const flap = el.flap.current;
    const lift = el.lift.current;
    if (!t || !v || !flap || !W) return;
    const back = t.dir < 0;
    const g = foldAt(W, H, t.top, corner.current.x, corner.current.y);
    if (!g) {
      v.style.clipPath = "none";
      flap.style.clipPath = polygon([]);
      lift.style.filter = "none";
      [el.vShade, el.flapShade, el.underShade].forEach((r) => r.current && (r.current.style.opacity = "0"));
      return;
    }
    corner.current = g.P;
    const { flat, folded } = splitSheet(W, H, g);
    v.style.clipPath = polygon(back ? mirror(W, flat) : flat);
    flap.style.clipPath = polygon(back ? folded : mirror(W, folded));
    flap.style.transform = flapMatrix(g, W, back);

    // Shading: strongest mid-turn, gone when the sheet lies flat again.
    const f = Math.min(1, Math.sin(Math.PI * g.progress) * 2.2);
    const away = { x: -g.n.x, y: -g.n.y };
    placeStrip(el.flapShade.current, W, H, g, g.n, !back, Math.min(g.depth, W * 0.6), f);
    placeStrip(el.vShade.current, W, H, g, away, back, Math.min(g.depth * 0.5, W * 0.18), f);
    placeStrip(el.underShade.current, W, H, g, g.n, back, Math.min(g.depth * 0.7, W * 0.3), f);
    lift.style.filter = `drop-shadow(0 0 ${(3 + 12 * f).toFixed(1)}px color-mix(in srgb, var(--paper-shade) ${Math.round(42 * f)}%, transparent))`;

    // Portrait: the part of the sheet beyond the spine leaves the stage instead of piling up.
    if (!sp) {
      if (back) v.style.opacity = smoothstep(0, 0.3, g.progress).toFixed(3);
      else lift.style.opacity = (1 - smoothstep(0.72, 1, g.progress)).toFixed(3);
    }
  };

  const restCorner = (t) => ({ x: live.current.W, y: t.top ? 0 : live.current.H });

  const runTo = (target, { duration, arc = 0, onDone }) => {
    anim.current?.stop();
    const start = { ...corner.current };
    anim.current = animate(0, 1, {
      duration,
      ease: TURN_EASE,
      onUpdate: (k) => {
        corner.current = {
          x: start.x + (target.x - start.x) * k,
          y: start.y + (target.y - start.y) * k + arc * Math.sin(Math.PI * k),
        };
        paint();
      },
      onComplete: () => {
        anim.current = null;
        onDone?.();
      },
    });
  };

  const commit = (to) => {
    live.current.pos = to;
    const sp = live.current.spread;
    setPage(sp ? (to === 0 ? 0 : 2 * to - 1) : to);
  };

  const clearTurn = () => {
    anim.current?.stop();
    anim.current = null;
    pending.current = null;
    putTurn(null);
  };

  // Drop whatever is moving: a turn on its way to the next page lands there at once.
  const settle = () => {
    const t = turnRef.current;
    if (t) {
      if (t.kind === "run" && t.commit) commit(t.to);
      clearTurn();
    }
    return live.current.pos;
  };

  const startTurn = (t, job) => {
    const next = { ...t, id: (ids.current += 1) };
    corner.current = restCorner(next);
    pending.current = job || null;
    putTurn(next);
  };

  // Paint a new turn before the browser shows it, then start its first move.
  useLayoutEffect(() => {
    if (!turn) return;
    paint();
    const job = pending.current;
    pending.current = null;
    job?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn?.id]);

  // Carry the current turn to the end (commit) or let the sheet fall back (revert).
  const finish = (commitIt, fromDrag = false) => {
    const t = turnRef.current;
    if (!t) return;
    putTurn({ ...t, kind: "run", commit: commitIt });
    const { W, H } = live.current;
    const rest = restCorner(t);
    const target = commitIt ? { x: -W, y: rest.y } : rest;
    const dist = Math.hypot(target.x - corner.current.x, target.y - corner.current.y) / (2 * W);
    const fullSweep = commitIt && !fromDrag;
    runTo(target, {
      duration: reduce ? 0.01 : clamp(TURN * (fullSweep ? 1 : dist * 1.15), 0.22, TURN),
      arc: fullSweep ? (t.top ? 1 : -1) * 0.16 * H : 0,
      onDone: () => {
        if (commitIt) commit(t.to);
        clearTurn();
      },
    });
  };

  const turnTo = (getTarget) => {
    const t = turnRef.current;
    if (t && t.kind === "peek") {
      const to = clamp(getTarget(t.from), 0, maxPos);
      if (Math.sign(to - t.from) === t.dir) {
        turnRef.current = { ...t, to };
        finish(true);
        return;
      }
    }
    const base = settle();
    const to = clamp(getTarget(base), 0, maxPos);
    if (to === base) return;
    if (reduce) {
      commit(to);
      return;
    }
    startTurn({ dir: to > base ? 1 : -1, from: base, to, top: false, kind: "run", commit: true }, () => finish(true));
  };
  const next = () => turnTo((b) => b + 1);
  const prev = () => turnTo((b) => b - 1);
  const jump = (p) => turnTo(() => p);

  // A resize or a view switch drops the turn (its geometry belongs to the old size).
  useEffect(() => {
    settle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pw, ph, spread]);

  // ---- Pointer: drag a page, click to turn, hover a corner to lift it -------------------------
  const drag = useRef(null);

  const locate = (e) => {
    const r = bookRef.current.getBoundingClientRect();
    return { r, x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const hoverZone = ({ r, x, y }) => {
    const pageW = r.width / cols;
    const top = y < r.height * 0.22;
    if (!top && y < r.height * 0.78) return null;
    if (x > r.width - pageW * 0.2) return { dir: 1, top };
    if (spread && x < pageW * 0.2) return { dir: -1, top };
    return null;
  };

  const onPointerDown = (e) => {
    drag.current = null;
    if (e.button !== 0 || e.target.closest("a, button")) return;
    const { r, x, y } = locate(e);
    drag.current = {
      dir: x >= r.width / 2 ? 1 : -1,
      top: y < r.height / 2,
      sx: e.clientX,
      sy: e.clientY,
      lastX: e.clientX,
      lastT: e.timeStamp,
      v: 0,
      moved: false,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) {
      if (e.pointerType !== "mouse" || e.buttons || reduce) return;
      const t = turnRef.current;
      if (t && t.kind !== "peek") return;
      const zone = hoverZone(locate(e));
      const same = t && zone && zone.dir === t.dir && zone.top === t.top;
      if (t && !same) finish(false);
      if (zone && !t) {
        const base = live.current.pos;
        if (zone.dir > 0 ? base >= maxPos : base <= 0) return;
        const { W, H } = live.current;
        startTurn({ dir: zone.dir, from: base, to: base + zone.dir, top: zone.top, kind: "peek" }, () =>
          runTo({ x: W * 0.8, y: zone.top ? W * 0.12 : H - W * 0.12 }, { duration: 0.4 })
        );
      }
      return;
    }

    const dx = e.clientX - d.sx;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      const t = turnRef.current;
      if (t && t.kind === "peek" && t.dir === d.dir && t.top === d.top) {
        anim.current?.stop();
        putTurn({ ...t, kind: "drag" });
      } else {
        const base = settle();
        if (d.dir > 0 ? base >= maxPos : base <= 0) {
          drag.current = null;
          return;
        }
        startTurn({ dir: d.dir, from: base, to: base + d.dir, top: d.top, kind: "drag" });
      }
      d.moved = true;
      d.origin = { ...corner.current };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // pointer already gone; the drag still ends on pointerup / pointercancel
      }
    }
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = ((e.clientX - d.lastX) / dt) * d.dir; // canonical: negative = towards the spine
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    corner.current = { x: d.origin.x + dx * d.dir * 1.15, y: d.origin.y + (e.clientY - d.sy) };
    paint();
  };

  const endDrag = (cancelled) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      if (!cancelled) (d.dir > 0 ? next : prev)();
      return;
    }
    finish(!cancelled && (corner.current.x < 0 || d.v < -0.45), true);
  };

  const onPointerLeave = () => {
    if (turnRef.current?.kind === "peek") finish(false);
  };

  // ---- Keyboard: arrows anywhere on the page; Home / End / Page keys only inside the viewer ------
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
      const inside = rootRef.current?.contains(e.target);
      const actions = { ArrowRight: next, ArrowLeft: prev };
      if (inside) Object.assign(actions, { PageDown: next, PageUp: prev, Home: () => jump(0), End: () => jump(maxPos) });
      const act = actions[e.key];
      if (act) {
        e.preventDefault();
        act();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ---- Full screen: the real thing where it exists, otherwise a fixed overlay ------------------
  const [nativeFull, setNativeFull] = useState(false);
  const [overlayFull, setOverlayFull] = useState(false);
  const full = nativeFull || overlayFull;

  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === rootRef.current;
      setNativeFull(on);
      if (on) setOverlayFull(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!overlayFull) return undefined;
    lockScroll();
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOverlayFull(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [overlayFull]);

  const toggleFull = () => {
    if (document.fullscreenElement) return void document.exitFullscreen();
    if (overlayFull) return setOverlayFull(false);
    const node = rootRef.current;
    if (!node.requestFullscreen) return setOverlayFull(true);
    // Some embedded browsers neither enter full screen nor reject: fall back after a moment.
    const fallback = setTimeout(() => !document.fullscreenElement && setOverlayFull(true), 1200);
    node.requestFullscreen().catch(() => {
      clearTimeout(fallback);
      setOverlayFull(true);
    });
  };

  // ---- What lies where -------------------------------------------------------------------------
  const L = (s) => (s > 0 && 2 * s - 1 < n ? 2 * s - 1 : null);
  const R = (s) => (2 * s < n ? 2 * s : null);
  const back = turn?.dir < 0;
  let left = null;
  let right = null;
  let single = null;
  let vIdx = null;
  let flapIdx = null;
  let under = false;
  if (spread) {
    if (!turn) [left, right] = [L(pos), R(pos)];
    else if (!back) [left, right, vIdx, flapIdx] = [L(turn.from), R(turn.to), R(turn.from), L(turn.to)];
    else [left, right, vIdx, flapIdx] = [L(turn.to), R(turn.from), L(turn.from), R(turn.to)];
    if (turn) under = (back ? left : right) !== null;
  } else if (!turn) single = pos;
  else if (!back) [single, vIdx, flapIdx, under] = [turn.to, turn.from, REVERSE, true];
  else [single, vIdx, flapIdx] = [turn.from, REVERSE, turn.to];

  // Where the book is heading: a closed book (only a cover showing) sits in the middle.
  const shown = turn?.kind === "run" && turn.commit ? turn.to : turn ? turn.from : pos;
  const shift = spread ? (shown === 0 ? -pw / 2 : shown === maxPos && n % 2 === 0 ? pw / 2 : 0) : 0;

  let label;
  if (!spread) label = `${shown + 1}`;
  else if (shown === 0) label = "1";
  else if (shown === maxPos && n % 2 === 0) label = `${n}`;
  else label = `${2 * shown}–${2 * shown + 1}`;

  // Stacked page edges: a hint of how much is left to read.
  const edge = (sheets) => clamp(sheets * 0.9, 0, 7);
  const sheets = spread ? Math.ceil(n / 2) : n;
  const edgeR = edge(sheets - shown - 1);
  const edgeL = spread ? edge(shown - 1) : 0;

  const face = (idx) => <BookFace page={pages[idx]} number={idx + 1} book={book} key={idx} />;
  const pageStyle = (x) => ({ left: x, width: pw, height: ph });

  return (
    <div
      ref={rootRef}
      className={`flipbook ${full ? "is-full" : ""} ${overlayFull ? "is-overlay" : ""}`}
      data-lenis-prevent={overlayFull || undefined}
    >
      <div className="fb-stage" ref={stageRef}>
        <span className="fb-stage__glow" aria-hidden="true" />

        {wide && (
          <button type="button" className="fb-arrow fb-arrow--prev" onClick={prev} disabled={shown <= 0} aria-label="Previous page">
            <HiChevronLeft />
          </button>
        )}

        {pw > 0 && (
          <motion.div
            key={spread ? "spread" : "single"}
            className={`fb-book ${spread ? "is-spread" : "is-single"} ${!spread || left !== null ? "has-l" : ""} ${right !== null ? "has-r" : ""}`}
            ref={bookRef}
            style={{ width: pw * cols, height: ph }}
            initial={{ opacity: 0, scale: 0.96, x: shift }}
            animate={{ opacity: 1, scale: 1, x: shift }}
            transition={{ duration: reduce ? 0 : TURN, ease: TURN_EASE, opacity: { duration: 0.4 } }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => endDrag(false)}
            onPointerCancel={() => endDrag(true)}
            onPointerLeave={onPointerLeave}
            role="region"
            aria-roledescription="book"
            aria-label={`${book.title}, page ${label} of ${n}`}
          >
            <span className="fb-edge fb-edge--right" style={{ width: edgeR }} aria-hidden="true" />
            {spread && <span className="fb-edge fb-edge--left" style={{ width: edgeL }} aria-hidden="true" />}

            {spread && left !== null && (
              <div className="fb-page fb-face fb-face--back" style={pageStyle(0)}>{face(left)}</div>
            )}
            {spread && right !== null && (
              <div className="fb-page fb-face fb-face--front" style={pageStyle(pw)}>{face(right)}</div>
            )}
            {!spread && single !== null && (
              <div className="fb-page fb-face fb-face--front" style={pageStyle(0)}>{face(single)}</div>
            )}

            {turn && (
              <div className="fb-fold" style={{ left: spread ? pw : 0 }} aria-hidden="true">
                {under && (
                  <div className="fb-fold__under" style={pageStyle(back ? -pw : 0)}>
                    <i ref={el.underShade} className="fb-fold__shade fb-fold__shade--under" />
                  </div>
                )}
                <div ref={el.v} className={`fb-fold__page fb-face ${back ? "fb-face--back" : "fb-face--front"}`} style={pageStyle(back ? -pw : 0)}>
                  {face(vIdx)}
                  <i ref={el.vShade} className="fb-fold__shade fb-fold__shade--curl" />
                </div>
                <div ref={el.lift} className="fb-fold__lift">
                  <div ref={el.flap} className={`fb-fold__page fb-fold__flap fb-face ${back ? "fb-face--front" : "fb-face--back"}`} style={pageStyle(0)}>
                    {face(flapIdx)}
                    <i ref={el.flapShade} className="fb-fold__shade fb-fold__shade--flap" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {wide && (
          <button type="button" className="fb-arrow fb-arrow--next" onClick={next} disabled={shown >= maxPos} aria-label="Next page">
            <HiChevronRight />
          </button>
        )}
      </div>

      <div className="fb-bar" role="toolbar" aria-label={`${book.title} controls`}>
        {!wide && (
          <button type="button" className="fb-btn" onClick={prev} disabled={shown <= 0} aria-label="Previous page">
            <HiChevronLeft />
          </button>
        )}
        <span className="fb-bar__count" aria-live="polite">
          {label} <i>/</i> {n}
        </span>
        <input
          type="range"
          className="fb-bar__range"
          min={0}
          max={maxPos}
          step={1}
          value={shown}
          onChange={(e) => jump(Number(e.target.value))}
          style={{ "--p": `${maxPos ? (shown / maxPos) * 100 : 0}%` }}
          aria-label="Go to page"
          aria-valuetext={`Page ${label} of ${n}`}
        />
        {!wide && (
          <button type="button" className="fb-btn" onClick={next} disabled={shown >= maxPos} aria-label="Next page">
            <HiChevronRight />
          </button>
        )}

        <span className="fb-bar__sep" aria-hidden="true" />

        {pdf && (
          <a className="fb-btn" href={pdf} download aria-label="Download PDF" title="Download PDF">
            <HiOutlineArrowDownTray />
          </a>
        )}
        <button type="button" className="fb-btn" onClick={toggleFull} aria-label={full ? "Exit full screen" : "Full screen"} title={full ? "Exit full screen" : "Full screen"}>
          {full ? <HiOutlineArrowsPointingIn /> : <HiOutlineArrowsPointingOut />}
        </button>
      </div>
    </div>
  );
};

export default FlipBook;
