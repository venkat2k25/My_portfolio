import { motion, useReducedMotion } from "framer-motion";
import { Arrow } from "./Icons";
import { portraitImage } from "../data/content";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="hero" id="home">
      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
      >
        <motion.p className="hero__role" {...rise} transition={{ duration: 0.4 }}>
          Software Engineer / AI Engineer / Functional Testing
        </motion.p>

        <motion.h1 {...rise} transition={{ duration: 0.5, delay: 0.05 }}>
          Venkata Raja B Y
        </motion.h1>

        <motion.p className="hero__intro" {...rise} transition={{ duration: 0.45, delay: 0.1 }}>
          I build reliable airline reservation systems and intelligent AI/ML products — where rigorous
          testing meets full-stack engineering.
        </motion.p>

        <motion.div className="hero__actions" {...rise} transition={{ duration: 0.45, delay: 0.15 }}>
          <a className="btn btn--primary" href="#work">
            View work <Arrow />
          </a>
          <a className="btn btn--secondary" href="#contact">
            Get in touch
          </a>
        </motion.div>

        <motion.div className="hero__facts" {...rise} transition={{ duration: 0.45, delay: 0.2 }}>
          <div>
            <span>Currently</span>
            <b>TCS — Japan Airlines</b>
          </div>
          <div>
            <span>Testing</span>
            <b>Amadeus Altea, PNR, IATCI</b>
          </div>
          <div>
            <span>Also building</span>
            <b>AI &amp; full-stack products</b>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__visual"
        initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="hero__photo">
          <img src={portraitImage} alt="Portrait of Venkata Raja B Y" />
        </div>
      </motion.div>
    </section>
  );
}
