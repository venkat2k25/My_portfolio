import { useEffect, useRef } from "react";

/**
 * The hero's backdrop, for every scene: a faint grid that brightens around the
 * cursor, plus a soft glow. Only transforms change per frame (the lit window
 * moves, the grid inside counter-moves), and the loop sleeps while the scene
 * is off screen.
 */
const LIT = 460; // lit window size, px
const GLOW = 760;

export default function GridField() {
  const ref = useRef(null);

  useEffect(() => {
    const field = ref.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!field || !fine) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lit = field.querySelector(".gf__lit");
    const litGrid = field.querySelector(".gf__lit-grid");
    const glow = field.querySelector(".gf__glow");

    let mx = -9999, my = -9999, sx = mx, sy = my;
    let visible = false, raf = 0, active = false;

    const size = () => {
      litGrid.style.width = `${field.offsetWidth}px`;
      litGrid.style.height = `${field.offsetHeight}px`;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(field);

    const loop = () => {
      const k = reduced ? 1 : 0.08;
      sx += (mx - sx) * k;
      sy += (my - sy) * k;
      const box = field.getBoundingClientRect();
      const lx = sx - box.left - LIT / 2, ly = sy - box.top - LIT / 2;
      lit.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      litGrid.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
      glow.style.transform = `translate3d(${sx - box.left - GLOW / 2}px, ${sy - box.top - GLOW / 2}px, 0)`;
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      if (visible && active && !raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      if (!active) {
        // first move: jump straight to the pointer instead of sliding in from a corner
        sx = e.clientX;
        sy = e.clientY;
        active = true;
        field.classList.add("is-lit");
      }
      mx = e.clientX;
      my = e.clientY;
      wake();
    };
    const onLeave = () => {
      active = false;
      field.classList.remove("is-lit");
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(field);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="gf" ref={ref} aria-hidden="true">
      <div className="gf__grid" />
      <div className="gf__lit">
        <div className="gf__lit-grid" />
      </div>
      <div className="gf__glow" />
    </div>
  );
}
