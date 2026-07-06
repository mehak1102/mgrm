import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { therapySections } from "../data/therapyRecommendationsData";
import TherapyAnatomyVisual from "../components/recommendation/TherapyAnatomyVisual";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import "./RecommendedByPhysiotherapist.css";

const TherapyChapter = lazy(() => import("../components/recommendation/TherapySection"));

const EASE = [0.16, 1, 0.3, 1];

const headlineStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const headlineWord = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

function ChapterFallback() {
  return (
    <div className="therapy-snap flex min-h-[50vh] items-center px-8 lg:pl-[7.5rem]">
      <div className="therapy-chapter-card h-[480px] w-full max-w-5xl animate-pulse rounded-[42px] border" />
    </div>
  );
}

function TherapyHero({ reduce, onBegin }) {
  const { t } = useTranslation();
  const heroStats = [
    { value: "12", label: t("therapy.specialties") },
    { value: "15", label: t("therapy.bodyRegions") },
    { value: "Live", label: t("therapy.liveInventory") },
  ];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <header
      ref={ref}
      className="therapy-snap therapy-hero relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-12 pt-24 lg:pl-[7.5rem] lg:pb-16 lg:pt-28"
    >
      <div className="therapy-hero-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="therapy-hero-orb therapy-hero-orb-a pointer-events-none absolute" aria-hidden />
      <div className="therapy-hero-orb therapy-hero-orb-b pointer-events-none absolute" aria-hidden />

      <motion.div
        style={reduce ? undefined : { opacity, y, scale }}
        className="relative z-10 mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12"
      >
        <div className="therapy-hero-panel overflow-hidden rounded-[32px] border p-6 sm:rounded-[40px] sm:p-8 md:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
            <div>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="therapy-hero-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              >
                <span className="therapy-hero-badge-dot h-1.5 w-1.5 rounded-full" aria-hidden />
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.28em]">
                  {t("therapy.badge")}
                </span>
              </motion.div>

              <BrandPillBadgeRow className="mt-2" />

              <motion.h1
                variants={reduce ? undefined : headlineStagger}
                initial={reduce ? false : "hidden"}
                animate={reduce ? undefined : "visible"}
                className="therapy-text-primary mt-6 text-[clamp(2.5rem,6.5vw,4.75rem)] font-extralight leading-[0.92] tracking-[-0.035em]"
              >
                <motion.span variants={reduce ? undefined : headlineWord} className="block">
                  {t("therapy.recommended")}
                </motion.span>
                <motion.span
                  variants={reduce ? undefined : headlineWord}
                  className="therapy-hero-title-accent mt-1 block font-light"
                >
                  {t("therapy.byPhysio")}
                </motion.span>
              </motion.h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                className="therapy-text-secondary mt-6 max-w-xl text-sm leading-7 sm:text-base sm:leading-8"
              >
                {t("therapy.heroCopy")}
              </motion.p>

              <motion.ul
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                className="therapy-hero-stats mt-8 grid grid-cols-3 gap-3 sm:max-w-md sm:gap-4"
              >
                {heroStats.map((stat) => (
                  <li key={stat.label} className="therapy-hero-stat rounded-2xl px-3 py-3 sm:px-4 sm:py-4">
                    <p className="therapy-text-primary text-xl font-light tracking-tight sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="therapy-text-muted mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em]">
                      {stat.label}
                    </p>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <button
                  type="button"
                  onClick={() => onBegin(therapySections[0].id)}
                  className="therapy-hero-cta-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t("therapy.exploreSpecialties")}
                  <ArrowDown size={15} strokeWidth={2.25} />
                </button>
                <Link
                  to="/shop"
                  className="therapy-hero-cta-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors"
                >
                  {t("therapy.browseShop")}
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.2 }}
              className="therapy-hero-visual-wrap relative flex items-center justify-center"
            >
              <div className="therapy-hero-visual-ring pointer-events-none absolute inset-0" aria-hidden />
              <div className="therapy-visual-frame therapy-hero-visual" style={{ "--chapter-accent": "#ef4444" }}>
                <TherapyAnatomyVisual
                  src="/cardiology/recomm.png"
                  accent="#ef4444"
                  alt={t("therapy.visualAlt")}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.65, ease: EASE }}
            className="therapy-hero-spectrum mt-10 sm:mt-12"
          >
            <p className="therapy-text-muted mb-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em]">
              {t("therapy.specialtySpectrum")}
            </p>
            <div className="flex h-2 overflow-hidden rounded-full">
              {therapySections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  title={section.title}
                  onClick={() => onBegin(section.id)}
                  className="therapy-hero-spectrum-seg min-w-0 flex-1 transition-opacity hover:opacity-100"
                  style={{ backgroundColor: section.accent, opacity: 0.85 }}
                  aria-label={t("therapy.jumpTo", { title: section.title })}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {therapySections.slice(0, 6).map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onBegin(section.id)}
                  className="therapy-hero-spectrum-link text-[0.58rem] font-medium uppercase tracking-[0.12em]"
                  style={{ color: "var(--therapy-muted)" }}
                >
                  {section.shortLabel}
                </button>
              ))}
              <span className="therapy-text-muted text-[0.58rem]">{t("therapy.more", { count: therapySections.length - 6 })}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={() => onBegin(therapySections[0].id)}
        className="therapy-scroll-hint therapy-hero-scroll-btn absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex lg:left-[calc(50%+3.75rem)]"
        aria-label={t("therapy.scrollToSpecialties")}
      >
        <span className="therapy-text-muted text-[0.58rem] font-semibold uppercase tracking-[0.2em]">
          {t("therapy.scroll")}
        </span>
        <ArrowDown size={16} className="therapy-text-muted opacity-60" />
      </button>
    </header>
  );
}

function TherapyNavRail({ activeId, onNavigate }) {
  const { t } = useTranslation();
  return (
    <nav className="therapy-nav-rail" aria-label={t("therapy.physioSpecialty")}>
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
  const { t } = useTranslation();
  return (
    <div className="therapy-mobile-nav" role="tablist" aria-label={t("therapy.physioSpecialty")}>
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

export default function RecommendedByPhysiotherapist({ embedded = false }) {
  const { t } = useTranslation();
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
      className={`therapy-page therapy-scroll ${embedded ? "therapy-page--embedded" : ""}`}
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {!embedded && <TherapyNavRail activeId={activeId} onNavigate={scrollToSection} />}
      {!embedded && <TherapyMobileNav activeId={activeId} onNavigate={scrollToSection} />}

      <TherapyHero reduce={reduce} onBegin={scrollToSection} />

      {therapySections.map((section, index) => (
        <Suspense key={section.id} fallback={<ChapterFallback />}>
          <TherapyChapter id={`therapy-${section.id}`} section={section} index={index} />
        </Suspense>
      ))}

      <footer className="therapy-snap therapy-footer px-5 py-20 text-center sm:px-8 lg:pl-[7.5rem]">
        <p className="therapy-text-muted text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
          {t("therapy.endCollection", { count: therapySections.length })}
        </p>
        <p className="therapy-text-secondary mx-auto mt-4 max-w-md text-sm leading-7">
          {t("therapy.allMapped")}
        </p>
        <p className="therapy-text-primary mt-8 text-2xl font-extralight tracking-[0.2em] opacity-50">
          MGRM
        </p>
      </footer>
    </motion.div>
  );
}
