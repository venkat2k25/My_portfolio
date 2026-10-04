import { useRef } from "react";
import { experienceTrack } from "../data/content";
import { WireSphere } from "./Geo";
import SectionHead from "./SectionHead";
import useScrollStory from "../hooks/useScrollStory";
import { gsap, ScrollTrigger } from "../lib/gsap";

export default function Experience() {
  const root = useRef(null);
  const current = experienceTrack.length - 1;

  useScrollStory(root, ({ desktop }) => {
    const trigger = root.current;

    // Arrival: the sphere zooms up out of the distance as the scene opens.
    gsap.fromTo(
      ".experience__sphere",
      { scale: 0.15, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger, start: "top bottom", end: "top 25%", scrub: true },
      }
    );

    // Sphere keeps turning for the whole section (it is sticky, so it travels with the reader).
    gsap.to(".experience__sphere .geo__spin", {
      rotationY: 360,
      rotationX: 90,
      ease: "none",
      scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
    });

    // Each row: rail fills as you reach it, row lights up while it is the one being read.
    gsap.utils.toArray(".timeline-row", trigger).forEach((row) => {
      const body = row.querySelector(".timeline-row__body");
      const year = row.querySelector("time");
      const fill = row.querySelector(".timeline-row__fill");

      gsap.from([year, body], {
        x: (i) => (i === 0 ? -30 : desktop ? 60 : 24),
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: { trigger: row, start: "top 70%", end: "bottom 60%", scrub: true },
        }
      );

      ScrollTrigger.create({
        trigger: row,
        start: "top 60%",
        end: "bottom 40%",
        toggleClass: { targets: row, className: "is-active" },
      });
    });
  });

  return (
    <section className="section experience" id="experience" ref={root}>
      <div className="experience__stage" aria-hidden="true">
        <WireSphere className="experience__sphere" size={280} />
      </div>

      <SectionHead index="04" label="Experience" title="The road" accent="so far." />

      <div className="timeline-list">
        {experienceTrack.map((entry, i) => (
          <div className={`timeline-row ${i === current ? "is-current" : ""}`} key={entry.year} data-cursor>
            <span className="timeline-row__idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <time>{entry.year}</time>
            <div className="timeline-row__rail">
              <span className="timeline-row__fill" />
              <span className="timeline-row__dot" />
            </div>
            <div className="timeline-row__body">
              <h3>{entry.title}</h3>
              <p>{entry.sub}</p>
              {i === current && <span className="timeline-row__current-tag">Present</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
