import { getSearchTokens } from "./searchUtils";

export function HighlightedText({ text, query }) {
  const content = String(text ?? "");
  const tokens = getSearchTokens(query);

  if (!tokens.length) {
    return content;
  }

  const normalizedTokens = tokens.map((token) => token.toLowerCase());
  const pattern = tokens
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  if (!pattern) {
    return content;
  }

  const parts = content.split(new RegExp(`(${pattern})`, "gi"));

  return parts.map((part, index) => {
    const isMatch = normalizedTokens.includes(part.toLowerCase());

    return isMatch ? (
      <mark key={`${part}-${index}`} className="search-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}
