import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBlogBySlug } from "../data/blogData";
import { getBlogArticle, getBlogReadMinutes } from "../data/blog";
import { ArrowLeft, Clock, ShoppingBag } from "lucide-react";
import {
  SectionHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";
import BlogArticleRenderer from "../components/blog/BlogArticleRenderer";

export default function BlogDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] bg-app dark:bg-zinc-950 grid place-items-center">
        <div className="bg-card dark:bg-zinc-900 rounded-3xl p-10 shadow text-center">
          <h1 className="typo-page-title">{t("blogs.notFound")}</h1>
          <Link to="/blogs" className="text-purple-700 font-black mt-4 inline-block">
            {t("blogs.backToBlogs")}
          </Link>
        </div>
      </main>
    );
  }

  const article = getBlogArticle(blog);
  const readMinutes = getBlogReadMinutes(blog);
  const shopQuery = blog.type === "activity" ? blog.activity : blog.category;

  return (
    <main className="blog-detail-page bg-[#f6f7fb] bg-app dark:bg-zinc-950 min-h-screen">
      <section className="max-w-5xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm sm:text-base font-black text-purple-700">
          <ArrowLeft size={18} /> {t("blogs.backToBlogs")}
        </Link>

        <article className="bg-card dark:bg-zinc-900 rounded-[20px] sm:rounded-[34px] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.12)] mt-5 sm:mt-8">
          <div className="relative h-[240px] sm:h-[420px] bg-slate-100 bg-surface-hover">
            <img
              src={blog.coverImage || blog.image}
              onError={(e) => (e.currentTarget.src = "/products/knee.png")}
              className="w-full h-full object-cover"
              alt={blog.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="blog-detail-hero-content absolute left-4 bottom-4 right-4 sm:left-8 sm:bottom-8 sm:right-8 text-white">
              <p className="blog-detail-hero-category text-[10px] sm:text-base font-black tracking-widest text-purple-200">
                {blog.category}
              </p>
              <SectionHeading
                text={blog.title}
                as="h1"
                className="typo-hero-title sm:text-5xl md:text-6xl lg:text-[4.25rem] mt-1.5 sm:mt-3 text-white leading-[1.1] sm:leading-[1.04] tracking-[-0.03em] max-w-4xl"
              />
              <FadeUpText className="blog-detail-hero-excerpt text-white/80 mt-2 sm:mt-3 max-w-2xl text-xs sm:text-lg leading-relaxed">
                {blog.excerpt}
              </FadeUpText>
              <p className="blog-detail-hero-meta mt-2.5 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-white/70">
                <Clock size={14} className="sm:hidden" />
                <Clock size={16} className="hidden sm:block" />
                {t("blogs.minRead", { count: readMinutes })}
              </p>
            </div>
          </div>

          <div className="px-5 py-8 sm:px-8 md:px-14 sm:py-12 md:py-16">
            {article ? (
              <BlogArticleRenderer article={article} />
            ) : (
              <p className="text-sm sm:text-lg text-gray-500 dark:text-zinc-400 leading-relaxed">
                {t("blogs.preparing")}
              </p>
            )}

            <div className="max-w-[42rem] mx-auto mt-10 sm:mt-16 pt-6 sm:pt-10 border-t border-slate-200 dark:border-white/10">
              <Link
                to={`/shop?search=${encodeURIComponent(shopQuery || "")}`}
                className="inline-flex items-center gap-2 bg-purple-700 text-white px-5 py-3 text-sm sm:text-base sm:px-7 sm:py-4 rounded-full font-black hover:bg-purple-800 transition"
              >
                <ShoppingBag size={18} /> {t("blogs.shopRelated")}
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
