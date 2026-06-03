import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function RecommendationGrid({
  title = "Recommended Products",
  subtitle = "",
  products = [],
  loading = false,
  emptyText = "No recommendations available right now.",
  className = "",
}) {
  return (
    <section className={className}>
      <div className="mb-8">
        <h2 className="text-4xl sm:text-[58px] font-black mt-2 text-fg">
          {title}
        </h2>
        {!!subtitle && (
          <p className="text-fg-muted mt-3 max-w-xl">{subtitle}</p>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {[1, 2, 3, 4].map((x) => (
            <div
              key={x}
              className="h-[430px] bg-card rounded-[28px] animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card rounded-3xl p-10 text-center shadow">
          <p className="text-fg-muted">{emptyText}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7"
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
