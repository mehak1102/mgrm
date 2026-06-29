import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import {
  productPriceOriginalProps,
  productPriceSaleProps,
} from "../utils/productPriceStyle";
import SmartSizeFinder from "../components/SmartSizeFinder";
import RecommendationGrid from "../components/RecommendationGrid";
import { useProductRecommendations } from "../hooks/useRecommendations";
import { trackViewedProduct } from "../utils/recommendationBehavior";
import ProductReviews from "../components/product/ProductReviews";
import RecoveryStoriesSection from "../components/product/RecoveryStoriesSection";
import PeopleAlsoBoughtCarousel from "../components/product/PeopleAlsoBoughtCarousel";
import { StarRatingDisplay } from "../components/product/StarRating";

import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
} from "lucide-react";
import ProductShareButton from "../components/product/ProductShareButton";
import { SectionHeading, FadeUpText } from "../components/typography/TypographyMotion";
import DeliveryTrustBadge from "../components/DeliveryTrustBadge";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isBlue } = useTheme();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeFinderOpen, setSizeFinderOpen] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });
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

  useEffect(() => {
    if (!product?._id) return;
    API.get(`/reviews/product/${product._id}`)
      .then((res) => setReviewSummary(res.data.summary || {}))
      .catch(() => {});
  }, [product?._id]);

  if (!product) {
    return (
      <main className="bg-app min-h-screen p-10">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-14">
          <div className="h-[620px] rounded-3xl bg-card animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-card animate-pulse rounded-xl" />
            <div className="h-6 w-1/3 bg-card animate-pulse rounded-lg" />
            <div className="h-32 bg-card animate-pulse rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  const images = product.images?.length ? product.images : ["/products/default.png"];
  const liked = isWishlisted(product);
  const stock = Number(product.stock || 10);
  const displayRating = reviewSummary.totalReviews
    ? reviewSummary.averageRating
    : product.rating || 4.6;

  const increaseQty = () => setQty((p) => Math.min(stock, p + 1));
  const decreaseQty = () => setQty((p) => Math.max(1, p - 1));

  return (
    <main className="bg-[#f7f7f7] bg-app dark:bg-zinc-950 min-h-screen transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid lg:grid-cols-2 gap-14">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex gap-6"
        >
          <div className="flex flex-col gap-4">
            {images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImg(img)}
                className={`w-20 h-24 rounded-xl overflow-hidden border transition ${
                  activeImg === img
                    ? "border-purple-600 ring-2 ring-purple-300/40"
                    : "border-gray-200 dark:border-white/10"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-card dark:bg-zinc-900 rounded-3xl p-6 shadow-sm min-h-[620px] flex items-center justify-center overflow-hidden">
            <img
              src={activeImg}
              className="w-full h-[560px] object-cover rounded-2xl transition duration-500 hover:scale-105"
              alt={product.name}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
            Home › Products › {product.name}
          </p>

          <SectionHeading text={product.name} as="h1" className="text-3xl font-bold text-fg" />

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="font-semibold text-fg">{displayRating.toFixed(1)}</span>
            <StarRatingDisplay value={displayRating} size={16} />
            {reviewSummary.totalReviews > 0 && (
              <a href="#customer-reviews" className="text-sm text-brand font-bold hover:underline">
                ({reviewSummary.totalReviews} reviews)
              </a>
            )}
          </div>

          <div className="mt-5">
            <span
              {...productPriceOriginalProps(
                isBlue,
                "block text-gray-500 dark:text-zinc-400/80 line-through"
              )}
            >
              ₹{product.price}
            </span>
            <span
              {...productPriceSaleProps(isBlue, "block text-2xl font-bold text-purple-700")}
            >
              ₹{product.discountPrice}
            </span>
          </div>

          <DeliveryTrustBadge
            seed={product.slug || product._id}
            className="mt-4"
          />

          {!!product.sizes?.length && (
            <div className="mt-6">
              <p className="font-semibold mb-2 text-fg">Select Size</p>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      size === s ? "border-purple-700 text-purple-700 bg-purple-50 dark:bg-purple-950/30" : "border-edge"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="font-semibold mb-2 text-fg">Quantity</p>
            <div className="flex items-center gap-6 bg-gray-100 bg-surface-hover px-4 py-2 rounded-lg w-fit">
              <button type="button" onClick={decreaseQty} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="font-bold">{qty}</span>
              <button type="button" onClick={increaseQty} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs mt-1 text-gray-500 dark:text-zinc-400">Stock: {stock}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => addToCart(product, qty, size)}
              className="flex-1 bg-purple-700 text-white py-3 rounded-xl font-semibold flex justify-center gap-2 hover:scale-[1.02] transition"
            >
              <ShoppingCart size={18} /> Add To Cart
            </button>
            <ProductShareButton product={product} compact />
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-14 flex items-center justify-center border rounded-xl transition ${
                liked ? "text-red-500 border-red-300" : "border-edge"
              }`}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSizeFinderOpen(true)}
            className="mt-4 text-cyan-700 dark:text-cyan-400 font-bold hover:underline"
          >
            Find My Size
          </button>

          <FadeUpText className="mt-8 text-gray-500 dark:text-zinc-400 leading-7">
            {product.description || "Premium orthopedic support designed for comfort and recovery."}
          </FadeUpText>
        </motion.section>
      </div>

      <SmartSizeFinder
        open={sizeFinderOpen}
        onClose={() => setSizeFinderOpen(false)}
        onSelectSize={(selectedSize) => setSize(selectedSize)}
        product={product}
      />

      <div className="max-w-[1400px] mx-auto px-6 pb-14 space-y-14">
        <PeopleAlsoBoughtCarousel productId={product._id} />

        <RecoveryStoriesSection productId={product._id} />

        <div id="customer-reviews">
          <ProductReviews productId={product._id} />
        </div>

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
