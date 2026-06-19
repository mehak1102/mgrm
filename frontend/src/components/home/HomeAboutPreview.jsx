import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  SectionLabel,
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
const DURATION = 1.4;

const CARD_REVEAL = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE_LUXURY, delay },
  }),
};

const TRUST_CARD_REVEAL = {
  duration: 0.9,
  ease: EASE_LUXURY,
  stagger: 0.2,
};

const TRUSTED_CARDS = [
  {
    title: "Indian Armed Forces",
    image:
      "https://images.unsplash.com/photo-1737996159880-84645414d1db?q=80&w=1200&auto=format&fit=crop",
    href: "/about-us#section-1",
  },
  {
    title: "NDMA Recognition",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfNpw2cQhzbDKfrjS3KGV_9QHJrWAOKEG_kA&s",
    href: "/about-us#section-1",
  },
  {
    title: "Healthcare Innovation",
    image: "https://etimg.etb2bimg.com/photo/123819552.cms",
    href: "/about-us#section-1",
  },
  {
    title: "National Quality Awards",
    image:
      "https://images.unsplash.com/photo-1697209868660-c5991488f7b1?q=80&w=1200&auto=format&fit=crop",
    href: "/about-us#section-1",
  },
];

const CITIZEN_PORTRAITS = [
  {
    name: "Dr A P J Abdul Kalam",
    image:
      "https://cdn.britannica.com/56/148856-004-2F59E2D9/APJ-2008.jpg",
  },
  {
    name: "Dr Manmohan Singh",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Prime_Minister_Dr._Manmohan_Singh_in_March_2014.jpg",
  },
];

const TIMELINE = [
  { year: "1994", label: "MGRM Incorporated", href: "/about-us#section-3" },
  { year: "1995", label: "Manufacturing Started", href: "/about-us#section-3" },
  { year: "1997", label: "US FDA Registration", href: "/about-us#section-3" },
  { year: "2005", label: "WHO GMP Certified", href: "/about-us#section-3" },
  { year: "2007", label: "NDMA Expert Committee", href: "/about-us#section-3" },
  { year: "2008", label: "NDMA Steering Committee", href: "/about-us#section-3" },
];

const CHIPS = [
  { label: "Trusted Recovery", icon: "✓" },
  { label: "Orthopedic Innovation", icon: "⚡" },
  { label: "Made For Everyday Life", icon: "◎" },
];

const CITIZEN_COPY =
  "From trusted medical support systems to everyday recovery solutions — MGRM has evolved to make orthopedic care accessible across every stage of life.";

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

