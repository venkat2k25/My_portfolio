/**
 * Shared section header, in the hero's voice:
 *   (01) ── ABOUT                      mono index + label, decoded on enter
 *   A bit about *me.*                  serif headline, words rise out of a mask
 *   optional note on the right
 */
export default function SectionHead({ index, label, title, accent, note, className = "" }) {
  return (
    <header className={`sh ${note ? "sh--row" : ""} ${className}`}>
      <div>
        <p className="sh__meta">
          <span className="sh__idx">({index})</span>
          <span className="sh__rule" aria-hidden="true" />
          <span data-scramble>{label}</span>
        </p>
        <h2 className="sh__title" data-split>
          {title} {accent && <em>{accent}</em>}
        </h2>
      </div>
      {note && (
        <p className="sh__note" data-reveal>
          {note}
        </p>
      )}
    </header>
  );
}
