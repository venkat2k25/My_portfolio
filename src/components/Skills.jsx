import { useRef } from "react";
import useScrollStory from "../hooks/useScrollStory";
import { skillGroups } from "../data/content";

export default function Skills() {
  const root = useRef(null);
  useScrollStory(root);

  return (
    <section className="section skills" id="skills" ref={root}>
      <div className="section-head" data-reveal>
        <p className="section-label">Skills</p>
        <h2>What I work with</h2>
      </div>
      <div className="skill-grid" data-stagger>
        {skillGroups.map((group) => (
          <article className="skill-panel" key={group.title}>
            <h3>{group.title}</h3>
            <div className="chips">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
