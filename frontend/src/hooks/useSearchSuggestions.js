import { useEffect, useMemo, useState } from "react";
import { normalizeSearchQuery } from "../utils/searchNormalizer";
import { buildSuggestionsFromIndex } from "../utils/searchSuggestions";
import {
  fetchSuggestIndex,
  getCachedSuggestIndex,
} from "../utils/suggestIndexLoader";

/**
 * Dynamic Amazon-style suggestions from every product in the catalog.
 */
export default function useSearchSuggestions(query, options = {}) {
  const { enabled = true, limit = 8 } = options;
  const trimmed = String(query || "").trim();
  const [index, setIndex] = useState(() => getCachedSuggestIndex());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let ignore = false;
    setLoading(true);

    fetchSuggestIndex()
      .then((products) => {
        if (!ignore) setIndex(products);
      })
      .catch(() => {
        if (!ignore) setIndex((prev) => prev || []);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [enabled]);

  const suggestions = useMemo(() => {
    if (!enabled || trimmed.length < 1) return [];
    const { search: apiQuery } = normalizeSearchQuery(trimmed);
    return buildSuggestionsFromIndex(index, apiQuery || trimmed, { limit });
  }, [enabled, trimmed, index, limit]);

  return { suggestions, loading };
}
