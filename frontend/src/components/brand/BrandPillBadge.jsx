import { Fragment } from "react";

const BADGE_ITEMS = {
  products: [
    { label: "Braces", itemClass: "brand-pill-badge__item--braces" },
    { label: "Bandage", itemClass: "brand-pill-badge__item--bandage" },
    { label: "Splints", itemClass: "brand-pill-badge__item--splints" },
  ],
  values: [
    { label: "Comfort", itemClass: "brand-pill-badge__item--comfort" },
    { label: "Care", itemClass: "brand-pill-badge__item--care" },
    { label: "Cure", itemClass: "brand-pill-badge__item--cure" },
  ],
};

export function BrandPillBadge({ variant = "products", tone = "default", className = "" }) {
  const items = BADGE_ITEMS[variant] || BADGE_ITEMS.products;

  return (
    <span
      className={`brand-pill-badge brand-pill-badge--${tone} ${className}`.trim()}
      role="text"
    >
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? (
            <span className="brand-pill-badge__sep" aria-hidden>
              |
            </span>
          ) : null}
          <span className={`brand-pill-badge__item ${item.itemClass}`}>{item.label}</span>
        </Fragment>
      ))}
    </span>
  );
}

/** Compact inline pair — products + values, minimal vertical space */
export function BrandPillBadgeRow({
  tone = "default",
  className = "",
  showProducts = true,
  showValues = true,
}) {
  if (!showProducts && !showValues) return null;

  return (
    <div className={`brand-pill-badge-row ${className}`.trim()}>
      {showProducts ? <BrandPillBadge variant="products" tone={tone} /> : null}
      {showValues ? <BrandPillBadge variant="values" tone={tone} /> : null}
    </div>
  );
}
