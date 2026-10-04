import { useEffect, useRef, useState } from "react";
import { navLinks } from "../data/content";
import { layoutTop } from "../lib/smoothScroll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(false);
  const bar = useRef(null);

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

  useEffect(() => {
    // Scenes are pinned and shifted while they hand off, so what is on screen
    // is not where it sits in the layout. Work from layout positions instead:
    // a scene counts as current once its top passes just over half the screen,
    // which is when its background takes over during the hand-off.
    const navIds = new Set(navLinks.map((l) => l.href.slice(1)));
    const scenes = [...document.querySelectorAll(".scene")].map((el) => ({
      el,
      dark: el.classList.contains("scene--dark"),
      id: [...el.querySelectorAll("[id]")].find((n) => navIds.has(n.id))?.id || "",
    }));

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("--p", max > 0 ? Math.min(1, y / max) : 0);

      const probe = y + window.innerHeight * 0.55;
      let current = scenes[0];
      for (const s of scenes) if (layoutTop(s.el) <= probe) current = s;
      setActive(current?.id || "");
      setDark(!!current?.dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className={`topbar ${open ? "is-open" : ""} ${dark ? "is-dark" : ""}`}>
      <a className="brand" href="#home" onClick={() => setOpen(false)} data-magnetic="0.25">
        <span className="brand__mark" aria-hidden="true" />
        VENKATA RAJA
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
        {navLinks.map((link, i) => (
          <a
            href={link.href}
            key={link.href}
            onClick={() => setOpen(false)}
            className={active === link.href.slice(1) ? "is-active" : undefined}
            aria-current={active === link.href.slice(1) ? "location" : undefined}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            <span className="roll">
              <span className="roll__in">
                <span>{link.label}</span>
                <span aria-hidden="true">{link.label}</span>
              </span>
            </span>
          </a>
        ))}
      </nav>
      <div className="status-pill">
        <i className="pulse" aria-hidden="true" /> OPEN TO WORK
      </div>
      <span className="topbar__progress" ref={bar} aria-hidden="true" />
    </header>
  );
}
