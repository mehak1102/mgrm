import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Heart,
  Grid2X2,
  List,
  Star,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import API from "../api";
import { activities } from "../data/siteData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import FloatingMedicalBg from "../components/FloatingMedicalBg";

const colors = [
  "Black",
  "White",
  "Grey",
  "Black & Green",
  "Black & Orange",
  "Beige",
  "Silver",
];

const sizes = ["S", "M", "L", "XL", "XXL", "UN", "Regular", "Plus", "SM", "LXL"];

export default function ShopByActivity() {
  const [params, setParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [activeActivity, setActiveActivity] = useState(params.get("activity") || "");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sort, setSort] = useState("popularity");
  const [view, setView] = useState("grid");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveActivity(params.get("activity") || "");
  }, [params]);

  useEffect(() => {
    setLoading(true);

    const query = new URLSearchParams();

    if (activeActivity) {
      query.set("activity", activeActivity);
    } else {
      query.set("activityOnly", "true");
    }

    if (selectedColor) query.set("color", selectedColor);
    if (selectedSize) query.set("size", selectedSize);

    API.get(`/products?${query.toString()}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeActivity, selectedColor, selectedSize]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(
      (p) => Number(p.discountPrice || p.price || 0) <= maxPrice
    );

    if (sort === "low") {
      list = [...list].sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
    }

    if (sort === "high") {
      list = [...list].sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, sort, maxPrice]);

  const selectActivity = (name) => {
    setActiveActivity(name);
    setParams(name ? { activity: name } : {});
  };

  const clearFilters = () => {
    setActiveActivity("");
    setSelectedColor("");
    setSelectedSize("");
    setMaxPrice(5000);
    setParams({});
  };

  return (
    <main className="bg-[#f7f8fb] min-h-screen">
          <FloatingMedicalBg />
      <div className="max-w-[1500px] mx-auto px-5 py-8">
        <div className="text-sm text-gray-500 mb-6">
          Home <span className="mx-2">›</span> Shop By Activity
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-white rounded-[18px] shadow-[0_10px_35px_rgba(15,23,42,0.08)] h-fit sticky top-24">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">Filters</h2>
              <button onClick={clearFilters} className="text-purple-600 text-sm font-bold">
                Clear All
              </button>
            </div>

            <div className="p-5 border-b">
              <div className="flex justify-between font-black text-sm mb-4">
                ACTIVITY <ChevronDown size={16} />
              </div>

              <div className="grid gap-1 max-h-[300px] overflow-auto pr-1">
                <button
                  onClick={() => selectActivity("")}
                  className={`text-left px-3 py-2 rounded-xl font-semibold ${
                    !activeActivity ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50"
                  }`}
                >
                  All Activity Products
                </button>

                {activities.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => selectActivity(item.name)}
                    className={`text-left px-3 py-2 rounded-xl font-semibold ${
                      activeActivity === item.name
                        ? "bg-purple-50 text-purple-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 border-b">
              <div className="flex justify-between font-black text-sm mb-4">
                COLOR <ChevronDown size={16} />
              </div>

              <div className="grid gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setSelectedColor(selectedColor === color ? "" : color)
                    }
                    className={`flex items-center justify-between text-sm rounded-xl px-3 py-2 ${
                      selectedColor === color
                        ? "bg-purple-50 text-purple-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{
                          background:
                            color === "Black"
                              ? "#000"
                              : color === "White"
                              ? "#fff"
                              : color === "Grey"
                              ? "#bbb"
                              : color === "Beige"
                              ? "#ead5b7"
                              : color === "Silver"
                              ? "#c0c0c0"
                              : "#111",
                        }}
                      />
                      {color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 border-b">
              <div className="flex justify-between font-black text-sm mb-4">
                SIZE <ChevronDown size={16} />
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? "" : size)
                    }
                    className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                      selectedSize === size
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "hover:border-purple-500 hover:text-purple-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between font-black text-sm mb-4">
                PRICE <ChevronDown size={16} />
              </div>

              <p className="text-sm mb-3">₹100 - ₹{maxPrice}</p>
              <input
                type="range"
                min="100"
                max="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          </aside>

          <section>
            <div className="flex flex-col md:flex-row justify-between gap-5 mb-7">
              <div>
                <h1 className="text-4xl font-black">
                  Shop By Activity{" "}
                  <span className="text-gray-400 text-2xl">
                    ({filteredProducts.length})
                  </span>
                </h1>
                <p className="text-gray-500 mt-2">
                  {activeActivity
                    ? `Products recommended for ${activeActivity}.`
                    : "Only activity-based products are shown here."}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold">Sort By:</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border rounded-xl px-4 py-3 outline-none"
                >
                  <option value="popularity">Popularity</option>
                  <option value="low">Price Low to High</option>
                  <option value="high">Price High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>

                <div className="bg-white border rounded-xl p-1 flex">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-3 rounded-lg ${
                      view === "grid" ? "bg-purple-100 text-purple-700" : ""
                    }`}
                  >
                    <Grid2X2 size={18} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`p-3 rounded-lg ${
                      view === "list" ? "bg-purple-100 text-purple-700" : ""
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                  <div key={x} className="h-[430px] bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow">
                <h2 className="text-3xl font-black">No activity products found</h2>
                <p className="text-gray-500 mt-2">
                  Admin me product ke andar activity field fill karo.
                </p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid md:grid-cols-2 xl:grid-cols-4 gap-7"
                    : "grid gap-5"
                }
              >
                {filteredProducts.map((product) => {
                  const price = Number(product.price || 0);
                  const discountPrice = Number(product.discountPrice || product.price || 0);
                  const save =
                    price && discountPrice
                      ? Math.round(((price - discountPrice) / price) * 100)
                      : 0;

                  return (
                    <article
                      key={product._id}
                      className={`relative group bg-white rounded-[18px] overflow-hidden shadow-[0_12px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition ${
                        view === "list" ? "flex" : ""
                      }`}
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className={`relative bg-white block ${
                          view === "list" ? "w-72 h-72" : "h-72"
                        }`}
                      >
                        {save > 0 && (
                          <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-black px-3 py-2 rounded">
                            Save {save}%
                          </span>
                        )}

                        <span className="absolute top-14 left-4 bg-white shadow text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Star size={13} fill="#fbbf24" className="text-yellow-400" />
                          {product.rating || 4.8}
                        </span>

                        <img
                          src={product.images?.[0] || product.image || "/products/knee.png"}
                          onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                          className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-500"
                          alt={product.name}
                        />
                      </Link>

                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow grid place-items-center ${
                          isWishlisted(product) ? "text-red-500" : "text-purple-600"
                        }`}
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted(product) ? "currentColor" : "none"}
                        />
                      </button>

                      <div className="p-5 flex-1">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-black line-clamp-2 hover:text-purple-600 transition">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-xs text-gray-500 mt-1">
                          {product.activity || "Activity Support"}
                        </p>

                        <div className="mt-3">
                          <span className="text-xl font-black">₹{discountPrice}.00</span>
                          {price > discountPrice && (
                            <span className="text-gray-400 line-through ml-2">
                              ₹{price}.00
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          (Incl. of all Taxes)
                        </p>

                        <button
                          onClick={() => addToCart(product)}
                          className="mt-5 w-full border border-purple-500 text-purple-600 rounded-lg py-3 font-black hover:bg-purple-600 hover:text-white transition flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={18} /> Add to Cart
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}