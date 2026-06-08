import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HeroHeading,
  SectionLabel,
  FadeUpText,
} from "../typography/TypographyMotion";

export const VIEWPORT_PREMIUM = { once: true, amount: 0.2 };

const EASE_LUXURY = [0.16, 1, 0.3, 1];
const EASE_EDITORIAL = [0.22, 1, 0.36, 1];

export const FadeUpSlow = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.45, ease: EASE_LUXURY },
  },
};

export const FadeUpMedium = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: EASE_LUXURY },
  },
};

export const SlideLeftLuxury = {
  hidden: { opacity: 0, x: -44 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.15, ease: EASE_LUXURY },
  },
};

export const SlideRightLuxury = {
  hidden: { opacity: 0, x: 44 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.15, ease: EASE_LUXURY },
  },
};

export const ScaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.05, ease: EASE_LUXURY },
  },
};

export const StaggerContainer = (stagger = 0.14, delay = 0.1) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const CardCascade = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.88, ease: EASE_EDITORIAL },
  },
};

const HEADER_VARIANTS = {
  fadeUp: FadeUpSlow,
  slideLeft: SlideLeftLuxury,
  slideRight: SlideRightLuxury,
  scale: ScaleReveal,
};

function usePremiumMotion() {
  return !useReducedMotion();
}

export function PremiumReveal({
  children,
  variant = FadeUpSlow,
  className = "",
  delay = 0,
}) {
  const enabled = usePremiumMotion();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_PREMIUM}
      variants={{
        hidden: variant.hidden,
        visible: {
          ...variant.visible,
          transition: {
            ...variant.visible.transition,
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function PremiumStagger({
  children,
  className = "",
  stagger = 0.14,
  delay = 0.12,
}) {
  const enabled = usePremiumMotion();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_PREMIUM}
      variants={StaggerContainer(stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

export function PremiumStaggerItem({ children, className = "" }) {
  const enabled = usePremiumMotion();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={CardCascade}>
      {children}
    </motion.div>
  );
}

export function PremiumSectionHeader({
  label,
  title,
  description,
  style = "fadeUp",
  className = "",
  titleClassName = "text-[58px] font-black mt-2 text-slate-900 dark:text-zinc-100",
  labelClassName = "text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-sm",
}) {
  const variant = HEADER_VARIANTS[style] || FadeUpSlow;

  return (
    <PremiumReveal variant={variant} className={className}>
      {label && <SectionLabel className={labelClassName}>{label}</SectionLabel>}
      <h2 className={titleClassName}>{title}</h2>
      {description && (
        <FadeUpText className="text-gray-500 dark:text-zinc-400 mt-3 max-w-xl">
          {description}
        </FadeUpText>
      )}
    </PremiumReveal>
  );
}

/** Cinematic section header with word-by-word title */
export function PremiumWordHeader({
  label,
  title,
  description,
  style = "slideLeft",
  titleClassName = "text-4xl sm:text-[58px] font-black mt-2 text-slate-900 dark:text-zinc-100",
  labelClassName = "text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-sm",
  className = "",
}) {
  const variant = HEADER_VARIANTS[style] || SlideLeftLuxury;

  return (
    <PremiumReveal variant={variant} className={className}>
      {label && <SectionLabel className={labelClassName}>{label}</SectionLabel>}
      <HeroHeading text={title} className={titleClassName} />
      {description && (
        <FadeUpText delay={0.2} className="text-gray-500 dark:text-zinc-400 mt-3 max-w-xl">
          {description}
        </FadeUpText>
      )}
    </PremiumReveal>
  );
}

export function ProductRevealCard({ children, index = 0, className = "" }) {
  const enabled = usePremiumMotion();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_PREMIUM}
      transition={{
        duration: 0.95,
        delay: index * 0.16,
        ease: EASE_LUXURY,
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.45, ease: EASE_EDITORIAL },
      }}
    >
      {children}
    </motion.div>
  );
}

export function TestimonialCard({ item, index = 0 }) {
  const enabled = usePremiumMotion();

  if (!enabled) {
    return (
      <article className="rounded-[34px] border border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <Quote className="h-12 w-12 text-cyan-500" />
        <p className="mt-6 text-lg leading-9 text-gray-600 dark:text-zinc-300">{item.text}</p>
        <p className="mt-6 font-black text-slate-900 dark:text-zinc-100">{item.name}</p>
      </article>
    );
  }

  const slideX = index % 2 === 0 ? -40 : 40;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_PREMIUM}
      variants={{
        hidden: { opacity: 0, x: slideX },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 1.15,
            ease: EASE_LUXURY,
            delay: index * 0.1,
            staggerChildren: 0.22,
            delayChildren: 0.35,
          },
        },
      }}
      className="rounded-[34px] border border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]"
    >
      <motion.div variants={FadeUpMedium}>
        <Quote className="h-12 w-12 text-cyan-500" />
      </motion.div>
      <motion.p
        variants={FadeUpSlow}
        className="mt-6 text-lg leading-9 text-gray-600 dark:text-zinc-300"
      >
        {item.text}
      </motion.p>
      <motion.p
        variants={FadeUpMedium}
        className="mt-6 font-black text-slate-900 dark:text-zinc-100"
      >
        {item.name}
      </motion.p>
    </motion.article>
  );
}

