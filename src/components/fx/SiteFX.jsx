import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";

/* ------------------------------------------------------------------ */
/*  Site-wide pointer effects (mouse / trackpad only)                  */
/*                                                                     */
/*  - Cursor: a dot plus a trailing ring. It grows over anything        */
/*    clickable, and shows a word over elements with                    */
/*    data-cursor-label="…".                                            */
/*  - Magnetic: elements with data-magnetic lean toward the pointer     */
/*    (data-magnetic="0.4" sets the strength).                          */
/* ------------------------------------------------------------------ */
const HOVER = "a, button, [role='tab'], [data-cursor], [data-cursor-label]";

export default function SiteFX() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const html = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    html.classList.add("has-cursor");

    const dotX = gsap.quickSetter(dot, "x", "px");
    const dotY = gsap.quickSetter(dot, "y", "px");
    const ringX = gsap.quickTo(ring, "x", { duration: reduced ? 0 : 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: reduced ? 0 : 0.45, ease: "power3.out" });

    // magnetic element currently under the pointer
    let mag = null;
    let magX = null;
    let magY = null;
    const releaseMag = () => {
      if (!mag) return;
      magX(0);
      magY(0);
      mag = null;
    };

    let shownLabel = "";
    const onMove = (e) => {
      html.classList.add("cur-on");
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const t = e.target instanceof Element ? e.target : null;
      const hoverEl = t?.closest(HOVER);
      const text = hoverEl?.closest("[data-cursor-label]")?.dataset.cursorLabel || "";
      html.classList.toggle("cur-hover", !!hoverEl);
      html.classList.toggle("cur-label", !!text);
      if (text !== shownLabel) {
        label.textContent = text;
        shownLabel = text;
      }
      html.classList.toggle("cur-text", !!t?.closest("input, textarea, [contenteditable='true']"));

      if (reduced) return;
      const m = t?.closest("[data-magnetic]");
      if (m !== mag) {
        releaseMag();
        if (m) {
          mag = m;
          magX = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
          magY = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        }
      }
      if (mag) {
        const r = mag.getBoundingClientRect();
        const k = parseFloat(mag.dataset.magnetic) || 0.3;
        magX((e.clientX - (r.left + r.width / 2)) * k);
        magY((e.clientY - (r.top + r.height / 2)) * k);
      }
    };
    const onDown = () => html.classList.add("cur-down");
    const onUp = () => html.classList.remove("cur-down");
    const onLeave = () => {
      html.classList.remove("cur-on");
      releaseMag();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    html.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.removeEventListener("mouseleave", onLeave);
      releaseMag();
      html.classList.remove("has-cursor", "cur-on", "cur-hover", "cur-label", "cur-text", "cur-down");
    };
  }, []);

  return (
    <div className="cur" aria-hidden="true">
      <div className="cur__ring" ref={ringRef}>
        <i />
        <span ref={labelRef} />
      </div>
      <div className="cur__dot" ref={dotRef} />
    </div>
  );
}
