import { motion } from "framer-motion";
import { Arrow } from "./Icons";
import { portraitImage, quickFacts } from "../data/content";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="section-head">
        <p className="section-label">About</p>
        <h2>A bit about me</h2>
      </div>

      <motion.div
        className="about__layout"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    </section>
  );
}