export function BlogCardEditorial({ blog, index = 0 }) {
  const enabled = usePremiumMotion();

  const cardInner = (
    <>
      <div className="h-44 overflow-hidden bg-slate-100 bg-surface-hover">
        {enabled ? (
          <motion.img
            variants={ScaleReveal}
            src={blog.image}
            onError={(e) => (e.currentTarget.src = "/products/knee.png")}
            className="w-full h-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105"
            alt={blog.title}
          />
        ) : (
          <img
            src={blog.image}
            onError={(e) => (e.currentTarget.src = "/products/knee.png")}
            className="w-full h-full object-cover transition duration-[1.2s] ease-out group-hover:scale-105"
            alt={blog.title}
          />
        )}
      </div>
      <div className="p-5">
        {enabled ? (
          <>
            <motion.p
              variants={FadeUpMedium}
              className="text-xs text-purple-700 font-black uppercase tracking-wider"
            >
              {blog.category}
            </motion.p>
            <motion.h3
              variants={FadeUpSlow}
              className="font-black mt-2 text-lg leading-tight group-hover:text-purple-700 transition"
            >
              {blog.title}
            </motion.h3>
            <motion.p
              variants={FadeUpMedium}
              className="text-sm text-gray-500 dark:text-zinc-400 mt-3 line-clamp-2"
            >
              {blog.excerpt}
            </motion.p>
            <motion.span
              variants={FadeUpMedium}
              className="inline-flex mt-5 font-black text-sm text-purple-700"
            >
              Read article →
            </motion.span>
          </>
        ) : (
          <>
            <p className="text-xs text-purple-700 font-black uppercase tracking-wider">
              {blog.category}
            </p>
            <h3 className="font-black mt-2 text-lg leading-tight group-hover:text-purple-700 transition">
              {blog.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-3 line-clamp-2">
              {blog.excerpt}
            </p>
            <span className="inline-flex mt-5 font-black text-sm text-purple-700">
              Read article →
            </span>
          </>
        )}
      </div>
    </>
  );

  const card = (
    <Link
      to={`/blogs/${blog.slug}`}
      className="group block bg-card dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.13)] transition duration-500"
    >
      {cardInner}
    </Link>
  );

  if (!enabled) return card;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_PREMIUM}
      variants={StaggerContainer(0.14, index * 0.08)}
    >
      {card}
    </motion.div>
  );
}

export function FeaturedBlogReveal({ blog }) {
  const enabled = usePremiumMotion();

  if (!enabled) {
    return (
      <Link
        to={`/blogs/${blog.slug}`}
        className="block rounded-[36px] overflow-hidden bg-card dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
      >
        <div className="grid lg:grid-cols-2">
          <img src={blog.image} alt={blog.title} className="h-full min-h-[320px] w-full object-cover" />
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <p className="text-purple-700 font-black tracking-[0.3em] text-xs uppercase">Featured Guide</p>
            <h2 className="text-4xl lg:text-5xl font-black mt-4 text-slate-900 dark:text-zinc-100 leading-tight">{blog.title}</h2>
            <p className="mt-6 text-lg text-gray-500 dark:text-zinc-400 leading-8">{blog.excerpt}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_PREMIUM}
      variants={StaggerContainer(0.2, 0.15)}
    >
      <Link
        to={`/blogs/${blog.slug}`}
        className="group block rounded-[36px] overflow-hidden bg-card dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] hover:shadow-[0_40px_110px_rgba(15,23,42,0.16)] transition-shadow duration-700"
      >
        <div className="grid lg:grid-cols-2">
          <motion.div variants={ScaleReveal} className="overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full min-h-[320px] w-full object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.03]"
            />
          </motion.div>
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <motion.p variants={FadeUpMedium} className="text-purple-700 font-black tracking-[0.3em] text-xs uppercase">
              Featured Guide
            </motion.p>
            <motion.h2 variants={SlideLeftLuxury} className="text-4xl lg:text-5xl font-black mt-4 text-slate-900 dark:text-zinc-100 leading-tight">
              {blog.title}
            </motion.h2>
            <motion.p variants={FadeUpSlow} className="mt-6 text-lg text-gray-500 dark:text-zinc-400 leading-8">
              {blog.excerpt}
            </motion.p>
            <motion.span variants={FadeUpMedium} className="mt-8 inline-flex font-black text-purple-700">
              Read featured article →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
