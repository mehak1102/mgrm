import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import { HeroHeading, SectionLabel, FadeUpText } from "../components/typography/TypographyMotion";
import {
  FeaturedBlogReveal,
  BlogCardEditorial,
  PremiumReveal,
  FadeUpSlow,
  SlideLeftLuxury,
} from "../components/motion/PremiumMotion";

const featuredBlog = blogPosts[0];
const remainingBlogs = blogPosts.slice(1);

export default function Blogs() {
  return (
    <main className="bg-[#f6f7fb] bg-app dark:bg-zinc-950 min-h-screen">
      <FloatingMedicalBg />

      <div className="relative z-10">
        {/* Category strip */}
        <PremiumReveal variant={FadeUpSlow}>
          <section className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-white/10 overflow-hidden py-4">
            <div className="blog-strip flex gap-4 w-max">
              {[...blogPosts, ...blogPosts].map((item, i) => (
                <Link
                  key={`${item.slug}-${i}`}
                  to={`/blogs/${item.slug}`}
                  className="shrink-0 flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-500"
                >
                  <img
                    src={item.image}
                    onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                    className="w-11 h-11 rounded-full object-cover"
                    alt={item.category}
                  />
                  <span className="font-black text-sm text-slate-800 dark:text-zinc-100">
                    {item.category}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </PremiumReveal>

        {/* Editorial hero */}
        <section className="relative max-w-7xl mx-auto px-5 pt-16 pb-10">
          <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-[100px] pointer-events-none" />

          <PremiumReveal variant={SlideLeftLuxury} className="max-w-4xl">
            <SectionLabel className="text-purple-700 font-black tracking-[0.35em] text-sm">
              MGRM HEALTH JOURNAL
            </SectionLabel>
            <HeroHeading
              text="Recovery Guides & Expert Insights"
              className="text-5xl md:text-7xl font-black mt-4 leading-[1.02] text-slate-900 dark:text-zinc-100"
            />
            <FadeUpText delay={0.35} className="text-gray-500 dark:text-zinc-400 mt-6 text-lg max-w-2xl leading-8">
              Editorial guides on orthopedic support, sizing, rehabilitation and daily recovery —
              written for patients, athletes and healthcare professionals.
            </FadeUpText>
          </PremiumReveal>

          <div className="hidden md:flex absolute top-16 right-5 items-center gap-3 rounded-2xl bg-card dark:bg-zinc-900 px-5 py-3 shadow-sm font-bold text-gray-500 dark:text-zinc-400">
            {blogPosts.length} guides
          </div>
        </section>

        {/* Featured blog — most premium reveal */}
        <section className="max-w-7xl mx-auto px-5 pb-14">
          <FeaturedBlogReveal blog={featuredBlog} />
        </section>

        {/* All guides grid */}
        <section className="max-w-7xl mx-auto px-5 pb-16">
          <PremiumReveal variant={FadeUpSlow} className="mb-10">
            <SectionLabel className="text-purple-700 font-black tracking-widest text-sm">
              ALL GUIDES
            </SectionLabel>
            <h2 className="text-4xl font-black mt-2 text-slate-900 dark:text-zinc-100">
              Browse the collection
            </h2>
          </PremiumReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {remainingBlogs.map((blog, index) => (
              <BlogCardEditorial key={blog.slug} blog={blog} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
