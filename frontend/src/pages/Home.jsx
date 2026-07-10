import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useHomeRecommendations } from "../hooks/useRecommendations";
import { useProductStats } from "../context/ProductStatsContext";
import { trackCategoryClick } from "../utils/recommendationBehavior";
import { splitTextUnits } from "../utils/textUnits";

import { bodyCategories } from "../data/siteData";
import { blogPosts } from "../data/blogData";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import HeroAnatomicalRunner from "../components/HeroAnatomicalRunner";
import ViewportVideo from "../components/media/ViewportVideo";
import "../theme/home-trust-features.css";
import "../theme/home-about-hero.css";
import "../theme/navbar-logo.css";
import DeferredSection from "../components/performance/DeferredSection";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import BrandLogo from "../components/BrandLogo";
import Logo3D from "../components/Logo3D";
import HomeAboutPreview from "../components/home/HomeAboutPreview";
import {
  SectionHeading,
  SectionLabel,
  FadeUpText,
  cardRevealTransition,
  AnimatedStat,
  HeroKineticLine,
  HeroTitleBlock,
} from "../components/typography/TypographyMotion";
import {
  PremiumWordHeader,
  PremiumStagger,
  PremiumStaggerItem,
  ProductRevealCard,
  BlogCardEditorial,
  ScaleReveal,
  PremiumReveal,
  FadeUpSlow,
} from "../components/motion/PremiumMotion";

const loadBodyFlowMap = () => import("../components/BodyFlowMap");
const loadFeaturedCollections = () => import("../components/home/HomeFeaturedCollectionsSection");
const loadShopByActivity = () => import("../components/home/HomeShopByActivitySection");
// const loadSmartSize = () => import("../components/home/HomeSmartSizeSection");
const loadCustomize = () => import("../components/home/HomeCustomizeSection");
const loadTestimonials = () => import("../components/home/HomeTestimonialsSection");
const loadFrequentlyUsedProducts = () => import("../components/home/FrequentlyUsedProducts");

const HERO_TAGLINE_EN = "MGRM medicare products | Braces | Bandage | Splints";

const ABOUT_HERO_LINES_EN = {
  revolutionizing: "Revolutionizing",
  rehabilitation: "Rehabilitation",
  since1994: "Since 1994",
};

function hexToRgbTuple(hex) {
  const n = hex.replace("#", "");
  return `${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}`;
}

const TRUSTED_RING_RADIUS = 48.75;
const TRUSTED_RING_CIRCUMFERENCE = 2 * Math.PI * TRUSTED_RING_RADIUS;

function TrustedSupportCategoryRing({ cat, staggerIndex }) {
  const delay = staggerIndex * 0.06;
  const categoryRgb = hexToRgbTuple(cat.color);
  const reduceMotion = useReducedMotion();

  return (
    <div className="trusted-support-ring relative mx-auto h-28 w-28 sm:h-36 sm:w-36 md:h-48 md:w-48 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay, ease: "easeOut" }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-full bg-white dark:bg-zinc-900"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }}
        >
          <img
            src={cat.image}
            alt={cat.name}
            onError={(e) => {
              e.currentTarget.src = "/products/knee2.png";
            }}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div
          className="trusted-support-ring__glow pointer-events-none absolute inset-0 rounded-full"
          style={{ "--category-rgb": categoryRgb }}
          aria-hidden="true"
        />

        <svg
          className="trusted-support-ring__svg pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle
            className="trusted-support-ring__base"
            cx="50"
            cy="50"
            r={TRUSTED_RING_RADIUS}
            fill="transparent"
            stroke={cat.color}
            strokeWidth="3"
            strokeOpacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
          <motion.circle
            className="trusted-support-ring__draw"
            cx="50"
            cy="50"
            r={TRUSTED_RING_RADIUS}
            fill="transparent"
            stroke={cat.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={TRUSTED_RING_CIRCUMFERENCE}
            strokeDashoffset={TRUSTED_RING_CIRCUMFERENCE}
            vectorEffect="non-scaling-stroke"
            animate={
              reduceMotion
                ? { strokeDashoffset: 0 }
                : { strokeDashoffset: [TRUSTED_RING_CIRCUMFERENCE, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 8, repeat: Infinity, ease: "linear" }
            }
          />
        </svg>
      </motion.div>
    </div>
  );
}

function HomeHeroCategoryCard({ cat, index, onSelect }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => onSelect(cat.query || cat.category || cat.name)}
      className="home-hero-cat-card w-full rounded-2xl lg:rounded-[24px] text-left bg-white/78 dark:bg-zinc-900/90 backdrop-blur-xl border border-white dark:border-white/10 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-500 flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4"
    >
      <span
        className="font-light shrink-0 text-2xl sm:text-3xl"
        style={{ color: cat.color }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className="grid place-items-center shrink-0 rounded-xl lg:rounded-2xl w-11 h-11 sm:w-16 sm:h-16"
        style={{ background: `${cat.color}22` }}
      >
        <img
          src={cat.image}
          onError={(e) => {
            e.currentTarget.src = "/products/knee.png";
          }}
          className="object-contain sm:object-cover rounded-lg lg:rounded-xl w-10 h-10 sm:w-14 sm:h-14"
          alt={cat.name}
        />
      </div>

      <div className="min-w-0">
        <h3 className="font-black text-slate-900 dark:text-zinc-100 text-[13px] sm:text-lg leading-snug line-clamp-2 sm:line-clamp-none">
          {cat.name}
        </h3>
        <p className="home-hero-cat-count text-gray-500 dark:text-zinc-400 text-[11px] sm:text-sm mt-0.5">
          {t("common.productsCount", { count: cat.count })}
        </p>
      </div>
    </button>
  );
}

const HOME_HERO_MAP_POSITIONS = [
  ["58%", "7%"],
  ["45%", "24%"],
  ["58%", "28%"],
  ["55%", "36%"],
  ["47%", "38%"],
  ["53%", "45%"],
  ["61%", "62%"],
  ["58%", "84%"],
  ["43%", "70%"],
  ["51%", "20%"],
  ["52%", "76%"],
  ["41%", "31%"],
  ["45%", "60%"],
  ["54%", "55%"],
  ["49%", "50%"],
];

