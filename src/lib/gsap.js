import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, app-wide. Import { gsap, ScrollTrigger } from here everywhere.
gsap.registerPlugin(ScrollTrigger);

// Pinned sections change page height; re-measure once fonts/images have settled.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };