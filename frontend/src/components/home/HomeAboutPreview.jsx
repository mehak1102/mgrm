import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  SectionLabel,
  HeroHeading,
  FadeUpText,
} from "../typography/TypographyMotion";
import {
  PremiumStagger,
  PremiumStaggerItem,
  VIEWPORT_PREMIUM,
  FadeUpSlow,
} from "../motion/PremiumMotion";
import "../../theme/home-about-preview.css";

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const CHIPS = [
  "Trusted Recovery",
  "Orthopedic Innovation",
  "Made For Everyday Life",
];

const ORTHO_IMAGE = "/products/orth2.png";
const ORTHO_ACCENT = "/products/knee2.png";
const CITIZEN_PRIMARY =
  "https://cdn.britannica.com/56/148856-004-2F59E2D9/APJ-2008.jpg";
const CITIZEN_SECONDARY =
  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Prime_Minister_Dr._Manmohan_Singh_in_March_2014.jpg";

function PreviewImage({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

export default function HomeAboutPreview() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -20]);
  const frontY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [10, -8]);

  return (
    <section
      ref={sectionRef}
      className="home-about-preview relative max-w-[1500px] mx-auto mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 lg:pb-32"
      aria-labelledby="home-about-preview-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[40px] sm:rounded-[48px] border border-slate-100/80 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)] bg-gradient-to-br from-slate-50/90 via-white/95 to-cyan-50/50 dark:from-zinc-950/95 dark:via-zinc-900/90 dark:to-slate-950/95 [data-theme=blue]:from-[var(--gradient-from)] [data-theme=blue]:via-[var(--gradient-via)] [data-theme=blue]:to-[var(--gradient-to)] shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)] overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-2 w-2 rounded-full bg-cyan-400/30" />
        <div className="absolute bottom-1/3 left-1/5 h-1.5 w-1.5 rounded-full bg-blue-400/25" />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-center min-h-0">
        <motion.div
          className="order-1 lg:order-none relative mx-auto w-full max-w-[540px] lg:max-w-none aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] min-h-[320px] sm:min-h-[380px] lg:min-h-[480px]"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={VIEWPORT_PREMIUM}
          transition={{ duration: 1.35, ease: EASE_LUXURY }}
        >
          {/* Orthopedic cluster — clickable */}
          <motion.div
            style={{ y: backY }}
            className="absolute left-0 top-0 w-[88%] z-10"
          >
            <Link
              to="/about-us#orthopedic-product-categories"
              className="home-about-preview-image-link home-about-preview-image-link--ortho group"
              aria-label="View orthopedic product categories on About Us"
            >
              <div className="home-about-preview-image-cluster relative">
                <div className="home-about-preview-image-frame overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/70 dark:border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.14)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] bg-card w-[82%]">
                  <PreviewImage
                    src={ORTHO_IMAGE}
                    alt="Orthopedic rehabilitation supports"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
                <div className="home-about-preview-image-frame absolute right-0 top-[18%] w-[48%] overflow-hidden rounded-[22px] sm:rounded-[26px] border-2 border-white dark:border-zinc-800 shadow-[0_16px_48px_rgba(15,23,42,0.18)]">
                  <PreviewImage
                    src={ORTHO_ACCENT}
                    alt="Knee support category"
                    className="w-full aspect-square object-cover"
                  />
                </div>
              </div>
            </Link>
            <p className="home-about-preview-image-caption mt-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-zinc-400 pl-1">
              Orthopedic Categories
            </p>
          </motion.div>

          {/* First Citizen cluster — clickable */}
          <motion.div
            style={{ y: frontY }}
            className="absolute left-[4%] right-[2%] bottom-0 h-[52%] z-30"
          >
            <Link
              to="/about-us#first-citizen"
              className="home-about-preview-image-link home-about-preview-image-link--citizen group block h-full"
              aria-label="View First Citizen to the Common Man on About Us"
            >
              <div className="home-about-preview-image-cluster relative h-full">
                <div className="home-about-preview-image-frame absolute left-0 bottom-[8%] w-[54%] overflow-hidden rounded-[24px] sm:rounded-[28px] border border-white/80 dark:border-white/15 shadow-[0_18px_50px_rgba(15,23,42,0.16)] bg-card">
                  <PreviewImage
                    src={CITIZEN_PRIMARY}
                    alt="Trusted by national leaders"
                    className="w-full aspect-[5/4] object-cover object-top"
                  />
                </div>
                <div className="home-about-preview-image-frame absolute right-0 bottom-0 w-[44%] overflow-hidden rounded-[20px] sm:rounded-[24px] border-2 border-white dark:border-zinc-700 shadow-[0_14px_40px_rgba(15,23,42,0.15)]">
                  <PreviewImage
                    src={CITIZEN_SECONDARY}
                    alt="Healthcare leadership trust"
                    className="w-full aspect-[4/5] object-cover object-top"
                  />
                </div>
              </div>
            </Link>
            <p className="home-about-preview-image-caption mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 text-right pr-1">
              First Citizen → Common Man
            </p>
          </motion.div>
        </motion.div>

        <div className="order-2 lg:order-none min-w-0">
          <motion.div
            className="home-about-preview-hero-copy"
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={VIEWPORT_PREMIUM}
            variants={FadeUpSlow}
          >
            <SectionLabel className="home-about-preview-label text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-[var(--text-accent)] font-black tracking-[0.28em] text-xs sm:text-sm">
              OUR JOURNEY
            </SectionLabel>

            <h2
              id="home-about-preview-heading"
              className="home-about-preview-heading mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-[var(--text-primary)]"
            >
              <HeroHeading
                text="Transforming Rehabilitation In India"
                as="span"
                animateOnMount={false}
                className="!inline"
              />
            </h2>

            <FadeUpText className="home-about-preview-body mt-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)] max-w-xl">
              MGRM has supported recovery journeys through orthopedic innovation,
              trusted support systems, and patient-first design — helping everyday
              movement feel possible again.
            </FadeUpText>
          </motion.div>

          <motion.div
            className="home-about-preview-story-block mt-8 sm:mt-10 rounded-[28px] border border-slate-200/80 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)] bg-white/60 dark:bg-zinc-900/50 [data-theme=blue]:bg-[var(--card-bg)] backdrop-blur-sm px-6 sm:px-8 py-6 sm:py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_PREMIUM}
            transition={{ duration: 1.2, ease: EASE_LUXURY, delay: 0.12 }}
          >
            <div className="home-about-preview-micro font-black uppercase tracking-tight text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-[var(--text-primary)]">
              <span className="home-about-preview-label block text-[11px] sm:text-xs tracking-[0.32em] text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-[var(--text-accent)]">
                First Citizen
              </span>
              <span className="home-about-preview-label block text-sm font-semibold normal-case tracking-normal text-slate-400 dark:text-zinc-500 [data-theme=blue]:text-[var(--text-muted)] my-1 pl-0.5">
                to
              </span>
              <span className="home-about-preview-micro-title block text-xl sm:text-2xl leading-none">
                the
              </span>
              <span className="home-about-preview-micro-title block text-2xl sm:text-3xl lg:text-4xl leading-[0.95] mt-0.5 bg-gradient-to-r from-slate-900 via-slate-700 to-cyan-700 dark:from-zinc-100 dark:via-zinc-200 dark:to-cyan-300 [data-theme=blue]:from-[var(--text-primary)] [data-theme=blue]:via-[var(--text-primary)] [data-theme=blue]:to-[var(--text-accent)] bg-clip-text text-transparent">
                Common Man
              </span>
            </div>

            <p className="home-about-preview-body mt-5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)]">
              From trusted medical support systems to everyday recovery solutions —
              MGRM has evolved to make orthopedic care accessible across every stage
              of life.
            </p>
          </motion.div>

          <PremiumStagger
            className="home-about-preview-chips mt-7 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-3"
            stagger={0.1}
            delay={0.18}
          >
            {CHIPS.map((chip) => (
              <PremiumStaggerItem key={chip}>
                <span className="home-about-preview-chip inline-flex items-center gap-2 rounded-full border border-slate-200/90 dark:border-white/12 [data-theme=blue]:border-[var(--border-color)] bg-white/80 dark:bg-zinc-900/70 [data-theme=blue]:bg-[var(--card-elevated)] px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-zinc-200 [data-theme=blue]:text-[var(--text-on-card)] shadow-sm">
                  <span className="home-about-preview-chip-dot text-cyan-500 [data-theme=blue]:text-[var(--text-accent)]" aria-hidden>
                    •
                  </span>
                  {chip}
                </span>
              </PremiumStaggerItem>
            ))}
          </PremiumStagger>

          <motion.div
            className="mt-9 sm:mt-10"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_PREMIUM}
            transition={{ duration: 1.15, ease: EASE_LUXURY, delay: 0.28 }}
          >
            <Link
              to="/about-us"
              className="home-about-preview-cta btn-primary inline-flex items-center gap-2.5 rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-transform duration-500 dark:!bg-white/10 dark:!text-zinc-100 dark:!border dark:!border-white/20 dark:backdrop-blur-md dark:hover:!bg-white/15 dark:hover:shadow-[0_0_32px_rgba(34,211,238,0.18)] [data-theme=blue]:shadow-[0_0_24px_rgba(255,215,0,0.2)] [data-theme=blue]:hover:shadow-[0_0_36px_rgba(255,215,0,0.35)]"
            >
              Read Full Story
              <ArrowRight size={18} className="shrink-0" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
