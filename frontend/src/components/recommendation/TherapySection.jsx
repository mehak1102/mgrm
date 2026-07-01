import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import TherapyProductCarousel from "./TherapyProductCarousel";
import TherapyAnatomyVisual from "./TherapyAnatomyVisual";
import { therapyShopUrl } from "../../data/therapyRecommendationsData";

const EASE = [0.22, 1, 0.36, 1];

const MOOD_CLASS = {
  dynamic: "therapy-mood-dynamic",
  fluid: "therapy-mood-fluid",
  grounded: "therapy-mood-grounded",
  structural: "therapy-mood-structural",
  vital: "therapy-mood-vital",
  precision: "therapy-mood-precision",
  aligned: "therapy-mood-aligned",
  delicate: "therapy-mood-delicate",
  elevated: "therapy-mood-elevated",
  articulate: "therapy-mood-articulate",
  centered: "therapy-mood-centered",
  assistive: "therapy-mood-assistive",
};

function TherapyChapter({ section, index = 0, id }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const accent = section.accent || "#0ea5e9";
  const chapterNum = String(index + 1).padStart(2, "0");
  const moodClass = MOOD_CLASS[section.mood] || "";

  return (
    <section
      id={id}
      className={`therapy-snap relative py-16 pl-0 pr-0 lg:py-20 lg:pl-[7.5rem] ${moodClass}`}
      style={{ "--chapter-accent": accent }}
    >
      <div className="therapy-chapter-bg" aria-hidden>
        <div
          className="therapy-chapter-orb"
          style={{
            background: accent,
            width: "50vw",
            height: "50vw",
            maxWidth: 560,
            maxHeight: 560,
            top: index % 2 === 0 ? "-18%" : "auto",
            bottom: index % 2 === 0 ? "auto" : "-22%",
            right: index % 2 === 0 ? "-10%" : "auto",
            left: index % 2 === 0 ? "auto" : "-12%",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="therapy-chapter-card overflow-hidden rounded-[36px] border p-6 sm:rounded-[42px] sm:p-8 md:p-10 lg:p-12">
          {/* Top — editorial + anatomy visual (cardiology pattern) */}
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <p className="therapy-text-muted text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
                {chapterNum} · {t("therapy.physioSpecialty")}
              </p>
              <h2
                className="mt-3 text-[clamp(1.85rem,4vw,3.5rem)] font-light leading-[1.06] tracking-[-0.02em] therapy-text-primary"
                style={{ color: index % 3 === 0 ? accent : undefined }}
              >
                {section.title}
              </h2>
              <p className="therapy-text-secondary mt-5 max-w-lg text-sm leading-7 sm:text-base">
                {section.tagline}
              </p>
              <p className="therapy-story mt-4 max-w-md text-xs italic leading-6 sm:text-sm">
                {section.story}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {section.categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="therapy-chip rounded-full px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em]"
                  >
                    {cat}
                  </Link>
                ))}
              </div>

              <Link
                to={therapyShopUrl(section.categories)}
                className="therapy-cta-link group/cta mt-8 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em]"
              >
                {t("therapy.exploreSpecialty")}
                <span className="transition-transform duration-400 group-hover/cta:translate-x-1">→</span>
              </Link>

              <motion.div
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
                style={{ transformOrigin: "left", backgroundColor: accent }}
                className="mt-7 h-[2px] w-28 rounded-full opacity-80"
              />
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="flex items-center justify-center"
            >
              <TherapyAnatomyVisual
                src={section.heroImage || "/cardiology/heart.png"}
                accent={accent}
                alt={t("therapy.visualAlt")}
              />
            </motion.div>
          </div>

          {/* Bottom — grouped product shelves */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            className="therapy-shelf-panel mt-14 rounded-3xl border p-5 sm:mt-16 sm:p-7 lg:p-8"
          >
            <TherapyProductCarousel categories={section.categories} accent={accent} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(TherapyChapter);
