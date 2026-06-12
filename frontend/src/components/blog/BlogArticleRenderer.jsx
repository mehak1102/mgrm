import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Lightbulb,
  Quote,
  ArrowRight,
  AlertTriangle,
  Stethoscope,
  Sparkles,
} from "lucide-react";

const EASE_LUXURY = [0.16, 1, 0.3, 1];
const VIEWPORT = { once: true, amount: 0.12 };

const blockReveal = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.82,
      ease: EASE_LUXURY,
    },
  },
};

const headingReveal = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.88,
      ease: EASE_LUXURY,
    },
  },
};

const sectionStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.08,
    },
  },
};

const supportCardReveal = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: EASE_LUXURY,
    },
  },
};

const supportStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.12,
    },
  },
};

function AnimatedBlock({ children, variant = blockReveal, className = "" }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div variants={variant} className={className}>
      {children}
    </motion.div>
  );
}

function ArticleParagraph({ children, isLead = false }) {
  return (
    <p
      className={`${
        isLead
          ? "text-xl md:text-[1.35rem] text-slate-700 dark:text-zinc-200 font-medium"
          : "text-[1.0625rem] md:text-lg text-slate-600 dark:text-zinc-300"
      } leading-[1.9] tracking-[0.012em]`}
    >
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-[1.75rem] md:text-[2.15rem] font-black text-slate-900 dark:text-zinc-50 tracking-[-0.025em] leading-[1.12] mt-20 mb-10 first:mt-0">
      {children}
    </h2>
  );
}

function BlockDivider() {
  return (
    <div className="my-14 flex items-center gap-5" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200/90 dark:via-white/12 to-transparent" />
      <span className="flex gap-1">
        <span className="w-1 h-1 rounded-full bg-purple-400/50" />
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500/70" />
        <span className="w-1 h-1 rounded-full bg-purple-400/50" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200/90 dark:via-white/12 to-transparent" />
    </div>
  );
}

function QuoteBlock({ text, attribution }) {
  return (
    <blockquote className="my-12 relative overflow-hidden rounded-3xl border border-purple-100/80 dark:border-purple-500/15 bg-gradient-to-br from-purple-50/90 via-white to-purple-50/40 dark:from-purple-950/30 dark:via-zinc-900 dark:to-purple-950/10 px-8 py-9 md:px-10 md:py-11">
      <Quote className="text-purple-300/60 dark:text-purple-500/40 mb-5" size={28} aria-hidden />
      <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-zinc-100 leading-[1.55] tracking-[-0.01em]">
        "{text}"
      </p>
      {attribution && (
        <footer className="mt-6 text-sm font-bold text-purple-700/80 dark:text-purple-300 tracking-[0.12em] uppercase">
          {attribution}
        </footer>
      )}
    </blockquote>
  );
}

