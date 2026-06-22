import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { therapySections } from "../data/therapyRecommendationsData";
import TherapyAnatomyVisual from "../components/recommendation/TherapyAnatomyVisual";
import "./RecommendedByPhysiotherapist.css";

const TherapyChapter = lazy(() => import("../components/recommendation/TherapySection"));

const EASE = [0.16, 1, 0.3, 1];

function ChapterFallback() {
  return (
    <div className="therapy-snap flex min-h-[50vh] items-center px-8 lg:pl-[7.5rem]">
      <div className="therapy-chapter-card h-[480px] w-full max-w-5xl animate-pulse rounded-[42px] border" />
    </div>
  );
}

function TherapyHero({ reduce }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <header
      ref={ref}
      className="therapy-snap therapy-hero relative flex min-h-[100svh] flex-col justify-center overflow-hidden lg:pl-[7.5rem]"
    >
      <div className="therapy-hero-grid pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
        <motion.div style={reduce ? undefined : { opacity, y }}>
          <p className="therapy-text-muted text-[0.62rem] font-semibold uppercase tracking-[0.32em]">
            Therapist Recommendations
          </p>

          <h1 className="therapy-text-primary mt-5 text-[clamp(2.4rem,7vw,5rem)] font-extralight leading-[0.95] tracking-[-0.03em]">
            Recommended
            <span className="therapy-hero-title-accent mt-1 block font-light">
              By Physiotherapist
            </span>
          </h1>

          <p className="therapy-text-secondary mt-7 max-w-lg text-sm leading-7 sm:text-base sm:leading-8">
            Twelve clinical specialties. Every body category mapped to real supports —
            curated the way specialists think about recovery, not how catalogs are filed.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <div className="h-px w-14 therapy-border bg-[var(--therapy-line)]" />
            <p className="therapy-text-muted text-[0.65rem] font-medium uppercase tracking-[0.22em]">
              Scroll · {therapySections.length} specialties
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          className="flex justify-center lg:justify-end"
        >
          <TherapyAnatomyVisual
            src="/cardiology/heart.png"
            accent="#ef4444"
            alt="Clinical rehabilitation focus"
          />
        </motion.div>
      </div>

      <div className="therapy-scroll-hint pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block lg:left-[calc(50%+3.75rem)]">
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-[var(--therapy-muted)] to-[var(--therapy-ink)] opacity-40" />
      </div>
    </header>
  );
}

function TherapyNavRail({ activeId, onNavigate }) {
  return (
    <nav className="therapy-nav-rail" aria-label="Therapy specialties">
      {therapySections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            className={`therapy-nav-btn ${isActive ? "is-active" : ""}`}
            style={{ color: isActive ? section.accent : undefined }}
            onClick={() => onNavigate(section.id)}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="therapy-nav-dot" />
            <span className="therapy-nav-label">{section.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TherapyMobileNav({ activeId, onNavigate }) {
  return (
    <div className="therapy-mobile-nav" role="tablist" aria-label="Therapy specialties">
      {therapySections.map((section) => (
        <button
          key={section.id}
          type="button"
          role="tab"
          aria-selected={activeId === section.id}
          className={`therapy-pill ${activeId === section.id ? "is-active" : ""}`}
          style={activeId === section.id ? { borderColor: section.accent, color: "var(--therapy-ink)" } : undefined}
          onClick={() => onNavigate(section.id)}
        >
          {section.shortLabel}
        </button>
      ))}
    </div>
  );
}

export default function RecommendedByPhysiotherapist() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(therapySections[0].id);
  const observerRef = useRef(null);

  const scrollToSection = useCallback((id) => {
    document.getElementById(`therapy-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const elements = therapySections
      .map((s) => document.getElementById(`therapy-${s.id}`))
      .filter(Boolean);

    if (!elements.length) return undefined;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id.replace("therapy-", ""));
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.2, 0.5, 0.75] }
    );

    elements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <motion.div
      className="therapy-page therapy-scroll"
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <TherapyNavRail activeId={activeId} onNavigate={scrollToSection} />
      <TherapyMobileNav activeId={activeId} onNavigate={scrollToSection} />

      <TherapyHero reduce={reduce} />

      {therapySections.map((section, index) => (
        <Suspense key={section.id} fallback={<ChapterFallback />}>
          <TherapyChapter id={`therapy-${section.id}`} section={section} index={index} />
        </Suspense>
      ))}

      <footer className="therapy-snap therapy-footer px-5 py-20 text-center sm:px-8 lg:pl-[7.5rem]">
        <p className="therapy-text-muted text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
          End of collection · {therapySections.length} specialties
        </p>
        <p className="therapy-text-secondary mx-auto mt-4 max-w-md text-sm leading-7">
          All fifteen body categories mapped. Live inventory only — no placeholders.
        </p>
        <p className="therapy-text-primary mt-8 text-2xl font-extralight tracking-[0.2em] opacity-50">
          MGRM
        </p>
      </footer>
    </motion.div>
  );
}
