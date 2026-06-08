import { EventDetailContent } from "./EventDetailContent";
import { HighlightedText } from "./HighlightedText";

function formatFullDate(dateString) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

export function EventDetailPanel({ event, highlightQuery, onStartQuiz }) {
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
        <h3><HighlightedText text={event.title} query={highlightQuery} /></h3>
        <span className="event-panel__date">{formatFullDate(event.date)}</span>
      </div>

      <div className="event-panel__content">
        <EventDetailContent
          event={event}
          highlightQuery={highlightQuery}
          onStartQuiz={onStartQuiz}
        />
      </div>
    </aside>
  );
}
