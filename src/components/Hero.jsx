import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Edit this block – your links and labels                            */
/* ------------------------------------------------------------------ */

const PROFILE = {
  name: "VENKATA RAJA",
  role: "AI ENGINEER / FULL-STACK DEVELOPER",
  availability: "AVAILABLE FOR OPPORTUNITIES",

  nav: [
    { label: "WORK", href: "#work" },
    { label: "PROJECTS", href: "#projects" },
    { label: "ABOUT", href: "#about" },
    { label: "CONTACT", href: "#contact" },
  ],

  social: [
    { label: "GITHUB", href: "https://github.com/your-username" },
    {
      label: "LINKEDIN",
      href: "https://www.linkedin.com/in/your-username",
    },
    { label: "EMAIL", href: "mailto:you@example.com" },
  ],
};


/* ------------------------------------------------------------------ */
/*  PORTRAIT FRAME CONFIGURATION                                      */
/* ------------------------------------------------------------------ */

/*
 * Your files are:
 *
 * public/portrait/001.webp
 * public/portrait/002.webp
 * public/portrait/003.webp
 * ...
 * public/portrait/450.webp
 */

const FRAME_COUNT = 450;

/*
 * IMPORTANT:
 *
 * i starts from 0 internally.
 *
 * i = 0  -> 001.webp
 * i = 1  -> 002.webp
 * i = 449 -> 450.webp
 */
const frameUrl = (i) =>
  `/portrait/${String(i + 1).padStart(3, "0")}.webp`;


/* ------------------------------------------------------------------ */
/*  HEAD TRACKING                                                     */
/* ------------------------------------------------------------------ */

/*
 * OLD:
 *
 * GAIN = 1.5
 *
 * This made the portrait very sensitive.
 *
 * NEW:
 *
 * GAIN = 0.75
 *
 * Approximately half the previous sensitivity.
 */
const GAIN = 0.75;


/*
 * 1.0 = linear cursor response.
 *
 * The previous 0.78 curve caused small cursor movements
 * to have a stronger effect.
 */
const CURVE = 1.0;


/*
 * Higher value = smoother and slower movement.
 *
 * Previous:
 * 0.26
 *
 * New:
 * 0.42
 */
const SMOOTH_TIME = 0.42;


/*
 * Maximum number of frames the portrait can travel
 * per second.
 *
 * Lower value prevents sudden whipping between frames.
 */
const MAX_SPEED = 55;


/* ------------------------------------------------------------------ */
/*  CURSOR -> FRAME MAPPING                                           */
/* ------------------------------------------------------------------ */

/*
 * Instead of hard-coding frame numbers such as 29.5,
 * this maps the full 450-frame sequence automatically.
 *
 * 001.webp  = far left
 * ~112.webp = left
 * ~225.webp = center
 * ~337.webp = right
 * 450.webp  = far right
 */

const ANCHORS = [
  [-1, 0],
  [-0.5, Math.round((FRAME_COUNT - 1) * 0.25)],
  [0, Math.round((FRAME_COUNT - 1) * 0.5)],
  [0.5, Math.round((FRAME_COUNT - 1) * 0.75)],
  [1, FRAME_COUNT - 1],
];


/* ------------------------------------------------------------------ */
/*  TERMINAL TEXT                                                     */
/* ------------------------------------------------------------------ */

const TERMINAL_LINES = [
  "FUTURE SYSTEM ONLINE",
  "ARTIFICIAL INTELLIGENCE: ACTIVE",
  "CREATIVE ENGINE: ACTIVE",
  "PORTFOLIO TIMELINE: 2026",
];


/* ------------------------------------------------------------------ */
/*  STYLES                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600&display=swap");


/* ------------------------------------------------------------------ */
/*  ROOT                                                               */
/* ------------------------------------------------------------------ */

.vr-home {
  --bg: #f1f1f1;
  --ink: #111214;
  --mute: rgba(17, 18, 20, 0.58);
  --faint: rgba(17, 18, 20, 0.38);
  --line: rgba(17, 18, 20, 0.14);

  --accent: #6d35f5;
  --ok: #17a673;

  --mono:
    "JetBrains Mono",
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace;

  --display:
    "Space Grotesk",
    "Helvetica Neue",
    Arial,
    sans-serif;

  --serif:
    "Instrument Serif",
    Georgia,
    "Times New Roman",
    serif;

  --pad: clamp(20px, 4vw, 56px);

  --ease:
    cubic-bezier(0.2, 0.7, 0.2, 1);

  --mx: 50%;
  --my: 50%;

  position: relative;

  height: 100svh;
  min-height: 680px;

  overflow: hidden;

  background:
    radial-gradient(
      60% 55% at 50% 42%,
      #f8f8f8 0%,
      var(--bg) 70%
    );

  color: var(--ink);

  font-family: var(--mono);

  -webkit-font-smoothing: antialiased;
}


.vr-home *,
.vr-home *::before,
.vr-home *::after {
  box-sizing: border-box;
}


.vr-home.has-cursor,
.vr-home.has-cursor a,
.vr-home.has-cursor button {
  cursor: none;
}


/* ------------------------------------------------------------------ */
/*  BACKGROUND                                                         */
/* ------------------------------------------------------------------ */

