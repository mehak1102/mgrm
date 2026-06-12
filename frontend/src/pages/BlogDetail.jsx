import { Link, useParams } from "react-router-dom";

import { getBlogBySlug } from "../data/blogData";

import { getBlogArticle, getBlogReadMinutes } from "../data/blog";

import { ArrowLeft, Clock, ShoppingBag } from "lucide-react";

import {

  SectionHeading,

  FadeUpText,

} from "../components/typography/TypographyMotion";

import BlogArticleRenderer from "../components/blog/BlogArticleRenderer";



export default function BlogDetail() {

  const { slug } = useParams();

  const blog = getBlogBySlug(slug);



  if (!blog) {

    return (

      <main className="min-h-screen bg-[#f6f7fb] bg-app dark:bg-zinc-950 grid place-items-center">

        <div className="bg-card dark:bg-zinc-900 rounded-3xl p-10 shadow text-center">

          <h1 className="text-3xl font-black">Blog not found</h1>

          <Link to="/blogs" className="text-purple-700 font-black mt-4 inline-block">

            Back to blogs

          </Link>

        </div>

      </main>

    );

  }



  const article = getBlogArticle(blog);

  const readMinutes = getBlogReadMinutes(blog);

  const shopQuery = blog.type === "activity" ? blog.activity : blog.category;



  return (

    <main className="bg-[#f6f7fb] bg-app dark:bg-zinc-950 min-h-screen">

      <section className="max-w-5xl mx-auto px-5 py-10">

        <Link to="/blogs" className="inline-flex items-center gap-2 font-black text-purple-700">

          <ArrowLeft size={18} /> Back to Blogs

        </Link>



        <article className="bg-card dark:bg-zinc-900 rounded-[34px] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.12)] mt-8">

          <div className="relative h-[420px] bg-slate-100 bg-surface-hover">

            <img

              src={blog.coverImage || blog.image}

              onError={(e) => (e.currentTarget.src = "/products/knee.png")}

              className="w-full h-full object-cover"

              alt={blog.title}

            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />



            <div className="absolute left-8 bottom-8 right-8 text-white">

              <p className="font-black tracking-widest text-purple-200">

                {blog.category}

              </p>

              <SectionHeading

                text={blog.title}

                as="h1"

                className="text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black mt-3 text-white leading-[1.04] tracking-[-0.03em] max-w-4xl"

              />

              <FadeUpText className="text-white/80 mt-3 max-w-2xl text-lg leading-relaxed">

                {blog.excerpt}

              </FadeUpText>

              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/70">

                <Clock size={16} />

                {readMinutes} min read

              </p>

            </div>

          </div>



          <div className="px-8 md:px-14 py-12 md:py-16">

            {article ? (

              <BlogArticleRenderer article={article} />

            ) : (

              <p className="text-lg text-gray-500 dark:text-zinc-400 leading-relaxed">

                Full article content is being prepared for this guide.

              </p>

            )}



            <div className="max-w-[42rem] mx-auto mt-16 pt-10 border-t border-slate-200 dark:border-white/10">

              <Link

                to={`/shop?search=${encodeURIComponent(shopQuery || "")}`}

                className="inline-flex items-center gap-2 bg-purple-700 text-white px-7 py-4 rounded-full font-black hover:bg-purple-800 transition"

              >

                <ShoppingBag size={18} /> Shop Related Products

              </Link>

            </div>

          </div>

        </article>

      </section>

    </main>

  );

}

