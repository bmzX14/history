import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { LearningPage } from "./components/LearningPage";
import { QuizPage } from "./components/QuizPage";
import { timelineEvents } from "./data/timelineEvents";

type ModeId = "learn" | "quiz";

const modes: Array<{ id: ModeId; label: string }> = [
  { id: "learn", label: "학습" },
  { id: "quiz", label: "퀴즈" }
];

// Flatten all entries and inject year + era from their parent group
const allEntries = timelineEvents.flatMap((group) =>
  group.entries.map((entry) => ({ ...entry, year: group.year, era: group.era }))
);

export default function App() {
  const [mode, setMode] = useState<ModeId>("learn");
  const [activeEra, setActiveEra] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEntryId, setActiveEntryId] = useState<string | null>(
    allEntries[0]?.id ?? null
  );
  const [quizSeedEntryId, setQuizSeedEntryId] = useState<string | null>(null);

  const activeEntry = allEntries.find((e) => e.id === activeEntryId) ?? allEntries[0];

  const eras = useMemo(() => {
    const mapped = timelineEvents.map((group) => group.era);
    return ["all", ...new Set(mapped)];
  }, []);

  const startQuizFromEntry = (entryId: string) => {
    setQuizSeedEntryId(entryId);
    setMode("quiz");
  };

  return (
    <div className="app-shell">
      <Header modes={modes} activeMode={mode} onChangeMode={setMode} />

      <main className="app-main">
        {mode === "learn" ? (
          <LearningPage
            eras={eras}
            activeEra={activeEra}
            activeEntry={activeEntry}
            activeEntryId={activeEntryId}
            searchInput={searchInput}
            searchQuery={searchQuery}
            yearGroups={timelineEvents}
            onChangeEra={setActiveEra}
            onChangeSearchInput={setSearchInput}
            onClearSearch={() => {
              setSearchInput("");
              setSearchQuery("");
            }}
            onSubmitSearch={() => setSearchQuery(searchInput.trim())}
            onSelectEntry={setActiveEntryId}
            onStartQuiz={startQuizFromEntry}
          />
        ) : (
          <QuizPage
            entries={allEntries}
            seedEntryId={quizSeedEntryId}
            onBackToEntry={(entryId) => {
              setActiveEntryId(entryId);
              setActiveEra("all");
              setSearchInput("");
              setSearchQuery("");
              setMode("learn");
            }}
            onReturnToLearning={() => setMode("learn")}
          />
        )}
      </main>
    </div>
  );
}
