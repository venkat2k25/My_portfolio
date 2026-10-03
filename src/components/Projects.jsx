import { useRef } from "react";
import useScrollStory from "../hooks/useScrollStory";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/content";

export default function Projects() {
  const root = useRef(null);
  useScrollStory(root);

  return (
    <section className="section projects" id="work" ref={root}>
      <div className="section-head section-head--row" data-reveal>
        <div>
          <p className="section-label">Selected work</p>
          <h2>Projects</h2>
        </div>
        <p className="section-note">
          A few things I&rsquo;ve built and shipped, across AI, testing tooling and full-stack apps.
        </p>
      </div>
      <div className="project-list" data-stagger>
        {projects.map((project) => (
          <ProjectCard project={project} key={project.number} />
        ))}
      </div>
    </section>
  );
}
