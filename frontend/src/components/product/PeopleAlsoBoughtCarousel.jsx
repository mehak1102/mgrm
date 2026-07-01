import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { productPriceSaleProps } from "../../utils/productPriceStyle";

function AlsoBoughtCard({ product, t }) {
  const { addToCart } = useCart();
  const { isBlue } = useTheme();
  const image = product.images?.[0] || "/products/knee.png";
  const price = Number(product.discountPrice || product.price || 0);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="shrink-0 w-[240px] sm:w-[260px] rounded-[24px] border border-edge bg-card overflow-hidden shadow-lg snap-start"
    >
      <Link to={`/product/${product.slug}`} className="block relative h-48 bg-app overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain p-4 hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-card/95 shadow text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          <Star size={12} className="text-amber-400" fill="currentColor" />
          {product.rating || 4.6}
        </span>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-black text-sm line-clamp-2 text-fg hover:text-brand transition">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span {...productPriceSaleProps(isBlue, "text-lg font-black")}>₹{price}</span>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="w-10 h-10 rounded-xl bg-purple-600 text-white grid place-items-center hover:scale-110 transition shadow-md"
            aria-label={t("global.quickAdd")}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function PeopleAlsoBoughtCarousel({ productId, limit = 10 }) {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let ignore = false;
    setLoading(true);
    API.get(`/recommendations/product/${productId}/also-bought?limit=${limit}`)
      .then((res) => {
        if (!ignore) setProducts(res.data.products || []);
      })
      .catch(() => {
        if (!ignore) setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [productId, limit]);

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="py-4">
        <div className="h-10 w-72 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse mb-6" />
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0 w-[260px] h-[340px] rounded-[24px] bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="relative">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">{t("global.frequentlyPaired")}</p>
          <h2 className="text-3xl md:text-4xl font-black text-fg mt-1">{t("global.peopleAlsoBought")}</h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="w-11 h-11 rounded-full border border-edge bg-card grid place-items-center hover:bg-brand/10 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="w-11 h-11 rounded-full border border-edge bg-card grid place-items-center hover:bg-brand/10 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 custom-scroll -mx-1 px-1"
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <AlsoBoughtCard product={product} t={t} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
