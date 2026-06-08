import { useEffect, useRef, useState } from "react";
import { EventDetailContent } from "./EventDetailContent";
import { HighlightedText } from "./HighlightedText";

const MONTH_ABBR = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export function TimelineRail({
  yearGroups,
  activeEntry,
  activeEntryId,
  highlightQuery,
  onSelectEntry,
  onStartQuiz
}) {
  const activeRef = useRef(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    const syncViewport = (event) => {
      setIsMobileLayout(event.matches);
    };

    syncViewport(mediaQuery);
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!isMobileLayout) {
      setExpandedEntryId(null);
    }
  }, [isMobileLayout]);

  useEffect(() => {
    const visibleEntryIds = new Set(
      yearGroups.flatMap((group) => group.entries.map((entry) => entry.id))
    );

    if (expandedEntryId && !visibleEntryIds.has(expandedEntryId)) {
      setExpandedEntryId(null);
    }
  }, [expandedEntryId, yearGroups]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeEntryId]);

  const handleCardClick = (entryId) => {
    if (isMobileLayout) {
      setExpandedEntryId((current) => (current === entryId ? null : entryId));
    }

    onSelectEntry(entryId);
  };

  return (
    <div className="timeline-rail">
      {yearGroups.map((group) => (
        <div key={group.id} className="timeline-year-group">
          <div className="timeline-year-header">
            <span className="timeline-year-number">{group.year}</span>
          </div>

          {group.entries.map((entry, index) => {
            const isActive = entry.id === activeEntryId;
            const isExpanded = isMobileLayout ? expandedEntryId === entry.id : isActive;
            return (
              <button
                key={entry.id}
                ref={isActive ? activeRef : null}
                type="button"
                className={isExpanded ? "timeline-card is-active" : "timeline-card"}
                onClick={() => handleCardClick(entry.id)}
                style={{ "--accent": entry.accent }}
                aria-expanded={isExpanded}
              >
                <span className="timeline-card__line" aria-hidden="true">
                  {index !== group.entries.length - 1 && (
                    <span className="timeline-card__line-tail" />
                  )}
                </span>

                <div className="timeline-card__body">
                  <div className="timeline-card__year">
                    {MONTH_ABBR[entry.month - 1]}
                  </div>
                  <div className="timeline-card__copy">
                    <h3><HighlightedText text={entry.title} query={highlightQuery} /></h3>
                    <p><HighlightedText text={entry.summary} query={highlightQuery} /></p>
                    <div className="timeline-tags">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="timeline-tag">
                          <HighlightedText text={tag} query={highlightQuery} />
                        </span>
                      ))}
                    </div>
                    <span className="timeline-card__toggle">
                      {isExpanded ? "접기" : "자세히 보기"}
                    </span>
                  </div>
                </div>

                {isExpanded && activeEntry?.id === entry.id && (
                  <div className="timeline-card__mobile-detail">
                    <EventDetailContent
                      event={activeEntry}
                      highlightQuery={highlightQuery}
                      onStartQuiz={onStartQuiz}
                      className="timeline-card__mobile-detail-content"
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
