import { useLayoutEffect } from "react";
import { gsap, SplitText } from "../lib/gsap";

/**
 * Scoped, auto-cleaned scroll animation for one section.
 *
 *   useScrollStory(rootRef, ({ desktop, tablet, mobile }, root) => { ...gsap code... });
 *
 * - Everything runs inside gsap.matchMedia(root): selectors are scoped to the
 *   section, and every tween / ScrollTrigger / SplitText is reverted on unmount
 *   or when the breakpoint changes.
 * - Nothing runs under prefers-reduced-motion, so content stays in its natural,
 *   fully visible state (no CSS hides content up front).
 * - Optional data-attributes work in ANY section with no extra code:
 *     data-reveal            fade/slide in once visible
 *     data-stagger           children reveal one after another
 *     data-zoom              scrubbed scale 0.82 -> 1 as it enters
 *     data-parallax="0.15"   vertical drift (desktop/tablet only)
 *     data-split             words rise out of a line mask ("chars" for letters)
 *     data-scramble          text decodes from random glyphs once visible
 *     data-words             words light up one by one as you scroll past
 *     data-count             the number counts up from 0 (data-decimals="2")
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
        const undo = applyDataAttributes(root, c);
        build?.(c, root);
        return undo;
      }
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const once = (el, start = "top 85%") => ({
  trigger: el,
  start,
  toggleActions: "play none none reverse",
});

function applyDataAttributes(root, { mobile }) {
  const q = (s) => gsap.utils.toArray(s, root);

  q("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: once(el) })
  );

  q("[data-stagger]").forEach((el) =>
    gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
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

  // Headlines: each word (or letter) slides up out of its own line mask.
  q("[data-split]").forEach((el) => {
    const chars = el.dataset.split === "chars";
    SplitText.create(el, {
      type: chars ? "lines,words,chars" : "lines,words",
      mask: "lines",
      autoSplit: true, // re-split when fonts load or the width changes
      onSplit: (self) =>
        gsap.from(chars ? self.chars : self.words, {
          yPercent: 110,
          rotate: chars ? 6 : 3,
          duration: chars ? 0.9 : 1,
          stagger: chars ? 0.025 : 0.06,
          ease: "power4.out",
          scrollTrigger: once(el, "top 88%"),
        }),
    });
  });

  // Mono labels decode like a terminal readout.
  q("[data-scramble]").forEach((el) => {
    const text = el.textContent;
    gsap.to(el, {
      duration: 1.1,
      ease: "none",
      scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_", speed: 0.5, revealDelay: 0.25 },
      scrollTrigger: once(el, "top 92%"),
    });
  });

  // Long statements fill in word by word with scroll.
  q("[data-words]").forEach((el) => {
    SplitText.create(el, {
      type: "words",
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: true },
          }
        ),
    });
  });

  // Numbers count up once visible (the markup already holds the final value).
  const counters = q("[data-count]");
  counters.forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const val = { n: 0 };
    gsap.to(val, {
      n: end,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => (el.textContent = val.n.toFixed(decimals)),
      onComplete: () => (el.textContent = end.toFixed(decimals)),
      scrollTrigger: once(el, "top 90%"),
    });
  });

  if (!mobile) {
    q("[data-parallax]").forEach((el) =>
      gsap.to(el, {
        y: () => -parseFloat(el.dataset.parallax || "0.15") * window.innerHeight,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      })
    );
  }

  // counters write text directly, so put the final values back on revert
  return () => counters.forEach((el) => (el.textContent = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.decimals || "0", 10))));
}
