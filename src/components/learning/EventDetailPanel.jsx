function formatFullDate(dateString) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

export function EventDetailPanel({ event, onStartQuiz }) {
  if (!event) {
    return null;
  }

  return (
    <aside className="event-panel">
      <div
        className="event-panel__hero"
        style={{
          "--accent": event.accent
        }}
      >
        <div className="event-panel__hero-overlay" />
        <p className="eyebrow">선택된 사건</p>
        <h3>{event.title}</h3>
        <span className="event-panel__date">{formatFullDate(event.date)}</span>
      </div>

      <div className="event-panel__content">
        <p className="event-panel__summary">{event.description}</p>

        <ul className="detail-list">
          {event.detailPoints.map((point) => (
            <li key={point}>{point}</li>
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
              {tag}
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
    </aside>
  );
}
