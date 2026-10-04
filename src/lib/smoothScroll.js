import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Eased, inertial scrolling driven by GSAP's ticker, so ScrollTrigger and
 * Lenis read the same frame. Skipped under prefers-reduced-motion.
 *
 * Also owns in-page navigation: scenes are moved and pinned during their
 * transitions, so a section's on-screen position is not where it lives in
 * the document. scrollToId() measures the layout position instead and lands
 * exactly where the scene is fully revealed.
 */
let lenis = null;
const raf = (time) => lenis?.raf(time * 1000);

export function startSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(raf);
  gsap.ticker.lagSmoothing(500, 33);
  lenis.destroy();
  lenis = null;
}

// Document offset from the layout chain (offsetTop ignores transforms).
export function layoutTop(el) {
  const scene = el.closest(".scene");
  // A pinned scene is position:fixed; its pin-spacer still holds its place.
  let node = scene ? (scene.parentElement.classList.contains("pin-spacer") ? scene.parentElement : scene) : el;
  let top = 0;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  const top = el ? layoutTop(el) : window.innerHeight;
  if (lenis) lenis.scrollTo(top, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top, behavior: "smooth" });
}

// Route every same-page "#id" link through scrollToId.
export function handleAnchorClicks(e) {
  const link = e.target.closest?.('a[href^="#"]');
  if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
  const id = link.getAttribute("href").slice(1);
  if (!id || !document.getElementById(id)) return;
  e.preventDefault();
  scrollToId(id);
  history.replaceState(null, "", `#${id}`);
}
