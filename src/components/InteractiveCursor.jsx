import { useEffect, useRef } from "react";

/**
 * Renders the custom neon cursor (dot + trailing ring) and drives the CSS
 * custom properties that power the hero's pointer-reactive tilt/glow.
 * Falls back to the native cursor automatically on touch devices via CSS
 * (see the `@media (pointer: fine)` block in index.css).
 */
export default function InteractiveCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let targetX = ringX;
    let targetY = ringY;

    const move = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dotRef.current?.style.setProperty("transform", `translate3d(${targetX}px, ${targetY}px, 0)`);
      const root = document.documentElement.style;
      root.setProperty("--cursor-x", `${targetX / window.innerWidth}`);
      root.setProperty("--cursor-y", `${targetY / window.innerHeight}`);
      root.setProperty("--hero-rx", `${(0.5 - targetY / window.innerHeight) * -4}deg`);
      root.setProperty("--hero-ry", `${(0.5 - targetX / window.innerWidth) * 7}deg`);
      root.setProperty("--hero-x", `${(targetX / window.innerWidth - 0.5) * 18}px`);
      root.setProperty("--hero-y", `${(targetY / window.innerHeight - 0.5) * 12}px`);
    };

    const animate = () => {
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;
      ringRef.current?.style.setProperty("transform", `translate3d(${ringX}px, ${ringY}px, 0)`);
      frame = requestAnimationFrame(animate);
    };

    const setActive = (event) => {
      const target = event.target;
      const active = Boolean(target.closest?.("a, .project-card, .skill-panel, .checkpoint"));
      ringRef.current?.classList.toggle("is-active", active);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", setActive);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", setActive);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cursor-system" aria-hidden="true">
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <i />
        <i />
      </div>
    </div>
  );
}
