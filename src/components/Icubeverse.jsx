import { icubeModules } from "../data/content";

export default function Icubeverse() {
  return (
    <section className="section icube">
      <div className="icube__inner">
        <div>
          <p className="section-label">Also building</p>
          <h2>Icubeverse</h2>
          <p>
            A freelance studio I co-founded and build client work under, together with a friend.
          </p>
          <a className="btn btn--secondary" href="#contact">
            Get in touch
          </a>
        </div>
        <div className="icube__tags">
          <div className="tag-row">
            {icubeModules.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
