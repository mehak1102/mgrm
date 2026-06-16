/** Blue-theme product price styling — inline so it wins over card/global text rules. */

export const BLUE_SALE_PRICE_COLOR = "#FFD700";
export const BLUE_ORIGINAL_PRICE_COLOR = "rgba(255, 255, 255, 0.45)";

export function productPriceSaleProps(isBlue, extraClassName = "") {
  return {
    className: extraClassName.trim() || undefined,
    style: isBlue
      ? {
          color: BLUE_SALE_PRICE_COLOR,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          textShadow: "0 0 10px rgba(255, 215, 0, 0.1)",
        }
      : undefined,
  };
}

export function productPriceOriginalProps(isBlue, extraClassName = "") {
  return {
    className: extraClassName.trim() || undefined,
    style: isBlue ? { color: BLUE_ORIGINAL_PRICE_COLOR } : undefined,
  };
}
