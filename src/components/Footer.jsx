import { navLinks } from "../data/content";
import { scrollToId } from "../lib/smoothScroll";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__mark" aria-hidden="true">
        VENKATA RAJA
      </p>
      <div className="site-footer__bar">
        <span>© 2026 Venkata Raja B Y</span>
        <nav aria-label="Footer navigation">
          {navLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button type="button" className="site-footer__top" onClick={() => scrollToId("home")} data-magnetic="0.4">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
