// Solid 3D primitives built from shaded CSS faces. React renders them once;
// useSceneTransitions moves the layers:
//   .solid         enter / exit scale (flies in from depth, past the camera on exit)
//   .solid__drift  scroll parallax (data-depth)
//   .solid__bob    idle float (CSS)
//   .solid__spin   scroll-driven rotation
// tone: "grey" | "neon" | "ink"

function Solid({ kind, tone = "grey", depth = 0.2, hideSm = false, style, vars, children }) {
  return (
    <div
      className={`solid solid--${kind} solid--${tone}${hideSm ? " solid--hide-sm" : ""}`}
      data-depth={depth}
      style={{ ...vars, ...style }}
      aria-hidden="true"
    >
      <div className="solid__drift">
        <div className="solid__bob">
          <div className="solid__stage">{children}</div>
        </div>
      </div>
    </div>
  );
}

const BOX_FACES = ["front", "back", "right", "left", "top", "bottom"];

export function SolidBox({ size = 120, w = size, h = size, d = size, ...rest }) {
  return (
    <Solid kind="box" vars={{ "--w": `${w}px`, "--h": `${h}px`, "--d": `${d}px`, "--box": `${Math.max(w, h, d)}px` }} {...rest}>
      <div className="solid__spin">
        {BOX_FACES.map((f) => (
          <i key={f} className={`solid__face solid__face--${f}`} />
        ))}
      </div>
    </Solid>
  );
}

// Square pyramid: slant = 0.95 × base, so each side tilts asin(0.5 / 0.95) ≈ 31.8°.
const PYRAMID_SIDES = ["front", "right", "back", "left"];

export function SolidPyramid({ size = 120, ...rest }) {
  const slant = size * 0.95;
  const height = Math.sqrt(slant * slant - (size / 2) ** 2);
  return (
    <Solid
      kind="pyramid"
      vars={{ "--s": `${size}px`, "--l": `${slant}px`, "--ph": `${height}px`, "--box": `${size}px` }}
      {...rest}
    >
      <div className="solid__spin">
        <i className="solid__face solid__face--base" />
        {PYRAMID_SIDES.map((f, k) => (
          <i key={f} className={`solid__face solid__face--${f}`} style={{ "--k": k }} />
        ))}
      </div>
    </Solid>
  );
}

// A shaded ball never needs to turn, so only its orbit ring spins.
export function SolidSphere({ size = 140, ring = true, ...rest }) {
  return (
    <Solid kind="sphere" vars={{ "--s": `${size}px`, "--box": `${size}px` }} {...rest}>
      <i className="solid__ball" />
      <div className="solid__spin">{ring && <i className="solid__ring" />}</div>
    </Solid>
  );
}
