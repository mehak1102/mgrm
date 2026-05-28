import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import SmartSizeFinder from "../components/SmartSizeFinder";
import RecommendationGrid from "../components/RecommendationGrid";
import { useProductRecommendations } from "../hooks/useRecommendations";
import { trackViewedProduct } from "../utils/recommendationBehavior";

import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
} from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeFinderOpen, setSizeFinderOpen] = useState(false);
  const { products: relatedProducts, loading: relatedLoading } =
    useProductRecommendations(product?._id, 8);

  useEffect(() => {
    API.get(`/products/${slug}`).then((res) => {
      const p = res.data;
      setProduct(p);
      setActiveImg(p.images?.[0] || "/products/default.png");
      setSize(p.sizes?.[0] || "");
      if (p?._id) trackViewedProduct(p._id);
    });
  }, [slug]);

  if (!product) return <div className="p-10">Loading...</div>;

  const images = product.images?.length
    ? product.images
    : ["/products/default.png"];

  const liked = isWishlisted(product);

  const stock = Number(product.stock || 10);

  const increaseQty = () => setQty((p) => Math.min(stock, p + 1));
  const decreaseQty = () => setQty((p) => Math.max(1, p - 1));

  return (
    <main className="bg-[#f7f7f7] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid lg:grid-cols-2 gap-14">

        {/* ================= LEFT IMAGE ================= */}
        <section className="flex gap-6">
          
          {/* Thumbnails */}
          <div className="flex flex-col gap-4">
            {images.map((img) => (
              <button
                key={img}
                onClick={() => setActiveImg(img)}
                className={`w-20 h-24 rounded-xl overflow-hidden border ${
                  activeImg === img
                    ? "border-purple-600"
                    : "border-gray-200 dark:border-zinc-800/60"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

       <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm min-h-[620px] flex items-center justify-center overflow-hidden">
  <img
    src={activeImg}
    className="w-full h-[560px] object-cover rounded-2xl transition duration-500 hover:scale-105"
    alt={product.name}
  />
</div>
        </section>

        {/* ================= RIGHT DETAILS ================= */}
        <section>

          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
            Home › Products › {product.name}
          </p>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold">4.6</span>
            <div className="flex text-yellow-500">
              {[1,2,3,4,5].map((x)=>(
                <Star key={x} size={16} fill="currentColor"/>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mt-5">
            <p className="text-gray-400 dark:text-zinc-500 line-through">
              ₹{product.price}
            </p>
            <p className="text-2xl font-bold text-purple-700">
              ₹{product.discountPrice}
            </p>
          </div>

          {/* Size */}
          {!!product.sizes?.length && (
            <div className="mt-6">
              <p className="font-semibold mb-2">Select Size</p>

              <div className="flex gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 border rounded-lg ${
                      size === s
                        ? "border-purple-700 text-purple-700"
                        : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Quantity</p>

            <div className="flex items-center gap-6 bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-lg w-fit transition-colors duration-300">
              <button onClick={decreaseQty}>
                <Minus size={16} />
              </button>

              <span className="font-bold">{qty}</span>

              <button onClick={increaseQty}>
                <Plus size={16} />
              </button>
            </div>

            <p className="text-xs mt-1 text-gray-500 dark:text-zinc-400">
              Stock: {stock}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => addToCart(product, qty, size)}
              className="flex-1 bg-purple-700 text-white py-3 rounded-xl font-semibold flex justify-center gap-2"
            >
              <ShoppingCart size={18} /> Add To Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`w-14 flex items-center justify-center border rounded-xl ${
                liked ? "text-red-500 border-red-300" : ""
              }`}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
          <button
  onClick={() => setSizeFinderOpen(true)}
  className="mt-4 text-cyan-700 font-bold hover:underline"
>
  Find My Size
</button>

          {/* Description */}
          <div className="mt-8 text-gray-600 dark:text-zinc-300 leading-7">
            {product.description ||
              "Premium orthopedic support designed for comfort and recovery."}
          </div>
        </section>
      </div>
<SmartSizeFinder
  open={sizeFinderOpen}
  onClose={() => setSizeFinderOpen(false)}
  onSelectSize={(selectedSize) => setSize(selectedSize)}
  product={product}
/>
      <div className="max-w-[1400px] mx-auto px-6 pb-14">
        <RecommendationGrid
          title="You May Also Like"
          subtitle="Recommendations based on category, tags, purpose and frequently viewed together products."
          products={relatedProducts}
          loading={relatedLoading}
          emptyText="No similar products found right now."
        />
      </div>
    </main>
  );
}