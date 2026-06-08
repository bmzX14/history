import { EraFilterBar } from "./learning/EraFilterBar";
import { EventDetailPanel } from "./learning/EventDetailPanel";
import { TimelineRail } from "./learning/TimelineRail";

export function LearningPage({
  eras,
  activeEra,
  activeEntry,
  activeEntryId,
  yearGroups,
  onChangeEra,
  onSelectEntry,
  onStartQuiz
}) {
  const totalEntries = yearGroups.reduce((sum, g) => sum + g.entries.length, 0);

  if (!yearGroups.length) {
    return (
      <section className="page">
        <div className="empty-state">
          <p className="eyebrow">내용 없음</p>
          <h2>타임라인을 시작하려면 사건을 추가하세요.</h2>
          <p>
            학습 화면은 `src/data/timelineEvents.js`에서 직접 데이터를 읽습니다.
            데이터가 없으면 빈 화면이 표시됩니다.
          </p>
        </div>
      </section>
    );
  }

  const visibleGroups =
    activeEra === "all"
      ? yearGroups
      : yearGroups.filter((g) => g.era === activeEra);

  const allVisibleEntries = visibleGroups.flatMap((g) => g.entries);
  const activeInView =
    allVisibleEntries.find((e) => e.id === activeEntryId) ??
    allVisibleEntries[0] ??
    activeEntry;

  return (
    <section className="page page--learning">
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">학습 모드</p>
          <h2>외국인학생을 위한<br />한국 현대사 수업 학습</h2>
          <p>
            타임라인의 각 사건을 살펴보고, 기억이 생생할 때 바로 짧은 퀴즈에 도전해 보세요.
          </p>
        </div>

        <div className="hero-stats" aria-label="학습 현황">
          <div className="stat-card">
            <strong>{totalEntries}</strong>
            <span>핵심 사건</span>
          </div>
          <div className="stat-card">
            <strong>{eras.length - 1}</strong>
            <span>시대 구분</span>
          </div>
          <div className="stat-card">
            <strong>2가지</strong>
            <span>학습과 연습</span>
          </div>
        </div>
      </div>

      <EraFilterBar
        eras={eras}
        activeEra={activeEra}
        onChangeEra={onChangeEra}
      />

      <div className="learning-layout">
        <TimelineRail
          yearGroups={visibleGroups}
          activeEntryId={activeInView?.id}
          onSelectEntry={onSelectEntry}
        />

        <EventDetailPanel
          event={activeInView}
          onStartQuiz={onStartQuiz}
        />
      </div>
    </section>
  );
}
