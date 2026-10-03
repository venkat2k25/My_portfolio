// Pure-CSS 3D wireframes. GSAP rotates `.geo__spin`; React never re-renders them.
const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"];

export function WireCube({ className = "" }) {
  return (
    <div className={`geo geo--cube ${className}`} aria-hidden="true">
      <div className="geo__spin">
        {CUBE_FACES.map((f) => (
          <i key={f} className={`geo__face geo__face--${f}`} />
        ))}
        <i className="geo__core" />
      </div>
    </div>
  );
}

const MERIDIANS = [0, 30, 60, 90, 120, 150];
const LATITUDES = [-0.6, -0.3, 0, 0.3, 0.6]; // fraction of radius

export function WireSphere({ className = "", size = 260 }) {
  const r = size / 2;
  return (
    <div className={`geo geo--sphere ${className}`} style={{ "--s": `${size}px` }} aria-hidden="true">
      <div className="geo__spin">
        {MERIDIANS.map((deg) => (
          <i key={deg} className="geo__ring" style={{ transform: `rotateY(${deg}deg)` }} />
        ))}
        {LATITUDES.map((f) => (
          <i
            key={f}
            className="geo__ring"
            style={{ transform: `rotateX(90deg) translateZ(${f * r}px) scale(${Math.sqrt(1 - f * f)})` }}
          />
        ))}
      </div>
    </div>
  );
}