import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useScrollStory from "../hooks/useScrollStory";
import SectionHead from "./SectionHead";
import { skillGroups } from "../data/content";
import { gsap, ScrollTrigger } from "../lib/gsap";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/*  Marquee: drifts on its own; scrolling speeds it up and its          */
/*  direction follows the scroll direction. Slows down under the cursor.*/
/* ------------------------------------------------------------------ */
const BASE_SPEED = 45; // px / s

function Marquee({ items, reverse = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const track = el.firstChild;
    const base = reverse ? -1 : 1;
    let x = 0, boost = 0, dir = 1, hover = 1, visible = false;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (visible = self.isActive),
      onUpdate: (self) => {
        boost = gsap.utils.clamp(-10, 10, self.getVelocity() / 250);
        dir = self.direction;
      },
    });
    visible = st.isActive;

    const tick = (_, dtMs) => {
      if (!visible) return;
      const half = track.scrollWidth / 2;
      if (!half) return;
      const speed = (BASE_SPEED + Math.abs(boost) * 60) * base * dir * hover;
      x = gsap.utils.wrap(-half, 0, x - speed * (dtMs / 1000));
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      boost *= 0.94;
    };
    gsap.ticker.add(tick);

    const slow = () => gsap.to({ v: hover }, { v: 0.2, duration: 0.6, onUpdate() { hover = this.targets()[0].v; } });
    const fast = () => gsap.to({ v: hover }, { v: 1, duration: 0.6, onUpdate() { hover = this.targets()[0].v; } });
    el.addEventListener("pointerenter", slow);
    el.addEventListener("pointerleave", fast);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      el.removeEventListener("pointerenter", slow);
      el.removeEventListener("pointerleave", fast);
    };
  }, [reverse]);

  const row = items.map((item, i) => (
    <span className="mq__item" key={i}>
      {item}
      <i className="mq__sep">✦</i>
    </span>
  ));

  return (
    <div className="mq" ref={ref} aria-hidden="true">
      <div className="mq__track">
        {row}
        {row}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Console: pick a group (hover, click or arrow keys) to load it       */
/* ------------------------------------------------------------------ */
function SkillConsole() {
  const [active, setActive] = useState(0);
  const panel = useRef(null);
  const tabs = useRef([]);
  const first = useRef(true);
  const group = skillGroups[active];

  // each switch decodes the header and deals the chips in
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reducedMotion()) return;
    const p = panel.current;
    const ctx = gsap.context(() => {
      gsap.from(".console__chips li", { y: 16, opacity: 0, duration: 0.45, stagger: 0.03, ease: "power3.out" });
      gsap.from(".console__bar i", { scaleX: 0, duration: 0.6, ease: "power3.out" });
      gsap.to(".console__code", {
        duration: 0.6,
        scrambleText: { text: group.code, chars: "0123456789ABCDEF.", speed: 0.6 },
      });
      gsap.to(".console__panel-title", {
        duration: 0.7,
        scrambleText: { text: group.title, chars: "lowerCase", speed: 0.6 },
      });
    }, p);
    return () => ctx.revert();
  }, [active, group]);

  const onKeyDown = (e) => {
    const n = skillGroups.length;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let next = null;
    if (step) next = (active + step + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next == null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="console" data-reveal>
      <div className="console__tabs" role="tablist" aria-label="Skill groups" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {skillGroups.map((g, i) => (
          <button
            key={g.title}
            ref={(el) => (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={`skill-tab-${i}`}
            aria-selected={i === active}
            aria-controls="skill-panel"
            tabIndex={i === active ? 0 : -1}
            className="console__tab"
            onClick={() => setActive(i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
          >
            <span className="console__tab-code">{g.code}</span>
            <span className="console__tab-name">{g.title}</span>
            <span className="console__tab-count">{String(g.items.length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <div className="console__panel" ref={panel} role="tabpanel" id="skill-panel" aria-labelledby={`skill-tab-${active}`}>
        <header className="console__head">
          <span className="console__code">{group.code}</span>
          <span className="console__live">
            <i className="pulse" aria-hidden="true" /> LOADED
          </span>
        </header>
        <h3 className="console__panel-title">{group.title}</h3>
        <ul className="console__chips">
          {group.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="console__bar" aria-hidden="true">
          <i style={{ width: `${((active + 1) / skillGroups.length) * 100}%` }} />
          <span>
            {String(active + 1).padStart(2, "0")} / {String(skillGroups.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const root = useRef(null);
  useScrollStory(root);

  const all = skillGroups.flatMap((g) => g.items);
  const half = Math.ceil(all.length / 2);

  return (
    <section className="skills" id="skills" ref={root}>
      <div className="section skills__head">
        <SectionHead index="03" label="Skills" title="What I" accent="work with." />
      </div>
      <div className="skills__marquees">
        <Marquee items={all.slice(0, half)} />
        <Marquee items={all.slice(half)} reverse />
      </div>
      <div className="section skills__console">
        <SkillConsole />
      </div>
    </section>
  );
}
