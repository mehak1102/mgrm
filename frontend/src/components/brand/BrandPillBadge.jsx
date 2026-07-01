import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const BADGE_ITEMS = {
  products: [
    { key: "brand.braces", itemClass: "brand-pill-badge__item--braces" },
    { key: "brand.bandage", itemClass: "brand-pill-badge__item--bandage" },
    { key: "brand.splints", itemClass: "brand-pill-badge__item--splints" },
  ],
  values: [
    { key: "brand.comfort", itemClass: "brand-pill-badge__item--comfort" },
    { key: "brand.care", itemClass: "brand-pill-badge__item--care" },
    { key: "brand.cure", itemClass: "brand-pill-badge__item--cure" },
  ],
};

export function BrandPillBadge({ variant = "products", tone = "default", className = "" }) {
  const { t } = useTranslation();
  const items = BADGE_ITEMS[variant] || BADGE_ITEMS.products;

  return (
    <span
      className={`brand-pill-badge brand-pill-badge--${tone} ${className}`.trim()}
      role="text"
    >
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? (
            <span className="brand-pill-badge__sep" aria-hidden>
              |
            </span>
          ) : null}
          <span className={`brand-pill-badge__item ${item.itemClass}`}>{t(item.key)}</span>
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
