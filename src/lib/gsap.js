import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

// Register once, app-wide. Import { gsap, ScrollTrigger, SplitText } from here everywhere.
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

// Pinned sections change page height; re-measure once fonts/images have settled.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger, SplitText };
