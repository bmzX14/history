import { EraFilterBar } from "./learning/EraFilterBar";
import { EventDetailPanel } from "./learning/EventDetailPanel";
import { SearchBar } from "./learning/SearchBar";
import { TimelineRail } from "./learning/TimelineRail";
import { matchesKoreanSearch } from "./learning/searchUtils";

export function LearningPage({
  eras,
  activeEra,
  activeEntry,
  activeEntryId,
  searchInput,
  searchQuery,
  yearGroups,
  onChangeEra,
  onChangeSearchInput,
  onClearSearch,
  onSubmitSearch,
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

  const visibleGroups = yearGroups
    .filter((group) => activeEra === "all" || group.era === activeEra)
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) =>
        matchesKoreanSearch(entry, group, searchQuery)
      )
    }))
    .filter((group) => group.entries.length > 0);

  const allVisibleEntries = visibleGroups.flatMap((g) => g.entries);
  const activeInView =
    allVisibleEntries.find((e) => e.id === activeEntryId) ??
    allVisibleEntries[0] ??
    null;

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

      <SearchBar
        value={searchInput}
        searchQuery={searchQuery}
        onChange={onChangeSearchInput}
        onClear={onClearSearch}
        onSubmit={onSubmitSearch}
        resultCount={allVisibleEntries.length}
      />

      {allVisibleEntries.length ? (
        <div className="learning-layout">
          <TimelineRail
            yearGroups={visibleGroups}
            activeEntry={activeInView}
            activeEntryId={activeInView?.id}
            highlightQuery={searchQuery}
            onSelectEntry={onSelectEntry}
            onStartQuiz={onStartQuiz}
          />

          <EventDetailPanel
            event={activeInView}
            highlightQuery={searchQuery}
            onStartQuiz={onStartQuiz}
          />
        </div>
      ) : (
        <div className="empty-state search-empty-state">
          <p className="eyebrow">검색 결과 없음</p>
          <h2>입력한 한국어 단어와 일치하는 사건을 찾지 못했습니다.</h2>
          <p>
            다른 어휘를 입력하거나 시대 필터를 `전체 시대`로 바꿔 다시 찾아보세요.
          </p>
        </div>
      )}
    </section>
  );
}