function HomeHeroMapStage({ compact = false, onCategorySelect }) {
  return (
    <div
      className={`home-hero-map-stage relative flex justify-center items-center bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_35px_120px_rgba(15,23,42,0.10)] dark:shadow-[0_35px_120px_rgba(0,0,0,0.35)] overflow-hidden ${
        compact
          ? "h-[min(58vw,300px)] sm:h-[360px] rounded-[28px]"
          : "h-[690px] rounded-[46px]"
      }`}
    >
      <div
        className={`home-hero-map-stage-glow absolute rounded-full bg-cyan-100/40 dark:bg-cyan-500/10 blur-3xl pointer-events-none ${
          compact ? "w-[280px] h-[280px]" : "w-[560px] h-[560px]"
        }`}
      />
      <div
        className={`home-hero-map-stage-strip absolute top-12 h-24 bg-white/70 dark:bg-cyan-500/5 blur-3xl pointer-events-none ${
          compact ? "inset-x-8" : "inset-x-20"
        }`}
      />

      <HeroAnatomicalRunner className="rounded-[30px]" compact={compact} />

      {bodyCategories.slice(0, 15).map((cat, index) => {
        const [left, top] = HOME_HERO_MAP_POSITIONS[index] || ["50%", "50%"];

        return (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + index * 0.05 }}
            onClick={() => onCategorySelect(cat.query || cat.category || cat.name)}
            className="absolute z-20 group"
            style={{ left, top }}
            title={cat.name}
          >
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: cat.color }}
            />
            <span
              className={`relative rounded-full border-2 border-white shadow-lg grid place-items-center font-black text-white transition group-hover:scale-125 ${
                compact ? "w-5 h-5 text-[8px]" : "w-7 h-7 text-[10px]"
              }`}
              style={{ background: cat.color }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="home-hero-map-tooltip absolute left-8 top-0 whitespace-nowrap rounded-full bg-black/80 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition">
              {cat.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [productStart, setProductStart] = useState(0);
  const [blogStart, setBlogStart] = useState(0);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { products, loading: recommendationsLoading, strategy } =
    useHomeRecommendations({ cart, limit: 12 });
  const {
    categoriesWithCounts,
    bodyTotal,
    formatProductCount,
  } = useProductStats();

  const heroCountLabel = String(bodyTotal);
  const heroText = `${heroCountLabel} ${HERO_TAGLINE_EN}`;
  const heroNumLen = heroCountLabel.length;

  const certifications = [
    {
      title: t("home.certifications.iso.title"),
      subtitle: t("home.certifications.iso.subtitle"),
      image: "/certifications/iso.png",
      glow: "cyan",
    },
    {
      title: t("home.certifications.who.title"),
      subtitle: t("home.certifications.who.subtitle"),
      image: "/certifications/who-gmp.png",
      glow: "emerald",
    },
    {
      title: t("home.certifications.fda.title"),
      subtitle: t("home.certifications.fda.subtitle"),
      image: "/certifications/fda.png",
      glow: "fuchsia",
    },
    {
      title: t("home.certifications.quality.title"),
      subtitle: t("home.certifications.quality.subtitle"),
      image: "/certifications/quality.png",
      glow: "orange",
    },
    {
      title: t("home.certifications.ce.title"),
      subtitle: t("home.certifications.ce.subtitle"),
      image: "/certifications/cee.png",
      glow: "slate",
    },
  ];

  const marqueeTags = [
    t("home.marquee.welcome"),
    t("home.marquee.global"),
    t("home.marquee.expect"),
    t("home.marquee.partner"),
    t("home.marquee.orthopedic"),
    t("home.marquee.medical"),
    t("home.marquee.rehab"),
    t("home.marquee.healthcare"),
    t("home.marquee.quality"),
  ];

const BANDAGE_STAT_PASTELS = [
  {
    bg: "#bae6fd",
    border: "#38bdf8",
    num: "#0c4a6e",
    label: "#0369a1",
    glow: "rgba(14, 165, 233, 0.18)",
  },
  {
    bg: "#ddd6fe",
    border: "#a78bfa",
    num: "#5b21b6",
    label: "#6d28d9",
    glow: "rgba(139, 92, 246, 0.18)",
  },
  {
    bg: "#fed7aa",
    border: "#fb923c",
    num: "#c2410c",
    label: "#ea580c",
    glow: "rgba(251, 146, 60, 0.18)",
  },
];

  const goCategory = (category) => {
    trackCategoryClick(category);
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const nextProducts = () => {
    if (productStart + 4 < products.length) {
      setProductStart(productStart + 4);
    }
  };

  const prevProducts = () => {
    if (productStart - 4 >= 0) {
      setProductStart(productStart - 4);
    }
  };

  const nextBlogs = () => {
    if (blogStart + 4 < blogPosts.length) {
      setBlogStart(blogStart + 4);
    }
  };

  const prevBlogs = () => {
    if (blogStart - 4 >= 0) {
      setBlogStart(blogStart - 4);
    }
  };

  return (
    <main className="relative overflow-hidden bg-app dark:bg-zinc-950 transition-colors duration-300">
      {/* HERO — moved from About Us page */}
      <section className="home-about-hero">
        <div className="home-about-hero__media" aria-hidden>
          <ViewportVideo
            eager
            autoPlay
            muted
            loop
            playsInline
            poster="/products/orth2.png"
            sources={[{ src: "/videos/slow.mp4", type: "video/mp4" }]}
            className="home-about-hero__video"
          />
          <div className="home-about-hero__shade" />
        </div>

        <div className="home-about-hero__content">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-5xl text-center">
              <BrandPillBadgeRow tone="on-dark" className="mb-3 sm:mb-4 justify-center" />
              <div className="about-hero-company-badge mb-5 sm:mb-8 inline-flex max-w-full items-center gap-2 sm:gap-3 rounded-full border border-white/20 bg-white/10 px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-cyan-300" />

                <div className="about-hero-company-badge__text text-sm sm:text-lg md:text-xl font-semibold text-white tracking-widest text-center">
                  <HeroKineticLine
                    text={t("about.companyName")}
                    className="justify-center"
                    delay={0.05}
                  />
                </div>
              </div>

              <HeroTitleBlock
                className="mt-5 sm:mt-8 text-center font-black leading-[0.92] tracking-[-1px] sm:tracking-[-2px] text-white"
                lines={[
                  {
                    text: ABOUT_HERO_LINES_EN.revolutionizing,
                    className:
                      "justify-center text-[clamp(1.75rem,8.5vw,5.5rem)]",
                    delay: 1.05,
                  },
                  {
                    text: ABOUT_HERO_LINES_EN.rehabilitation,
                    className:
                      "justify-center text-[clamp(2rem,9.5vw,6.125rem)]",
                    gradient: true,
                  },
                  {
                    text: ABOUT_HERO_LINES_EN.since1994,
                    className:
                      "justify-center text-[clamp(1.125rem,4.2vw,3.25rem)] tracking-[0.2em] sm:tracking-[0.35em] text-white/85",
                  },
                ]}
              />

              <FadeUpText
                animateOnMount
                delay={3.35}
                className="home-about-hero__copy mt-6 sm:mt-10 mx-auto max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed sm:leading-8 text-gray-200 px-1"
              >
                {t("about.heroCopy")}
              </FadeUpText>
            </div>
          </div>
        </div>
      </section>

      <FloatingMedicalBg />

      <div className="relative z-10">
        {/* HERO */}
        <section className="home-hero-section relative min-h-[92vh] pt-10 pb-20 overflow-hidden">
    
          <ViewportVideo
            eager
            src="/videos/hero.mp4"
            poster="/banners/bandage.png"
            className="home-hero-video absolute inset-0 w-full h-full object-cover opacity-[0.90]"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="home-hero-video-overlay absolute inset-0 bg-gradient-to-b from-white/78 via-white/60 to-white/82 dark:from-slate-950/88 dark:via-slate-950/72 dark:to-slate-950/90 transition-colors duration-500" />

          <div className="home-hero-video-radial absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,167,220,0.16),transparent_45%)]" />

          <div className="relative max-w-[1500px] mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <BrandPillBadgeRow className="mb-2 sm:mb-2.5" />
            </motion.div>

            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="home-hero-title w-max max-w-none text-[clamp(0.8125rem,2.65vw,3.25rem)] leading-[0.95] font-black tracking-tight text-slate-900 dark:text-zinc-100 pt-1 transition-colors duration-300 flex flex-nowrap whitespace-nowrap"
    >
      {splitTextUnits(heroText).map((char, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: 100,
            filter: "blur(14px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            delay: index * 0.07,
            duration: 1.4,
            ease: [0.19, 1, 0.22, 1],
          }}
          className={`inline-block shrink-0 will-change-transform ${
            index < heroNumLen ? "text-red-500 home-hero-num" : "home-hero-tail text-slate-700 dark:text-inherit"
          }`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
            </div>

            <PremiumReveal variant={FadeUpSlow} delay={0.6} className="mt-8 mb-2">
              <SectionLabel className="blue-theme-section-label text-cyan-600 dark:text-cyan-400 font-black tracking-[0.3em] text-sm">
                {t("home.topCategories")}
              </SectionLabel>
            </PremiumReveal>

            <div className="grid lg:grid-cols-[330px_1fr_330px] gap-10 items-center mt-6">
              <PremiumStagger className="space-y-2 sm:space-y-4" stagger={0.14} delay={0.2}>
                {categoriesWithCounts.slice(0, 5).map((cat, index) => (
                  <PremiumStaggerItem key={cat.name}>
                    <HomeHeroCategoryCard cat={cat} index={index} onSelect={goCategory} />
                  </PremiumStaggerItem>
                ))}
              </PremiumStagger>

              <HomeHeroMapStage onCategorySelect={goCategory} />

              <PremiumStagger className="space-y-2 sm:space-y-4" stagger={0.14} delay={0.35}>
                {categoriesWithCounts.slice(5, 10).map((cat, i) => (
                  <PremiumStaggerItem key={cat.name}>
                    <HomeHeroCategoryCard cat={cat} index={i + 5} onSelect={goCategory} />
                  </PremiumStaggerItem>
                ))}
              </PremiumStagger>
            </div>

            <PremiumStagger
              className="mt-6 grid grid-cols-2 gap-2 sm:gap-2.5 lg:mt-10 lg:flex lg:flex-wrap lg:justify-center lg:gap-3"
              stagger={0.1}
              delay={0.5}
            >
              {bodyCategories.slice(10).map((cat, i, arr) => {
                const index = i + 10;
                const isLastOdd = arr.length % 2 === 1 && i === arr.length - 1;

                return (
                  <PremiumStaggerItem
                    key={cat.name}
                    className={`lg:w-auto ${isLastOdd ? "col-span-2 flex justify-center" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => goCategory(cat.query || cat.category || cat.name)}
                      className={`rounded-full font-bold shadow-sm hover:scale-105 transition duration-500 bg-white/80 backdrop-blur border lg:shadow-md ${
                        isLastOdd
                          ? "px-3 py-1.5 text-[10px] sm:text-xs lg:px-6 lg:py-3 lg:text-base"
                          : "w-full px-2.5 py-1.5 text-[10px] sm:text-xs lg:w-auto lg:px-6 lg:py-3 lg:text-base"
                      }`}
                      style={{ borderColor: `${cat.color}66`, color: cat.color }}
                    >
                      {String(index + 1).padStart(2, "0")} &nbsp; {cat.name}
                    </button>
                  </PremiumStaggerItem>
                );
              })}
            </PremiumStagger>
          </div>
        </section>

        <DeferredSection loader={loadBodyFlowMap} minHeight={520} />

        {/* FEATURES */}
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 py-12 md:py-28">
          <PremiumStagger className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5" stagger={0.12}>
            {[
              [t("support.certifiedProducts"), ShieldCheck],
              [t("home.freeShipping"), Truck],
              [t("home.easyReturns"), RotateCcw],
              [t("home.originalMgrm"), BadgeCheck],
            ].map(([label, Icon]) => (
              <PremiumStaggerItem key={label}>
                <div className="card rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-6 flex items-center gap-2 sm:gap-3 md:gap-4 hover:-translate-y-1 transition duration-500 h-full">
                  <Icon className="text-cyan-600 shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <b className="text-[11px] sm:text-sm md:text-base leading-tight">{label}</b>
                </div>
              </PremiumStaggerItem>
            ))}
          </PremiumStagger>
        </section>


        {/* GLOBAL CERTIFICATIONS */}
<section className="home-trust-cert-section relative max-w-[1450px] mx-auto px-4 sm:px-6 py-12 md:py-28 overflow-hidden">
  <div className="home-trust-cert-bg absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 rounded-[28px] sm:rounded-[48px] transition-colors duration-300" />
  <div className="home-trust-cert-glow-emerald pointer-events-none absolute top-16 right-24 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
  <div className="home-trust-cert-glow-cyan pointer-events-none absolute bottom-10 left-16 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl" />


  <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-20 items-center min-h-0 lg:min-h-[720px]">
    
    {/* LEFT */}
    <div className="overflow-hidden">
      <div className="flex gap-3 sm:gap-5 lg:gap-7 w-max marquee-cert py-2 sm:py-4">
        {[...certifications, ...certifications].map((item, i) => {
          const isFda = item.image.includes("fda.png");

          return (
            <motion.div
              key={`${item.title}-${i}`}
              {...cardRevealTransition(i % certifications.length)}
              className="home-trust-cert-card w-[148px] sm:w-[220px] lg:w-[280px] shrink-0 rounded-[20px] sm:rounded-[28px] lg:rounded-[34px] bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:shadow-[0_25px_70px_rgba(15,23,42,0.10)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-3 sm:p-5 lg:p-7 group hover:-translate-y-2 transition-all duration-500"
            >

<div
  className={`home-trust-cert-logo rounded-[18px] sm:rounded-[24px] lg:rounded-[30px] bg-white dark:bg-zinc-800 shadow-[0_12px_30px_rgba(15,23,42,0.10)] sm:shadow-[0_20px_50px_rgba(15,23,42,0.12)] flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-110 transition ${
    isFda ? "w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36" : "w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
  }`}
>
  <img
    src={item.image}
    alt={item.title}
    className={`object-contain ${
      isFda ? "w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 lg:w-32 lg:h-32" : "w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
    }`}
  />
</div>
              <h3 className="home-trust-cert-title mt-3 sm:mt-4 lg:mt-6 text-sm sm:text-lg lg:text-2xl font-black text-slate-900 dark:text-zinc-100 leading-tight">
                {item.title}
              </h3>

              <p className="home-trust-cert-subtitle mt-1.5 sm:mt-2 lg:mt-3 text-[10px] sm:text-xs lg:text-base text-slate-500 dark:text-zinc-400 leading-snug sm:leading-normal lg:leading-7 line-clamp-2 sm:line-clamp-none">
                {item.subtitle}
              </p>

              <div className="home-trust-cert-verified mt-2 sm:mt-3 lg:mt-5 flex items-center gap-1.5 sm:gap-2 text-emerald-600 font-black text-[10px] sm:text-xs lg:text-sm">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                {t("home.verifiedStandard")}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>

    {/* RIGHT */}
    <div className="relative">
      <div className="home-trust-cert-panel relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[28px] sm:rounded-[42px] p-5 sm:p-8 lg:p-12 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)] border border-white dark:border-white/10 transition-colors duration-300">
        <SectionLabel className="home-trust-cert-label text-emerald-600 dark:text-emerald-400 font-black tracking-[0.25em] text-xs sm:text-sm">
          {t("home.trustSafety")}
        </SectionLabel>

        <SectionHeading
          text={t("home.expectBest")}
          className="home-trust-cert-heading text-3xl sm:text-5xl lg:text-6xl font-black mt-3 sm:mt-5 leading-[1] text-slate-900 dark:text-zinc-100"
        />

        <FadeUpText className="home-trust-cert-desc mt-4 sm:mt-6 lg:mt-8 text-sm sm:text-lg lg:text-xl text-slate-500 dark:text-zinc-400 leading-relaxed sm:leading-8">
          {t("home.trustCopy")}
        </FadeUpText>

        <div className="mt-5 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-4">
          {[
            {
              text: t("home.medicalGrade"),
              tone: "emerald",
              icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
            },
            {
              text: t("home.intlStandards"),
              tone: "sky",
              icon: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
            },
            {
              text: t("home.premiumMaterials"),
              tone: "violet",
              icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
            },
            {
              text: t("home.trustedRecovery"),
              tone: "amber",
              icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
            },
          ].map((item) => (
            <div
              key={item.text}
              className={`home-trust-feature home-trust-feature--${item.tone} flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border-2 px-2.5 py-2.5 sm:px-4 sm:py-4`}
            >
              <div
                className={`home-trust-feature-icon flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl ${item.icon}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
              </div>

              <span className="home-trust-feature-text text-[10px] sm:text-sm font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* ================= CARDIOLOGY AWARENESS SECTION ================= */}


<section className="home-cardiology-section relative overflow-hidden py-12 md:py-28">

  <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6">

    {/* MAIN CARD */}
    <div
      className="
        home-cardiology-card
        rounded-[24px] md:rounded-[42px]
        min-h-0 md:min-h-[760px]
        border

        border-black/5
        border-slate-200 dark:border-white/10

        bg-gradient-to-br

        from-[#f8fbff]
        via-[#eef4ff]
        to-[#f3f7ff]
        dark:from-zinc-900
        dark:via-zinc-900
        dark:to-slate-950

        p-4 sm:p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.10)]
        dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]

        backdrop-blur-xl
        md:p-12
        md:shadow-[0_30px_100px_rgba(0,0,0,0.12)]
      "
    >

      {/* TOP */}
      <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-2">

        {/* LEFT */}
        <div>

          <SectionHeading
            text={t("home.attention")}
            as="h2"
            className="text-3xl font-light tracking-wide text-red-500 sm:text-4xl md:text-[58px] lg:text-6xl"
          />

          <SectionHeading
            text={t("home.cardiologists")}
            as="h3"
            delay={0.15}
            className="mt-1 sm:mt-2 text-2xl font-light text-slate-900 dark:text-zinc-100 sm:text-3xl md:text-4xl lg:text-6xl"
          />

          <FadeUpText
            delay={0.25}
            className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-zinc-400 sm:text-base sm:leading-7 md:mt-8 md:text-lg md:leading-8"
          >
            {t("home.worldClassCopy", { count: bodyTotal })}
          </FadeUpText>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.25 }}
            style={{ transformOrigin: "left center" }}
            className="mt-4 h-[2px] w-20 rounded-full bg-red-500 sm:mt-6 md:mt-7 md:h-[3px] md:w-[160px]"
          />
        </div>

        {/* RIGHT HEART */}
        <div className="relative flex items-center justify-center py-2 sm:py-4 md:py-0">

          {/* GLOW */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              h-[140px]
              w-[140px]
              sm:h-[200px]
              sm:w-[200px]
              md:h-[280px]
              md:w-[280px]
              rounded-full
              bg-red-500/30
              blur-3xl
            "
          />

          {/* HEART */}
          <motion.img
            src="/cardiology/heart.png"
            alt="heart"
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            whileHover={{
              scale: 1.08,
              rotate: 2,
              filter:
                'drop-shadow(0px 0px 40px rgba(255,0,0,0.9))',
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            viewport={{ once: true }}
            className="
              relative
              z-10
              h-[130px]
              sm:h-[180px]
              cursor-pointer
              object-contain
              transition-all
              duration-500
              md:h-[260px]
              lg:h-[320px]
            "
          />

        
<svg
  className="
    absolute
    h-[170px]
    w-[170px]
    sm:h-[240px]
    sm:w-[240px]
    md:h-[340px]
    md:w-[340px]
    -rotate-90
  "
  viewBox="0 0 500 500"
>
  <motion.circle
    cx="250"
    cy="250"
    r="160"
    stroke="#ef4444"
    strokeWidth="2.5"
    fill="transparent"
    strokeLinecap="round"

    strokeDasharray="1005"
    strokeDashoffset="1005"

    animate={{
      strokeDashoffset: [1005, 0],
    }}

    transition={{
      duration: 5,
      repeat: Infinity,
      repeatDelay: 0.2,
      ease: 'linear',
    }}
  />
</svg>
        </div>
      </div>

      {/* MOVING PRODUCTS */}
      <div className="relative mt-10 overflow-hidden md:mt-20">

        {/* LEFT FADE */}
        <div
          className="
            absolute
            left-0
            top-0
            z-20
            h-full
            w-12
            sm:w-24

            bg-gradient-to-r

            from-[#f8fbff]
            from-[var(--bg-primary)]

            to-transparent
          "
        />

        {/* RIGHT FADE */}
        <div
          className="
            absolute
            right-0
            top-0
            z-20
            h-full
            w-12
            sm:w-24

            bg-gradient-to-l

            from-[#f3f7ff]
            from-[var(--bg-primary)]

            to-transparent
          "
        />

        {/* TRACK */}
        <motion.div
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max gap-4 md:gap-7"
        >

          {[
            '/products/abdomen2.png',
            '/products/ankle2.png',
            '/products/arm2.png',
            '/products/back2.png',
           
            '/products/calf2.png',
            // '/products/collar2.png',
            '/products/elbow2.png',
            '/products/finger2.png',
            '/products/knee2.png',
            '/products/leg2.png',
            '/products/neck2.png',
            '/products/orth2.png',
           
            '/products/ribs2.png',
            '/products/shoulder2.png',
            '/products/thigh2.png',
            '/products/wrist2.png',

            // duplicate
            '/products/abdomen2.png',
            '/products/ankle2.png',
            '/products/arm2.png',
            '/products/back2.png',
           
            '/products/calf2.png',
            // '/products/collar2.png',
            '/products/elbow2.png',
            '/products/finger2.png',
            '/products/knee2.png',
            '/products/leg2.png',
            '/products/neck2.png',
            '/products/orth2.png',
           
            '/products/ribs2.png',
            '/products/shoulder2.png',
            '/products/thigh2.png',
            '/products/wrist2.png',
          ].map((image, index) => (

            <motion.div
              key={index}
              whileHover={{
                y: -10,
                scale: 1.06,
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                group
                relative
                flex
                h-[88px]
                w-[88px]
                sm:h-[120px]
                sm:w-[120px]
                md:h-[150px]
                md:w-[150px]
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full

                border
                border-black/5
                border-slate-200 dark:border-white/10

                bg-black/[0.03]
                bg-card/50

                backdrop-blur-xl

                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                shadow-[0_15px_50px_rgba(0,0,0,0.25)]
              "
            >

              {/* HOVER GLOW */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-red-500/0
                  blur-2xl
                  transition-all
                  duration-500
                  group-hover:bg-red-500/20
                "
              />

              {/* FLOATING ANIMATION */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3 + (index % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="h-full w-full"
              >

                {/* IMAGE */}
                <img
                  src={image}
                  alt=""
                  className="
                    h-full
                    w-full
                    rounded-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-110
                    group-hover:rotate-2
                  "
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM */}
      <div
        className="
          home-cardiology-brand-footer
          mt-10
          flex
          flex-col
          items-center
          justify-between
          gap-4
          sm:gap-6
          md:mt-20
          md:gap-8

          border-t
          border-black/10
          border-slate-200 dark:border-white/10

          pt-5
          sm:pt-6
          md:pt-8
          md:flex-row
        "
      >

        {/* LOGO */}
        <Logo3D className="home-cardiology-brand-logo shrink-0" />

        {/* LOGO TEXT — replaced with theme logo above
        <div>
          <h3
            className="
              home-cardiology-brand-name
              text-4xl
              font-black
              tracking-wide

              text-slate-900
              dark:text-zinc-100
            "
          >
            MGRM
          </h3>

          <p
            className="
              home-cardiology-brand-tagline
              text-lg
              font-semibold
              tracking-[8px]
              text-red-500
            "
          >
            MEDICARE
          </p>
        </div>
        */}

        {/* DESCRIPTION */}
        <div
          className="
            max-w-xl
            text-center
            text-xs
            leading-6
            sm:text-sm
            sm:leading-7

            text-slate-600
            dark:text-zinc-400

            md:text-right
          "
        >
          {t("home.cardiologyFooterCopy")}
        </div>
      </div>
    </div>
  </div>
</section>
{/* ========================= PREMIUM MGRM SECTION ========================= */}
<section className="home-bandage-section relative max-w-[1450px] mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-28 overflow-x-clip overflow-y-visible min-w-0">


  {/* BACKGROUND */}
  <div className="home-bandage-section-bg absolute inset-0 rounded-[28px] sm:rounded-[40px] lg:rounded-[60px] overflow-hidden">

    <ViewportVideo
      autoPlay
      muted
      loop
      playsInline
      poster="/banners/bandage.png"
      src="/videos/medical-bg.mp4"
      className="w-full h-full object-cover scale-110 opacity-[0.88]"
    />

    {/* cinematic overlay */}
    <div className="home-bandage-section-overlay absolute inset-0 bg-gradient-to-r from-white/82 via-white/38 to-cyan-50/10 dark:from-slate-950/92 dark:via-slate-950/75 dark:to-zinc-900/40 transition-colors duration-500" />

    {/* light effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_38%)]" />

    {/* edge blur */}
    <div className="absolute inset-0 backdrop-blur-[1px]" />
  </div>

  {/* FLOATING BLURS */}
  <div className="absolute top-0 left-0 w-[280px] sm:w-[360px] lg:w-[420px] h-[280px] sm:h-[360px] lg:h-[420px] rounded-full bg-cyan-300/10 blur-[120px]" />
  <div className="absolute bottom-0 right-0 w-[280px] sm:w-[360px] lg:w-[420px] h-[280px] sm:h-[360px] lg:h-[420px] rounded-full bg-blue-300/10 blur-[120px]" />

  {/* CONTENT */}
  <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center min-w-0">

    {/* LEFT SIDE */}
    <div className="home-bandage-copy max-w-3xl min-w-0">

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >

        {/* TOP BADGE */}
        <div className="home-bandage-badge inline-flex items-center gap-2 sm:gap-3 rounded-full border border-white/70 dark:border-white/10 bg-white/65 dark:bg-zinc-900/70 backdrop-blur-2xl px-3 py-1.5 sm:px-6 sm:py-3 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-colors duration-300">

          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-500 animate-pulse" />

          <span className="home-bandage-badge-label text-[8px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.35em] font-black text-cyan-700 dark:text-cyan-400">
           {t("home.bandageBadge")}
          </span>
        </div>

        {/* TITLE */}

        <h2 className="home-bandage-title mt-3 sm:mt-6 text-2xl sm:text-4xl md:text-[58px] lg:text-6xl font-black leading-tight text-slate-900 dark:text-zinc-100 transition-colors duration-300 break-words">
          {t("home.bandageTitle1")}
          <br />
          {t("home.bandageTitle2")}
        </h2>

        {/* SUBTITLE */}
        <h3 className="home-bandage-subtitle mt-2 sm:mt-5 text-base sm:text-xl md:text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent dark:text-cyan-400">
          {t("home.bandageSubtitle")}
        </h3>

        {/* DESC */}
        <p className="home-bandage-desc mt-3 sm:mt-8 text-sm sm:text-lg leading-relaxed sm:leading-9 text-slate-600 dark:text-zinc-400 max-w-2xl transition-colors duration-300">
          {t("home.bandageDesc")}
        </p>

        {/* BUTTONS */}
        <div className="mt-5 sm:mt-12 flex flex-wrap gap-2.5 sm:gap-5">

          <Link
            to="/shop"
            className="home-bandage-btn-primary group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-4 sm:px-9 py-2 sm:py-4 text-white font-black shadow-[0_20px_50px_rgba(34,211,238,0.35)] hover:scale-[1.04] transition duration-300 text-xs sm:text-base"
          >
            <span className="relative z-10">
              {t("home.discoverProducts")}
            </span>

            <span className="absolute inset-0 bg-white/20 scale-x-0 origin-left group-hover:scale-x-100 transition duration-500" />
          </Link>

          <Link
            to="/support"
            className="home-bandage-btn-secondary rounded-full bg-white/78 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-white/10 px-4 sm:px-9 py-2 sm:py-4 text-slate-900 dark:text-zinc-100 font-black shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:bg-cyan-500 hover:text-white hover:scale-[1.04] transition duration-300 text-xs sm:text-base"
          >
            {t("home.marquee.partner")}
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 sm:gap-5 mt-6 sm:mt-16">

        {[
          { value: formatProductCount(bodyTotal), label: t("home.statProducts") },
          { value: "40+", label: t("home.statCountries") },
          { value: "25+", label: t("home.statYears") },
        ].map(({ value, label }, i) => {
          const pastel = BANDAGE_STAT_PASTELS[i % BANDAGE_STAT_PASTELS.length];

          return (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.14, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            className="home-bandage-stat-card home-bandage-stat-pastel rounded-2xl sm:rounded-[30px] border-2 p-2.5 sm:p-7 hover:-translate-y-2 transition-all duration-500 min-w-0"
            style={{
              "--bandage-stat-border": pastel.border,
              "--bandage-stat-num": pastel.num,
              "--bandage-stat-label": pastel.label,
              "--bandage-stat-glow": pastel.glow,
            }}
          >
            <AnimatedStat
              value={value}
              label={label}
              duration={2200 + i * 220}
              valueClassName="home-bandage-stat-num text-xl sm:text-5xl lg:text-[58px] font-black text-slate-900 dark:text-zinc-100"
              labelClassName="home-bandage-stat-label mt-1 sm:mt-2 text-[9px] sm:text-base font-semibold text-slate-500 dark:text-zinc-400 leading-tight"
            />
          </motion.div>
        );
        })}
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="home-bandage-visual relative w-full min-w-0 mt-6 sm:mt-8 lg:mt-0 min-h-[260px] sm:min-h-[520px] lg:min-h-[620px] flex items-center justify-center lg:justify-start lg:-ml-16 overflow-visible">

      {/* MAIN IMAGE CARD — full finger photo with bottom text overlay */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="home-bandage-image-card relative z-10 w-full max-w-[480px] mx-auto lg:mx-0 rounded-[22px] sm:rounded-[42px] overflow-hidden border border-white/70 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-[0_35px_100px_rgba(15,23,42,0.14)] dark:shadow-[0_35px_100px_rgba(0,0,0,0.45)] transition-colors duration-300"
      >

        <div className="home-bandage-image-frame relative h-[260px] sm:h-[520px] lg:h-[580px] overflow-hidden">
          <img
            src="/banners/bandage.png"
            alt={t("home.premiumOrthopedic")}
            className="w-full h-full object-cover object-center"
          />

          <div className="home-bandage-image-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/[0.97] to-transparent pt-14 sm:pt-28 pb-3 sm:pb-7 px-3 sm:px-7">
            <span className="home-bandage-image-label text-[8px] sm:text-xs tracking-[0.18em] sm:tracking-[0.3em] font-black text-[#003262]">
              {t("home.premiumOrthopedic")}
            </span>

            <h3 className="home-bandage-image-title mt-1 sm:mt-2.5 text-lg sm:text-3xl lg:text-[2.1rem] font-black text-[#003262] leading-tight">
              {t("home.expectBest")}
            </h3>

            <p className="home-bandage-image-desc mt-1.5 sm:mt-3.5 text-[11px] sm:text-[0.95rem] text-slate-500 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              {t("home.bandageImageDesc")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* FLOATING CARD — global presence */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="home-bandage-float-card home-bandage-float-card--presence hidden md:block absolute w-52 lg:w-60 rounded-[28px] bg-white dark:bg-white border border-slate-100 dark:border-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.14)] p-4 lg:p-5 transition-colors duration-300 z-20"
      >

        <p className="home-bandage-float-label text-[10px] sm:text-xs font-black tracking-[0.28em] text-[#003262]">
          {t("home.globalPresence")}
        </p>

        <h4 className="home-bandage-stat-num home-bandage-stat-num--highlight mt-1.5 text-3xl lg:text-[2.35rem] font-black text-[#c9a600] leading-none">
          40+
        </h4>

        <p className="home-bandage-float-subtitle mt-1 text-base lg:text-lg font-bold text-[#003262]">
          {t("home.statCountries")}
        </p>

        <p className="home-bandage-float-desc mt-2.5 text-sm leading-6 text-slate-500">
          {t("home.globalPresenceDesc")}
        </p>
      </motion.div>

      {/* FLOATING CARD — WHO-GMP */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="home-bandage-float-card home-bandage-float-card--cert hidden md:block absolute w-56 lg:w-[17.5rem] max-w-[calc(100%-1rem)] rounded-[28px] bg-white dark:bg-white border border-slate-100 dark:border-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.14)] p-4 lg:p-5 transition-colors duration-300 z-20"
      >

        <div className="flex items-center gap-3.5 lg:gap-4">

          <div className="home-bandage-cert-icon w-14 h-14 lg:w-[3.75rem] lg:h-[3.75rem] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/certifications/who-gmp.png"
              alt="WHO-GMP certified"
              className="w-full h-full object-contain p-1"
              loading="lazy"
            />
          </div>

          <div className="min-w-0">
            <h4 className="home-bandage-cert-title text-lg lg:text-2xl font-black text-[#003262] leading-tight">
              WHO-GMP
            </h4>

            <p className="home-bandage-cert-subtitle text-sm text-slate-500 mt-0.5">
              {t("home.certifiedManufacturing")}
            </p>
          </div>
        </div>

        <div className="home-bandage-cert-track mt-4 lg:mt-5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="home-bandage-cert-progress w-[90%] h-full rounded-full bg-[#f5c518]" />
        </div>
      </motion.div>
    </div>
  </div>

  {/* MOVING TAGS */}
  <div className="home-bandage-marquee relative mt-10 sm:mt-24 overflow-hidden">

    <div className="flex gap-3 sm:gap-6 w-max marquee-premium">

      {marqueeTags
        .concat(marqueeTags)
        .map((item, i) => (

          <div
            key={i}
            className="home-bandage-tag rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-white/10 px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-base text-slate-900 dark:text-zinc-100 font-black tracking-wide whitespace-nowrap shadow-[0_15px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:bg-cyan-500 hover:text-white transition duration-300"
          >
            {item}
          </div>
        ))}
    </div>
  </div>
</section>


        {/* BEST SELLERS */}
        <section className="home-trusted-supports-section relative max-w-[1500px] mx-auto mt-12 sm:mt-24 px-4 sm:px-6 pt-12 sm:pt-28 pb-12 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 rounded-[28px] sm:rounded-[48px] transition-colors duration-300" />

          <div className="relative flex justify-between items-end mb-5 sm:mb-10">
            <PremiumWordHeader
              label={t("home.bestSellers")}
              title={t("home.mostTrusted")}
              description={t("home.mostTrustedDesc")}
              style="slideLeft"
              labelClassName="text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-[10px] sm:text-sm"
              titleClassName="text-2xl sm:text-4xl md:text-[58px] font-black mt-1 sm:mt-2 text-slate-900 dark:text-zinc-100 leading-tight"
              descriptionClassName="text-gray-500 dark:text-zinc-400 mt-2 sm:mt-3 max-w-xl text-xs sm:text-base"
            />
          </div>

          <PremiumReveal variant={ScaleReveal} className="relative overflow-hidden">
            <div className="flex gap-4 sm:gap-7 md:gap-10 w-max marquee py-2 sm:py-4">
              {[...categoriesWithCounts, ...categoriesWithCounts].map((cat, i) => (
                <button
                  key={`${cat.name}-${i}`}
                  onClick={() => goCategory(cat.query || cat.category || cat.name)}
                  className="w-28 sm:w-40 md:w-52 shrink-0 text-center group"
                >
                  <TrustedSupportCategoryRing
                    cat={cat}
                    staggerIndex={i % bodyCategories.length}
                  />

                  <h3 className="mt-2 sm:mt-5 text-sm sm:text-xl font-black text-slate-900 dark:text-zinc-100 leading-tight">{cat.name}</h3>
                  <span className="home-trusted-count-pill text-[10px] sm:text-sm">{t("common.itemsCount", { count: cat.count })}</span>
                </button>
              ))}
            </div>
          </PremiumReveal>
        </section>

        {/* FEATURED COLLECTIONS */}
        <DeferredSection loader={loadFeaturedCollections} minHeight={760} />

        {/* LOCATE PAIN AREA */}
        <section className="home-locate-pain-section relative max-w-[1500px] mx-auto px-4 sm:px-6 py-12 sm:py-28">
          <div className="text-center mb-6 sm:mb-12">
            <p className="home-locate-label text-cyan-600 dark:text-cyan-400 font-black tracking-wider sm:tracking-widest text-[10px] sm:text-sm">{t("home.bodySearch")}</p>
            <h2 className="home-locate-heading text-2xl sm:text-4xl md:text-[58px] font-black mt-1 sm:mt-2 text-slate-900 dark:text-zinc-100 leading-tight">
              {t("home.locatePain")} <span className="highlight">{t("home.painArea")}</span>
            </h2>
            <p className="home-locate-desc text-gray-500 dark:text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-lg">
              {t("home.locatePainDesc")}
            </p>
          </div>

          <div className="relative rounded-[42px] overflow-hidden shadow-[0_35px_100px_rgba(15,23,42,0.18)]">
            <img
              src="/products/pain.png"
              onError={(e) => {
                e.currentTarget.src = "/products/body-blue.png";
              }}
              className="w-full h-[760px] object-contain bg-card"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/50 via-transparent to-blue-950/35" />

            {[
              bodyCategories.find((c) => c.query === "Neck"),
              bodyCategories.find((c) => c.query === "Shoulder"),
              bodyCategories.find((c) => c.query === "Arm"),
              bodyCategories.find((c) => c.query === "Abdominal"),
              bodyCategories.find((c) => c.query === "Thigh"),
              bodyCategories.find((c) => c.query === "Knee"),
              bodyCategories.find((c) => c.query === "Shin And Calf"),
              bodyCategories.find((c) => c.query === "Ankle And Foot"),
              bodyCategories.find((c) => c.query === "Leg"),
              bodyCategories.find((c) => c.query === "Back"),
            ]
              .filter(Boolean)
              .map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => goCategory(cat.query || cat.category || cat.name)}
                  className="home-pain-pin absolute group"
                  style={{
                    left: ["50%", "46%", "58%", "52%", "44%", "55%", "54%", "55%", "45%", "51%"][i],
                    top: ["12%", "26%", "30%", "43%", "56%", "63%", "77%", "90%", "69%", "20%"][i],
                  }}
                  title={cat.name}
                >
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-40"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="relative w-12 h-12 rounded-full border-2 border-white shadow-xl grid place-items-center text-white text-xs font-black group-hover:scale-125 transition"
                    style={{ background: cat.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="home-pain-tooltip absolute left-14 top-1 whitespace-nowrap bg-card text-slate-900 dark:text-zinc-100 rounded-full px-4 py-2 font-bold text-sm opacity-0 group-hover:opacity-100 transition shadow-lg">
                    {cat.name}
                  </span>
                </button>
              ))}

            <div className="home-locate-smart-guide absolute left-3 bottom-3 sm:left-8 sm:bottom-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 max-w-[11rem] sm:max-w-sm shadow-xl border border-white/50 dark:border-white/10 [data-theme=blue]:bg-white/95">
              <p className="text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-black font-black text-[10px] sm:text-sm">{t("home.smartGuide")}</p>
              <h3 className="text-base sm:text-3xl font-black mt-0.5 sm:mt-1 text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-black leading-tight">{t("home.findFaster")}</h3>
              <p className="text-gray-500 dark:text-zinc-400 [data-theme=blue]:text-black/80 mt-1 sm:mt-2 text-[11px] sm:text-base leading-snug">
                {t("home.tapPainPoint")}
              </p>
            </div>
          </div>
        </section>

        {/* SHOP BY ACTIVITY */}
        <DeferredSection loader={loadShopByActivity} minHeight={480} />

        {/* FEATURED PRODUCTS */}
        <section className="home-recommended-section relative max-w-[1500px] mx-auto px-4 sm:px-6 py-12 sm:py-28 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[#0a1220] dark:via-[#0f1a2e] dark:to-[#0a1628] rounded-[28px] sm:rounded-[48px] border border-slate-100/80 dark:border-white/10 transition-colors duration-300" />

          <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 sm:gap-6 mb-6 sm:mb-10 px-1 sm:px-4">
            <PremiumWordHeader
              label={strategy.startsWith("behavioral") ? t("home.personalized") : t("home.trending")}
              title={t("home.recommended")}
              description={t("home.recommendedDesc")}
              style="slideRight"
              labelClassName="text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-[10px] sm:text-sm"
              titleClassName="text-2xl sm:text-4xl md:text-[58px] font-black mt-1 sm:mt-2 text-slate-900 dark:text-zinc-100 leading-tight"
              descriptionClassName="text-gray-500 dark:text-zinc-400 mt-2 sm:mt-3 max-w-xl text-xs sm:text-base"
            />

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={prevProducts}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 shadow-lg grid place-items-center hover:scale-110 hover:bg-cyan-50 dark:hover:bg-zinc-700 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextProducts}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 shadow-lg grid place-items-center hover:scale-110 hover:bg-cyan-50 dark:hover:bg-zinc-700 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <Link
                to="/shop"
                className="btn-primary px-4 py-2 sm:px-6 sm:py-3 rounded-full font-black shadow-lg text-xs sm:text-base"
              >
                {t("common.more")}
              </Link>
            </div>
          </div>

          {recommendationsLoading ? (
            <div className="home-editorial-grid relative px-1 sm:px-4 pb-2">
              {[1, 2, 3, 4].map((x) => (
                <div
                  key={x}
                  className="h-[220px] sm:h-[430px] rounded-[20px] sm:rounded-[30px] bg-card animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-card dark:bg-zinc-900 rounded-3xl px-6 py-12 text-center mx-2 sm:mx-4">
              <p className="text-gray-500 dark:text-zinc-400">
                {t("home.noRecommendations")}
              </p>
            </div>
          ) : (
            <div className="home-editorial-grid relative px-1 sm:px-4 pb-2">
              {products.slice(productStart, productStart + 4).map((p, i) => (
                <ProductRevealCard key={p._id} index={i}>
                  <ProductCard product={p} pastelIndex={i} />
                </ProductRevealCard>
              ))}
            </div>
          )}
        </section>

        {/* <DeferredSection loader={loadSmartSize} minHeight={560} /> */}
        <DeferredSection loader={loadCustomize} minHeight={720} />
        <DeferredSection loader={loadTestimonials} minHeight={520} />

        {/* BLOGS */}
        <section className="home-blogs-section max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-28">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-6 sm:mb-10">
            <PremiumWordHeader
              label={t("home.learnRecover")}
              title={t("home.healthBlogs")}
              style="fadeUp"
              labelClassName="text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-[10px] sm:text-sm"
              titleClassName="text-2xl sm:text-4xl md:text-[58px] font-black mt-1 sm:mt-2 text-slate-900 dark:text-zinc-100 leading-tight"
            />

            <div className="flex gap-2 sm:gap-3 shrink-0 self-end">
              <button
                onClick={prevBlogs}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-card shadow-lg grid place-items-center hover:scale-110 transition"
                aria-label={t("common.previous")}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextBlogs}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-card shadow-lg grid place-items-center hover:scale-110 transition"
                aria-label={t("common.next")}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <Link
                to="/blogs"
                className="btn-primary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full font-black shadow-lg"
              >
                {t("common.more")}
              </Link>
            </div>
          </div>

          <div className="home-editorial-grid px-0.5 sm:px-0">
            {blogPosts.slice(blogStart, blogStart + 4).map((blog, index) => (
              <BlogCardEditorial key={`${blog.slug}-${index}`} blog={blog} index={index} compact />
            ))}
          </div>
        </section>


        <section className="home-anatomy-section relative overflow-hidden py-12 sm:py-24 pb-16 sm:pb-24">
  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

  <div className="container mx-auto px-4 sm:px-6">
    <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">

      {/* Left Content */}
      <div>
        <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-medium text-cyan-400">
          {t("home.anatomyBadge")}
        </span>

        <h2 className="mt-3 sm:mt-6 text-2xl sm:text-5xl font-black leading-tight text-slate-900 dark:text-white">
          {t("home.precisionSupport")}
          <span className="block text-cyan-500">
            {t("home.backedByScience")}
          </span>
        </h2>

        <p className="mt-3 sm:mt-6 text-sm sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {t("home.anatomyCopy")}
        </p>

        <div className="mt-4 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-4">
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-zinc-700 px-3.5 py-2.5 sm:px-5 sm:py-4">
            <div className="text-xl sm:text-3xl font-bold text-cyan-500">30+</div>
            <div className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
              {t("home.yearsExperience")}
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-zinc-700 px-3.5 py-2.5 sm:px-5 sm:py-4">
            <div className="text-xl sm:text-3xl font-bold text-cyan-500">{formatProductCount(bodyTotal)}</div>
            <div className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
              {t("home.certifiedProducts")}
            </div>
          </div>
        </div>
      </div>

      {/* Right Video */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-[40px] bg-cyan-500/20 blur-3xl" />

        <div className="relative overflow-hidden rounded-2xl sm:rounded-[40px] border border-cyan-500/20 bg-black/40 backdrop-blur-xl">
          <ViewportVideo
            autoPlay
            muted
            loop
            playsInline
            poster="/products/knee2.png"
            sources={[{ src: "/videos/de.mp4", type: "video/mp4" }]}
            className="relative overflow-hidden rounded-2xl sm:rounded-[40px] border border-cyan-500/20 bg-black/40 backdrop-blur-xl hover:scale-[1.02] transition-all duration-700"
          />
        </div>
      </div>

    </div>
  </div>
</section>

        {/* ================= PRINT ADS ================= */}
<section className="home-print-ads-section relative max-w-[1500px] mx-auto px-4 sm:px-6 mt-12 sm:mt-24 mb-6 sm:mb-10 pb-16 sm:pb-10 overflow-hidden">


{/* HEADING */}
<div className="text-center mb-6 sm:mb-14">

  {/* <BrandLogo size="hero" className="home-print-ads-logo mx-auto mt-4" /> */}

  <p className="home-print-ads-subtitle">
    Advanced respiratory & pain relief solutions designed for everyday comfort.
  </p>

</div>

{/* GRID */}
<div className="home-print-ads-grid grid grid-cols-2 gap-2 sm:gap-6 md:gap-10 max-w-[1100px] mx-auto">

  {/* CARD 1 */}
  <div className="group relative rounded-xl sm:rounded-[42px] overflow-hidden bg-card border border-white/70 border-slate-200 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500">

    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

    <div className="p-2 sm:p-5 md:p-6">
      <div className="overflow-hidden rounded-lg sm:rounded-[28px] md:rounded-[36px]">
        <img
          src="/ads/abc.png"
          alt="Nebulizer Ad"
          className="home-print-ads-image block w-full h-auto object-contain transition duration-700 group-hover:scale-[1.02] sm:group-hover:scale-[1.05]"
        />
      </div>
    </div>

<div className="home-print-ads-badge absolute top-2 left-2 sm:top-5 sm:left-5 bg-black/40 backdrop-blur-lg px-2 py-1 sm:px-4 sm:py-3 rounded-lg sm:rounded-[22px] border border-white/10 animate-[float_5s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

  <h3 className="text-[10px] sm:text-[28px] leading-tight sm:leading-[1] tracking-[-0.03em] font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
    Breathe Easier
  </h3>

</div>
  </div>

  {/* CARD 2 */}
  <div className="group relative rounded-xl sm:rounded-[42px] overflow-hidden bg-card border border-white/70 border-slate-200 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500">

    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-lime-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

    <div className="p-2 sm:p-5 md:p-6">
      <div className="overflow-hidden rounded-lg sm:rounded-[28px] md:rounded-[36px]">
        <img
          src="/ads/def.png"
          alt="Pain Relief Spray"
          className="home-print-ads-image block w-full h-auto object-contain transition duration-700 group-hover:scale-[1.02] sm:group-hover:scale-[1.05]"
        />
      </div>
    </div>

<div className="home-print-ads-badge absolute top-2 right-2 sm:top-5 sm:right-5 text-right bg-black/35 backdrop-blur-lg px-2 py-1 sm:px-4 sm:py-3 rounded-lg sm:rounded-[22px] border border-white/10 animate-[float_6s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

  <h3 className="text-[10px] sm:text-[28px] leading-tight sm:leading-[1] tracking-[-0.03em] font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
    Pain Relief
  </h3>

</div>
  </div>

</div>
</section>

        <DeferredSection loader={loadFrequentlyUsedProducts} minHeight={720} />
        <HomeAboutPreview />
      </div>
    </main>
  );
}