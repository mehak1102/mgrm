import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, X } from "lucide-react";
import { motion } from "framer-motion";

const RecommendedByPhysiotherapist = lazy(() => import("../../pages/RecommendedByPhysiotherapist"));
const ShopByBody = lazy(() => import("../../pages/ShopByBody"));
const Shop = lazy(() => import("../../pages/Shop"));
const ProductDetail = lazy(() => import("../../pages/ProductDetail"));

const ease = [0.22, 1, 0.36, 1];

function ExploreFallback({ dt }) {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`h-24 rounded-2xl animate-pulse ${dt.chip}`} />
      ))}
    </div>
  );
}

function ExploreContent({ target, onExplore }) {
  switch (target.type) {
    case "therapy":
      return <RecommendedByPhysiotherapist embedded />;
    case "categories":
      return (
        <ShopByBody
          embedded
          onCategorySelect={(cat) =>
            onExplore({
              type: "shop",
              category: cat.query || cat.name,
              title: cat.name,
            })
          }
        />
      );
    case "shop":
      return (
        <Shop
          embedded
          initialCategory={target.category}
          onProductSelect={(slug, name) =>
            onExplore({ type: "product", slug, title: name || slug })
          }
        />
      );
    case "product":
      return <ProductDetail embedded slug={target.slug} />;
    default:
      return null;
  }
}

export default function DashboardExplorePanel({ target, dt, onBack, onExplore }) {
  const { t } = useTranslation();
  const title = target.title || t("dashboard.account");

  return (
    <motion.div
      className={`absolute inset-0 z-30 flex flex-col ${dt.panelBg} ${dt.panelText} backdrop-blur-3xl`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease }}
    >
      <div
        className={`flex shrink-0 items-center justify-between gap-3 px-5 sm:px-8 py-3.5 border-b ${dt.headerBorder}`}
      >
        <button
          type="button"
          onClick={onBack}
          className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${dt.closeBtn}`}
          aria-label={t("dashboard.backToGrid")}
        >
          <ArrowLeft size={18} />
        </button>
        <p className={`text-sm sm:text-lg font-semibold tracking-tight truncate ${dt.stat}`}>{title}</p>
        <button
          type="button"
          onClick={onBack}
          className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${dt.closeBtn}`}
          aria-label={t("dashboard.closeSection")}
        >
          <X size={18} />
        </button>
      </div>

      <div className="dashboard-explore-embed flex-1 min-h-0 overflow-y-auto custom-scroll overscroll-contain">
        <Suspense fallback={<ExploreFallback dt={dt} />}>
          <ExploreContent target={target} onExplore={onExplore} />
        </Suspense>
      </div>
    </motion.div>
  );
}
