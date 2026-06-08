export function EraFilterBar({ eras, activeEra, onChangeEra }) {
  return (
    <div className="era-filter" aria-label="Historical eras">
      {eras.map((era) => (
        <button
          key={era}
          type="button"
          className={era === activeEra ? "chip is-active" : "chip"}
          onClick={() => onChangeEra(era)}
        >
          {era === "all" ? "전체 시대" : era}
        </button>
      ))}
    </div>
  );
}
