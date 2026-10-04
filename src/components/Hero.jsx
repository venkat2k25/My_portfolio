import { useCallback, useEffect, useRef, useState } from "react";
import { quickFacts, socials } from "../data/content";
import { scrollToId } from "../lib/smoothScroll";

/* ------------------------------------------------------------------ */
/*  Edit this block – copy and labels (links come from data/content)   */
/* ------------------------------------------------------------------ */
const PROFILE = {
  name: "VENKATA RAJA",
  role: "SOFTWARE ENGINEER · AI & FULL-STACK",
  headline: ["Reliable systems,", "intelligent products."],
  intro:
    "Software Engineer at TCS. " +
    "Alongside that, I build AI-driven analytics, computer-vision and full-stack applications.",
  availability: "OPEN TO OPPORTUNITIES",
  social: socials,
};

/* ------------------------------------------------------------------ */
/*  Head-tracking behaviour – tune here                                */
/* ------------------------------------------------------------------ */
// 60 frames, 1920×1080 WebP, in /public/portrait/001.webp … 060.webp
const TOTAL_FRAMES = 60;
// Small screens crop the same 16:9 source sequence in the responsive layout.
const TOUCH = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
// Phones / tablets (by device, not screen width): the head follows the tilt sensor instead of the cursor.
const PHONE =
  typeof navigator !== "undefined" &&
  (navigator.userAgentData?.mobile ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) || // iPadOS reports as a Mac
    (TOUCH && !window.matchMedia("(hover: hover)").matches));
const frameUrl = (i) => `/portrait/${String(i + 1).padStart(3, "0")}.webp`;
// Touch devices / slow connections decode frames at a smaller size to save memory.
const LITE =
  typeof window !== "undefined" &&
  (TOUCH ||
    !!navigator.connection?.saveData ||
    ["slow-2g", "2g", "3g"].includes(navigator.connection?.effectiveType));
// Canvas / decode resolution (same aspect as the source frames)
const FRAME_W = LITE ? 854 : 1280;
const FRAME_H = LITE ? 480 : 720;

const GAIN = 1.5; // >1 = more sensitive: full head turn is reached before the cursor hits the screen edge
const CURVE = 0.78; // <1 = small cursor movements already turn the head noticeably
const SMOOTH_TIME = 0.26; // seconds of "lag" – lower = snappier, higher = calmer
const MAX_SPEED = 70; // frames / second cap so the head never whips

// cursor x (-1 … 1) -> frame index (0–59)
const ANCHORS = [
  [-1, 3], //  far left   ≈ 45° left
  [-0.5, 13], //  left       ≈ 20–30° left
  [0, 21], //  center     ≈ 0° (facing the visitor)
  [0.5, 36], //  right      ≈ 20–30° right
  [1, 49], //  far right  ≈ 45° right
];
const POSTER_SRC = frameUrl(ANCHORS[2][1]); // centre frame, shown instantly while frames stream in

// Floating geometric shapes. x/y = position (% of the hero), size in px,
// depth = how much it drifts with the cursor (parallax), dur = float cycle in s.
// Kept clear of the face (centre) and the text blocks (bottom corners).
// On phones only the first four are shown.
const SHAPES = [
  { kind: "ring", x: 8, y: 20, size: 64, depth: 18, dur: 7 },
  { kind: "triangle", x: 24, y: 12, size: 34, depth: 30, dur: 5.5, accent: true },
  { kind: "square", x: 76, y: 14, size: 30, depth: 24, dur: 6.5 },
  { kind: "plus", x: 90, y: 28, size: 22, depth: 36, dur: 4.5, accent: true },
  { kind: "dots", x: 86, y: 44, size: 70, depth: 12, dur: 8 },
  { kind: "ring", x: 68, y: 80, size: 18, depth: 40, dur: 5, accent: true },
  { kind: "triangle", x: 56, y: 90, size: 24, depth: 26, dur: 7.5 },
];

