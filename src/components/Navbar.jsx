import { navLinks } from "../data/content";

export default function Navbar() {
  return (
    <header className="topbar">
      <a className="brand" href="#home">
        Venkata Raja
      </a>
      <nav aria-label="Primary navigation">
        {navLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="status-pill">
        <i /> Open to work
      </div>
    </header>
  );
}
