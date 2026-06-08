export function normalizeForSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

export function getSearchTokens(query) {
  return String(query ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function matchesKoreanSearch(entry, group, query) {
  if (!query) {
    return true;
  }

  const searchableText = [
    entry.title,
    entry.summary,
    entry.description,
    group.era,
    group.year,
    ...entry.detailPoints,
    ...entry.tags
  ].join(" ");

  return normalizeForSearch(searchableText).includes(normalizeForSearch(query));
}
