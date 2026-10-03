import { experienceTrack } from "../data/content";

export default function Timeline({ compact = false }) {
  return (
    <div className={`timeline ${compact ? "timeline--compact" : ""}`}>
      <div className="timeline__bar">
        {experienceTrack.map((entry, index) => (
          <div
            className={`timeline__point ${index === experienceTrack.length - 1 ? "is-active" : ""}`}
            key={`${entry.year}-${entry.title}`}
          >
            <span className="timeline__dot" />
            <span>{entry.year}</span>
            {index === experienceTrack.length - 1 && !compact && <small>CURRENT TIMELINE</small>}
          </div>
        ))}
      </div>
      {!compact && (
        <div className="timeline__status">
          <i /> TIMELINE STABLE <span>T−00:00:00</span>
        </div>
      )}
    </div>
  );
}
