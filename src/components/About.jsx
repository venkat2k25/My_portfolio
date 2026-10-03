import { useRef } from "react";
import { Arrow } from "./Icons";
import { portraitImage, quickFacts } from "../data/content";
import { WireCube } from "./Geo";
import useScrollStory from "../hooks/useScrollStory";
import { gsap } from "../lib/gsap";

export default function About() {
  const root = useRef(null);

  useScrollStory(root, () => {
    // 1) Entrance: plays once the section is in view, reverses when scrolling back up.
    //    (Not scrubbed, so there is never an empty section while approaching it.)
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: "play none none reverse" },
      })
      .from(".geo--about", { opacity: 0, duration: 1.2 }, 0)
      .from(".about__photo", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" }, 0.05)
      .from(".about__photo img", { scale: 1.35, duration: 1.6 }, 0.05)
      .from(".about__copy > *", { y: 36, opacity: 0, stagger: 0.14, duration: 0.8 }, 0.35)
      .from(".facts__row", { x: 48, opacity: 0, stagger: 0.09, duration: 0.6 }, 0.6);

    // 2) The cube turns and grows while the section is on screen. Pinning and the
    //    hand-off to the next section are handled by the scene transitions (Home).
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
      })
      .to(".geo--about .geo__spin", { rotationY: 300, rotationX: 140 }, 0)
      .to(".geo--about", { scale: 1.5 }, 0);
  });

  return (
    <section className="section about" id="about" ref={root}>
      <WireCube className="geo--about" />

      <div className="section-head">
        <p className="section-label">About</p>
        <h2>A bit about me</h2>
      </div>

      <div className="about__layout">
        <div className="about__photo">
          <img src={portraitImage} alt="Portrait of Venkata Raja B Y" />
        </div>

        <div className="about__copy">
          <p className="lead">
            I&rsquo;m a Software Engineer at TCS working on Japan Airlines partner testing, with a background
            in AI/ML, full-stack development and data analytics.
          </p>
          <p>
            I currently validate Amadeus Altea reservation workflows — PNR creation, codeshare, IATCI and iEMD
            scenarios — for Japan Airlines partner systems, translating business requirements into structured
            test cases and defect reports. Outside of testing, I build AI-driven analytics platforms,
            computer-vision apps, and full-stack products.
          </p>
          <a className="text-link" href="#contact">
            Get in touch <Arrow />
          </a>
        </div>

        <div className="facts">
          {quickFacts.map((fact) => (
            <div className="facts__row" key={fact.label}>
              <span>{fact.label}</span>
              <b className={fact.isStatus ? "is-status" : undefined}>
                {fact.isStatus && <i />}
                {fact.value}
              </b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