.vr-grid {
  position: absolute;

  inset: 0;

  pointer-events: none;

  background-image:
    linear-gradient(
      var(--line) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      var(--line) 1px,
      transparent 1px
    );

  background-size: 88px 88px;

  background-position: center;

  opacity: 0.35;

  -webkit-mask-image:
    radial-gradient(
      60% 60% at 50% 45%,
      transparent 30%,
      #000 100%
    );

  mask-image:
    radial-gradient(
      60% 60% at 50% 45%,
      transparent 30%,
      #000 100%
    );
}


.vr-grid--lit {
  opacity: 1;

  background-image:
    linear-gradient(
      rgba(109, 53, 245, 0.32) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(109, 53, 245, 0.32) 1px,
      transparent 1px
    );

  -webkit-mask-image:
    radial-gradient(
      230px circle at var(--mx) var(--my),
      #000 0%,
      transparent 100%
    );

  mask-image:
    radial-gradient(
      230px circle at var(--mx) var(--my),
      #000 0%,
      transparent 100%
    );
}


.vr-glow {
  position: absolute;

  inset: 0;

  pointer-events: none;

  background:
    radial-gradient(
      380px circle at var(--mx) var(--my),
      rgba(109, 53, 245, 0.07),
      transparent 70%
    );
}


/* ------------------------------------------------------------------ */
/*  TOP BAR                                                            */
/* ------------------------------------------------------------------ */

.vr-top {
  position: absolute;

  z-index: 6;

  top: 28px;

  left: var(--pad);
  right: var(--pad);

  display: flex;

  justify-content: space-between;

  align-items: center;

  font-size: 11px;

  letter-spacing: 0.18em;
}


.vr-mark {
  display: flex;

  align-items: center;

  gap: 10px;

  font-family: var(--display);

  font-weight: 600;

  letter-spacing: 0.22em;
}


.vr-mark i {
  width: 22px;
  height: 22px;

  display: grid;

  place-items: center;

  border: 1px solid var(--ink);

  font:
    600 10px/1
    var(--display);

  letter-spacing: 0;
}


.vr-top nav {
  display: flex;

  gap: clamp(18px, 3vw, 40px);
}


.vr-top nav a {
  position: relative;

  color: var(--mute);

  text-decoration: none;

  padding: 6px 0;

  transition: color 0.3s;
}


.vr-top nav a::after {
  content: "";

  position: absolute;

  left: 0;
  right: 0;

  bottom: 0;

  height: 1px;

  background: var(--ink);

  transform:
    scaleX(0);

  transform-origin: left;

  transition:
    transform
    0.45s
    var(--ease);
}


.vr-top nav a:hover {
  color: var(--ink);
}


.vr-top nav a:hover::after {
  transform: scaleX(1);
}


/* ------------------------------------------------------------------ */
/*  PORTRAIT                                                           */
/* ------------------------------------------------------------------ */

.vr-stage {
  position: absolute;

  inset: 0;

  pointer-events: none;
}


.vr-portrait {
  position: absolute;

  left: 50%;
  bottom: 0;

  transform:
    translateX(-50%);

  height:
    min(94svh, 100vw);

  aspect-ratio:
    900 / 720;

  opacity: 0;

  transition:
    opacity
    1.4s
    var(--ease)
    0.2s;

  -webkit-mask-image:
    linear-gradient(
      90deg,
      transparent 0,
      #000 12%,
      #000 88%,
      transparent 100%
    ),
    linear-gradient(
      180deg,
      transparent 0,
      #000 8%
    );

  -webkit-mask-composite:
    source-in;

  mask-image:
    linear-gradient(
      90deg,
      transparent 0,
      #000 12%,
      #000 88%,
      transparent 100%
    ),
    linear-gradient(
      180deg,
      transparent 0,
      #000 8%
    );

  mask-composite:
    intersect;
}


.is-ready .vr-portrait {
  opacity: 1;
}


.vr-canvas {
  width: 100%;
  height: 100%;

  display: block;
}


/* ------------------------------------------------------------------ */
/*  HUD                                                                */
/* ------------------------------------------------------------------ */

.vr-hud {
  position: absolute;

  top: 25%;

  display: flex;

  flex-direction: column;

  gap: 6px;

  font-size: 10px;

  letter-spacing: 0.2em;

  opacity: 0;

  transform:
    translateY(6px);

  transition:
    opacity 0.9s var(--ease) 1.1s,
    transform 0.9s var(--ease) 1.1s;
}


.is-ready .vr-hud {
  opacity: 1;

  transform: none;
}


.vr-hud::before {
  content: "";

  width: 28px;

  height: 1px;

  background: var(--ink);

  opacity: 0.4;

  margin-bottom: 6px;
}


.vr-hud__label {
  color: var(--faint);
}


.vr-hud__value {
  font-family: var(--display);

  font-weight: 500;

  font-size:
    clamp(
      15px,
      1.35vw,
      20px
    );

  letter-spacing: 0.08em;

  font-variant-numeric:
    tabular-nums;
}


.vr-hud--id {
  left:
    calc(
      50% +
      min(15vw, 22svh) +
      20px
    );
}


.vr-hud--signal {
  right:
    calc(
      50% +
      min(15vw, 22svh) +
      20px
    );

  align-items: flex-end;

  text-align: right;
}


.vr-hud--signal::before {
  align-self: flex-end;
}


.vr-hud--signal
.vr-hud__value {
  color: var(--accent);
}


.vr-hud__meter {
  width: 96px;

  height: 1px;

  background: var(--line);

  position: relative;

  overflow: hidden;
}


