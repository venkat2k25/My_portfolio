import { useEffect, useState } from "react";
import { navLinks } from "../data/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // close the mobile menu on Escape or when the screen grows past the breakpoint
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 720px)");
    const onWide = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className={`topbar ${open ? "is-open" : ""}`}>
      <a className="brand" href="#home" onClick={() => setOpen(false)}>
        Venkata Raja
      </a>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
      <nav id="primary-nav" aria-label="Primary navigation">
        {navLinks.map((link) => (
          <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
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
