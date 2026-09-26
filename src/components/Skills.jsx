import { skillGroups } from "../data/content";

export default function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="section-head">
        <p className="section-label">Skills</p>
        <h2>What I work with</h2>
      </div>
      <div className="skill-grid">
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
