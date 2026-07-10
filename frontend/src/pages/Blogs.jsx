import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import { HeroHeading, SectionLabel, FadeUpText } from "../components/typography/TypographyMotion";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import {
  FeaturedBlogReveal,
  BlogCardEditorial,
  PremiumReveal,
  FadeUpSlow,
  SlideLeftLuxury,
} from "../components/motion/PremiumMotion";
import { useBlogs } from "../hooks/useBlogs";

const FILTER_IDS = ["all", "bodyPart", "activity"];

export default function Blogs() {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState("bodyPart");
  const {
    featuredBlog,
    bodyPartBlogs,
    activityBlogs,
    stripItems,
    filteredCount,
    showBody,
    showActivity,
  } = useBlogs(filterType);

  const filterLabel = (id) => {
    if (id === "all") return t("blogs.all");
    if (id === "bodyPart") return t("blogs.bodyPart");
    return t("blogs.activity");
  };

  return (
    <main className="blogs-page bg-[#f6f7fb] bg-app dark:bg-zinc-950 min-h-screen">
      <FloatingMedicalBg />

      <div className="relative z-10">
        <PremiumReveal variant={FadeUpSlow}>
          <section className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-white/10 overflow-hidden py-2.5 sm:py-4">
            <div className="blog-strip flex gap-2.5 sm:gap-4 w-max">
              {[...stripItems, ...stripItems].map((item, i) => (
                <Link
                  key={`${item.query}-${i}`}
                  to={`/blogs/${item.slug}`}
                  className="shrink-0 flex items-center gap-2 sm:gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-500"
                >
                  <img
                    src={item.image}
                    onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-contain bg-slate-100 dark:bg-zinc-800 sm:object-cover"
                    alt={item.name}
                    loading="lazy"
                  />
                  <span className="blog-strip-label font-black text-[11px] sm:text-sm text-slate-800 dark:text-zinc-100 whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </PremiumReveal>

        <section className="relative max-w-7xl mx-auto px-5 pt-16 pb-10">
          <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-[100px] pointer-events-none" />

          <PremiumReveal variant={SlideLeftLuxury} className="max-w-4xl">
            <SectionLabel className="typo-label text-purple-700">
              {t("blogs.badge")}
            </SectionLabel>
            <BrandPillBadgeRow className="mt-2" />
            <HeroHeading
              text={t("blogs.title")}
              className="typo-hero-title mt-3 text-slate-900 dark:text-zinc-100"
            />
            <FadeUpText delay={0.35} className="typo-body-lg text-gray-500 dark:text-zinc-400 mt-4 sm:mt-6 max-w-2xl">
              {t("blogs.intro")}
            </FadeUpText>
          </PremiumReveal>

          <div className="hidden md:flex absolute top-16 right-5 items-center gap-3 rounded-2xl bg-card dark:bg-zinc-900 px-5 py-3 shadow-sm font-bold text-gray-500 dark:text-zinc-400">
            {t("blogs.guidesCount", { count: filteredCount })}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 pb-8 flex flex-wrap gap-2">
          {FILTER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilterType(id)}
              className={`rounded-full px-5 py-2.5 text-sm font-black border transition duration-300 ${
                filterType === id
                  ? "bg-purple-700 text-white border-purple-700"
                  : "bg-card border-slate-200 dark:border-white/10 hover:border-purple-300"
              }`}
            >
              {filterLabel(id)}
            </button>
          ))}
        </div>

        {featuredBlog && (
          <section className="max-w-7xl mx-auto px-5 pb-14">
            <FeaturedBlogReveal blog={featuredBlog} />
          </section>
        )}

        {showBody && bodyPartBlogs.length > 0 && (
          <section className="max-w-7xl mx-auto px-5 pb-14">
            <PremiumReveal variant={FadeUpSlow} className="mb-10">
              <SectionLabel className="typo-label text-purple-700">
                {t("blogs.bodyRecovery")}
              </SectionLabel>
              <h2 className="typo-section-title mt-2 text-slate-900 dark:text-zinc-100">
                {t("blogs.bodyGuides")}
              </h2>
            </PremiumReveal>

            <div className="catalog-grid catalog-grid--five">
              {bodyPartBlogs
                .filter((b) => b.slug !== featuredBlog?.slug)
                .map((blog, index) => (
                  <BlogCardEditorial key={blog.slug} blog={blog} index={index} compact />
                ))}
            </div>
          </section>
        )}

        {showActivity && activityBlogs.length > 0 && (
          <section className="max-w-7xl mx-auto px-5 pb-16">
            <PremiumReveal variant={FadeUpSlow} className="mb-10">
              <SectionLabel className="typo-label text-purple-700">
                {t("blogs.lifestyleRecovery")}
              </SectionLabel>
              <h2 className="typo-section-title mt-2 text-slate-900 dark:text-zinc-100">
                {t("blogs.activityGuides")}
              </h2>
            </PremiumReveal>

            <div className="catalog-grid catalog-grid--five">
              {activityBlogs.map((blog, index) => (
                <BlogCardEditorial key={blog.slug} blog={blog} index={index} compact />
              ))}
            </div>
          </section>
        )}

        {filteredCount === 0 && (
          <section className="max-w-7xl mx-auto px-5 pb-16 text-center">
            <p className="text-xl font-black text-slate-700 dark:text-zinc-300">
              {t("blogs.noGuides")}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
