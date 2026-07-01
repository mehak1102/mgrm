/** Split text into grapheme clusters so Devanagari conjuncts render correctly in animated spans. */
export function splitTextUnits(text) {
  if (!text) return [];

  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((s) => s.segment);
  }

  if (/[\u0900-\u097F\u0980-\u09FF]/.test(text)) {
    return text.split(/(\s+)/).filter((part) => part.length > 0);
  }

  return Array.from(text);
}
