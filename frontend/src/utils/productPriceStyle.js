/** Blue-theme product prices — inline color wins only if conflicting !important classes are removed. */

export const BLUE_SALE_PRICE_COLOR = "#FF8800";
export const BLUE_ORIGINAL_PRICE_COLOR = "#4f6980";

/** Classes that blue-theme card CSS forces with !important */
const COLOR_CLASS_RE =
  /\b(?:text-(?:slate|gray|zinc|purple|fg|brand|cyan|emerald|red|yellow|white|black)[^\s]*|font-black|font-bold)\b/g;

function layoutOnly(className = "") {
  return className.replace(COLOR_CLASS_RE, "").replace(/\s+/g, " ").trim();
}

export function productPriceSaleProps(isBlue, extraClassName = "") {
  return {
    className: isBlue
      ? layoutOnly(extraClassName) || undefined
      : extraClassName.trim() || undefined,
    style: isBlue
      ? {
          color: BLUE_SALE_PRICE_COLOR,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }
      : undefined,
  };
}

export function productPriceOriginalProps(isBlue, extraClassName = "") {
  return {
    className: isBlue
      ? layoutOnly(extraClassName) || undefined
      : extraClassName.trim() || undefined,
    style: isBlue ? { color: BLUE_ORIGINAL_PRICE_COLOR } : undefined,
  };
}
