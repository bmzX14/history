import { useEffect, useState } from "react";

const COMPACT_ENTER_SCROLL = 140;
const COMPACT_EXIT_SCROLL = 80;

export function Header({ modes, activeMode, onChangeMode }) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const nextScrollY = window.scrollY;

      setIsCompact((current) => {
        if (current) {
          return nextScrollY > COMPACT_EXIT_SCROLL;
        }

        return nextScrollY > COMPACT_ENTER_SCROLL;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={isCompact ? "topbar is-compact" : "topbar"}>
      <div className="brand-block">
        <div className="brand-icon" aria-hidden="true">
          <span className="brand-icon__core" />
        </div>
        <div className="brand-text">
          <p className="brand-eyebrow">한국 현대사 학습 플랫폼</p>
          <h1>한국 현대사</h1>
        </div>
      </div>

      <nav className="mode-switch" aria-label="메인 메뉴">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={mode.id === activeMode ? "mode-switch__button is-active" : "mode-switch__button"}
            onClick={() => onChangeMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