.vr-hud__meter i {
  position: absolute;

  inset: 0;

  background: var(--accent);

  transform-origin: right;
}


/* ------------------------------------------------------------------ */
/*  COPY                                                               */
/* ------------------------------------------------------------------ */

.vr-copy {
  position: absolute;

  z-index: 4;

  left: var(--pad);

  bottom:
    clamp(
      96px,
      15vh,
      140px
    );

  max-width:
    min(
      540px,
      42vw
    );
}


.vr-copy > * {
  opacity: 0;

  transform:
    translateY(14px);

  transition:
    opacity 0.9s var(--ease),
    transform 0.9s var(--ease);
}


.is-ready .vr-copy > * {
  opacity: 1;

  transform: none;
}


.is-ready
.vr-copy > :nth-child(1) {
  transition-delay: 0.25s;
}


.is-ready
.vr-copy > :nth-child(2) {
  transition-delay: 0.35s;
}


.is-ready
.vr-copy > :nth-child(3) {
  transition-delay: 0.45s;
}


.is-ready
.vr-copy > :nth-child(4) {
  transition-delay: 0.55s;
}


.is-ready
.vr-copy > :nth-child(5) {
  transition-delay: 0.65s;
}


.vr-role {
  margin: 0 0 22px;

  display: flex;

  align-items: center;

  gap: 14px;

  font-size: 11px;

  letter-spacing: 0.2em;

  color: var(--mute);
}


.vr-role::before {
  content: "";

  width: 32px;

  height: 1px;

  background: var(--ink);
}


.vr-name {
  margin: 0 0 14px;

  font-family: var(--display);

  font-weight: 600;

  font-size:
    clamp(
      20px,
      2vw,
      30px
    );

  letter-spacing: 0.24em;
}


.vr-subline {
  margin: 0 0 24px;

  display: flex;

  flex-direction: column;

  font-family: var(--serif);

  font-weight: 400;

  font-size:
    clamp(
      48px,
      6.4vw,
      108px
    );

  line-height: 0.92;

  letter-spacing: -0.02em;
}


.vr-subline
span:last-child {
  font-style: italic;

  color: var(--mute);
}


.vr-intro {
  margin: 0 0 32px;

  max-width: 40ch;

  font-size: 13px;

  line-height: 1.8;

  color: var(--mute);
}


.vr-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 12px;
}


.vr-btn {
  font:
    500 11px/1
    var(--mono);

  letter-spacing: 0.18em;

  padding: 17px 24px;

  border:
    1px solid
    var(--ink);

  border-radius: 2px;

  display: inline-flex;

  align-items: center;

  gap: 12px;

  transition:
    background 0.35s,
    color 0.35s,
    border-color 0.35s,
    transform 0.25s ease-out;

  will-change: transform;
}


.vr-btn--primary {
  background: var(--ink);

  color: #f4f4f4;
}


.vr-btn--primary:hover {
  background: var(--accent);

  border-color:
    var(--accent);
}


.vr-btn--primary span {
  transition:
    transform
    0.35s
    var(--ease);
}


.vr-btn--primary:hover
span {
  transform:
    translateX(4px);
}


.vr-btn--ghost {
  background: transparent;

  color: var(--ink);
}


.vr-btn--ghost:hover {
  background: var(--ink);

  color: #f4f4f4;
}


.vr-btn:focus-visible,
.vr-scroll:focus-visible,
.vr-top a:focus-visible,
.vr-social a:focus-visible {
  outline:
    2px solid
    var(--accent);

  outline-offset: 3px;
}


/* ------------------------------------------------------------------ */
/*  TERMINAL                                                           */
/* ------------------------------------------------------------------ */

.vr-terminal {
  position: absolute;

  z-index: 4;

  right: var(--pad);

  bottom:
    clamp(
      96px,
      15vh,
      140px
    );

  width:
    min(
      320px,
      27vw
    );

  padding:
    16px 18px;

  font-size: 10.5px;

  letter-spacing: 0.12em;

  background:
    rgba(
      255,
      255,
      255,
      0.55
    );

  -webkit-backdrop-filter:
    blur(10px);

  backdrop-filter:
    blur(10px);

  border:
    1px solid
    var(--line);

  border-left:
    2px solid
    var(--accent);

  border-radius: 2px;

  opacity: 0;

  transition:
    opacity
    0.9s
    var(--ease)
    0.8s;
}


.is-ready .vr-terminal {
  opacity: 1;
}


.vr-terminal ul {
  list-style: none;

  margin: 0;

  padding: 0;

  display: flex;

  flex-direction: column;

  gap: 11px;

  min-height: 96px;
}


.vr-terminal li {
  display: flex;

  align-items: center;

  gap: 10px;

  min-height: 14px;

  line-height: 1.4;
}


.vr-terminal__mark {
  width: 5px;

  height: 5px;

  border-radius: 50%;

  background:
    var(--faint);

  flex: none;

  transition:
    background 0.3s;
}


.vr-terminal li.is-done
.vr-terminal__mark {
  background:
    var(--ok);
}


.vr-caret {
  width: 6px;

  height: 11px;

  background:
    var(--ink);

  display: inline-block;
}


.vr-caret--blink {
  animation:
    vr-blink
    1s
    steps(2, start)
    infinite;
}


@keyframes vr-blink {
  to {
    visibility: hidden;
  }
}


/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */

