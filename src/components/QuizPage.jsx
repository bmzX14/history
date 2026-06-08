import { useEffect, useMemo, useState } from "react";

const INITIAL_FEEDBACK = {
  status: "idle",
  message: "",
  explanation: ""
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestionSet(entries, seedEntryId) {
  const quizEntries = entries.filter((entry) => entry.quiz);

  if (!seedEntryId) {
    return shuffle(quizEntries);
  }

  const focused = quizEntries.find((entry) => entry.id === seedEntryId);
  const remaining = quizEntries.filter((entry) => entry.id !== seedEntryId);

  return focused ? [focused, ...shuffle(remaining)] : shuffle(quizEntries);
}

export function QuizPage({ entries, seedEntryId, onBackToEntry, onReturnToLearning }) {
  const [shuffleKey, setShuffleKey] = useState(0);

  const questions = useMemo(
    () => buildQuestionSet(entries, seedEntryId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entries, seedEntryId, shuffleKey]
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setShuffleKey((k) => k + 1);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setAnswer("");
    setFeedback(INITIAL_FEEDBACK);
    setHistory([]);
  }, [seedEntryId]);

  const question = questions[index];
  const isFinished = index >= questions.length;
  const progress = questions.length ? ((Math.min(index + 1, questions.length)) / questions.length) * 100 : 0;

  if (!questions.length) {
    return (
      <section className="page page--quiz">
        <div className="empty-state">
          <p className="eyebrow">퀴즈 데이터 없음</p>
          <h2>퀴즈 모드를 사용하려면 사건에 `quiz` 항목을 추가하세요.</h2>
          <p>
            퀴즈 문제는 타임라인과 동일한 데이터에서 생성됩니다. `quiz` 필드가 없는 사건은 퀴즈에 표시되지 않습니다.
          </p>
          <div className="summary-actions">
            <button type="button" className="button button--primary" onClick={onReturnToLearning}>
              학습으로 돌아가기
            </button>
          </div>
        </div>
      </section>
    );
  }

  const evaluateAnswer = () => {
    if (!question || feedback.status !== "idle") {
      return;
    }

    const normalized = answer.trim();
    const isCorrect = question.quiz.acceptedAnswers.includes(normalized);

    setFeedback({
      status: isCorrect ? "correct" : "wrong",
      message: isCorrect ? "정답입니다!" : `오답입니다. 정답은 ${question.year}년입니다.`,
      explanation: question.quiz.explanation
    });

    setHistory((current) => [
      ...current,
      {
        id: question.id,
        entryId: question.id,
        title: question.title,
        yourAnswer: normalized || "미입력",
        correctAnswer: String(question.year),
        isCorrect
      }
    ]);

    if (isCorrect) {
      setScore((current) => current + 1);
      setStreak((current) => current + 1);
    } else {
      setStreak(0);
    }
  };

  useEffect(() => {
    if (answer.length !== 4 || feedback.status !== "idle") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      evaluateAnswer();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [answer, feedback.status, question]);

  const submitAnswer = (event) => {
    event.preventDefault();
    evaluateAnswer();
  };

  const goNext = () => {
    setAnswer("");
    setFeedback(INITIAL_FEEDBACK);
    setIndex((current) => current + 1);
  };

  if (isFinished) {
    return (
      <section className="page page--quiz">
        <div className="summary-card">
          <p className="eyebrow">퀴즈 완료</p>
          <h2>{score}/{questions.length} 정답</h2>
          <p>
            틀린 사건을 복습하고, 타임라인으로 돌아가 약점을 보완하세요.
          </p>

          <div className="summary-grid">
            {history.map((entry) => (
              <article
                key={entry.id}
                className={entry.isCorrect ? "summary-item is-correct" : "summary-item is-wrong"}
              >
                <strong>{entry.title}</strong>
                <span>내 답: {entry.yourAnswer}</span>
                {!entry.isCorrect && <span>정답: {entry.correctAnswer}년</span>}
              </article>
            ))}
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={() => {
                setShuffleKey((k) => k + 1);
                setIndex(0);
                setScore(0);
                setStreak(0);
                setAnswer("");
                setFeedback(INITIAL_FEEDBACK);
                setHistory([]);
              }}
            >
              다시 풀기
            </button>
            <button type="button" className="button button--ghost" onClick={onReturnToLearning}>
              학습으로 돌아가기
            </button>
            {history.find((entry) => !entry.isCorrect) && (
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  const firstMissed = history.find((entry) => !entry.isCorrect);
                  if (firstMissed?.entryId) {
                    onBackToEntry(firstMissed.entryId);
                  }
                }}
              >
                첫 번째 오답 복습하기
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page page--quiz">
      <div className="quiz-header">
        <div>
          <p className="eyebrow">퀴즈 모드</p>
          <h2>연도를 입력하고 즉시 확인하세요.</h2>
        </div>

        <div className="quiz-meta">
          <span>{index + 1} / {questions.length} 문제</span>
          <span>점수 {score}/{questions.length}</span>
          <span>연속 {streak}</span>
        </div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <span className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className={feedback.status === "wrong" ? "quiz-card is-wrong" : feedback.status === "correct" ? "quiz-card is-correct" : "quiz-card"}>
        <div className="quiz-card__badge" style={{ "--accent": question.accent }}>
          {question.era}
        </div>

        <h3>{question.quiz.prompt}</h3>
        <p className="quiz-card__summary">{question.summary}</p>

        <form onSubmit={submitAnswer} className="quiz-form">
          <label className="field-label" htmlFor="year-answer">
            연도 입력
          </label>
          <input
            id="year-answer"
            className="year-input"
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            value={answer}
            onChange={(event) => {
              const numericValue = event.target.value.replace(/\D/g, "").slice(0, 4);
              setAnswer(numericValue);
            }}
            autoComplete="off"
          />
          <span className="field-hint">
            4자리 숫자를 입력하세요. 완성되면 자동으로 채점됩니다.
          </span>

          <div className="quiz-actions">
            {feedback.status === "idle" ? (
              <button
                type="submit"
                className="button button--primary button--wide"
                disabled={answer.length !== 4}
              >
                정답 확인
              </button>
            ) : (
              <button
                type="button"
                className="button button--primary button--wide"
                onClick={goNext}
              >
                {index === questions.length - 1 ? "결과 보기" : "다음 문제"}
              </button>
            )}

            <button
              type="button"
              className="button button--ghost"
              onClick={() => onBackToEntry(question.id)}
            >
              사건 다시 보기
            </button>
          </div>
        </form>

        {feedback.status !== "idle" && (
          <div className={feedback.status === "correct" ? "feedback-banner is-correct" : "feedback-banner is-wrong"}>
            <strong>{feedback.message}</strong>
            <p>{feedback.explanation}</p>
          </div>
        )}
      </div>
    </section>
  );
}
