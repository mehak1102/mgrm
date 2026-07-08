import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import DeliveryTrustBadge from "./DeliveryTrustBadge";
import {
  productPriceOriginalProps,
  productPriceSaleProps,
} from "../utils/productPriceStyle";

const PASTEL_CARD_PALETTE = [
  { border: "#f9a8b8", glow: "rgba(249, 168, 184, 0.42)" },
  { border: "#7dd3fc", glow: "rgba(125, 211, 252, 0.42)" },
  { border: "#86efac", glow: "rgba(134, 239, 172, 0.42)" },
  { border: "#fcd34d", glow: "rgba(252, 211, 77, 0.42)" },
  { border: "#c4b5fd", glow: "rgba(196, 181, 253, 0.42)" },
  { border: "#f9a8d4", glow: "rgba(249, 168, 212, 0.42)" },
  { border: "#5eead4", glow: "rgba(94, 234, 212, 0.42)" },
  { border: "#a5b4fc", glow: "rgba(165, 180, 252, 0.42)" },
];

const PASTEL_CARD_PALETTE_DARK = [
  { border: "rgba(251, 113, 133, 0.55)", glow: "rgba(251, 113, 133, 0.32)" },
  { border: "rgba(56, 189, 248, 0.55)", glow: "rgba(56, 189, 248, 0.32)" },
  { border: "rgba(74, 222, 128, 0.55)", glow: "rgba(74, 222, 128, 0.32)" },
  { border: "rgba(251, 191, 36, 0.55)", glow: "rgba(251, 191, 36, 0.32)" },
  { border: "rgba(167, 139, 250, 0.55)", glow: "rgba(167, 139, 250, 0.32)" },
  { border: "rgba(244, 114, 182, 0.55)", glow: "rgba(244, 114, 182, 0.32)" },
  { border: "rgba(45, 212, 191, 0.55)", glow: "rgba(45, 212, 191, 0.32)" },
  { border: "rgba(129, 140, 248, 0.55)", glow: "rgba(129, 140, 248, 0.32)" },
];

export default function ProductCard({ product, pastelIndex }) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isBlue, isDark } = useTheme();

  const image = product.images?.[0] || product.image || "/products/knee.png";
  const price = Number(product.price || 0);
  const discountPrice = Number(product.discountPrice || product.price || 0);
  const liked = isWishlisted(product);
  const palette = isDark ? PASTEL_CARD_PALETTE_DARK : PASTEL_CARD_PALETTE;
  const pastel =
    pastelIndex != null
      ? palette[pastelIndex % palette.length]
      : null;

  return (
    <div
      className={`group relative rounded-[22px] overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.09)] hover:-translate-y-2 transition-all duration-500 bg-card dark:bg-zinc-900 ${
        pastel
          ? "product-card--pastel border-2"
          : "border border-slate-200 dark:border-white/10"
      }`}
      style={
        pastel
          ? {
              "--pc-pastel-border": pastel.border,
              "--pc-pastel-glow": pastel.glow,
            }
          : undefined
      }
    >
      <div className="relative">
        <Link
          to={`/product/${product.slug}`}
          className={`product-card__image-wrap block relative overflow-hidden h-44 sm:h-52 lg:h-72 ${
            pastel ? "product-card--pastel__image" : "bg-card"
          }`}
        >
          <img
            src={image}
            onError={(e) => (e.currentTarget.src = "/products/knee.png")}
            alt={product.name}
            className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-110 transition duration-700"
          />
        </Link>

        <button
          onClick={() => toggleWishlist(product)}
          className={`product-card__wishlist absolute top-2 right-2 z-10 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-card dark:bg-zinc-800 border border-slate-200/80 dark:border-white/10 shadow-lg grid place-items-center transition ${
            liked ? "text-red-500" : "text-slate-500 dark:text-zinc-400 hover:text-red-500"
          }`}
        >
          <Heart size={16} className="sm:hidden" fill={liked ? "currentColor" : "none"} />
          <Heart size={20} className="hidden sm:block" fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-card__body p-5">
        <p className="product-card__category text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase">
          {product.category || t("productDetail.medicalSupport")}
        </p>

        <Link to={`/product/${product.slug}`}>
          <h3
            className="product-card__title font-black text-lg mt-2 line-clamp-2 transition text-slate-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-cyan-400"
          >
            {product.name}
          </h3>
        </Link>

        <p className="product-card__desc text-sm mt-2 line-clamp-2 text-gray-500 dark:text-zinc-400">
          {product.description || t("productDetail.premiumSupport")}
        </p>

        <div className="product-card__rating-row flex items-center gap-1 text-yellow-500 mt-3">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-bold">{product.rating || 4.6}</span>
          <span className="text-xs text-gray-500 dark:text-zinc-400/80">
            (24)
          </span>
        </div>

        <DeliveryTrustBadge
          seed={product.slug || product._id || product.name}
          compact
          lightSurface={!isDark}
          className="product-card__trust mt-3"
        />

        <div className="flex justify-between items-end mt-5">
          <div>
            <span
              {...productPriceSaleProps(
                isBlue,
                "product-card__price text-2xl font-black text-slate-900 dark:text-zinc-100"
              )}
            >
              ₹{discountPrice}
            </span>
            {price > discountPrice && (
              <span
                {...productPriceOriginalProps(
                  isBlue,
                  "ml-2 line-through text-gray-500 dark:text-zinc-400/80"
                )}
              >
                ₹{price}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="product-card__cart-btn bg-purple-600 dark:bg-sky-600 text-white p-3 rounded-2xl hover:scale-110 hover:bg-purple-700 dark:hover:bg-sky-500 transition shadow-lg"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}