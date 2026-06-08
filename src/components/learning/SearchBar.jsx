export function SearchBar({
  value,
  searchQuery,
  onChange,
  onClear,
  onSubmit,
  resultCount
}) {
  const hasDraft = Boolean(value.trim());
  const hasCommittedSearch = Boolean(searchQuery.trim());
  const isDirty = value.trim() !== searchQuery.trim();

  return (
    <form
      className="search-panel"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="search-field" htmlFor="korean-search">
        <span className="search-field__label">한국어 단어 검색</span>
        <div className="search-field__input-wrap">
          <input
            id="korean-search"
            type="text"
            className="search-field__input"
            placeholder="예: 독립운동, 광복, 민주주의"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoComplete="off"
          />

          <div className="search-field__actions">
            <button
              type="button"
              className="search-field__clear"
              onClick={onClear}
              disabled={!hasDraft && !hasCommittedSearch}
              aria-label="검색어 지우기"
            >
              지우기
            </button>

            <button
              type="submit"
              className="search-field__submit"
              disabled={!hasDraft && !hasCommittedSearch}
            >
              검색
            </button>
          </div>
        </div>
      </label>

      <p className="search-panel__meta">
        {isDirty && hasDraft
          ? "입력을 마쳤다면 검색 버튼을 눌러 결과를 확인하세요."
          : hasCommittedSearch
            ? `${resultCount}개의 사건이 검색되었습니다.`
            : "한국어 어휘로 사건을 빠르게 찾아보세요."}
      </p>
    </form>
  );
}
