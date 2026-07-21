import { Search } from "lucide-react";

function highlightMatch(text, query) {
  const q = String(query || "").trim();
  if (!q) return text;

  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx < 0) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    <>
      {before}
      <span className="text-slate-900 dark:text-white font-semibold">{match}</span>
      <span className="font-semibold text-slate-800 dark:text-zinc-100">{after}</span>
    </>
  );
}

/**
 * Amazon-style search suggestion dropdown.
 */
export default function SearchSuggestionsDropdown({
  open,
  suggestions,
  query,
  activeIndex,
  onSelect,
  onHover,
  listId = "navbar-search-suggestions",
}) {
  if (!open || !suggestions?.length) return null;

  return (
    <ul
      id={listId}
      role="listbox"
      className="absolute left-0 right-0 top-full mt-1.5 z-[1000] max-h-[min(70vh,22rem)] overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] py-1.5"
    >
      {suggestions.map((item, index) => {
        const active = index === activeIndex;
        return (
          <li key={`${item.type}-${item.text}`} role="option" aria-selected={active} id={`${listId}-opt-${index}`}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(item)}
              onMouseEnter={() => onHover?.(index)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                active
                  ? "bg-slate-100 dark:bg-zinc-800"
                  : "hover:bg-slate-50 dark:hover:bg-zinc-800/80"
              }`}
            >
              <Search
                size={15}
                className="shrink-0 text-slate-400 dark:text-zinc-500"
                aria-hidden
              />
              <span className="min-w-0 truncate text-slate-600 dark:text-zinc-300">
                {highlightMatch(item.text, query)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
