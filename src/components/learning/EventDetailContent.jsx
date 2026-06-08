import { HighlightedText } from "./HighlightedText";

export function EventDetailContent({
  event,
  onStartQuiz,
  className = "",
  highlightQuery = ""
}) {
  if (!event) {
    return null;
  }

  const classes = ["event-detail-content", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <p className="event-panel__summary">
        <HighlightedText text={event.description} query={highlightQuery} />
      </p>

      <ul className="detail-list">
        {event.detailPoints.map((point) => (
          <li key={point}>
            <HighlightedText text={point} query={highlightQuery} />
          </li>
        ))}
      </ul>

      <div className="panel-meta">
        <div>
          <span className="panel-meta__label">시대</span>
          <strong>{event.era}</strong>
        </div>
        <div>
          <span className="panel-meta__label">분류</span>
          <strong>{event.category}</strong>
        </div>
        <div>
          <span className="panel-meta__label">중요도</span>
          <strong>{event.importance}/5</strong>
        </div>
      </div>

      <div className="timeline-tags">
        {event.tags.map((tag) => (
          <span key={tag} className="timeline-tag">
            <HighlightedText text={tag} query={highlightQuery} />
          </span>
        ))}
      </div>

      <div className="panel-actions">
        <button
          type="button"
          className="button button--primary"
          onClick={() => onStartQuiz(event.id)}
        >
          이 사건 연습하기
        </button>
      </div>
    </div>
  );
}
