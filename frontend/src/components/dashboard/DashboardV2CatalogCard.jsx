import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DashboardV2CatalogCard({
  categories = [],
  activeIndex = 0,
  bodyTotal = 0,
  formatProductCount,
  onClick,
}) {
  const { t } = useTranslation();

  const items = categories.filter((c) => c?.productImage);
  const slideCount = items.length || categories.length;
  const index = slideCount ? activeIndex % slideCount : 0;
  const active = items[index] || categories[index] || null;

  const subtitle = active
    ? `${active.name} · ${formatProductCount(active.count ?? 0, { suffix: "" })} ${t("common.inCategory")}`
    : t("common.certifiedProductsCount", { count: formatProductCount(bodyTotal) });

  const countLabel = active
    ? t("common.productsInRotator", {
        count: formatProductCount(active.count ?? 0, { suffix: "" }),
        defaultValue: `${formatProductCount(active.count ?? 0, { suffix: "" })} products`,
      })
    : formatProductCount(bodyTotal, { suffix: "" });

  const dots = items.length > 1 ? items : categories;

  return (
    <button type="button" onClick={() => onClick?.(active)} className="dashboard-v2__catalog">
      <div className="dashboard-v2__catalog-visual" aria-hidden>
        {active?.productImage ? (
          <img
            key={active.query}
            src={active.productImage}
            alt={active.productName || active.name || ""}
            className="dashboard-v2__catalog-img"
            style={{ objectPosition: active.imageFocus || "center center" }}
            loading="lazy"
            draggable={false}
          />
        ) : null}

        {dots.length > 1 ? (
          <div className="dashboard-v2__catalog-dots">
            {dots.map((item, i) => (
              <span
                key={item.query || item.name}
                className={`dashboard-v2__catalog-dot ${i === index ? "is-active" : ""}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="dashboard-v2__catalog-foot">
        <div className="dashboard-v2__catalog-meta">
          <span className="dashboard-v2__catalog-cat">{active?.name || t("dashboard.grid.catalog")}</span>
          <span className="dashboard-v2__catalog-qty">{countLabel}</span>
        </div>

        <p className="dashboard-v2__catalog-eyebrow">{t("dashboard.grid.catalog")}</p>
        <p className="dashboard-v2__catalog-title">{t("dashboard.grid.allProducts")}</p>
        <p className="dashboard-v2__catalog-detail">{subtitle}</p>

        <span className="dashboard-v2__catalog-btn">
          {t("dashboard.grid.browseAll")}
          <ArrowUpRight size={12} strokeWidth={2.35} />
        </span>
      </div>
    </button>
  );
}
