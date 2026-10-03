/**
 * One full-screen layer of the scroll story.
 *
 *   .scene         trigger + pin target; z-index stacks later scenes on top
 *   .scene__frame  background; shifted so it appears in place, fades up
 *   .scene__inner  depth move (settle in on enter, recede on exit)
 *
 * tone: "white" | "grey" | "hero"
 */
export default function Scene({ index, tone = "white", shapes, children }) {
  return (
    <div className={`scene scene--${tone}`} style={{ "--z": index + 1 }}>
      <div className="scene__frame">
        <div className="scene__inner">
          {shapes && (
            <div className="scene__shapes" aria-hidden="true">
              {shapes}
            </div>
          )}
          <div className="scene__body">{children}</div>
        </div>
      </div>
    </div>
  );
}
