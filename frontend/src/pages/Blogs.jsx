import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogData";
import FloatingMedicalBg from "../components/FloatingMedicalBg";

export default function Blogs() {
  return (
    <main className="bg-[#f6f7fb] dark:bg-slate-950 min-h-screen">
        <FloatingMedicalBg />
      {/* clean moving strip */}

        <div className="relative z-10">
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 overflow-hidden py-4">
        <div className="blog-strip flex gap-4 w-max">
          {[...blogPosts, ...blogPosts].map((item, i) => (
            <Link
              key={`${item.slug}-${i}`}
              to={`/blogs/${item.slug}`}
              className="shrink-0 flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <img
                src={item.image}
                onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                className="w-11 h-11 rounded-full object-cover"
                alt={item.category}
              />
              <span className="font-black text-sm text-slate-800 dark:text-gray-200">
                {item.category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-purple-700 font-black tracking-widest text-sm">
              HEALTH GUIDES
            </p>
            <h1 className="text-5xl font-black mt-2 text-slate-900 dark:text-white">Health Blogs</h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-2">
              Product guides, recovery tips and activity support articles.
            </p>
          </div>

          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl px-5 py-3 shadow-sm font-bold text-gray-500 dark:text-zinc-400">
            {blogPosts.length} guides
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {blogPosts.map((blog) => (
            <Link
              key={blog.slug}
              to={`/blogs/${blog.slug}`}
              className="group bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.13)] transition duration-500"
            >
              <div className="h-44 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                <img
                  src={blog.image}
                  onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  alt={blog.title}
                />
              </div>

              <div className="p-5">
                <p className="text-xs text-purple-700 font-black uppercase tracking-wider">
                  {blog.category}
                </p>

                <h3 className="font-black mt-2 text-lg leading-tight group-hover:text-purple-700 transition">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-3 line-clamp-2">
                  {blog.excerpt}
                </p>

                <span className="inline-flex mt-5 font-black text-sm text-purple-700">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
}