.vr-foot {
  position: absolute;

  z-index: 5;

  left: var(--pad);

  right: var(--pad);

  bottom: 22px;

  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-end;

  font-size: 10px;

  letter-spacing: 0.2em;
}


.vr-status {
  display: flex;

  align-items: center;

  gap: 10px;

  color: var(--mute);

  padding-bottom: 4px;
}


.vr-pulse {
  position: relative;

  width: 7px;

  height: 7px;

  border-radius: 50%;

  background: var(--ok);
}


.vr-pulse::after {
  content: "";

  position: absolute;

  inset: 0;

  border-radius: 50%;

  background: var(--ok);

  animation:
    vr-ping
    2.2s
    ease-out
    infinite;
}


@keyframes vr-ping {
  0% {
    transform: scale(1);

    opacity: 0.6;
  }

  100% {
    transform: scale(3.2);

    opacity: 0;
  }
}


.vr-social {
  display: flex;

  gap: 22px;

  padding-bottom: 4px;
}


.vr-social a {
  color: var(--mute);

  text-decoration: none;

  transition:
    color 0.3s;
}


.vr-social a:hover {
  color: var(--ink);
}


.vr-scroll {
  position: absolute;

  left: 50%;

  bottom: 0;

  transform:
    translateX(-50%);

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 10px;

  padding:
    6px 12px;

  background: none;

  border: 0;

  color: var(--mute);

  font:
    400 10px/1
    var(--mono);

  letter-spacing: 0.28em;

  transition:
    color 0.3s;
}


.vr-scroll:hover {
  color: var(--ink);
}


.vr-scroll i {
  width: 1px;

  height: 30px;

  background:
    linear-gradient(
      var(--ink),
      transparent
    );

  transform-origin: top;

  animation:
    vr-decode
    2.2s
    cubic-bezier(
      0.6,
      0,
      0.2,
      1
    )
    infinite;
}


@keyframes vr-decode {
  0% {
    transform:
      scaleY(0);

    opacity: 1;
  }

  60% {
    transform:
      scaleY(1);

    opacity: 1;
  }

  100% {
    transform:
      scaleY(1);

    opacity: 0;
  }
}


/* ------------------------------------------------------------------ */
/*  LOADER                                                             */
/* ------------------------------------------------------------------ */

.vr-loader {
  position: absolute;

  inset: 0;

  z-index: 20;

  display: grid;

  place-items: center;

  background:
    var(--bg);

  color:
    var(--mute);

  font-size: 10px;

  letter-spacing: 0.24em;

  text-align: center;

  transition:
    opacity 0.9s ease,
    visibility 0.9s;
}


.is-ready .vr-loader {
  opacity: 0;

  visibility: hidden;
}


.vr-loader__line {
  position: relative;

  overflow: hidden;

  width: 140px;

  height: 1px;

  margin:
    16px auto 0;

  background:
    var(--line);
}


.vr-loader__line i {
  position: absolute;

  inset: 0;

  background:
    var(--ink);

  transform:
    scaleX(0);

  transform-origin: left;

  transition:
    transform 0.2s;
}


/* ------------------------------------------------------------------ */
/*  CUSTOM CURSOR                                                      */
/* ------------------------------------------------------------------ */

.vr-cur {
  position: fixed;

  left: 0;
  top: 0;

  z-index: 100;

  pointer-events: none;

  opacity: 0;

  transition:
    opacity 0.3s;
}


.has-cursor.cur-on
.vr-cur {
  opacity: 1;
}


.vr-cur__dot {
  width: 6px;

  height: 6px;

  margin:
    -3px 0 0 -3px;

  border-radius: 50%;

  background:
    var(--ink);

  transition:
    background 0.25s;
}


.vr-cur__ring {
  width: 38px;

  height: 38px;

  margin:
    -19px 0 0 -19px;
}


.vr-cur__ring i {
  display: block;

  width: 100%;
  height: 100%;

  border-radius: 50%;

  border:
    1px solid
    var(--ink);

  opacity: 0.45;

  transition:
    transform 0.35s var(--ease),
    background 0.3s,
    border-color 0.3s,
    opacity 0.3s;
}


.vr-cur__ring.is-hover i {
  transform:
    scale(1.55);

  background:
    rgba(
      109,
      53,
      245,
      0.10
    );

  border-color:
    var(--accent);

  opacity: 0.9;
}


.vr-cur__ring.is-down i {
  transform:
    scale(0.7);
}


.vr-cur__ring.is-hover.is-down i {
  transform:
    scale(1.2);
}


.vr-cur__dot.is-hover {
  background:
    var(--accent);
}


/* ------------------------------------------------------------------ */
/*  RESPONSIVE                                                         */
/* ------------------------------------------------------------------ */

@media (max-width: 1100px) {
  .vr-terminal {
    width: 290px;
  }

  .vr-hud {
    top: 21%;
  }
}


@media (max-width: 820px) {
  .vr-home {
    min-height: 760px;
  }

  .vr-top nav a:nth-child(n + 3) {
    display: none;
  }

  .vr-portrait {
    height:
      min(
        58svh,
        130vw
      );

    bottom: auto;

    top: 76px;
  }

  .vr-hud {
    top: 96px;
  }

  .vr-hud--id {
    left: auto;

    right: var(--pad);
  }

  .vr-hud--signal {
    right: auto;

    left: var(--pad);

    align-items:
      flex-start;

    text-align:
      left;
  }

  .vr-hud--signal::before {
    align-self:
      flex-start;
  }

  .vr-copy {
    left: var(--pad);

    right: var(--pad);

    bottom: 84px;

    max-width: none;
  }

  .vr-subline {
    font-size:
      clamp(
        42px,
        13vw,
        72px
      );
  }

  .vr-intro {
    font-size: 12px;

    margin-bottom: 20px;
  }

  .vr-terminal,
  .vr-status,
  .vr-social {
    display: none;
  }
}


