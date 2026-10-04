import { useEffect, useRef } from "react";
import { icubeModules } from "../data/content";
import useScrollStory from "../hooks/useScrollStory";
import SectionHead from "./SectionHead";
import { Arrow } from "./Icons";
import { gsap } from "../lib/gsap";

const WORD = "Icubeverse";
const RADIUS = 260; // px of cursor influence around each letter

/** Letters swell (weight + lift) as the cursor comes near them. */
function useProximityLetters(ref) {
  useEffect(() => {
    const word = ref.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!word || !fine || reduced) return;

    const letters = [...word.querySelectorAll("span")].map((el) => ({
      el,
      w: gsap.quickTo(el, "--wght", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
    }));

    const onMove = (e) => {
      for (const l of letters) {
        const r = l.el.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / RADIUS);
        l.w(300 + t * 400);
        l.y(-t * 14);
      }
    };
    const onLeave = () => letters.forEach((l) => (l.w(300), l.y(0)));

    const zone = word.closest(".icube");
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
}

const scramble = (e) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget.querySelector("span");
  gsap.to(el, {
    duration: 0.6,
    overwrite: true,
    scrambleText: { text: el.dataset.text, chars: "upperCase", speed: 0.8 },
  });
};

const buildIcube = (_, root) => {
  gsap.from(".icube__word span", {
    yPercent: 105,
    duration: 1,
    stagger: 0.04,
    ease: "power4.out",
    scrollTrigger: { trigger: root.querySelector(".icube__word"), start: "top 85%", toggleActions: "play none none reverse" },
  });
};

export default function Icubeverse() {
  const root = useRef(null);
  const word = useRef(null);
  useScrollStory(root, buildIcube);
  useProximityLetters(word);

  return (
    <section className="section icube" id="icubeverse" ref={root}>
      <SectionHead index="05" label="Also building" title="A studio," accent="on the side." />

      <h3 className="icube__word" ref={word} aria-label={WORD}>
        {[...WORD].map((ch, i) => (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ))}
      </h3>

      <div className="icube__row">
        <p className="icube__text" data-reveal>
          A freelance studio I co-founded and build client work under, together with a friend.
        </p>
        <ul className="icube__pills" data-stagger>
          {icubeModules.map((item) => (
            <li key={item} onPointerEnter={scramble} data-cursor>
              <span data-text={item}>{item}</span>
            </li>
          ))}
        </ul>
        <a className="btn btn--primary" href="#contact" data-magnetic="0.4">
          Start a project <Arrow />
        </a>
      </div>
    </section>
  );
}