function ShapeSvg({ kind }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" };
  switch (kind) {
    case "ring":
      return <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" {...s} /></svg>;
    case "triangle":
      return <svg viewBox="0 0 100 100"><path d="M50 6 L95 88 L5 88 Z" strokeLinejoin="round" {...s} /></svg>;
    case "square":
      return <svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" {...s} /></svg>;
    case "plus":
      return <svg viewBox="0 0 100 100"><path d="M50 4 V96 M4 50 H96" strokeLinecap="round" {...s} /></svg>;
    case "dots":
      return (
        <svg viewBox="0 0 100 100">
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={10 + (i % 5) * 20} cy={10 + Math.floor(i / 5) * 20} r="2.6" fill="currentColor" />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

function FloatingShapes() {
  return (
    <div className="vr-shapes" aria-hidden="true">
      {SHAPES.map((sh, i) => (
        <div
          key={i}
          className={`vr-shape ${sh.accent ? "vr-shape--accent" : ""}`}
          data-depth={sh.depth}
          style={{ left: `${sh.x}%`, top: `${sh.y}%`, width: sh.size, height: sh.size }}
        >
          <span
            className="vr-shape__float"
            style={{ width: "100%", height: "100%", "--dur": `${sh.dur}s`, "--delay": `${-i * 1.3}s` }}
          >
            <ShapeSvg kind={sh.kind} />
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles (inline so this stays one self-contained file)              */
/* ------------------------------------------------------------------ */
// Fonts are loaded once, site-wide, in index.css.
const CSS = `/* The footage is shot on a light studio backdrop, so the hero stays light. */
.vr-home {
  --bg: #f1f1f1;
  --ink: #111214;
  --mute: rgba(17, 18, 20, 0.58);
  --faint: rgba(17, 18, 20, 0.38);
  --line: rgba(17, 18, 20, 0.14);
  --accent: #00d936; /* neon, a touch deeper so strokes read on the light backdrop */
  --ok: #17a673;
  --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --display: "Space Grotesk", "Helvetica Neue", Arial, sans-serif;
  --serif: "Instrument Serif", Georgia, "Times New Roman", serif;
  --pad: clamp(20px, 4vw, 56px);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --mx: 50%;
  --my: 50%;

  position: relative;
  height: 100svh;
  min-height: 680px;
  overflow: hidden;
  background: radial-gradient(60% 55% at 50% 42%, #f8f8f8 0%, var(--bg) 70%);
  color: var(--ink);
  font-family: var(--mono);
  -webkit-font-smoothing: antialiased;
}
.vr-home *, .vr-home *::before, .vr-home *::after { box-sizing: border-box; }

/* ---------- background ---------- */
.vr-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 88px 88px; background-position: center;
  opacity: 0.35;
  -webkit-mask-image: radial-gradient(60% 60% at 50% 45%, transparent 30%, #000 100%);
  mask-image: radial-gradient(60% 60% at 50% 45%, transparent 30%, #000 100%);
}
/* the grid brightens around the cursor: a fixed-size masked window moved by
   transform (the grid inside counter-moves), so nothing is repainted per frame */
.vr-lit {
  position: absolute; left: 0; top: 0; width: 460px; height: 460px; pointer-events: none; overflow: hidden;
  -webkit-mask-image: radial-gradient(closest-side, #000 0%, transparent 100%);
  mask-image: radial-gradient(closest-side, #000 0%, transparent 100%);
  will-change: transform;
}
.vr-lit__grid {
  position: absolute; left: 0; top: 0;
  background-image: linear-gradient(rgba(0, 217, 54, 0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 54, 0.32) 1px, transparent 1px);
  background-size: 88px 88px; background-position: center;
  will-change: transform;
}
.vr-glow {
  position: absolute; left: 0; top: 0; width: 760px; height: 760px; pointer-events: none;
  background: radial-gradient(closest-side, rgba(0, 217, 54, 0.07), transparent 70%);
  will-change: transform;
}
.vr-lit, .vr-glow { opacity: 0; transition: opacity 0.4s; }
.cur-on .vr-lit, .cur-on .vr-glow { opacity: 1; }

/* ---------- portrait ---------- */
.vr-stage { position: absolute; inset: 0; pointer-events: none; }
.vr-portrait {
  position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
  height: min(94svh, 56.25vw); aspect-ratio: 16 / 9;
  opacity: 0; transition: opacity 1.4s var(--ease) 0.2s;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%), linear-gradient(180deg, transparent 0, #000 8%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%), linear-gradient(180deg, transparent 0, #000 8%);
  mask-composite: intersect;
}
.is-ready .vr-portrait { opacity: 1; }
.vr-media { position: relative; width: 100%; height: 100%; }
.vr-poster, .vr-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover; }
.vr-canvas { opacity: 0; transition: opacity 0.5s ease; }
.vr-media.is-live .vr-canvas { opacity: 1; }

/* ---------- floating geometric shapes ---------- */
.vr-shapes { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.vr-shape {
  position: absolute; color: var(--ink);
  opacity: 0; transition: opacity 1.2s var(--ease);
  will-change: transform;
}
.is-ready .vr-shape { opacity: 0.32; }
.vr-shape--accent { color: var(--accent); }
.is-ready .vr-shape--accent { opacity: 0.55; }
.vr-shape__float { display: block; animation: vr-float var(--dur) ease-in-out infinite alternate; animation-delay: var(--delay); }
.vr-shape svg { display: block; width: 100%; height: 100%; overflow: visible; }
@keyframes vr-float {
  0% { transform: translate3d(0, -10px, 0) rotate(-8deg); }
  100% { transform: translate3d(0, 10px, 0) rotate(8deg); }
}

/* ---------- copy ---------- */
.vr-copy { position: absolute; z-index: 4; left: var(--pad); bottom: clamp(96px, 15vh, 140px); max-width: min(540px, 42vw); }
.vr-copy > * { opacity: 0; transform: translateY(14px); transition: opacity 0.9s var(--ease), transform 0.9s var(--ease); }
.is-ready .vr-copy > * { opacity: 1; transform: none; }
.is-ready .vr-copy > :nth-child(1) { transition-delay: 0.25s; }
.is-ready .vr-copy > :nth-child(2) { transition-delay: 0.35s; }
.is-ready .vr-copy > :nth-child(3) { transition-delay: 0.45s; }
.is-ready .vr-copy > :nth-child(4) { transition-delay: 0.55s; }
.is-ready .vr-copy > :nth-child(5) { transition-delay: 0.65s; }
.vr-role { margin: 0 0 22px; display: flex; align-items: center; gap: 14px; font-size: 11px; letter-spacing: 0.2em; color: var(--mute); }
.vr-role::before { content: ""; width: 32px; height: 1px; background: var(--ink); }
.vr-name { margin: 0 0 14px; font-family: var(--display); font-weight: 600; font-size: clamp(20px, 2vw, 30px); letter-spacing: 0.24em; }
.vr-subline { margin: 0 0 24px; display: flex; flex-direction: column; font-family: var(--serif); font-weight: 400; font-size: clamp(40px, 4.8vw, 80px); line-height: 0.98; letter-spacing: -0.02em; }
.vr-subline span:last-child { font-style: italic; color: var(--mute); }
.vr-intro { margin: 0 0 32px; max-width: 40ch; font-size: 13px; line-height: 1.8; color: var(--mute); }
.vr-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.vr-btn {
  font: 500 11px/1 var(--mono); letter-spacing: 0.18em; padding: 17px 24px;
  border: 1px solid var(--ink); border-radius: 2px; display: inline-flex; align-items: center; gap: 12px;
  transition: background 0.35s, color 0.35s, border-color 0.35s, transform 0.25s ease-out;
  will-change: transform;
}
.vr-btn--primary { background: var(--ink); color: #f4f4f4; }
.vr-btn--primary:hover { background: #00ff41; border-color: #00ff41; color: var(--ink); box-shadow: 0 0 24px rgba(0, 255, 65, 0.35); }
.vr-btn--primary span { transition: transform 0.35s var(--ease); }
.vr-btn--primary:hover span { transform: translateX(4px); }
.vr-btn--ghost { background: transparent; color: var(--ink); }
.vr-btn--ghost:hover { background: var(--ink); color: #f4f4f4; }
.vr-btn:focus-visible, .vr-scroll:focus-visible, .vr-social a:focus-visible { outline: 2px solid #008a23; outline-offset: 3px; }

/* ---------- quick facts ---------- */
.vr-facts {
  position: absolute; z-index: 4; right: var(--pad); bottom: clamp(96px, 15vh, 140px); width: min(300px, 26vw);
  margin: 0; padding: 18px 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line); border-radius: 2px;
  opacity: 0; transform: translateY(10px); transition: opacity 0.9s var(--ease) 0.7s, transform 0.9s var(--ease) 0.7s;
}
.is-ready .vr-facts { opacity: 1; transform: none; }
.vr-facts__row { display: grid; gap: 4px; padding: 11px 0; border-top: 1px solid var(--line); }
.vr-facts__row:first-child { border-top: 0; padding-top: 0; }
.vr-facts__row:last-child { padding-bottom: 0; }
.vr-facts dt { font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--faint); }
.vr-facts dd { margin: 0; font-family: var(--display); font-weight: 500; font-size: 13.5px; line-height: 1.4; }

/* ---------- footer ---------- */
.vr-foot { position: absolute; z-index: 5; left: var(--pad); right: var(--pad); bottom: 22px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; letter-spacing: 0.2em; }
.vr-status { display: flex; align-items: center; gap: 10px; color: var(--mute); padding-bottom: 4px; }
.vr-pulse { position: relative; width: 7px; height: 7px; border-radius: 50%; background: var(--ok); }
.vr-pulse::after { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--ok); animation: vr-ping 2.2s ease-out infinite; }
@keyframes vr-ping { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3.2); opacity: 0; } }
.vr-social { display: flex; gap: 22px; padding-bottom: 4px; }
.vr-social a { text-transform: uppercase; color: var(--mute); text-decoration: none; transition: color 0.3s; }
.vr-social a:hover { color: var(--ink); }
.vr-scroll {
  position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 6px 12px;
  background: none; border: 0; color: var(--mute); font: 400 10px/1 var(--mono); letter-spacing: 0.28em; transition: color 0.3s;
}
.vr-scroll:hover { color: var(--ink); }
.vr-scroll i { width: 1px; height: 30px; background: linear-gradient(var(--ink), transparent); transform-origin: top; animation: vr-decode 2.2s cubic-bezier(0.6, 0, 0.2, 1) infinite; }
@keyframes vr-decode { 0% { transform: scaleY(0); opacity: 1; } 60% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .vr-facts { width: 260px; }
}
/* Mobile: everything stacks in normal flow – square portrait that fades into the
   background, then the copy on a clean ground (never over the dark jacket). */
@media (max-width: 820px) {
  .vr-home { height: auto; min-height: 0; display: flex; flex-direction: column; padding-bottom: 28px; }
  .vr-stage { position: relative; inset: auto; }
  .vr-portrait {
    position: relative; left: auto; bottom: auto; transform: none;
    width: min(100%, 62svh); height: auto; aspect-ratio: 1 / 1; margin: 0 auto;
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 10%, #000 90%, transparent 100%), linear-gradient(180deg, #000 62%, transparent 98%);
    mask-image: linear-gradient(90deg, transparent 0, #000 10%, #000 90%, transparent 100%), linear-gradient(180deg, #000 62%, transparent 98%);
  }
  .vr-copy { position: relative; left: auto; right: auto; bottom: auto; max-width: none; margin-top: -36px; padding: 0 var(--pad); }
  .vr-role { margin-bottom: 16px; font-size: 10px; }
  .vr-name { font-size: 18px; margin-bottom: 10px; }
  .vr-subline { font-size: clamp(34px, 10.5vw, 56px); margin-bottom: 18px; }
  .vr-intro { font-size: 13px; line-height: 1.7; margin-bottom: 24px; max-width: none; }
  .vr-actions { gap: 10px; }
  .vr-btn { flex: 1 1 140px; justify-content: center; padding: 16px 14px; }
  .vr-facts { position: relative; right: auto; bottom: auto; width: auto; margin: 32px var(--pad) 0; }
  .vr-foot { position: relative; left: auto; right: auto; bottom: auto; margin: 24px var(--pad) 0; flex-wrap: wrap; gap: 14px 24px; align-items: center; }
  .vr-scroll { display: none; }
  .vr-status, .vr-social { padding-bottom: 0; }
  .vr-foot { justify-content: flex-start; }
  .vr-social { gap: 4px 18px; flex-wrap: wrap; }
  .vr-social a { padding: 8px 0; } /* bigger tap target */
  .vr-shape:nth-child(n + 5) { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .vr-portrait, .vr-copy > *, .vr-facts, .vr-canvas, .vr-shape { transition: none; }
  .vr-scroll i, .vr-pulse::after, .vr-shape__float { animation: none; }
}
`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function xToIndex(x) {
  // gain + curve make the head react earlier and more visibly to small cursor moves
  x = clamp(x * GAIN, -1, 1);
  x = Math.sign(x) * Math.pow(Math.abs(x), CURVE);
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    if (x <= ANCHORS[i + 1][0]) {
      const t = (x - ANCHORS[i][0]) / (ANCHORS[i + 1][0] - ANCHORS[i][0]);
      return ANCHORS[i][1] + (ANCHORS[i + 1][1] - ANCHORS[i][1]) * t;
    }
  }
  return ANCHORS[ANCHORS.length - 1][1];
}

// Critically damped spring (SmoothDamp): eases in and out, never snaps.
function smoothDamp(cur, target, vel, smoothTime, maxSpeed, dt) {
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const maxChange = maxSpeed * smoothTime;
  const change = clamp(cur - target, -maxChange, maxChange);
  const t2 = cur - change;
  const temp = (vel + omega * change) * dt;
  vel = (vel - omega * temp) * exp;
  let out = t2 + (change + temp) * exp;
  if (target - cur > 0 === out > target) {
    out = target;
    vel = (out - target) / dt;
  }
  return [out, vel];
}

/* ------------------------------------------------------------------ */
/*  Living portrait – frames drawn on a canvas one at a time, spring-   */
/*  driven by the cursor. Frames stream in centre-out and are decoded   */
/*  once (downscaled), so moving never waits on a decode.               */
/* ------------------------------------------------------------------ */
function LivingPortrait() {
  const canvasRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // opaque frames: cheaper to composite
    const reduced = prefersReducedMotion();
    const center = xToIndex(0);

    // Every frame is decoded once, downscaled to the canvas size, and kept –
    // so the head never lands on a frame that is still decoding (no stutter).
    const bitmaps = new Array(TOTAL_FRAMES);
    const decodeOpts = { resizeWidth: FRAME_W, resizeHeight: FRAME_H, resizeQuality: "high" };

    let alive = true;
    let started = false;
    let raf = 0;
    let last = 0;
    let pos = center;
    let vel = 0;
    let target = center;
    let drawn = -1; // position last painted, to skip redundant redraws
    let dirty = true; // a new frame arrived that may improve the current picture
    // unbroken run of decoded frames around the centre – the head only turns within it,
    // so while frames are still arriving it never jumps to a far-away frame
    let lo = Math.round(center);
    let hi = lo;
    const grow = () => {
      while (lo > 0 && bitmaps[lo - 1]) lo--;
      while (hi < TOTAL_FRAMES - 1 && bitmaps[hi + 1]) hi++;
    };

    // closest decoded frame to i (falls back gracefully while frames are still arriving)
    const nearest = (i) => {
      for (let d = 0; d < TOTAL_FRAMES; d++) {
        if (bitmaps[i - d]) return i - d;
        if (bitmaps[i + d]) return i + d;
      }
      return -1;
    };

    // Always paint one whole frame – blending neighbours shows a ghosted double image
    // when the head moves between them.
    let shown = -1; // frame index currently on the canvas
    const draw = (p) => {
      const i = Math.round(clamp(p, 0, TOTAL_FRAMES - 1));
      const ia = bitmaps[i] ? i : nearest(i);
      if (ia < 0 || ia === shown) return;
      ctx.drawImage(bitmaps[ia], 0, 0, canvas.width, canvas.height);
      shown = ia;
    };

    // ---- input
    // Desktop: the mouse position anywhere on the page.
    // Phones/tablets: the tilt sensor only (touches are ignored). If there is no
    // sensor data – permission denied, no gyroscope – the head slowly looks around.
    const media = canvas.parentElement;
    let lastTilt = -Infinity;

    const onMove = (e) => {
      target = xToIndex((e.clientX / window.innerWidth) * 2 - 1);
    };
    const toCenter = () => {
      target = center;
    };

    // left/right tilt in the current screen orientation (degrees)
    const sideTilt = (e) => {
      const angle = screen.orientation?.angle ?? window.orientation ?? 0;
      if (angle === 90) return e.beta;
      if (angle === -90 || angle === 270) return -e.beta;
      if (angle === 180) return -e.gamma;
      return e.gamma;
    };
    let base = null; // how the phone is normally held; drifts slowly so that becomes "facing you"
    const onTilt = (e) => {
      if (e.gamma == null || e.beta == null) return;
      const t = sideTilt(e);
      base = base == null ? t : base + (t - base) * 0.003;
      let d = t - base;
      d = Math.abs(d) < 2 ? 0 : d - Math.sign(d) * 2; // small dead zone against hand jitter
      target = xToIndex(clamp(d / 22, -1, 1)); // ~24° of tilt = full head turn
      lastTilt = performance.now();
    };

    const listenTilt = () => window.addEventListener("deviceorientation", onTilt);
    const needsPermission =
      typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function";
    // iOS only allows the permission prompt from a tap, so ask on the first one anywhere
    const askPermission = () => {
      window.removeEventListener("touchend", askPermission);
      window.removeEventListener("click", askPermission);
      DeviceOrientationEvent.requestPermission()
        .then((r) => r === "granted" && alive && listenTilt())
        .catch(() => {});
    };

    if (PHONE) {
      if (!reduced && typeof DeviceOrientationEvent !== "undefined") {
        if (needsPermission) {
          window.addEventListener("touchend", askPermission, { passive: true });
          window.addEventListener("click", askPermission);
        } else {
          listenTilt(); // Android: no prompt needed
        }
      }
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", toCenter);
      window.addEventListener("blur", toCenter);
    }

    // pause the animation while the hero is scrolled out of view (saves battery)
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && started && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(media);

    const tick = (now) => {
      if (!visible) {
        raf = 0;
        return;
      }
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      // phones without tilt data (yet): the head slowly looks around on its own
      if (PHONE && !reduced && now - lastTilt > 1500) {
        target = xToIndex(0.55 * Math.sin(now / 1000 * 0.5));
      }
      const goal = clamp(target, lo, hi);
      [pos, vel] = smoothDamp(pos, goal, vel, reduced ? SMOOTH_TIME * 1.8 : SMOOTH_TIME, MAX_SPEED, dt);

      if (dirty || Math.abs(pos - drawn) > 0.001) {
        draw(pos);
        drawn = pos;
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (started || !alive) return;
      started = true;
      draw(pos);
      drawn = pos;
      setLive(true); // fade poster -> canvas (same frame, no visible jump)
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // stream + decode frames centre-out with a few parallel requests
    (async () => {
      const order = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);
      order.sort((x, y) => Math.abs(x - center) - Math.abs(y - center));
      const c = order[0];
      let next = 0;
      let got = 0;
      const worker = async () => {
        while (alive && next < order.length) {
          const i = order[next++];
          try {
            const res = await fetch(frameUrl(i));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const bm = await createImageBitmap(await res.blob(), decodeOpts);
            if (!alive) {
              bm.close();
              return;
            }
            bitmaps[i] = bm;
            grow();
            dirty = true;
            got++;
            if (!started && bitmaps[c] && got >= 8) start();
          } catch (err) {
            console.error("Frame failed:", i, err);
          }
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
      if (alive && !started && got > 0) start();
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("touchend", askPermission);
      window.removeEventListener("click", askPermission);
      window.removeEventListener("deviceorientation", onTilt);
      document.documentElement.removeEventListener("mouseleave", toCenter);
      window.removeEventListener("blur", toCenter);
      io.disconnect();
      bitmaps.forEach((b) => b?.close?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`vr-media ${live ? "is-live" : ""}`}>
      <img
        className="vr-poster"
        src={POSTER_SRC}
        width={1920}
        height={1080}
        alt={`Portrait of ${PROFILE.name}, turning as you ${PHONE ? "tilt your phone" : "move your cursor"}`}
        fetchpriority="high"
        decoding="async"
      />
      <canvas ref={canvasRef} className="vr-canvas" width={FRAME_W} height={FRAME_H} aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor effect: grid + glow that follow it, shapes drift away.       */
/*  (The cursor itself is site-wide: components/fx/SiteFX.)             */
/* ------------------------------------------------------------------ */
function CursorFX({ rootRef }) {
  useEffect(() => {
    const root = rootRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!root || !fine) return;

    const reduced = prefersReducedMotion();
    const lit = root.querySelector(".vr-lit");
    const litGrid = root.querySelector(".vr-lit__grid");
    const glow = root.querySelector(".vr-glow");
    const shapes = [...root.querySelectorAll(".vr-shape")].map((el) => ({ el, depth: +el.dataset.depth }));

    let mx = window.innerWidth / 2, my = window.innerHeight / 2; // pointer
    let sx = mx, sy = my; // spotlight (trails the pointer)
    let raf = 0;

    // cache the hero's box instead of measuring it every frame
    let box = root.getBoundingClientRect();
    const measure = () => {
      box = root.getBoundingClientRect();
      litGrid.style.width = `${box.width}px`;
      litGrid.style.height = `${box.height}px`;
    };
    measure();

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      root.classList.add("cur-on");
    };
    const onLeave = () => root.classList.remove("cur-on");

    const loop = () => {
      sx += (mx - sx) * (reduced ? 1 : 0.07);
      sy += (my - sy) * (reduced ? 1 : 0.07);
      // spotlight + lit grid: transform-only, handled by the compositor
      const lx = sx - box.left - 230, ly = sy - box.top - 230;
      lit.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      litGrid.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
      glow.style.transform = `translate3d(${sx - box.left - 380}px, ${sy - box.top - 380}px, 0)`;
      // shapes drift away from the cursor, nearer ones (higher depth) more
      if (!reduced) {
        const px = sx / window.innerWidth - 0.5, py = sy / window.innerHeight - 0.5;
        for (const s of shapes) s.el.style.transform = `translate3d(${-px * s.depth}px, ${-py * s.depth}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      root.classList.remove("cur-on");
    };
  }, [rootRef]);

  return null;
}

/* Buttons gently lean toward the cursor */
function useMagnetic() {
  const ref = useRef(null);
  const onPointerMove = useCallback((e) => {
    if (prefersReducedMotion() || e.pointerType === "touch") return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }, []);
  const onPointerLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onPointerMove, onPointerLeave };
}

/* ------------------------------------------------------------------ */
/*  Quick facts card (from data/content)                                */
/* ------------------------------------------------------------------ */
function QuickFacts() {
  return (
    <dl className="vr-facts">
      {/* status is already shown in the footer */}
      {quickFacts
        .filter((f) => !f.isStatus)
        .map((f) => (
          <div className="vr-facts__row" key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                                */
/* ------------------------------------------------------------------ */
export default function Hero({ onEnterPortfolio, onViewProjects }) {
  const rootRef = useRef(null);
  const [ready, setReady] = useState(false);
  const magA = useMagnetic();
  const magB = useMagnetic();

  // Content is shown immediately – nothing waits for the video.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const goTo = useCallback((id, cb) => {
    if (cb) return cb();
    scrollToId(id);
  }, []);

  return (
    <main ref={rootRef} id="home" className={`vr-home ${ready ? "is-ready" : ""}`}>
      <style>{CSS}</style>

      <div className="vr-grid" aria-hidden="true" />
      <div className="vr-lit" aria-hidden="true">
        <div className="vr-lit__grid" />
      </div>
      <div className="vr-glow" aria-hidden="true" />

      <section className="vr-stage">
        <div className="vr-portrait">
          <LivingPortrait />
        </div>
      </section>

      <FloatingShapes />

      <section className="vr-copy">
        <p className="vr-role">{PROFILE.role}</p>
        <h1 className="vr-name">{PROFILE.name}</h1>
        <h2 className="vr-subline">
          {PROFILE.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="vr-intro">{PROFILE.intro}</p>
        <div className="vr-actions">
          <button
            type="button"
            className="vr-btn vr-btn--primary"
            onClick={() => goTo("work", onViewProjects)}
            {...magA}
          >
            VIEW MY WORK <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            className="vr-btn vr-btn--ghost"
            onClick={() => goTo("contact", onEnterPortfolio)}
            {...magB}
          >
            GET IN TOUCH
          </button>
        </div>
      </section>

      <QuickFacts />

      <footer className="vr-foot">
        <div className="vr-status">
          <span className="vr-pulse" aria-hidden="true" />
          {PROFILE.availability}
        </div>
        <button type="button" className="vr-scroll" onClick={() => goTo("work", onEnterPortfolio)}>
          <span>SCROLL</span>
          <i aria-hidden="true" />
        </button>
        <nav className="vr-social" aria-label="Social">
          {PROFILE.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>
          ))}
        </nav>
      </footer>

      <CursorFX rootRef={rootRef} />
    </main>
  );
}
