import { timelineYears } from "../data/content";

export default function Timeline({ compact = false }) {
  return (
    <div className={`timeline ${compact ? "timeline--compact" : ""}`}>
      <div className="timeline__bar">
        {timelineYears.map((year) => (
          <div className={`timeline__point ${year === "2026" ? "is-active" : ""}`} key={year}>
            <span className="timeline__dot" />
            <span>{year}</span>
            {year === "2026" && !compact && <small>CURRENT TIMELINE</small>}
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
