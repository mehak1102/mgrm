import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function RecommendationGrid({
  title,
  subtitle = "",
  products = [],
  loading = false,
  emptyText,
  className = "",
}) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("global.recommendedProducts");
  const resolvedEmptyText = emptyText ?? t("global.noRecommendations");

  return (
    <section className={className}>
      <div className="mb-8">
        <h2 className="text-4xl sm:text-[58px] font-black mt-2 text-fg">
          {resolvedTitle}
        </h2>
        {!!subtitle && (
          <p className="text-gray-500 dark:text-zinc-400 mt-3 max-w-xl">{subtitle}</p>
        )}
      </div>

      {loading ? (
        <div className="catalog-grid">
          {[1, 2, 3, 4].map((x) => (
            <div
              key={x}
              className="h-[430px] bg-card dark:bg-zinc-900 rounded-[28px] animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card dark:bg-zinc-900 rounded-3xl p-10 text-center shadow">
          <p className="text-gray-500 dark:text-zinc-400">{resolvedEmptyText}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="catalog-grid"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
