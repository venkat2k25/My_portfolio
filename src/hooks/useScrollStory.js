import { useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";

/**
 * Scoped, auto-cleaned scroll animation for one section.
 *
 *   useScrollStory(rootRef, ({ desktop, tablet, mobile }, root) => { ...gsap code... });
 *
 * - Everything runs inside gsap.matchMedia(root): selectors are scoped to the
 *   section, and every tween / ScrollTrigger is reverted on unmount or when the
 *   breakpoint changes.
 * - Nothing runs under prefers-reduced-motion, so content stays in its natural,
 *   fully visible state (no CSS hides content up front).
 * - Optional data-attributes work in ANY section with no extra code:
 *     data-reveal            fade/slide in once visible
 *     data-stagger           children reveal one after another
 *     data-zoom              scrubbed scale 0.82 -> 1 as it enters
 *     data-parallax="0.15"   vertical drift (desktop/tablet only)
 *
 * Pass a stable `build` function (module-level or useCallback) so the effect runs once.
 */
export default function useScrollStory(ref, build) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        tablet: "(min-width: 640px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 639px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const c = ctx.conditions;
        applyDataAttributes(root, c);
        build?.(c, root);
      }
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function applyDataAttributes(root, { mobile }) {
  const q = (s) => gsap.utils.toArray(s, root);
  const once = (el, start = "top 85%") => ({
    trigger: el,
    start,
    toggleActions: "play none none reverse",
  });

  q("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: once(el) })
  );

  q("[data-stagger]").forEach((el) =>
    gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: once(el, "top 80%"),
    })
  );

  q("[data-zoom]").forEach((el) =>
    gsap.fromTo(
      el,
      { scale: 0.82, opacity: 0.2 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 95%", end: "top 40%", scrub: true },
      }
    )
  );

  if (!mobile) {
    q("[data-parallax]").forEach((el) =>
      gsap.to(el, {
        y: () => -parseFloat(el.dataset.parallax || "0.15") * window.innerHeight,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      })
    );
  }
}
