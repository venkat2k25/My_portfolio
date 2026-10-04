import { useEffect, useRef } from "react";
import useScrollStory from "../hooks/useScrollStory";
import ProjectCard from "./ProjectCard";
import SectionHead from "./SectionHead";
import { projects } from "../data/content";
import { gsap } from "../lib/gsap";

const MAX_TILT = 6; // degrees

/**
 * Bento grid of spotlight cards. One pointer listener on the grid feeds every
 * card its own cursor position (--mx/--my), so the border glow flows across
 * neighbouring cards, and the card under the pointer tilts toward it.
 */
function useSpotlightGrid(ref) {
  useEffect(() => {
    const grid = ref.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!grid || !fine) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = [...grid.querySelectorAll(".pcard")];
    const tilt = new Map();
    if (!reduced) {
      cards.forEach((c) => {
        gsap.set(c, { transformPerspective: 1000 });
        tilt.set(c, {
          rx: gsap.quickTo(c, "rotationX", { duration: 0.6, ease: "power3.out" }),
          ry: gsap.quickTo(c, "rotationY", { duration: 0.6, ease: "power3.out" }),
        });
      });
    }

    const onMove = (e) => {
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        c.style.setProperty("--mx", `${x}px`);
        c.style.setProperty("--my", `${y}px`);
        const t = tilt.get(c);
        if (!t) continue;
        const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
        t.rx(inside ? (0.5 - y / r.height) * MAX_TILT : 0);
        t.ry(inside ? (x / r.width - 0.5) * MAX_TILT : 0);
      }
    };
    const onLeave = () => tilt.forEach((t) => (t.rx(0), t.ry(0)));

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      gsap.set(cards, { clearProps: "transform" });
    };
  }, [ref]);
}

export default function Projects() {
  const root = useRef(null);
  const grid = useRef(null);
  useScrollStory(root);
  useSpotlightGrid(grid);

  return (
    <section className="section projects" id="work" ref={root}>
      <SectionHead
        index="02"
        label="Selected work"
        title="Things I've"
        accent="built & shipped."
        note="A few projects across AI, testing tooling and full-stack apps."
      />
      <div className="bento" ref={grid} data-stagger>
        {projects.map((project, i) => (
          <ProjectCard project={project} featured={i === 0} key={project.number} />
        ))}
      </div>
    </section>
  );
}