/* ------------------------------------------------------------------ */
/*  REDUCED MOTION                                                     */
/* ------------------------------------------------------------------ */

@media (prefers-reduced-motion: reduce) {
  .vr-portrait,
  .vr-hud,
  .vr-copy > *,
  .vr-terminal,
  .vr-loader {
    transition: none;
  }

  .vr-scroll i,
  .vr-caret--blink,
  .vr-pulse::after {
    animation: none;
  }
}
`;


/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const clamp = (v, a, b) =>
  Math.max(a, Math.min(b, v));


const prefersReducedMotion = () =>
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


/* ------------------------------------------------------------------ */
/*  CURSOR X -> FRAME INDEX                                            */
/* ------------------------------------------------------------------ */

function xToIndex(x) {
  /*
   * Reduce sensitivity by 50%.
   */
  x = clamp(
    x * GAIN,
    -1,
    1
  );


  /*
   * Linear response.
   */
  x =
    Math.sign(x) *
    Math.pow(
      Math.abs(x),
      CURVE
    );


  /*
   * Interpolate between anchor points.
   */
  for (
    let i = 0;
    i < ANCHORS.length - 1;
    i++
  ) {
    const left =
      ANCHORS[i];

    const right =
      ANCHORS[i + 1];


    if (
      x <= right[0]
    ) {
      const t =
        (x - left[0]) /
        (right[0] - left[0]);


      return (
        left[1] +
        (right[1] - left[1]) *
          t
      );
    }
  }


  return ANCHORS[
    ANCHORS.length - 1
  ][1];
}


/* ------------------------------------------------------------------ */
/*  SMOOTH DAMP                                                        */
/* ------------------------------------------------------------------ */

function smoothDamp(
  cur,
  target,
  vel,
  smoothTime,
  maxSpeed,
  dt
) {
  const omega =
    2 / smoothTime;

  const x =
    omega * dt;

  const exp =
    1 /
    (
      1 +
      x +
      0.48 * x * x +
      0.235 * x * x * x
    );


  const maxChange =
    maxSpeed *
    smoothTime;


  const change =
    clamp(
      cur - target,
      -maxChange,
      maxChange
    );


  const tempTarget =
    cur - change;


  const temp =
    (vel +
      omega * change) *
    dt;


  vel =
    (vel -
      omega * temp) *
    exp;


  let output =
    tempTarget +
    (change + temp) *
      exp;


  /*
   * Prevent overshooting.
   */
  if (
    (
      target - cur > 0 &&
      output > target
    ) ||
    (
      target - cur < 0 &&
      output < target
    )
  ) {
    output = target;

    vel = 0;
  }


  return [
    output,
    vel,
  ];
}


/* ------------------------------------------------------------------ */
/*  LIVING PORTRAIT                                                    */
/* ------------------------------------------------------------------ */

function LivingPortrait({
  onProgress,
  onReady,
}) {
  const canvasRef =
    useRef(null);


  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;


    const ctx =
      canvas.getContext(
        "2d",
        {
          alpha: true,

          /*
           * Helps reduce latency on supported browsers.
           */
          desynchronized: true,
        }
      );


    if (!ctx) return;


    /*
     * Store all decoded images.
     */
    const frames =
      new Array(
        FRAME_COUNT
      );


    const reduced =
      prefersReducedMotion();


    /*
     * Exact center frame.
     *
     * For 450 frames:
     * center ≈ frame 225.
     */
    const center =
      xToIndex(0);


    let target =
      center;


    let position =
      center;


    let velocity = 0;


    let raf = 0;

    let lastTime = 0;

    let alive = true;


    /* -------------------------------------------------------------- */
    /* Draw portrait                                                   */
    /* -------------------------------------------------------------- */

    const draw = (p) => {
      p =
        clamp(
          p,
          0,
          FRAME_COUNT - 1
        );


      /*
       * Current frame.
       */
      const a =
        Math.floor(p);


      /*
       * Next frame.
       */
      const b =
        Math.min(
          FRAME_COUNT - 1,
          a + 1
        );


      /*
       * Fraction between the two frames.
       *
       * Example:
       *
       * p = 100.25
       *
       * frame 100 = 75%
       * frame 101 = 25%
       */
      const blend =
        p - a;


      const frameA =
        frames[a];


      const frameB =
        frames[b];


      /*
       * If current frame isn't loaded yet,
       * don't draw a blank canvas.
       */
      if (!frameA) {
        return;
      }


      /*
       * Clear previous frame.
       */
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      /*
       * Draw current frame.
       */
      ctx.globalAlpha = 1;


      ctx.drawImage(
        frameA,
        0,
        0,
        canvas.width,
        canvas.height
      );


      /*
       * Smoothly blend into the next frame.
       *
       * This is what removes the obvious
       * "frame 1 -> frame 2 -> frame 3"
       * stepping effect.
       */
      if (
        blend > 0.001 &&
        frameB &&
        frameB !== frameA
      ) {
        ctx.globalAlpha =
          blend;


        ctx.drawImage(
          frameB,
          0,
          0,
          canvas.width,
          canvas.height
        );


        ctx.globalAlpha = 1;
      }
    };


    /* -------------------------------------------------------------- */
    /* Pointer movement                                                */
    /* -------------------------------------------------------------- */

    const onMove = (e) => {
      /*
       * Convert cursor position:
       *
       * left edge  = -1
       * center      = 0
       * right edge = +1
       */
      const normalizedX =
        (e.clientX /
          window.innerWidth) *
          2 -
        1;


      target =
        xToIndex(
          normalizedX
        );
    };


    /*
     * When cursor leaves the window,
     * smoothly return to center.
     */
    const toCenter = () => {
      target = center;
    };


    window.addEventListener(
      "pointermove",
      onMove,
      {
        passive: true,
      }
    );


    window.addEventListener(
      "pointerdown",
      onMove,
      {
        passive: true,
      }
    );


    document.documentElement.addEventListener(
      "mouseleave",
      toCenter
    );


    window.addEventListener(
      "blur",
      toCenter
    );


    /* -------------------------------------------------------------- */
    /* Animation loop                                                  */
    /* -------------------------------------------------------------- */

    const tick = (now) => {
      if (!alive) return;


      const dt =
        clamp(
          (now - lastTime) /
            1000,
          0.001,
          0.05
        );


      lastTime = now;


      /*
       * Smoothly move current position
       * toward the cursor target.
       */
      [
        position,
        velocity,
      ] =
        smoothDamp(
          position,
          target,
          velocity,

          reduced
            ? SMOOTH_TIME * 1.5
            : SMOOTH_TIME,

          MAX_SPEED,

          dt
        );


      /*
       * Render fractional frame.
       */
      draw(position);


      raf =
        requestAnimationFrame(
          tick
        );
    };


    /* -------------------------------------------------------------- */
    /* LOAD PORTRAIT FRAMES                                            */
    /* -------------------------------------------------------------- */

    const loadFrames =
      async () => {
        let loaded = 0;

        let nextIndex = 0;


        /*
         * Load 8 files at a time.
         *
         * This prevents the browser from opening
         * hundreds of requests simultaneously.
         */
        const worker =
          async () => {
            while (
              alive &&
              nextIndex <
                FRAME_COUNT
            ) {
              const index =
                nextIndex++;


              try {
                /*
                 * Example:
                 *
                 * /portrait/001.webp
                 * /portrait/002.webp
                 * ...
                 */
                const response =
                  await fetch(
                    frameUrl(
                      index
                    ),
                    {
                      cache:
                        "force-cache",
                    }
                  );


                if (
                  !response.ok
                ) {
                  throw new Error(
                    `HTTP ${response.status}`
                  );
                }


                const blob =
                  await response.blob();


                /*
                 * Decode the WebP image
                 * before using it.
                 */
                frames[index] =
                  await createImageBitmap(
                    blob
                  );

              } catch (error) {
                console.error(
                  `Portrait frame failed: ${
                    index + 1
                  }.webp`,
                  error
                );
              }


              loaded++;


              onProgress?.(
                loaded /
                  FRAME_COUNT
              );
            }
          };


        /*
         * Eight parallel workers.
         */
        await Promise.all(
          Array.from(
            {
              length: 8,
            },
            worker
          )
        );


        if (!alive) return;


        /*
         * Show the center portrait first.
         */
        draw(center);


        /*
         * Tell Hero that all frames
         * have finished loading.
         */
        onReady?.();


        lastTime =
          performance.now();


        raf =
          requestAnimationFrame(
            tick
          );
      };


    loadFrames();


    /* -------------------------------------------------------------- */
    /* CLEANUP                                                         */
    /* -------------------------------------------------------------- */

    return () => {
      alive = false;


      cancelAnimationFrame(
        raf
      );


      window.removeEventListener(
        "pointermove",
        onMove
      );


      window.removeEventListener(
        "pointerdown",
        onMove
      );


      document.documentElement.removeEventListener(
        "mouseleave",
        toCenter
      );


      window.removeEventListener(
        "blur",
        toCenter
      );


      /*
       * Release decoded image memory.
       */
      frames.forEach(
        (frame) => {
          frame?.close?.();
        }
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <canvas
      ref={canvasRef}
      className="vr-canvas"
      width={720}
      height={576}
      role="img"
      aria-label={`Portrait of ${PROFILE.name} turning to follow your cursor`}
    />
  );
}


/* ------------------------------------------------------------------ */
/*  CUSTOM CURSOR                                                      */
/* ------------------------------------------------------------------ */

function CursorFX({
  rootRef,
}) {
  const dotRef =
    useRef(null);

  const ringRef =
    useRef(null);


  useEffect(() => {
    const root =
      rootRef.current;


    const fine =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;


    if (!root || !fine) {
      return;
    }


    root.classList.add(
      "has-cursor"
    );


    const dot =
      dotRef.current;


    const ring =
      ringRef.current;


    const ringEl =
      ring.firstChild;


    const dotEl =
      dot.firstChild;


    const reduced =
      prefersReducedMotion();


    let mx =
      window.innerWidth / 2;

    let my =
      window.innerHeight / 2;


    let rx = mx;
    let ry = my;


    let sx = mx;
    let sy = my;


    let hover = false;
    let down = false;

    let raf = 0;


    const onMove = (e) => {
      mx = e.clientX;

      my = e.clientY;


      root.classList.add(
        "cur-on"
      );


      const target =
        e.target;


      hover =
        !!(
          target &&
          target.closest &&
          target.closest(
            "a, button, [data-cursor]"
          )
        );
    };


    const onDown = () => {
      down = true;
    };


    const onUp = () => {
      down = false;
    };


    const onLeave = () => {
      root.classList.remove(
        "cur-on"
      );
    };


    const loop = () => {
      /*
       * Ring follows cursor.
       */
      rx +=
        (mx - rx) *
        (reduced
          ? 1
          : 0.18);


      ry +=
        (my - ry) *
        (reduced
          ? 1
          : 0.18);


      /*
       * Spotlight follows more slowly.
       */
      sx +=
        (mx - sx) *
        (reduced
          ? 1
          : 0.07);


      sy +=
        (my - sy) *
        (reduced
          ? 1
          : 0.07);


      dot.style.transform =
        `translate3d(${mx}px, ${my}px, 0)`;


      ring.style.transform =
        `translate3d(${rx}px, ${ry}px, 0)`;


      const r =
        root.getBoundingClientRect();


      root.style.setProperty(
        "--mx",
        `${sx - r.left}px`
      );


      root.style.setProperty(
        "--my",
        `${sy - r.top}px`
      );


      ringEl.classList.toggle(
        "is-hover",
        hover
      );


      ringEl.classList.toggle(
        "is-down",
        down
      );


      dotEl.classList.toggle(
        "is-hover",
        hover
      );


      raf =
        requestAnimationFrame(
          loop
        );
    };


    window.addEventListener(
      "pointermove",
      onMove,
      {
        passive: true,
      }
    );


    window.addEventListener(
      "pointerdown",
      onDown
    );


    window.addEventListener(
      "pointerup",
      onUp
    );


    document.documentElement.addEventListener(
      "mouseleave",
      onLeave
    );


    raf =
      requestAnimationFrame(
        loop
      );


    return () => {
      cancelAnimationFrame(
        raf
      );


      window.removeEventListener(
        "pointermove",
        onMove
      );


      window.removeEventListener(
        "pointerdown",
        onDown
      );


      window.removeEventListener(
        "pointerup",
        onUp
      );


      document.documentElement.removeEventListener(
        "mouseleave",
        onLeave
      );


      root.classList.remove(
        "has-cursor",
        "cur-on"
      );
    };
  }, [rootRef]);


  return (
    <>
      <div
        className="vr-cur"
        ref={ringRef}
        aria-hidden="true"
      >
        <div className="vr-cur__ring">
          <i />
        </div>
      </div>


      <div
        className="vr-cur"
        ref={dotRef}
        aria-hidden="true"
      >
        <div className="vr-cur__dot" />
      </div>
    </>
  );
}


/* ------------------------------------------------------------------ */
/*  MAGNETIC BUTTONS                                                   */
/* ------------------------------------------------------------------ */

function useMagnetic() {
  const ref =
    useRef(null);


  const onPointerMove =
    useCallback(
      (e) => {
        if (
          prefersReducedMotion() ||
          e.pointerType === "touch"
        ) {
          return;
        }


        const el =
          ref.current;


        if (!el) return;


        const r =
          el.getBoundingClientRect();


        const dx =
          (
            e.clientX -
            (
              r.left +
              r.width / 2
            )
          ) * 0.22;


        const dy =
          (
            e.clientY -
            (
              r.top +
              r.height / 2
            )
          ) * 0.32;


        el.style.transform =
          `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      },
      []
    );


  const onPointerLeave =
    useCallback(() => {
      if (ref.current) {
        ref.current.style.transform =
          "";
      }
    }, []);


  return {
    ref,
    onPointerMove,
    onPointerLeave,
  };
}