function PreviewTimeline({ reduce }) {
  return (
    <div className="home-about-preview-timeline mt-6 sm:mt-7">
      <Link
        to="/about-us#section-3"
        className={`home-about-preview-timeline-link${
          reduce ? " home-about-preview-timeline-link--static" : " home-about-preview-timeline-link--loop"
        }`}
        aria-label="View MGRM timeline on About Us"
      >
        <div className="home-about-preview-timeline-rail" aria-hidden>
          <div className="home-about-preview-timeline-line-track" />
          <div className="home-about-preview-timeline-line-draw" />
        </div>

        <div className="home-about-preview-timeline-points">
          {TIMELINE.map((item) => (
            <div key={item.year} className="home-about-preview-timeline-point">
              <span className="home-about-preview-timeline-dot" aria-hidden />
              <span className="home-about-preview-timeline-year">{item.year}</span>
              <span className="home-about-preview-timeline-label">{item.label}</span>
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}

export default function HomeAboutPreview() {
  const reduce = useReducedMotion();

  return (
    <section
      className="home-about-preview relative max-w-[1500px] mx-auto mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-28 lg:pb-32"
      aria-labelledby="home-about-preview-heading"
    >
      {/* Depth background */}
      <div className="home-about-preview-bg" aria-hidden>
        <div className="home-about-preview-bg-layer home-about-preview-bg-layer--1" />
        <div className="home-about-preview-bg-layer home-about-preview-bg-layer--2" />
        <div className="home-about-preview-bg-layer home-about-preview-bg-layer--3" />
        <div className="home-about-preview-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`home-about-preview-particle home-about-preview-particle--${(i % 4) + 1}`} />
          ))}
        </div>
      </div>

      <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-14 xl:gap-16 items-start min-h-0">
        {/* LEFT — immersive story collage */}
        <div className="home-about-preview-visual order-1 lg:order-none w-full max-w-[580px] lg:max-w-none mx-auto">
          <motion.p
            className="home-about-preview-visual-label text-[10px] sm:text-[11px] font-black uppercase tracking-[0.32em] text-slate-500 dark:text-zinc-400 mb-4 sm:mb-5"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_PREMIUM}
            transition={{ duration: DURATION, ease: EASE_LUXURY }}
          >
            Trusted Across India
          </motion.p>

          <div className="home-about-preview-trust-strip">
            {TRUSTED_CARDS.map((card, index) => (
              <motion.div
                key={card.title}
                className="home-about-preview-trust-card-wrap"
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={VIEWPORT_PREMIUM}
                transition={{
                  duration: TRUST_CARD_REVEAL.duration,
                  ease: TRUST_CARD_REVEAL.ease,
                  delay: index * TRUST_CARD_REVEAL.stagger,
                }}
              >
                <Link
                  to={card.href}
                  className="home-about-preview-trust-card group"
                  aria-label={`${card.title} — view on About Us`}
                >
                  <PreviewImage
                    src={card.image}
                    alt=""
                    className="home-about-preview-trust-img"
                  />
                  <div className="home-about-preview-trust-overlay" aria-hidden />
                  <div className="home-about-preview-trust-content">
                    <h3 className="text-xs sm:text-sm font-bold leading-snug text-white">
                      {card.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* First Citizen — portraits only */}
          <motion.div
            className="home-about-preview-citizen-strip mt-6 sm:mt-7"
            custom={0.45}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={VIEWPORT_PREMIUM}
            variants={CARD_REVEAL}
          >
            <Link
              to="/about-us#first-citizen"
              className="home-about-preview-citizen-link group"
              aria-label="First Citizen to the Common Man — view on About Us"
            >
              <div className="home-about-preview-citizen-portraits">
                <div className="home-about-preview-citizen-portrait home-about-preview-citizen-portrait--left">
                  <PreviewImage
                    src={CITIZEN_PORTRAITS[0].image}
                    alt={CITIZEN_PORTRAITS[0].name}
                    className="home-about-preview-citizen-img"
                  />
                </div>
                <div className="home-about-preview-citizen-portrait home-about-preview-citizen-portrait--center">
                  <PreviewImage
                    src={CITIZEN_PORTRAITS[1].image}
                    alt={CITIZEN_PORTRAITS[1].name}
                    className="home-about-preview-citizen-img"
                  />
                </div>
              </div>
            </Link>

            <PreviewTimeline reduce={reduce} />
          </motion.div>
        </div>

        {/* RIGHT — editorial journey copy */}
        <div className="order-2 lg:order-none min-w-0 lg:pt-2">
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
              className="home-about-preview-heading mt-5 text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black leading-[0.92] tracking-[-0.02em] text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-[var(--text-primary)]"
            >
              <span className="block">Transforming</span>
              <span className="block">Rehabilitation</span>
              <span className="block">In India</span>
            </h2>

            <FadeUpText className="home-about-preview-body mt-7 sm:mt-8 text-base sm:text-lg lg:text-xl leading-[1.75] text-slate-600 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)] max-w-[620px]">
              MGRM has supported recovery journeys through orthopedic innovation,
              trusted support systems, and patient-first design — helping everyday
              movement feel possible again.
            </FadeUpText>
          </motion.div>

          <motion.div
            className="home-about-preview-story-accent mt-10 sm:mt-12 flex gap-5 sm:gap-6"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_PREMIUM}
            transition={{ duration: DURATION, ease: EASE_LUXURY, delay: 0.14 }}
          >
            <div className="home-about-preview-accent-line shrink-0" aria-hidden />
            <div className="home-about-preview-story-copy min-w-0">
              <div className="home-about-preview-micro font-black uppercase tracking-tight text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-[var(--text-primary)]">
                <span className="home-about-preview-label block text-[11px] sm:text-xs tracking-[0.32em] text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-[var(--text-accent)]">
                  First Citizen
                </span>
                <span className="home-about-preview-label block text-xs sm:text-sm font-semibold normal-case tracking-normal text-slate-400 dark:text-zinc-500 [data-theme=blue]:text-[var(--text-muted)] my-1">
                  to
                </span>
                <span className="home-about-preview-micro-title block text-xl sm:text-2xl lg:text-[1.65rem] leading-none tracking-tight uppercase">
                  The Common Man
                </span>
              </div>
              <p className="home-about-preview-body mt-4 sm:mt-5 text-sm sm:text-base leading-[1.75] text-slate-600 dark:text-zinc-400 [data-theme=blue]:text-[var(--text-secondary)] max-w-[620px]">
                {CITIZEN_COPY}
              </p>
            </div>
          </motion.div>

          <PremiumStagger
            className="home-about-preview-chips mt-9 sm:mt-10 flex flex-wrap gap-3"
            stagger={0.1}
            delay={0.2}
          >
            {CHIPS.map((chip) => (
              <PremiumStaggerItem key={chip.label}>
                <span className="home-about-preview-pill">
                  <span className="home-about-preview-pill-icon" aria-hidden>
                    {chip.icon}
                  </span>
                  {chip.label}
                </span>
              </PremiumStaggerItem>
            ))}
          </PremiumStagger>

          <motion.div
            className="mt-10 sm:mt-12"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_PREMIUM}
            transition={{ duration: DURATION, ease: EASE_LUXURY, delay: 0.32 }}
          >
            <Link
              to="/about-us"
              className="home-about-preview-cta btn-primary inline-flex items-center gap-2.5 rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-transform duration-500 dark:!bg-white/10 dark:!text-zinc-100 dark:!border dark:!border-white/20 dark:backdrop-blur-md dark:hover:!bg-white/15 dark:hover:shadow-[0_0_32px_rgba(34,211,238,0.18)]"
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
