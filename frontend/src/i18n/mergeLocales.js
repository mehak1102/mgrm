export function deepMergeLocale(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMergeLocale(out[key] || {}, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
