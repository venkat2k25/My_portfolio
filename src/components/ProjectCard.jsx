export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__num">{project.number}</div>
      <div>
        <div className="project-card__year">{project.year}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.tech.split(" / ").map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>
      <span className="project-card__status">{project.status}</span>
    </article>
  );
}