/* ------------------------------------------------------------------ */
/*  TERMINAL                                                           */
/* ------------------------------------------------------------------ */

function Terminal({
  run,
}) {
  const [chars, setChars] =
    useState(0);


  const total =
    TERMINAL_LINES.reduce(
      (n, line) =>
        n + line.length,
      0
    );


  useEffect(() => {
    if (!run) return;


    if (
      prefersReducedMotion()
    ) {
      setChars(total);

      return;
    }


    const id =
      setInterval(() => {
        setChars((current) => {
          if (
            current >= total
          ) {
            clearInterval(id);

            return current;
          }


          return current + 1;
        });
      }, 32);


    return () =>
      clearInterval(id);
  }, [
    run,
    total,
  ]);


  let remaining =
    chars;


  return (
    <div
      className="vr-terminal"
      aria-label="System status"
    >
      <ul>
        {TERMINAL_LINES.map(
          (line, i) => {
            const shown =
              clamp(
                remaining,
                0,
                line.length
              );


            remaining -=
              line.length;


            const typing =
              shown > 0 &&
              shown <
                line.length;


            const done =
              shown ===
              line.length;


            return (
              <li
                key={line}
                className={
                  done
                    ? "is-done"
                    : ""
                }
              >
                <span className="vr-terminal__mark" />

                <span>
                  {line.slice(
                    0,
                    shown
                  )}
                </span>


                {typing && (
                  <i className="vr-caret" />
                )}


                {done &&
                  i ===
                    TERMINAL_LINES.length -
                      1 && (
                    <i className="vr-caret vr-caret--blink" />
                  )}
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  CORE SIGNAL                                                        */
/* ------------------------------------------------------------------ */

function CoreSignal({
  run,
}) {
  const [v, setV] =
    useState(0);


  useEffect(() => {
    if (!run) return;


    if (
      prefersReducedMotion()
    ) {
      setV(97.6);

      return;
    }


    let raf;


    const start =
      performance.now();


    const step = (
      now
    ) => {
      const t =
        clamp(
          (now - start) /
            1800,
          0,
          1
        );


      setV(
        97.6 *
          (
            1 -
            Math.pow(
              1 - t,
              3
            )
          )
      );


      if (t < 1) {
        raf =
          requestAnimationFrame(
            step
          );
      }
    };


    raf =
      requestAnimationFrame(
        step
      );


    return () =>
      cancelAnimationFrame(
        raf
      );
  }, [run]);


  return (
    <div
      className="vr-hud vr-hud--signal"
    >
      <span className="vr-hud__label">
        CORE SIGNAL
      </span>

      <strong className="vr-hud__value">
        {v.toFixed(1)}%
      </strong>

      <div className="vr-hud__meter">
        <i
          style={{
            transform:
              `scaleX(${v / 100})`,
          }}
        />
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

export default function Hero({
  onEnterPortfolio,
  onViewProjects,
}) {
  const rootRef =
    useRef(null);


  const [progress, setProgress] =
    useState(0);


  const [ready, setReady] =
    useState(false);


  const magA =
    useMagnetic();


  const magB =
    useMagnetic();


  const goTo =
    useCallback(
      (id, cb) => {
        if (cb) {
          return cb();
        }


        const el =
          document.getElementById(
            id
          );


        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
          });
        } else {
          window.scrollTo({
            top:
              window.innerHeight,

            behavior:
              "smooth",
          });
        }
      },
      []
    );


  return (
    <main
      ref={rootRef}
      className={
        `vr-home ${
          ready
            ? "is-ready"
            : ""
        }`
      }
    >
      <style>
        {CSS}
      </style>


      {/* Background */}
      <div
        className="vr-grid"
        aria-hidden="true"
      />


      <div
        className="vr-grid vr-grid--lit"
        aria-hidden="true"
      />


      <div
        className="vr-glow"
        aria-hidden="true"
      />


      {/* Top navigation */}
      <header className="vr-top">
        <div className="vr-mark">
          <i aria-hidden="true">
            {PROFILE.name[0]}
          </i>

          <span>
            {PROFILE.name}
          </span>
        </div>


        <nav aria-label="Primary">
          {PROFILE.nav.map(
            (n) => (
              <a
                key={n.label}
                href={n.href}
              >
                {n.label}
              </a>
            )
          )}
        </nav>
      </header>


      {/* Portrait */}
      <section className="vr-stage">
        <div className="vr-portrait">
          <LivingPortrait
            onProgress={
              setProgress
            }
            onReady={() =>
              setReady(true)
            }
          />
        </div>


        {/* Subject ID */}
        <div
          className="vr-hud vr-hud--id"
        >
          <span className="vr-hud__label">
            SUBJECT ID
          </span>

          <strong className="vr-hud__value">
            VRB//026
          </strong>
        </div>


        <CoreSignal
          run={ready}
        />
      </section>


      {/* Main copy */}
      <section className="vr-copy">
        <p className="vr-role">
          {PROFILE.role}
        </p>


        <h1 className="vr-name">
          {PROFILE.name}
        </h1>


        <h2 className="vr-subline">
          <span>
            BUILDING
          </span>

          <span>
            THE FUTURE
          </span>
        </h2>


        <p className="vr-intro">
          Designing intelligent systems
          where artificial intelligence,
          software and human imagination
          converge.
        </p>


        <div className="vr-actions">
          <button
            type="button"
            className="vr-btn vr-btn--primary"
            onClick={() =>
              goTo(
                "work",
                onEnterPortfolio
              )
            }
            {...magA}
          >
            ENTER PORTFOLIO

            <span aria-hidden="true">
              →
            </span>
          </button>


          <button
            type="button"
            className="vr-btn vr-btn--ghost"
            onClick={() =>
              goTo(
                "projects",
                onViewProjects
              )
            }
            {...magB}
          >
            VIEW PROJECTS
          </button>
        </div>
      </section>


      {/* Terminal */}
      <Terminal
        run={ready}
      />


      {/* Footer */}
      <footer className="vr-foot">
        <div className="vr-status">
          <span
            className="vr-pulse"
            aria-hidden="true"
          />

          {PROFILE.availability}
        </div>


        <button
          type="button"
          className="vr-scroll"
          onClick={() =>
            goTo(
              "work",
              onEnterPortfolio
            )
          }
        >
          <span>
            SCROLL TO DECODE
          </span>

          <i aria-hidden="true" />
        </button>


        <nav
          className="vr-social"
          aria-label="Social"
        >
          {PROFILE.social.map(
            (s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s.label}
              </a>
            )
          )}
        </nav>
      </footer>


      {/* Loading screen */}
      <div
        className="vr-loader"
        role="status"
        aria-live="polite"
      >
        <div>
          CALIBRATING GAZE

          <div className="vr-loader__line">
            <i
              style={{
                transform:
                  `scaleX(${progress})`,
              }}
            />
          </div>
        </div>
      </div>


      {/* Custom cursor */}
      <CursorFX
        rootRef={rootRef}
      />
    </main>
  );
}