function TipBlock({ title, text }) {
  return (
    <div className="my-12 rounded-3xl border border-amber-200/60 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/95 to-orange-50/30 dark:from-amber-950/25 dark:to-zinc-900 p-7 md:p-9 shadow-[0_20px_60px_rgba(251,191,36,0.08)]">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
          <Lightbulb className="text-amber-600 dark:text-amber-400" size={22} />
        </div>
        <div>
          <p className="text-xs font-black tracking-[0.2em] uppercase text-amber-700/70 dark:text-amber-300/70 mb-2">
            Clinical tip
          </p>
          <p className="font-black text-lg text-amber-950 dark:text-amber-100">{title}</p>
          <p className="mt-3 text-base text-amber-950/75 dark:text-amber-50/75 leading-[1.75]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function InsightBlock({ title, text, variant = "info" }) {
  const isWarning = variant === "warning";
  return (
    <div
      className={`my-12 rounded-3xl border p-7 md:p-9 ${
        isWarning
          ? "border-red-200/60 dark:border-red-500/20 bg-gradient-to-br from-red-50/90 to-white dark:from-red-950/20 dark:to-zinc-900"
          : "border-sky-200/60 dark:border-sky-500/15 bg-gradient-to-br from-sky-50/90 to-white dark:from-sky-950/20 dark:to-zinc-900"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${
            isWarning ? "bg-red-100 dark:bg-red-900/30" : "bg-sky-100 dark:bg-sky-900/30"
          }`}
        >
          {isWarning ? (
            <AlertTriangle className="text-red-600" size={22} />
          ) : (
            <Stethoscope className="text-sky-600 dark:text-sky-400" size={22} />
          )}
        </div>
        <div>
          <p
            className={`text-xs font-black tracking-[0.2em] uppercase mb-2 ${
              isWarning ? "text-red-600/70" : "text-sky-600/70 dark:text-sky-400/70"
            }`}
          >
            {isWarning ? "Important" : "Medical insight"}
          </p>
          <p
            className={`font-black text-lg ${
              isWarning ? "text-red-950 dark:text-red-100" : "text-sky-950 dark:text-sky-100"
            }`}
          >
            {title}
          </p>
          <p className="mt-3 text-base leading-[1.75] text-slate-700 dark:text-zinc-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function HighlightBlock({ text }) {
  return (
    <div className="my-12 relative overflow-hidden rounded-3xl bg-slate-950 dark:bg-zinc-950 text-white px-8 py-9 md:px-10 md:py-11 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 blur-[80px] pointer-events-none" />
      <div className="relative flex items-start gap-4">
        <Sparkles className="shrink-0 text-purple-300 mt-1" size={22} />
        <div>
          <p className="text-xs font-black tracking-[0.28em] uppercase text-purple-300/90 mb-3">
            Key takeaway
          </p>
          <p className="text-lg md:text-xl leading-[1.7] text-white/92 font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ListBlock({ title, items, style = "bullet" }) {
  const Tag = style === "numbered" ? "ol" : "ul";
  return (
    <div className="my-10 pl-1">
      {title && (
        <p className="font-black text-slate-800 dark:text-zinc-100 mb-5 text-sm uppercase tracking-[0.18em]">
          {title}
        </p>
      )}
      <Tag
        className={`space-y-4 ${
          style === "numbered" ? "list-decimal list-inside" : "list-none"
        }`}
      >
        {items.map((item) => (
          <li
            key={item.slice(0, 48)}
            className={`text-[1.0625rem] md:text-lg text-slate-600 dark:text-zinc-300 leading-[1.8] ${
              style === "bullet"
                ? "relative pl-7 before:content-[''] before:absolute before:left-0 before:top-[0.72em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-purple-500/80"
                : ""
            }`}
          >
            {item}
          </li>
        ))}
      </Tag>
    </div>
  );
}

function SupportCard({ product }) {
  const color = product.color || "#7c6cff";
  const shopHref = product.shopCategory
    ? `/shop?category=${encodeURIComponent(product.shopCategory)}`
    : `/product/${product.slug}`;

  return (
      <Link
        to={shopHref}
        className="group block rounded-[28px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden transition duration-700 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(15,23,42,0.12)]"
        style={{
          boxShadow: `0 20px 50px ${color}12`,
        }}
      >
        <div
          className="relative h-52 md:h-56 flex items-center justify-center overflow-hidden transition duration-700 group-hover:shadow-inner"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${color}18 0%, transparent 65%), linear-gradient(180deg, #fafbfc 0%, #f4f6f9 100%)`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 70%, ${color}28 0%, transparent 60%)`,
            }}
          />
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = "/products/knee2.png")}
            className="relative z-[1] w-[72%] max-h-[78%] object-contain transition duration-[1.1s] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="px-7 py-6 md:px-8 md:py-7 border-t border-slate-100 dark:border-white/5">
          <p className="text-xs font-black tracking-[0.16em] uppercase text-slate-400 dark:text-zinc-500 mb-2">
            {product.categoryName || "MGRM Support"}
          </p>
          <p className="font-black text-xl text-slate-900 dark:text-zinc-50 tracking-tight group-hover:text-purple-700 dark:group-hover:text-purple-300 transition duration-500">
            {product.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2.5 leading-relaxed max-w-md">
            {product.description}
          </p>
          <span className="inline-flex items-center gap-2 mt-5 text-sm font-black text-purple-700 dark:text-purple-300 group-hover:gap-3 transition-all duration-500">
            Explore <ArrowRight size={16} />
          </span>
        </div>
      </Link>
  );
}

