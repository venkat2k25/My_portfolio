import { useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";

const vh = () => window.innerHeight;

// Every tween spans the whole transition (0 → 1) and is shaped by an ease that
// is flat outside [a, b]. So any scroll position, including straight after a
// refresh or a jump, renders an exact state; no tween waits for the playhead
// to reach it before applying its starting values.
const seg = (a, b, ease = "none") => {
  const e = gsap.parseEase(ease);
  return (t) => (t <= a ? 0 : t >= b ? 1 : e((t - a) / (b - a)));
};
const span = (a, b, ease) => ({ duration: 1, ease: seg(a, b, ease) });

/**
 * Scroll as scene changes instead of a page moving upward.
 *
 * Between two scenes (desktop + tablet), over 100vh of scroll:
 *   0.00 – 0.40  the outgoing scene is pinned in place and recedes to nothing
 *   0.35 – 0.55  the incoming background fades over whatever is left of it
 *   0.50 – 1.00  the incoming content fades up and settles from a slight zoom
 * The two never show content at the same time, and only opacity and transforms
 * animate, so everything stays on the compositor.
 *
 * The outgoing pin uses pinSpacing: false, so the document layout never changes.
 * The incoming frame is shifted by exactly the distance it still has to scroll,
 * so it appears in place; when the hand-off ends it is in its natural position
 * at the top of the page and normal reading resumes.
 *
 * Phones get a lighter fade/zoom with no pinning. Reduced motion gets nothing.
 */
export default function useSceneTransitions(ref) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(ref.current);

    mm.add(
      {
        full: "(min-width: 640px) and (prefers-reduced-motion: no-preference)",
        lite: "(max-width: 639px) and (prefers-reduced-motion: no-preference)",
      },
      ({ conditions: { full } }) => {
        const scenes = gsap.utils.toArray(".scene", ref.current);

        scenes.forEach((scene, i) => {
          const frame = scene.querySelector(":scope > .scene__frame");
          const inner = frame.querySelector(":scope > .scene__inner");
          const solids = gsap.utils.toArray(".scene__shapes > .solid", inner);

          animateSolids(scene, solids);

          if (!full) {
            if (i > 0) liteEnter(scene, inner);
            return;
          }
          if (i > 0) enter(scene, frame, inner, solids);
          if (i < scenes.length - 1) exit(scene, inner, solids);
        });
      }
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function enter(scene, frame, inner, solids) {
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: scene,
      start: "top bottom",
      end: "top top",
      scrub: true, // must track scroll exactly: the shift below cancels it
      invalidateOnRefresh: true,
      // still mostly invisible: don't let it catch the pointer
      onUpdate: (self) => (frame.style.pointerEvents = self.progress < 0.5 ? "none" : ""),
      onLeave: () => {
        gsap.set([frame, inner], { clearProps: "transform,opacity" });
        frame.style.pointerEvents = "";
      },
    },
  });

  // Hold the scene in place on screen while it is scrolled into position.
  tl.fromTo(frame, { y: () => -vh() }, { y: 0, duration: 1 }, 0)
    .fromTo(frame, { opacity: 0 }, { opacity: 1, ...span(0.35, 0.55, "sine.inOut") }, 0)
    .fromTo(
      inner,
      { scale: 1.05, opacity: 0, transformOrigin: () => `50% ${vh() / 2}px` },
      { scale: 1, opacity: 1, transformOrigin: () => `50% ${vh() / 2}px`, ...span(0.5, 1, "power2.out") },
      0
    );

  if (solids.length) {
    tl.fromTo(solids, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, ...span(0.6, 0.95, "power2.out") }, 0);
  }
}

function exit(scene, inner, solids) {
  // Recede around the part of the scene that is actually on screen.
  const origin = () => `50% ${inner.offsetHeight - vh() / 2}px`;

  const tl = gsap.timeline({
    defaults: { immediateRender: false },
    scrollTrigger: {
      trigger: scene,
      start: "bottom bottom",
      end: "+=100%",
      pin: true,
      pinSpacing: false,
      scrub: true,
      invalidateOnRefresh: true,
      // faded out: stop catching the pointer
      onUpdate: (self) => (inner.style.pointerEvents = self.progress > 0.35 ? "none" : ""),
      // Back at rest: drop the transform so fixed-position children behave.
      onLeaveBack: () => {
        gsap.set([inner, ...solids], { clearProps: "transform,opacity" });
        inner.style.pointerEvents = "";
      },
    },
  });

  tl.fromTo(
    inner,
    { scale: 1, opacity: 1, transformOrigin: origin },
    { scale: 0.94, opacity: 0, transformOrigin: origin, ...span(0, 0.4, "sine.out") },
    0
  );

  if (solids.length) {
    tl.fromTo(solids, { scale: 1, opacity: 1 }, { scale: 1.6, opacity: 0, ...span(0, 0.35, "sine.in") }, 0);
  }
}

function liteEnter(scene, inner) {
  gsap.fromTo(
    inner,
    { opacity: 0, scale: 0.97 },
    {
      opacity: 1,
      scale: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: scene, start: "top 92%", end: "top 50%", scrub: true },
    }
  );
}

// Shapes turn and drift with scroll for as long as their scene is on screen.
function animateSolids(scene, solids) {
  solids.forEach((solid, k) => {
    const dir = k % 2 ? -1 : 1;
    const depth = parseFloat(solid.dataset.depth || "0.2");
    const range = { trigger: scene, start: "top bottom", end: "bottom top", invalidateOnRefresh: true };

    gsap.fromTo(
      solid.querySelector(".solid__spin"),
      { rotationX: -22, rotationY: 32 }, // matches the static CSS pose
      { rotationX: -22 + dir * 140, rotationY: 32 + dir * 320, ease: "none", scrollTrigger: { ...range, scrub: 0.8 } }
    );
    gsap.fromTo(
      solid.querySelector(".solid__drift"),
      { y: () => depth * vh() * 0.6 },
      { y: () => -depth * vh() * 0.6, ease: "none", scrollTrigger: { ...range, scrub: true } }
    );
  });
}
