import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getActivityGlow } from "../../data/activityProductsData";

/** Luxury ease-out — calm deceleration, no snap */
const LUXURY_EASE = [0.22, 1, 0.36, 1];
const EXIT_EASE = [0.4, 0, 0.2, 1];

const TIMING = {
  hoverPause: 0.08,
  arrowDuration: 0.32,
  productDuration: 0.58,
  productStagger: 0.14,
  labelDuration: 0.42,
  exitDuration: 0.36,
};

const ARROW_DELAY = TIMING.hoverPause;
const PRODUCT_DELAYS = [
  0.1,
  0.1 + TIMING.productStagger,
];
const LABEL_DELAY = 0.1;

const railVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01, delay: TIMING.hoverPause },
  },
  exit: {
    opacity: 0,
    transition: { duration: TIMING.exitDuration, ease: EXIT_EASE },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: TIMING.productDuration,
      ease: LUXURY_EASE,
      delay: PRODUCT_DELAYS[i] ?? PRODUCT_DELAYS[0],
    },
  }),
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    transition: { duration: 0.32, ease: EXIT_EASE },
  },
};

function ActivityConnector({ glow, reduce, anchorX }) {
  const rgb = glow.rgb;
  const left = anchorX != null ? anchorX : "50%";

  return (
    <motion.div
      className="absolute top-0 flex flex-col items-center pointer-events-none"
      style={{ left, transform: "translateX(-50%)" }}
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -4 }}
      transition={{
        delay: ARROW_DELAY,
        duration: TIMING.arrowDuration,
        ease: LUXURY_EASE,
      }}
    >
      <div
        className="w-px"
        style={{
          height: 36,
          background: `linear-gradient(to bottom, rgba(${rgb}, 0.04), rgba(${rgb}, 0.38), rgba(${rgb}, 0.62))`,
        }}
      />
      <ChevronDown
        size={18}
        strokeWidth={2.25}
        style={{ color: `rgba(${rgb}, 0.68)` }}
        className="mt-0.5"
      />
    </motion.div>
  );
}

function RailProductCard({ product, index, glow, reduce }) {
  const rgb = glow.rgb;

  return (
    <motion.div
      custom={index}
      variants={reduce ? undefined : cardVariants}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "visible"}
      exit={reduce ? undefined : "exit"}
      className="group/p min-w-0"
    >
      <div
        className="relative h-full overflow-hidden rounded-[22px] border border-white/50 dark:border-white/10 bg-white/88 dark:bg-zinc-900/90 backdrop-blur-xl shadow-[0_18px_48px_rgba(15,23,42,0.1)] dark:shadow-[0_18px_48px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-[650ms] ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12),0_0_32px_rgba(var(--glow-rgb),0.14)] dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_32px_rgba(var(--glow-rgb),0.1)]"
        style={{ "--glow-rgb": rgb }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-[650ms] ease-out group-hover/p:opacity-75"
          style={{
            background: `radial-gradient(ellipse at 50% 32%, rgba(${rgb}, 0.18) 0%, transparent 68%)`,
          }}
        />

        <div className="relative h-[210px] sm:h-[230px] flex items-center justify-center bg-gradient-to-b from-slate-50/95 via-white/75 to-white/45 dark:from-zinc-800/90 dark:via-zinc-900/80 dark:to-zinc-950/65">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "/products/knee.png";
            }}
            className="relative z-[1] max-h-[84%] max-w-[84%] object-contain transition-transform duration-[750ms] ease-out group-hover/p:scale-[1.03]"
          />
        </div>

        <div className="relative border-t border-white/40 dark:border-white/8 px-5 py-4 sm:px-6 sm:py-5 bg-white/55 dark:bg-zinc-900/55 backdrop-blur-lg">
          <p className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-50 leading-snug line-clamp-2">
            {product.name}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="mt-3.5 inline-flex items-center gap-2 text-xs sm:text-sm font-black text-cyan-600 dark:text-cyan-400 transition-all duration-500 ease-out hover:gap-2.5"
          >
            View Product
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ActivityProductRail({ activity, products, anchorX }) {
  const reduce = useReducedMotion();
  const items = (products || []).slice(0, 2);
  const glow = activity ? getActivityGlow(activity) : null;

  return (
    <AnimatePresence mode="wait">
      {activity && items.length > 0 && glow && (
        <motion.div
          key={activity}
          variants={reduce ? undefined : railVariants}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
          exit={reduce ? undefined : "exit"}
          className="relative"
        >
          <ActivityConnector glow={glow} reduce={reduce} anchorX={anchorX} />

          <div className="pt-14 pb-3">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
              transition={{
                delay: LABEL_DELAY,
                duration: TIMING.labelDuration,
                ease: LUXURY_EASE,
              }}
              className="mb-7 text-center text-sm sm:text-base font-black tracking-wide text-slate-500 dark:text-zinc-400"
            >
              Featured Supports For{" "}
              <span
                className="text-slate-900 dark:text-zinc-100"
                style={{ textShadow: `0 0 24px rgba(${glow.rgb}, 0.22)` }}
              >
                {activity}
              </span>
            </motion.p>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              {items.map((product, index) => (
                <RailProductCard
                  key={`${activity}-${product.slug || product._id || index}`}
                  product={product}
                  index={index}
                  glow={glow}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
