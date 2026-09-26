import { experienceTrack } from "../data/content";

export default function Experience() {
  const current = experienceTrack.length - 1;

  return (
    <section className="section experience" id="experience">
      <div className="section-head">
        <p className="section-label">Experience</p>
        <h2>Career</h2>
      </div>
      <div className="timeline-list">
        {experienceTrack.map((entry, i) => (
          <div className={`timeline-row ${i === current ? "is-current" : ""}`} key={entry.year}>
            <time>{entry.year}</time>
            <div className="timeline-row__rail">
              <span className="timeline-row__dot" />
            </div>
            <div>
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
