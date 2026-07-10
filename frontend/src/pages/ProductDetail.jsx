import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import FrequentlyBoughtTogether from "../components/product/FrequentlyBoughtTogether";
import { StarRatingDisplay } from "../components/product/StarRating";

import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Ruler,
} from "lucide-react";
import ProductShareButton from "../components/product/ProductShareButton";
import { SectionHeading, FadeUpText } from "../components/typography/TypographyMotion";
import DeliveryTrustBadge from "../components/DeliveryTrustBadge";

export default function ProductDetail({ embedded = false, slug: slugProp }) {
  const { slug: routeSlug } = useParams();
  const slug = slugProp || routeSlug;
  const { t } = useTranslation();
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
      <main className={`bg-app p-10 ${embedded ? "min-h-0" : "min-h-screen"}`}>
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
    <main className={`product-detail-page bg-[#f7f7f7] bg-app dark:bg-zinc-950 transition-colors duration-300 ${embedded ? "min-h-0" : "min-h-screen"}`}>
      <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6 sm:gap-14 ${embedded ? "py-4 sm:py-6" : "py-6 sm:py-10"}`}>
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="product-detail-gallery flex flex-col sm:flex-row gap-3 sm:gap-6"
        >
          <div className="product-detail-thumbs flex flex-row sm:flex-col gap-2 sm:gap-4 order-2 sm:order-1">
            {images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImg(img)}
                className={`w-14 h-16 sm:w-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden border transition shrink-0 ${
                  activeImg === img
                    ? "border-purple-600 ring-2 ring-purple-300/40"
                    : "border-gray-200 dark:border-white/10"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain sm:object-cover bg-slate-100 dark:bg-zinc-800" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="product-detail-main-img-wrap order-1 sm:order-2 flex-1 bg-card dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm min-h-0 sm:min-h-[620px] flex items-center justify-center overflow-hidden">
            <img
              src={activeImg}
              className="product-detail-main-img w-full h-auto max-h-[280px] sm:max-h-none sm:h-[560px] object-contain sm:object-cover rounded-xl sm:rounded-2xl transition duration-500 hover:scale-105"
              alt={product.name}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <p className="typo-breadcrumb text-gray-500 dark:text-zinc-400 mb-3 sm:mb-4">
            {t("common.home")} › {t("productDetail.products")} › {product.name}
          </p>

          <SectionHeading text={product.name} as="h1" className="typo-page-title text-fg" />

          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 flex-wrap">
            <span className="text-sm sm:text-base font-semibold text-fg">{displayRating.toFixed(1)}</span>
            <StarRatingDisplay value={displayRating} size={14} />
            {reviewSummary.totalReviews > 0 && (
              <a href="#customer-reviews" className="text-xs sm:text-sm text-brand font-bold hover:underline">
                ({reviewSummary.totalReviews} {t("common.reviews")})
              </a>
            )}
          </div>

          <div className="mt-3 sm:mt-5">
            <span
              {...productPriceOriginalProps(
                isBlue,
                "block text-sm sm:text-base text-gray-500 dark:text-zinc-400/80 line-through"
              )}
            >
              ₹{product.price}
            </span>
            <span
              {...productPriceSaleProps(isBlue, "block text-xl sm:text-2xl font-bold text-purple-700")}
            >
              ₹{product.discountPrice}
            </span>
          </div>

          <DeliveryTrustBadge
            seed={product.slug || product._id}
            className="mt-3 sm:mt-4"
          />

          {!!product.sizes?.length && (
            <div className="mt-4 sm:mt-6">
              <p className="text-sm sm:text-base font-semibold mb-2 text-fg">{t("productDetail.selectSize")}</p>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`product-detail-size-btn px-3 py-1.5 sm:px-4 sm:py-2 text-sm border rounded-lg transition ${
                      size === s ? "border-purple-700 text-purple-700 bg-purple-50 dark:bg-purple-950/30" : "border-edge"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6">
            <p className="text-sm sm:text-base font-semibold mb-2 text-fg">{t("common.quantity")}</p>
            <div className="product-detail-qty flex items-center gap-4 sm:gap-6 bg-gray-100 bg-surface-hover px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg w-fit">
              <button type="button" onClick={decreaseQty} aria-label={t("productDetail.decreaseQty")}>
                <Minus size={16} />
              </button>
              <span className="font-bold text-sm sm:text-base">{qty}</span>
              <button type="button" onClick={increaseQty} aria-label={t("productDetail.increaseQty")}>
                <Plus size={16} />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs mt-1 text-gray-500 dark:text-zinc-400">
              {t("productDetail.stock")} {stock}
            </p>
          </div>

          <div className="product-detail-actions flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={() => addToCart(product, qty, size)}
              className="flex-1 bg-purple-700 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] transition"
            >
              <ShoppingCart size={18} /> {t("productDetail.addToCart")}
            </button>
            <ProductShareButton product={product} compact />
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`w-11 sm:w-14 flex items-center justify-center border rounded-xl transition ${
                liked ? "text-red-500 border-red-300" : "border-edge"
              }`}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="product-detail-finder mt-4 sm:mt-5 rounded-2xl border border-cyan-200/70 dark:border-cyan-500/20 bg-gradient-to-r from-cyan-50/90 via-white to-purple-50/80 dark:from-cyan-950/30 dark:via-zinc-900 dark:to-purple-950/20 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 grid place-items-center shrink-0">
                <Ruler size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="product-detail-finder__title font-black text-cyan-800 dark:text-cyan-300 text-sm sm:text-base">
                  {t("smartSize.finder")}
                </p>
                <p className="product-detail-finder__text text-gray-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 leading-snug">
                  {t("smartSize.description")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSizeFinderOpen(true)}
                className="product-detail-finder__btn shrink-0 bg-gradient-to-r from-cyan-600 to-purple-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black hover:scale-[1.02] transition"
              >
                {t("productDetail.findMySize")}
              </button>
            </div>
          </div>

          <FadeUpText className="product-detail-desc mt-5 sm:mt-8 text-sm sm:text-base text-gray-500 dark:text-zinc-400 leading-relaxed sm:leading-7">
            {product.description || t("productDetail.fallbackDesc")}
          </FadeUpText>
        </motion.section>
      </div>

      <SmartSizeFinder
        open={sizeFinderOpen}
        onClose={() => setSizeFinderOpen(false)}
        onSelectSize={(selectedSize) => setSize(selectedSize)}
        product={product}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-10 sm:pb-14 space-y-8 sm:space-y-14">
        <FrequentlyBoughtTogether productId={product._id} primaryProduct={product} />
        <PeopleAlsoBoughtCarousel productId={product._id} />

        <RecoveryStoriesSection productId={product._id} />

        <div id="customer-reviews">
          <ProductReviews productId={product._id} />
        </div>

        <RecommendationGrid
          title={t("productDetail.youMayLike")}
          products={relatedProducts}
          loading={relatedLoading}
          emptyText={t("productDetail.noSimilar")}
        />
      </div>
    </main>
  );
}
