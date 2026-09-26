import ProjectCard from "./ProjectCard";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <section className="section projects" id="work">
      <div className="section-head section-head--row">
        <div>
          <p className="section-label">Selected work</p>
          <h2>Projects</h2>
        </div>
        <p className="section-note">
          A few things I&rsquo;ve built and shipped, across AI, testing tooling and full-stack apps.
        </p>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.number} />
        ))}
      </div>
    </section>
  );
}
