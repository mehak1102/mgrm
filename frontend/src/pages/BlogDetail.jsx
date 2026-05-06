import { Link, useParams } from "react-router-dom";
import { blogPosts, getBlogContent } from "../data/blogData";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams();
  const blog = blogPosts.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] grid place-items-center">
        <div className="bg-white rounded-3xl p-10 shadow text-center">
          <h1 className="text-3xl font-black">Blog not found</h1>
          <Link to="/blogs" className="text-purple-700 font-black mt-4 inline-block">
            Back to blogs
          </Link>
        </div>
      </main>
    );
  }

  const content = getBlogContent(blog);

  return (
    <main className="bg-[#f6f7fb] min-h-screen">
      <section className="max-w-5xl mx-auto px-5 py-10">
        <Link to="/blogs" className="inline-flex items-center gap-2 font-black text-purple-700">
          <ArrowLeft size={18} /> Back to Blogs
        </Link>

        <article className="bg-white rounded-[34px] overflow-hidden shadow-[0_30px_90px_rgba(15,23,42,0.12)] mt-8">
          <div className="relative h-[420px] bg-slate-100">
            <img
              src={blog.image}
              onError={(e) => (e.currentTarget.src = "/products/knee.png")}
              className="w-full h-full object-cover"
              alt={blog.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="absolute left-8 bottom-8 text-white">
              <p className="font-black tracking-widest text-purple-200">
                {blog.category}
              </p>
              <h1 className="text-5xl font-black mt-2">{blog.title}</h1>
              <p className="text-white/80 mt-3 max-w-2xl">{blog.excerpt}</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid gap-10">
              {content.map((block) => (
                <section key={block.heading}>
                  <h2 className="text-3xl font-black">{block.heading}</h2>
                  <p className="text-gray-600 leading-8 mt-3">{block.text}</p>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-[28px] bg-purple-50 p-8">
              <h3 className="text-3xl font-black">Quick tip</h3>
              <p className="text-gray-600 leading-8 mt-3">
                Always measure the affected body part before choosing size. A good support should feel snug, stable and comfortable.
              </p>
            </div>

            <Link
              to={`/shop?search=${encodeURIComponent(blog.category)}`}
              className="mt-10 inline-flex items-center gap-2 bg-purple-700 text-white px-7 py-4 rounded-full font-black hover:bg-purple-800 transition"
            >
              <ShoppingBag size={18} /> Shop Related Products
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}