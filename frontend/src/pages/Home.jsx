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
    <div className="trusted-support-ring relative mx-auto h-48 w-48 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
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
              <PremiumStagger className="space-y-4" stagger={0.14} delay={0.2}>
                {categoriesWithCounts.slice(0, 5).map((cat, index) => (
                  <PremiumStaggerItem key={cat.name}>
                    <button
                      type="button"
                      onClick={() => goCategory(cat.query || cat.category || cat.name)}
                      className="home-hero-cat-card w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 dark:bg-zinc-900/90 backdrop-blur-xl border border-white dark:border-white/10 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-500"
                    >
                      <span className="text-3xl font-light" style={{ color: cat.color }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div
                        className="w-16 h-16 rounded-2xl grid place-items-center"
                        style={{ background: `${cat.color}22` }}
                      >
                        <img
                          src={cat.image}
                          onError={(e) => {
                            e.currentTarget.src = "/products/knee.png";
                          }}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">{cat.name}</h3>
                        <p className="home-hero-cat-count text-sm text-gray-500 dark:text-zinc-400">{t("common.productsCount", { count: cat.count })}</p>
                      </div>
                    </button>
                  </PremiumStaggerItem>
                ))}
              </PremiumStagger>

              <div className="home-hero-map-stage relative h-[690px] flex justify-center items-center rounded-[46px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_35px_120px_rgba(15,23,42,0.10)] dark:shadow-[0_35px_120px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="home-hero-map-stage-glow absolute w-[560px] h-[560px] rounded-full bg-cyan-100/40 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="home-hero-map-stage-strip absolute inset-x-20 top-12 h-24 bg-white/70 dark:bg-cyan-500/5 blur-3xl pointer-events-none" />

                <HeroAnatomicalRunner className="rounded-[30px]" />
{/* <video
  autoPlay
  muted
  loop
  playsInline
  className="
  relative z-10
  h-[640px]
  w-full
  object-cover
  rounded-[30px]
  brightness-110
  contrast-110
  saturate-125
  drop-shadow-[0_0_40px_rgba(34,211,238,0.35)]
  "

>
  <source src="/videos/wpp.webm" type="video/webm" />
</video> */}

{/* <div className="relative flex items-center justify-center">
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="h-[500px] w-[500px] rounded-full bg-cyan-400/25 blur-[100px] animate-pulse" />
  </div>

  <div className="absolute h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[80px]" />

  <video
    autoPlay
    muted
    loop
    playsInline
    className="
      relative z-10
      h-[640px]
      w-full
      object-cover
      rounded-[30px]
      brightness-100
      contrast-110
      saturate-125
      drop-shadow-[0_0_40px_rgba(34,211,238,0.35)]
    "
  >
    <source src="/videos/wpp.webm" type="video/webm" />
  </video>

  
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-20 w-[55%] rounded-full bg-cyan-400/20 blur-3xl" />
</div> */}
                {bodyCategories.slice(0, 15).map((cat, index) => {
                  const positions = [
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

                  const [left, top] = positions[index] || ["50%", "50%"];

                  return (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      onClick={() => goCategory(cat.query || cat.category || cat.name)}
                      className="absolute z-20 group"
                      style={{ left, top }}
                      title={cat.name}
                    >
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ background: cat.color }}
                      />
                      <span
                        className="relative w-7 h-7 rounded-full border-2 border-white shadow-lg grid place-items-center text-[10px] font-black text-white transition group-hover:scale-125"
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

              <PremiumStagger className="space-y-4" stagger={0.14} delay={0.35}>
                {categoriesWithCounts.slice(5, 10).map((cat, i) => {
                  const index = i + 5;

                  return (
                    <PremiumStaggerItem key={cat.name}>
                      <button
                        type="button"
                        onClick={() => goCategory(cat.query || cat.category || cat.name)}
                        className="home-hero-cat-card w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 dark:bg-zinc-900/90 backdrop-blur-xl border border-white dark:border-white/10 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-500"
                      >
                        <span className="text-3xl font-light" style={{ color: cat.color }}>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div
                          className="w-16 h-16 rounded-2xl grid place-items-center"
                          style={{ background: `${cat.color}22` }}
                        >
                          <img
                            src={cat.image}
                            onError={(e) => {
                              e.currentTarget.src = "/products/knee.png";
                            }}
                            className="w-14 h-14 object-cover rounded-xl"
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">{cat.name}</h3>
                          <p className="home-hero-cat-count text-sm text-gray-500 dark:text-zinc-400">{t("common.productsCount", { count: cat.count })}</p>
                        </div>
                      </button>
                    </PremiumStaggerItem>
                  );
                })}
              </PremiumStagger>
            </div>

            <PremiumStagger className="mt-10 flex flex-wrap justify-center gap-3" stagger={0.1} delay={0.5}>
              {bodyCategories.slice(10).map((cat, i) => {
                const index = i + 10;

                return (
                  <PremiumStaggerItem key={cat.name}>
                    <button
                      type="button"
                      onClick={() => goCategory(cat.query || cat.category || cat.name)}
                      className="rounded-full px-6 py-3 font-bold shadow-md hover:scale-105 transition duration-500 bg-white/80 backdrop-blur border"
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
        <section className="max-w-[1500px] mx-auto px-6 py-28">
          <PremiumStagger className="grid md:grid-cols-4 gap-5" stagger={0.12}>
            {[
              [t("support.certifiedProducts"), ShieldCheck],
              [t("home.freeShipping"), Truck],
              [t("home.easyReturns"), RotateCcw],
              [t("home.originalMgrm"), BadgeCheck],
            ].map(([label, Icon]) => (
              <PremiumStaggerItem key={label}>
                <div className="card rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 transition duration-500">
                  <Icon className="text-cyan-600" />
                  <b>{label}</b>
                </div>
              </PremiumStaggerItem>
            ))}
          </PremiumStagger>
        </section>


        {/* GLOBAL CERTIFICATIONS */}
<section className="home-trust-cert-section relative max-w-[1450px] mx-auto px-6 py-28 overflow-hidden">
  <div className="home-trust-cert-bg absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 rounded-[48px] transition-colors duration-300" />
  <div className="home-trust-cert-glow-emerald pointer-events-none absolute top-16 right-24 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
  <div className="home-trust-cert-glow-cyan pointer-events-none absolute bottom-10 left-16 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl" />


  <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-20 items-center min-h-[720px]">
    
    {/* LEFT */}
    <div className="overflow-hidden">
      <div className="flex gap-7 w-max marquee-cert py-4">
        {[...certifications, ...certifications].map((item, i) => {
         

          return (
            <motion.div
              key={`${item.title}-${i}`}
              {...cardRevealTransition(i % certifications.length)}
              className="home-trust-cert-card w-[280px] shrink-0 rounded-[34px] bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_25px_70px_rgba(15,23,42,0.10)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-7 group hover:-translate-y-2 transition-all duration-500"
            >

<div
  className={`home-trust-cert-logo rounded-[30px] bg-white dark:bg-zinc-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)] flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-110 transition ${
    item.image.includes("fda.png") ? "w-36 h-36" : "w-28 h-28"
  }`}
>
  <img
    src={item.image}
    alt={item.title}
    className={`object-contain ${
      item.image.includes("fda.png") ? "w-32 h-32" : "w-20 h-20"
    }`}
  />
</div>
              <h3 className="home-trust-cert-title mt-6 text-2xl font-black text-slate-900 dark:text-zinc-100">
                {item.title}
              </h3>

              <p className="home-trust-cert-subtitle mt-3 text-slate-500 dark:text-zinc-400 leading-7">
                {item.subtitle}
              </p>

              <div className="home-trust-cert-verified mt-5 flex items-center gap-2 text-emerald-600 font-black text-sm">
                <CheckCircle2 size={16} />
                {t("home.verifiedStandard")}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>

    {/* RIGHT */}
    <div className="relative">
      <div className="home-trust-cert-panel relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[42px] p-12 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)] border border-white dark:border-white/10 transition-colors duration-300">
        <SectionLabel className="home-trust-cert-label text-emerald-600 dark:text-emerald-400 font-black tracking-[0.25em] text-sm">
          {t("home.trustSafety")}
        </SectionLabel>

        <SectionHeading
          text={t("home.expectBest")}
          className="home-trust-cert-heading text-6xl font-black mt-5 leading-[1] text-slate-900 dark:text-zinc-100"
        />

        <FadeUpText className="home-trust-cert-desc mt-8 text-xl text-slate-500 dark:text-zinc-400 leading-8">
          {t("home.trustCopy")}
        </FadeUpText>

        <div className="mt-8 grid grid-cols-2 gap-4">
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
              className={`home-trust-feature home-trust-feature--${item.tone} flex items-center gap-3 rounded-2xl border-2 px-4 py-4`}
            >
              <div
                className={`home-trust-feature-icon flex h-10 w-10 items-center justify-center rounded-xl ${item.icon}`}
              >
                <CheckCircle2 size={18} />
              </div>

              <span className="home-trust-feature-text text-sm font-bold text-slate-900 dark:text-zinc-100">
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


<section className="home-cardiology-section relative overflow-hidden py-28">

  <div className="relative z-10 mx-auto max-w-[1500px] px-6">

    {/* MAIN CARD */}
    <div
      className="
        rounded-[42px]
         min-h-[760px]
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

        p-8
        shadow-[0_30px_100px_rgba(0,0,0,0.12)]
        dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]

        backdrop-blur-xl
        md:p-12
      "
    >

      {/* TOP */}
      <div className="grid items-center gap-10 lg:grid-cols-2">

        {/* LEFT */}
        <div>

          <SectionHeading
            text={t("home.attention")}
            as="h2"
            className="text-[58px] font-light tracking-wide text-red-500 md:text-6xl"
          />

          <SectionHeading
            text={t("home.cardiologists")}
            as="h3"
            delay={0.15}
            className="mt-2 text-4xl font-light text-slate-900 dark:text-zinc-100 md:text-6xl"
          />

          <FadeUpText
            delay={0.25}
            className="mt-8 max-w-xl text-base leading-8 text-slate-600 dark:text-zinc-400 md:text-lg"
          >
            {t("home.worldClassCopy", { count: bodyTotal })}
          </FadeUpText>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.25 }}
            style={{ transformOrigin: "left center" }}
            className="mt-7 h-[3px] w-[160px] rounded-full bg-red-500"
          />
        </div>

        {/* RIGHT HEART */}
        <div className="relative flex items-center justify-center">

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
              h-[280px]
              w-[280px]
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
              h-[260px]
              cursor-pointer
              object-contain
              transition-all
              duration-500
              md:h-[320px]
            "
          />

        
<svg
  className="
    absolute
    h-[340px]
    w-[340px]
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
      <div className="relative mt-20 overflow-hidden">

        {/* LEFT FADE */}
        <div
          className="
            absolute
            left-0
            top-0
            z-20
            h-full
            w-24

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
            w-24

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
          className="flex w-max gap-7"
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
                h-[150px]
                w-[150px]
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
          mt-20
          flex
          flex-col
          items-center
          justify-between
          gap-8

          border-t
          border-black/10
          border-slate-200 dark:border-white/10

          pt-8
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
            text-sm
            leading-7

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
<section className="home-bandage-section relative max-w-[1450px] mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28 overflow-x-clip overflow-y-visible min-w-0">


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
        <div className="home-bandage-badge inline-flex items-center gap-3 rounded-full border border-white/70 dark:border-white/10 bg-white/65 dark:bg-zinc-900/70 backdrop-blur-2xl px-6 py-3 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-colors duration-300">

          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />

          <span className="home-bandage-badge-label text-[11px] tracking-[0.35em] font-black text-cyan-700 dark:text-cyan-400">
           {t("home.bandageBadge")}
          </span>
        </div>

        {/* TITLE */}

        <h2 className="home-bandage-title mt-6 text-4xl sm:text-5xl md:text-[58px] lg:text-6xl font-black leading-tight text-slate-900 dark:text-zinc-100 transition-colors duration-300 break-words">
          {t("home.bandageTitle1")}
          <br />
          {t("home.bandageTitle2")}
        </h2>

        {/* SUBTITLE */}
        <h3 className="home-bandage-subtitle mt-5 text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent dark:text-cyan-400">
          {t("home.bandageSubtitle")}
        </h3>

        {/* DESC */}
        <p className="home-bandage-desc mt-8 text-lg leading-9 text-slate-600 dark:text-zinc-400 max-w-2xl transition-colors duration-300">
          {t("home.bandageDesc")}
        </p>

        {/* BUTTONS */}
        <div className="mt-12 flex flex-wrap gap-4 sm:gap-5">

          <Link
            to="/shop"
            className="home-bandage-btn-primary group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-7 sm:px-9 py-3.5 sm:py-4 text-white font-black shadow-[0_20px_50px_rgba(34,211,238,0.35)] hover:scale-[1.04] transition duration-300 text-sm sm:text-base"
          >
            <span className="relative z-10">
              {t("home.discoverProducts")}
            </span>

            <span className="absolute inset-0 bg-white/20 scale-x-0 origin-left group-hover:scale-x-100 transition duration-500" />
          </Link>

          <Link
            to="/support"
            className="home-bandage-btn-secondary rounded-full bg-white/78 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-white/10 px-7 sm:px-9 py-3.5 sm:py-4 text-slate-900 dark:text-zinc-100 font-black shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:bg-cyan-500 hover:text-white hover:scale-[1.04] transition duration-300 text-sm sm:text-base"
          >
            {t("home.marquee.partner")}
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-12 sm:mt-16">

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
            className="home-bandage-stat-card home-bandage-stat-pastel rounded-[30px] border-2 p-5 sm:p-7 hover:-translate-y-2 transition-all duration-500 min-w-0"
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
              valueClassName="home-bandage-stat-num text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 dark:text-zinc-100"
              labelClassName="home-bandage-stat-label mt-2 font-semibold text-slate-500 dark:text-zinc-400"
            />
          </motion.div>
        );
        })}
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="home-bandage-visual relative w-full min-w-0 mt-8 lg:mt-0 min-h-[400px] sm:min-h-[520px] lg:min-h-[620px] flex items-center justify-center lg:justify-start lg:-ml-16 overflow-visible">

      {/* MAIN IMAGE CARD — full finger photo with bottom text overlay */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="home-bandage-image-card relative z-10 w-full max-w-[480px] mx-auto lg:mx-0 rounded-[32px] sm:rounded-[42px] overflow-hidden border border-white/70 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-[0_35px_100px_rgba(15,23,42,0.14)] dark:shadow-[0_35px_100px_rgba(0,0,0,0.45)] transition-colors duration-300"
      >

        <div className="home-bandage-image-frame relative h-[400px] sm:h-[520px] lg:h-[580px] overflow-hidden">
          <img
            src="/banners/bandage.png"
            alt={t("home.premiumOrthopedic")}
            className="w-full h-full object-cover object-center"
          />

          <div className="home-bandage-image-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/[0.97] to-transparent pt-24 sm:pt-28 pb-5 sm:pb-7 px-5 sm:px-7">
            <span className="home-bandage-image-label text-[10px] sm:text-xs tracking-[0.22em] sm:tracking-[0.3em] font-black text-[#003262]">
              {t("home.premiumOrthopedic")}
            </span>

            <h3 className="home-bandage-image-title mt-2 sm:mt-2.5 text-2xl sm:text-3xl lg:text-[2.1rem] font-black text-[#003262] leading-tight">
              {t("home.expectBest")}
            </h3>

            <p className="home-bandage-image-desc mt-3 sm:mt-3.5 text-sm sm:text-[0.95rem] text-slate-500 leading-relaxed">
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
  <div className="home-bandage-marquee relative mt-24 overflow-hidden">

    <div className="flex gap-6 w-max marquee-premium">

      {marqueeTags
        .concat(marqueeTags)
        .map((item, i) => (

          <div
            key={i}
            className="home-bandage-tag rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-white/10 px-8 py-4 text-slate-900 dark:text-zinc-100 font-black tracking-wide whitespace-nowrap shadow-[0_15px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:bg-cyan-500 hover:text-white transition duration-300"
          >
            {item}
          </div>
        ))}
    </div>
  </div>
</section>


        {/* BEST SELLERS */}
        <section className="home-trusted-supports-section relative max-w-[1500px] mx-auto mt-24 px-6 pt-28 pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 rounded-[48px] transition-colors duration-300" />

          <div className="relative flex justify-between items-end mb-10">
            <PremiumWordHeader
              label={t("home.bestSellers")}
              title={t("home.mostTrusted")}
              description={t("home.mostTrustedDesc")}
              style="slideLeft"
            />
          </div>

          <PremiumReveal variant={ScaleReveal} className="relative overflow-hidden">
            <div className="flex gap-10 w-max marquee py-4">
              {[...categoriesWithCounts, ...categoriesWithCounts].map((cat, i) => (
                <button
                  key={`${cat.name}-${i}`}
                  onClick={() => goCategory(cat.query || cat.category || cat.name)}
                  className="w-52 shrink-0 text-center group"
                >
                  <TrustedSupportCategoryRing
                    cat={cat}
                    staggerIndex={i % bodyCategories.length}
                  />

                  <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-zinc-100">{cat.name}</h3>
                  <span className="home-trusted-count-pill">{t("common.itemsCount", { count: cat.count })}</span>
                </button>
              ))}
            </div>
          </PremiumReveal>
        </section>

        {/* FEATURED COLLECTIONS */}
        <DeferredSection loader={loadFeaturedCollections} minHeight={760} />

        {/* LOCATE PAIN AREA */}
        <section className="home-locate-pain-section relative max-w-[1500px] mx-auto px-6 py-28">
          <div className="text-center mb-12">
            <p className="home-locate-label text-cyan-600 dark:text-cyan-400 font-black tracking-widest">{t("home.bodySearch")}</p>
            <h2 className="home-locate-heading text-[58px] font-black mt-2 text-slate-900 dark:text-zinc-100">
              {t("home.locatePain")} <span className="highlight">{t("home.painArea")}</span>
            </h2>
            <p className="home-locate-desc text-gray-500 dark:text-zinc-400 mt-3 text-lg">
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

            <div className="home-locate-smart-guide absolute left-8 bottom-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-6 max-w-sm shadow-xl border border-white/50 dark:border-white/10 [data-theme=blue]:bg-white/95">
              <p className="text-cyan-600 dark:text-cyan-400 [data-theme=blue]:text-black font-black text-sm">{t("home.smartGuide")}</p>
              <h3 className="text-3xl font-black mt-1 text-slate-900 dark:text-zinc-100 [data-theme=blue]:text-black">{t("home.findFaster")}</h3>
              <p className="text-gray-500 dark:text-zinc-400 [data-theme=blue]:text-black/80 mt-2">
                {t("home.tapPainPoint")}
              </p>
            </div>
          </div>
        </section>

        {/* SHOP BY ACTIVITY */}
        <DeferredSection loader={loadShopByActivity} minHeight={480} />

        {/* FEATURED PRODUCTS */}
        <section className="home-recommended-section relative max-w-[1500px] mx-auto px-6 py-28 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[#0a1220] dark:via-[#0f1a2e] dark:to-[#0a1628] rounded-[48px] border border-slate-100/80 dark:border-white/10 transition-colors duration-300" />

          <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-10 px-2 sm:px-4">
            <PremiumWordHeader
              label={strategy.startsWith("behavioral") ? t("home.personalized") : t("home.trending")}
              title={t("home.recommended")}
              description={t("home.recommendedDesc")}
              style="slideRight"
              titleClassName="text-4xl sm:text-[58px] font-black mt-2 text-slate-900 dark:text-zinc-100"
            />

            <div className="flex gap-3">
              <button
                onClick={prevProducts}
                className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 shadow-lg grid place-items-center hover:scale-110 hover:bg-cyan-50 dark:hover:bg-zinc-700 transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextProducts}
                className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 shadow-lg grid place-items-center hover:scale-110 hover:bg-cyan-50 dark:hover:bg-zinc-700 transition-all duration-300"
              >
                <ChevronRight size={24} />
              </button>
              <Link
                to="/shop"
                className="btn-primary px-6 py-3 rounded-full font-black shadow-lg"
              >
                {t("common.more")}
              </Link>
            </div>
          </div>

          {recommendationsLoading ? (
            <div className="home-editorial-grid relative px-2 sm:px-4 pb-2">
              {[1, 2, 3, 4].map((x) => (
                <div
                  key={x}
                  className="h-[430px] rounded-[30px] bg-card animate-pulse"
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
            <div className="home-editorial-grid relative px-2 sm:px-4 pb-2">
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
        <section className="max-w-7xl mx-auto px-5 py-28">
          <div className="flex justify-between items-end mb-10">
            <PremiumWordHeader
              label={t("home.learnRecover")}
              title={t("home.healthBlogs")}
              style="fadeUp"
            />

            <div className="flex gap-3">
              <button
                onClick={prevBlogs}
                className="w-12 h-12 rounded-full bg-card shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextBlogs}
                className="w-12 h-12 rounded-full bg-card shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronRight size={24} />
              </button>
              <Link
                to="/blogs"
                className="btn-primary px-6 py-3 rounded-full font-black shadow-lg"
              >
                {t("common.more")}
              </Link>
            </div>
          </div>

          <div className="home-editorial-grid">
            {blogPosts.slice(blogStart, blogStart + 4).map((blog, index) => (
              <BlogCardEditorial key={`${blog.slug}-${index}`} blog={blog} index={index} />
            ))}
          </div>
        </section>


        <section className="relative overflow-hidden py-24">
  {/* Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

  <div className="container mx-auto px-6">
    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Left Content */}
      <div>
        <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
          {t("home.anatomyBadge")}
        </span>

        <h2 className="mt-6 text-5xl font-black leading-tight text-slate-900 dark:text-white">
          {t("home.precisionSupport")}
          <span className="block text-cyan-500">
            {t("home.backedByScience")}
          </span>
        </h2>

        <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          {t("home.anatomyCopy")}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 px-5 py-4">
            <div className="text-3xl font-bold text-cyan-500">30+</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {t("home.yearsExperience")}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-zinc-700 px-5 py-4">
            <div className="text-3xl font-bold text-cyan-500">{formatProductCount(bodyTotal)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {t("home.certifiedProducts")}
            </div>
          </div>
        </div>
      </div>

      {/* Right Video */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-[40px] bg-cyan-500/20 blur-3xl" />

        <div className="relative overflow-hidden rounded-[40px] border border-cyan-500/20 bg-black/40 backdrop-blur-xl">
          <ViewportVideo
            autoPlay
            muted
            loop
            playsInline
            poster="/products/knee2.png"
            sources={[{ src: "/videos/de.mp4", type: "video/mp4" }]}
            className="relative overflow-hidden rounded-[40px] border border-cyan-500/20 bg-black/40 backdrop-blur-xl hover:scale-[1.02] transition-all duration-700"
          />
        </div>
      </div>

    </div>
  </div>
</section>

        {/* ================= PRINT ADS ================= */}
<section className="home-print-ads-section relative max-w-[1500px] mx-auto px-6 mt-24 mb-10 overflow-hidden">


{/* HEADING */}
<div className="text-center mb-14">

  {/* <BrandLogo size="hero" className="home-print-ads-logo mx-auto mt-4" /> */}

  <p className="home-print-ads-subtitle">
    Advanced respiratory & pain relief solutions designed for everyday comfort.
  </p>

</div>

{/* GRID */}
<div className="grid md:grid-cols-2 gap-10 max-w-[1100px] mx-auto">

  {/* CARD 1 */}
  <div className="group relative rounded-[42px] overflow-hidden bg-card border border-white/70 border-slate-200 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500">

    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

    <div className="p-5 sm:p-6">
      <div className="overflow-hidden rounded-[28px] sm:rounded-[36px]">
        <img
          src="/ads/abc.png"
          alt="Nebulizer Ad"
          className="block h-[460px] w-full object-cover transition duration-700 group-hover:scale-[1.05] sm:h-[480px]"
        />
      </div>
    </div>

<div className="absolute top-5 left-5 bg-black/40 backdrop-blur-lg px-4 py-3 rounded-[22px] border border-white/10 animate-[float_5s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

  <h3 className="text-[28px] leading-[1] tracking-[-0.03em] font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
    Breathe Easier
    <br />

    {/* <span className="text-cyan-300">
      NOW
    </span> */}
  </h3>

</div>
  </div>

  {/* CARD 2 */}
  <div className="group relative rounded-[42px] overflow-hidden bg-card border border-white/70 border-slate-200 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500">

    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-lime-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

    <div className="p-5 sm:p-6">
      <div className="overflow-hidden rounded-[28px] sm:rounded-[36px]">
        <img
          src="/ads/def.png"
          alt="Pain Relief Spray"
          className="block h-[460px] w-full object-cover transition duration-700 group-hover:scale-[1.05] sm:h-[480px]"
        />
      </div>
    </div>

<div className="absolute top-5 right-5 text-right bg-black/35 backdrop-blur-lg px-4 py-3 rounded-[22px] border border-white/10 animate-[float_6s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

  <h3 className="text-[28px] leading-[1] tracking-[-0.03em] font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
    Pain Relief
    <br />

    {/* <span className="text-lime-300">
      Naturally
    </span> */}
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