import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import FloatingMedicalBg from "../components/FloatingMedicalBg";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const validWishlist = wishlist.filter((p) => p?._id && p?.name);

  return (
    <main className="relative bg-[#f6f7fb] min-h-screen overflow-hidden">
      <FloatingMedicalBg />

      <div className="relative z-10 max-w-7xl mx-auto px-5 py-12">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-purple-700 font-black tracking-widest text-sm">
              YOUR FAVORITES
            </p>
            {/* <h1 className="text-5xl font-black mt-2">Wishlist</h1> */}
            <h1 className="text-3xl font-bold">
  Wishlist ({validWishlist.length})
</h1>
            <p className="text-gray-500 mt-2">
              Products you liked are saved here
            </p>
          </div>

          <div className="bg-white rounded-2xl px-5 py-3 shadow font-bold text-gray-500">
            {wishlist.length} items
          </div>
        </div>

        {/* EMPTY STATE */}
        {wishlist.length === 0 && (
          <div className="bg-white rounded-[30px] p-12 text-center shadow">
            <Heart className="mx-auto text-purple-400" size={50} />
            <h2 className="text-3xl font-black mt-4">No liked products</h2>
            <p className="text-gray-500 mt-2">
              Start exploring and add products you love.
            </p>

            <Link
              to="/shop"
              className="inline-block mt-6 bg-purple-700 text-white px-6 py-3 rounded-full font-bold"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
          {/* {wishlist.map((p) => (
             */}
             {validWishlist.map((p) => (
            <div
              key={p._id}
              className="group bg-white rounded-[26px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)] transition duration-500"
            >
              {/* IMAGE */}
              <Link to={`/product/${p.slug}`} className="block h-44 overflow-hidden">
                <img
                  src={p.images?.[0] || p.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </Link>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-black text-sm leading-tight line-clamp-2">
                  {p.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-black text-purple-700">
                    ₹{p.discountPrice || p.price}
                  </span>
                  {p.discountPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{p.price}
                    </span>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="flex-1 bg-purple-700 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-1"
                  >
                    <ShoppingCart size={16} /> Add
                  </button>

                  <button
                    onClick={() => toggleWishlist(p)}
                    className="p-2 rounded-xl bg-red-50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}