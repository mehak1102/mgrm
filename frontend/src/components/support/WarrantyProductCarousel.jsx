import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Eye } from "lucide-react";
import API from "../../api";

export default function WarrantyProductCarousel() {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    API.get("/products?featured=true")
      .then((res) => {
        const list = res.data.products || [];
        if (list.length >= 8) {
          setProducts(list.slice(0, 12));
          return;
        }
        return API.get("/products").then((all) => {
          const merged = [...list, ...(all.data.products || [])];
          const unique = [];
          const seen = new Set();
          for (const p of merged) {
            if (!seen.has(p._id)) {
              seen.add(p._id);
              unique.push(p);
            }
            if (unique.length >= 12) break;
          }
          setProducts(unique);
        });
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (reduced || products.length <= 4) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(1, products.length - 3));
    }, 4500);
    return () => clearInterval(timer);
  }, [products.length, reduced]);

  const visible = 4;
  const maxIndex = Math.max(0, products.length - visible);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  if (!products.length) {
    return (
      <div className="h-64 rounded-[32px] bg-white/50 dark:bg-slate-900/40 animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-fg">
          Recommended Products
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            className="w-11 h-11 rounded-2xl card border border-edge grid place-items-center disabled:opacity-40 hover:shadow-lg transition text-fg"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= maxIndex}
            className="w-11 h-11 rounded-2xl card border border-edge grid place-items-center disabled:opacity-40 hover:shadow-lg transition text-fg"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px]" ref={trackRef}>
        <motion.div
          className="flex gap-5 cursor-grab active:cursor-grabbing"
          drag={reduced ? false : "x"}
          dragConstraints={{ left: -(maxIndex * 280), right: 0 }}
          dragElastic={0.08}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -60) next();
            else if (info.offset.x > 60) prev();
          }}
          animate={{ x: reduced ? 0 : -index * 280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={reduced ? undefined : { scale: 1.03, y: -6 }}
              className="warranty-carousel-card card min-w-[260px] max-w-[260px] rounded-[28px] overflow-hidden border border-edge shadow-lg group hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)] hover:border-cyan-400/40 transition-all duration-300"
            >
              <div className="relative h-44 bg-gradient-to-br from-slate-50 to-cyan-50/50 dark:from-slate-800 dark:to-cyan-950/30 p-4">
                <img
                  src={product.images?.[0] || "/products/knee.png"}
                  alt={product.name}
                  onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                  className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                />
                <Link
                  to={`/product/${product.slug}`}
                  onClick={(e) => dragging && e.preventDefault()}
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/80 grid place-items-center opacity-0 group-hover:opacity-100 transition shadow"
                  aria-label="Quick view"
                >
                  <Eye size={16} />
                </Link>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-brand uppercase tracking-wide">
                  {product.category || "Support"}
                </p>
                <h4 className="font-black text-fg mt-1 line-clamp-2">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1 mt-2 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{product.rating || 4.6}</span>
                </div>
                <Link
                  to={`/product/${product.slug}`}
                  onClick={(e) => dragging && e.preventDefault()}
                  className="mt-3 inline-block text-sm font-bold text-brand hover:underline"
                >
                  View product →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
