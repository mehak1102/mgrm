import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Global viewport — trigger once when ~25% visible */
export const VIEWPORT = { once: true, amount: 0.25 };

const EASE_LUXURY = [0.16, 1, 0.3, 1];
const EASE_SMOOTH = [0.22, 1, 0.36, 1];

/** Four animation speed tiers */
export const SPEEDS = {
  hero: {
    wordStagger: 0.16,
    wordDuration: 1.65,
    y: 18,
    delayChildren: 0.2,
  },
  section: {
    wordStagger: 0.1,
    wordDuration: 1.05,
    y: 14,
    delayChildren: 0.08,
  },
  paragraph: {
    stagger: 0.22,
    duration: 1.35,
    y: 12,
  },
  card: {
    stagger: 0.07,
    duration: 0.65,
    y: 10,
  },
};

const staggerContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

function useMotionEnabled() {
  return !useReducedMotion();
}

function WordReveal({
  text,
  className = "",
  speed = SPEEDS.section,
  animateOnMount = false,
  highlightWords = [],
  wordClassName = "",
  gradient = false,
}) {
  const enabled = useMotionEnabled();
  const words = text.split(/\s+/).filter(Boolean);

  if (!enabled) {
    return <span className={className}>{text}</span>;
  }

  const motionProps = animateOnMount
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: VIEWPORT };

  return (
    <motion.span
      {...motionProps}
      className={`flex flex-wrap gap-x-[0.32em] gap-y-1 ${className}`}
      variants={staggerContainer(speed.wordStagger, speed.delayChildren)}
    >
      {words.map((word, i) => {
        const highlighted = highlightWords.includes(word);
        return (
          <motion.span
            key={`${word}-${i}`}
            variants={{
              hidden: { opacity: 0, y: speed.y },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: speed.wordDuration, ease: EASE_LUXURY },
              },
            }}
            className={`${wordClassName} ${
              gradient
                ? "bg-gradient-to-r from-cyan-300 via-white to-blue-300 bg-clip-text text-transparent"
                : highlighted
                  ? "text-red-500"
                  : ""
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

/** Tier 1 — Hero headlines (slow cinematic, 1.4–2.2s) */
export function HeroHeading({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0,
  highlightWords = [],
  animateOnMount = true,
}) {
  const enabled = useMotionEnabled();
  if (!enabled) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <WordReveal
        text={text}
        speed={{ ...SPEEDS.hero, delayChildren: SPEEDS.hero.delayChildren + delay }}
        animateOnMount={animateOnMount}
        highlightWords={highlightWords}
      />
    </Tag>
  );
}

export function HeroKineticLine({
  text,
  className = "",
  gradient = false,
  delay = 0,
}) {
  return (
    <WordReveal
      text={text}
      className={className}
      speed={{ ...SPEEDS.hero, delayChildren: SPEEDS.hero.delayChildren + delay }}
      animateOnMount
      gradient={gradient}
    />
  );
}

export function HeroTitleBlock({ lines, className = "" }) {
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <div key={i} className={i > 0 ? "mt-2 md:mt-3" : ""}>
          <HeroKineticLine
            text={line.text}
            className={line.className}
            gradient={line.gradient}
            delay={line.delay ?? i * 0.22}
          />
        </div>
      ))}
    </h1>
  );
}

/** Tier 2 — Section headings (medium, 0.9–1.3s) */
export function SectionHeading({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
}) {
  const enabled = useMotionEnabled();
  if (!enabled) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <WordReveal
        text={text}
        speed={{ ...SPEEDS.section, delayChildren: SPEEDS.section.delayChildren + delay }}
      />
    </Tag>
  );
}

export const CinematicHeading = SectionHeading;

/** Small uppercase labels */
export function SectionLabel({ children, className = "" }) {
  const enabled = useMotionEnabled();
  if (!enabled) return <span className={className}>{children}</span>;

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_SMOOTH }}
    >
      {children}
    </motion.span>
  );
}

/** Tier 3 — Paragraphs (slow fade-up, reading-first) */
export function FadeUpText({
  children,
  className = "",
  delay = 0,
  animateOnMount = false,
}) {
  const enabled = useMotionEnabled();
  if (!enabled) return <p className={className}>{children}</p>;

  const motionProps = animateOnMount
    ? {
        initial: { opacity: 0, y: SPEEDS.paragraph.y },
        animate: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: SPEEDS.paragraph.y },
        whileInView: { opacity: 1, y: 0 },
        viewport: VIEWPORT,
      };

  return (
    <motion.p
      {...motionProps}
      transition={{ duration: SPEEDS.paragraph.duration, delay, ease: EASE_SMOOTH }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

export function ParagraphGroup({ paragraphs, className = "" }) {
  const enabled = useMotionEnabled();

  if (!enabled) {
    return (
      <div className={className}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(SPEEDS.paragraph.stagger)}
    >
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          variants={{
            hidden: { opacity: 0, y: SPEEDS.paragraph.y },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: SPEEDS.paragraph.duration,
                ease: EASE_SMOOTH,
              },
            },
          }}
        >
          {p}
        </motion.p>
      ))}
    </motion.div>
  );
}

/** Quotes — full-block fade-up (no character animation) */
export function FadeUpQuote({ text, className = "" }) {
  const enabled = useMotionEnabled();
  if (!enabled) return <p className={className}>{text}</p>;

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.25, ease: EASE_SMOOTH }}
    >
      {text}
    </motion.p>
  );
}

/** @deprecated Use FadeUpQuote — kept for backward compatibility */
export const QuoteReveal = FadeUpQuote;

export function FadeUpParagraph({ children, className = "", delay = 0 }) {
  const enabled = useMotionEnabled();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(SPEEDS.paragraph.stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

export function FadeUpBlock({ children, className = "", delay = 0, id }) {
  const enabled = useMotionEnabled();
  if (!enabled) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y: SPEEDS.paragraph.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: SPEEDS.paragraph.duration,
        delay,
        ease: EASE_SMOOTH,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Tier 4 — Cards / badges (fast subtle, 0.5–0.8s) */
export function StaggerReveal({
  children,
  className = "",
  stagger = SPEEDS.card.stagger,
  delay = 0,
}) {
  const enabled = useMotionEnabled();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  const enabled = useMotionEnabled();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: SPEEDS.card.y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: SPEEDS.card.duration, ease: EASE_SMOOTH },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card motion preset for inline motion.div usage */
export function cardRevealTransition(index = 0) {
  return {
    initial: { opacity: 0, y: SPEEDS.card.y },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: {
      duration: SPEEDS.card.duration,
      delay: index * SPEEDS.card.stagger,
      ease: EASE_SMOOTH,
    },
  };
}

/** Statistics — count-up for small numbers, scale-in for years */
export function AnimatedStat({
  value,
  label,
  className = "",
  valueClassName = "",
  labelClassName = "",
  duration = 1800,
}) {
  const enabled = useMotionEnabled();
  const ref = useRef(null);
  const isInView = useInView(ref, VIEWPORT);
  const match = String(value).match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const numeric = match ? parseInt(match[2], 10) : 0;
  const suffix = match?.[3] ?? "";
  const shouldCount = numeric > 0 && numeric <= 200;
  const [count, setCount] = useState(!enabled || !shouldCount ? numeric : 0);

  useEffect(() => {
    if (!enabled || !isInView || !shouldCount) {
      setCount(numeric);
      return;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numeric));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, numeric, duration, enabled, shouldCount]);

  if (!enabled) {
    return (
      <div ref={ref} className={className}>
        <div className={valueClassName}>
          {prefix}
          {numeric}
          {suffix}
        </div>
        {label && <p className={labelClassName}>{label}</p>}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, ease: EASE_LUXURY }}
    >
      <div className={valueClassName}>
        {prefix}
        {count}
        {suffix}
      </div>
      {label && (
        <motion.p
          className={labelClassName}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.3, duration: 0.55, ease: EASE_SMOOTH }}
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
}

export function TimelineReveal({ children, className = "" }) {
  const enabled = useMotionEnabled();
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(0.14)}
    >
      {children}
    </motion.div>
  );
}

export function TimelineItem({ index, children, className = "" }) {
  const enabled = useMotionEnabled();
  const fromLeft = index % 2 === 0;

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x: fromLeft ? -28 : 28 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.85, ease: EASE_SMOOTH },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
