import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getActivityGlow } from "../../data/activityProductsData";

const LUXURY_EASE = [0.22, 1, 0.36, 1];
const EXIT_EASE = [0.4, 0, 0.2, 1];
const HOVER_MS = 300;

const TIMING = {
  hoverPause: 0.08,
  arrowDuration: 0.32,
  productDuration: 0.58,
  productStagger: 0.14,
  labelDuration: 0.42,
  exitDuration: 0.36,
};

const ARROW_DELAY = TIMING.hoverPause;
const PRODUCT_DELAYS = [0.1, 0.1 + TIMING.productStagger, 0.1 + TIMING.productStagger * 2];
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
      className="group/p min-w-0 h-full"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/50 dark:border-white/10 bg-white/88 dark:bg-zinc-900/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,23,42,0.09)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.32)] transition-[transform,box-shadow,border-color] ease-out hover:-translate-y-1.5 hover:border-white/70 dark:hover:border-white/16 hover:shadow-[0_22px_52px_rgba(15,23,42,0.12),0_0_36px_rgba(var(--glow-rgb),0.16)] dark:hover:shadow-[0_22px_52px_rgba(0,0,0,0.42),0_0_36px_rgba(var(--glow-rgb),0.12)]"
        style={{ "--glow-rgb": rgb, transitionDuration: `${HOVER_MS}ms` }}
      >
        {/* Soft ambient glow — intensifies on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-40 transition-opacity ease-out group-hover/p:opacity-70"
          style={{
            background: `radial-gradient(ellipse at 50% 28%, rgba(${rgb}, 0.16) 0%, transparent 72%)`,
            transitionDuration: `${HOVER_MS}ms`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 z-0 rounded-[24px] opacity-0 blur-xl transition-opacity ease-out group-hover/p:opacity-60"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, rgba(${rgb}, 0.28) 0%, transparent 70%)`,
            transitionDuration: `${HOVER_MS}ms`,
          }}
        />

        {/* Image — fills container */}
        <div className="relative h-[176px] sm:h-[188px] overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-50/80 to-white/60 dark:from-zinc-800/95 dark:via-zinc-900/85 dark:to-zinc-950/70">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "/products/knee.png";
            }}
            className="relative z-[2] h-full w-full object-cover object-center transition-transform ease-out group-hover/p:scale-[1.04]"
            style={{ transitionDuration: `${HOVER_MS}ms` }}
          />
        </div>

        {/* Footer — consistent height across cards */}
        <div className="relative z-[2] flex flex-1 flex-col border-t border-white/40 dark:border-white/8 bg-white/55 dark:bg-zinc-900/55 px-4 py-4 sm:px-5 sm:py-4 backdrop-blur-lg">
          <p className="text-sm font-black text-slate-900 dark:text-zinc-50 leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </p>
          <Link
            to={`/product/${product.slug}`}
            className="mt-auto pt-3 inline-flex items-center gap-1.5 text-xs font-black text-cyan-600 dark:text-cyan-400 transition-all ease-out hover:gap-2"
            style={{ transitionDuration: `${HOVER_MS}ms` }}
          >
            View Product
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ActivityProductRail({ activity, products, anchorX }) {
  const reduce = useReducedMotion();
  const items = (products || []).slice(0, 3);
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
              className="mb-6 text-center text-sm sm:text-base font-black tracking-wide text-slate-500 dark:text-zinc-400"
            >
              Featured Supports For{" "}
              <span
                className="text-slate-900 dark:text-zinc-100"
                style={{ textShadow: `0 0 24px rgba(${glow.rgb}, 0.22)` }}
              >
                {activity}
              </span>
            </motion.p>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5">
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
