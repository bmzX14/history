import { useEffect, useRef } from "react";

const MONTH_ABBR = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export function TimelineRail({ yearGroups, activeEntryId, onSelectEntry }) {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeEntryId]);

  return (
    <div className="timeline-rail">
      {yearGroups.map((group) => (
        <div key={group.id} className="timeline-year-group">
          <div className="timeline-year-header">
            <span className="timeline-year-number">{group.year}</span>
          </div>

          {group.entries.map((entry, index) => {
            const isActive = entry.id === activeEntryId;
            return (
              <button
                key={entry.id}
                ref={isActive ? activeRef : null}
                type="button"
                className={isActive ? "timeline-card is-active" : "timeline-card"}
                onClick={() => onSelectEntry(entry.id)}
                style={{ "--accent": entry.accent }}
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
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <div className="timeline-tags">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="timeline-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
