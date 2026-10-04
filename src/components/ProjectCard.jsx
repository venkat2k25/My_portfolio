export default function ProjectCard({ project, featured = false }) {
  return (
    <article className={`pcard ${featured ? "pcard--featured" : ""}`} data-cursor>
      <span className="pcard__ghost" aria-hidden="true">
        {project.number}
      </span>
      <header className="pcard__top">
        <span>
          {project.number} / {project.year}
        </span>
        <span className="pcard__status">
          <i className="pulse" aria-hidden="true" />
          {project.status}
        </span>
      </header>
      <div className="pcard__body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      <ul className="pcard__tags" aria-label="Built with">
        {project.tech.split(" / ").map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <span className="pcard__arrow" aria-hidden="true">
        ↗
      </span>
    </article>
  );
}
