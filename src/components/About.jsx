import { useRef } from "react";
import { Arrow } from "./Icons";
import SectionHead from "./SectionHead";
import { portraitImage, quickFacts, stats } from "../data/content";
import useScrollStory from "../hooks/useScrollStory";
import { gsap } from "../lib/gsap";

const buildAbout = (_, root) => {
  gsap
    .timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: root.querySelector(".about__layout"), start: "top 75%", toggleActions: "play none none reverse" },
    })
    .from(".lens", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" }, 0)
    .from(".lens img", { scale: 1.3, duration: 1.6 }, 0)
    .from(".lens__tag", { opacity: 0, y: 10, stagger: 0.08, duration: 0.6 }, 0.7)
    .from(".about__facts .card-row", { x: 40, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.4);

  // the photo drifts a little slower than the page
  gsap.to(".lens", {
    yPercent: -8,
    ease: "none",
    scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
  });
};

/** Grayscale portrait; a colour lens follows the cursor across it. */
function Lens() {
  const ref = useRef(null);

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    gsap.to(el, { "--lr": "130px", duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };
  const onLeave = () => gsap.to(ref.current, { "--lr": "0px", duration: 0.5, ease: "power3.inOut", overwrite: "auto" });

  return (
    <figure className="lens" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor-label="Look">
      <img src={portraitImage} alt="Portrait of Venkata Raja B Y" />
      <img className="lens__color" src={portraitImage} alt="" aria-hidden="true" />
      <i className="lens__bracket" aria-hidden="true" />
      <figcaption>
        <span className="lens__tag">VR / 2026</span>
        <span className="lens__tag">SE · TCS</span>
      </figcaption>
    </figure>
  );
}

export default function About() {
  const root = useRef(null);
  useScrollStory(root, buildAbout);

  return (
    <section className="section about" id="about" ref={root}>
      <SectionHead index="01" label="About" title="A bit" accent="about me." />

      <div className="about__layout">
        <Lens />

        <div className="about__copy">
          <p className="about__statement" data-words>
            I&rsquo;m a Software Engineer at TCS working on Japan Airlines partner testing, with a background in
            AI/ML, full-stack development and data analytics.
          </p>
          <p className="about__body" data-reveal>
            I currently validate Amadeus Altea reservation workflows (PNR creation, codeshare, IATCI and iEMD
            scenarios) for Japan Airlines partner systems, translating business requirements into structured test
            cases and defect reports. Outside of testing, I build AI-driven analytics platforms, computer-vision apps,
            and full-stack products.
          </p>

          <div className="stats" data-stagger>
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>
                  <span data-count={s.value} data-decimals={s.decimals || 0}>
                    {s.value.toFixed(s.decimals || 0)}
                  </span>
                  {s.suffix}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <a className="btn btn--ghost" href="#contact" data-magnetic>
            Get in touch <Arrow />
          </a>
        </div>

        <dl className="card about__facts">
          {quickFacts.map((fact) => (
            <div className="card-row" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd className={fact.isStatus ? "is-status" : undefined}>
                {fact.isStatus && <i className="pulse" aria-hidden="true" />}
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