function SupportStack({ items, recommendation }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="my-12 space-y-6">
        {items.map((product) => (
          <SupportCard key={product.slug} product={product} />
        ))}
        {recommendation && (
          <p className="pt-4 text-base text-slate-500 dark:text-zinc-400 leading-[1.8] italic max-w-prose">
            {recommendation}
          </p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="my-12"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={supportStagger}
    >
      <div className="space-y-6">
        {items.map((product) => (
          <motion.div key={product.slug} variants={supportCardReveal}>
            <SupportCard product={product} />
          </motion.div>
        ))}
      </div>
      {recommendation && (
        <motion.p
          variants={supportCardReveal}
          className="pt-6 text-base text-slate-500 dark:text-zinc-400 leading-[1.8] italic max-w-prose"
        >
          {recommendation}
        </motion.p>
      )}
    </motion.div>
  );
}

function RoutineBlock({ intro, items }) {
  return (
    <div className="my-12 rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-white/50 dark:bg-zinc-900/50">
      {intro && (
        <div className="px-7 py-5 bg-slate-50/80 dark:bg-zinc-800/40 border-b border-slate-200/80 dark:border-white/10">
          <p className="font-black text-slate-800 dark:text-zinc-100 tracking-tight">{intro}</p>
        </div>
      )}
      <ul className="divide-y divide-slate-100/80 dark:divide-white/8">
        {items.map(({ time, action }) => (
          <li key={time} className="flex flex-col sm:flex-row sm:gap-8 px-7 py-5 md:py-6">
            <span className="shrink-0 font-black text-purple-700 dark:text-purple-300 text-xs uppercase tracking-[0.2em] sm:w-32">
              {time}
            </span>
            <span className="text-[1.0625rem] text-slate-600 dark:text-zinc-300 leading-[1.8] mt-1.5 sm:mt-0">
              {action}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqBlock({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="my-10 space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden transition-shadow duration-500 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 md:px-7 md:py-6 text-left font-black text-slate-900 dark:text-zinc-100 hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition"
            >
              <span className="text-base md:text-lg leading-snug tracking-tight">{item.q}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-purple-600 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 md:px-7 md:pb-7 -mt-1">
                <p className="text-base md:text-[1.0625rem] text-slate-600 dark:text-zinc-300 leading-[1.85]">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TakeawaysBlock({ items }) {
  return (
    <div className="my-8 rounded-3xl bg-gradient-to-br from-purple-50/90 via-white to-purple-50/50 dark:from-purple-950/25 dark:via-zinc-900 dark:to-purple-950/10 border border-purple-100/80 dark:border-purple-500/15 p-8 md:p-11">
      <ul className="space-y-5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-4 text-[1.0625rem] md:text-lg text-slate-700 dark:text-zinc-200 leading-[1.8]"
          >
            <span
              className="shrink-0 w-2 h-2 rounded-full bg-purple-600 mt-2.5 shadow-[0_0_12px_rgba(124,108,255,0.5)]"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RenderBlock({ block, isFirstParagraph }) {
  switch (block.type) {
    case "paragraph":
      return <ArticleParagraph isLead={isFirstParagraph}>{block.text}</ArticleParagraph>;
    case "divider":
      return <BlockDivider />;
    case "quote":
      return <QuoteBlock text={block.text} attribution={block.attribution} />;
    case "tip":
      return <TipBlock title={block.title} text={block.text} />;
    case "callout":
      return <InsightBlock title={block.title} text={block.text} variant={block.variant} />;
    case "list":
      return <ListBlock title={block.title} items={block.items} style={block.style} />;
    case "recommendation":
      return <HighlightBlock text={block.text} />;
    case "products":
      return <SupportStack items={block.items} recommendation={block.recommendation} />;
    case "routine":
      return <RoutineBlock intro={block.intro} items={block.items} />;
    case "faq":
      return <FaqBlock items={block.items} />;
    case "takeaways":
      return <TakeawaysBlock items={block.items} />;
    default:
      return null;
  }
}

function SectionBlocks({ section, animated }) {
  let paragraphIndex = 0;
  const spaceClass = section.id === "intro" ? "space-y-8 pb-2" : "space-y-7";

  return (
    <div className={spaceClass}>
      {section.blocks.map((block, i) => {
        const isPara = block.type === "paragraph";
        const isFirstParagraph = isPara && paragraphIndex === 0;
        if (isPara) paragraphIndex += 1;

        if (block.type === "products") {
          return (
            <div key={`${section.id}-${i}`}>
              <RenderBlock block={block} />
            </div>
          );
        }

        const inner = (
          <RenderBlock block={block} isFirstParagraph={isFirstParagraph} />
        );

        if (!animated) {
          return <div key={`${section.id}-${i}`}>{inner}</div>;
        }

        return (
          <AnimatedBlock key={`${section.id}-${i}`} variant={blockReveal}>
            {inner}
          </AnimatedBlock>
        );
      })}
    </div>
  );
}

function AnimatedSection({ section }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section className="mb-4">
        {section.title && <SectionHeading>{section.title}</SectionHeading>}
        <SectionBlocks section={section} animated={false} />
        {section.id === "intro" && (
          <div className="mt-12 h-px bg-gradient-to-r from-transparent via-slate-200/90 dark:via-white/10 to-transparent" />
        )}
      </section>
    );
  }

  return (
    <motion.section
      className="mb-4"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={sectionStagger}
    >
      {section.title && (
        <AnimatedBlock variant={headingReveal}>
          <SectionHeading>{section.title}</SectionHeading>
        </AnimatedBlock>
      )}
      <SectionBlocks section={section} animated />
      {section.id === "intro" && (
        <AnimatedBlock variant={blockReveal}>
          <div className="mt-12 h-px bg-gradient-to-r from-transparent via-slate-200/90 dark:via-white/10 to-transparent" />
        </AnimatedBlock>
      )}
    </motion.section>
  );
}

export default function BlogArticleRenderer({ article }) {
  if (!article?.sections?.length) return null;

  return (
    <article className="max-w-[40rem] mx-auto selection:bg-purple-200/60 dark:selection:bg-purple-900/40">
      {article.sections.map((section) => (
        <AnimatedSection key={section.id} section={section} />
      ))}
    </article>
  );
}
