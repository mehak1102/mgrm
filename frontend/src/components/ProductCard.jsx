import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const image = product.images?.[0] || product.image || "/products/knee.png";
  const price = Number(product.price || 0);
  const discountPrice = Number(product.discountPrice || product.price || 0);
  const liked = isWishlisted(product);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.09)] hover:-translate-y-2 transition duration-500 border border-slate-100 dark:border-white/10">
      <Link to={`/product/${product.slug}`} className="block relative h-72 bg-white dark:bg-slate-900 overflow-hidden">
        <img
          src={image}
          onError={(e) => (e.currentTarget.src = "/products/knee.png")}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-700"
        />
      </Link>

      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute -mt-14 ml-[calc(100%-60px)] w-11 h-11 rounded-full bg-white dark:bg-slate-900 shadow-lg grid place-items-center transition ${
          liked ? "text-red-500" : "text-slate-500 hover:text-red-500"
        }`}
      >
        <Heart size={20} fill={liked ? "currentColor" : "none"} />
      </button>

      <div className="p-5">
        <p className="text-xs font-black text-cyan-600 uppercase">
          {product.category || "Medical Support"}
        </p>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-black text-lg mt-2 text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-cyan-400 transition line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 line-clamp-2">
          {product.description || "Premium support product for comfort and recovery."}
        </p>

        <div className="flex items-center gap-1 text-yellow-500 mt-3">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-bold">{product.rating || 4.6}</span>
          <span className="text-xs text-gray-400 dark:text-zinc-500">(24)</span>
        </div>

        <div className="flex justify-between items-end mt-5">
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">₹{discountPrice}</span>
            {price > discountPrice && (
              <span className="ml-2 line-through text-gray-400 dark:text-zinc-500">₹{price}</span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-purple-600 text-white p-3 rounded-2xl hover:scale-110 transition shadow-lg"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}