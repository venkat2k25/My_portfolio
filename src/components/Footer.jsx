import { navLinks } from "../data/content";

export default function Footer() {
  return (
    <footer>
      <span>© 2026 Venkata Raja B Y</span>
      <nav aria-label="Footer navigation">
        {navLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
