// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { Search, ShoppingCart, Heart, User, LogOut, ChevronRight } from "lucide-react";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";
// import { useAuth } from "../context/AuthContext";
// import { mgrmCategories, activities } from "../data/siteData";

// export default function Navbar({ theme, setTheme }) {
//   const navigate = useNavigate();
//   const { cartCount, setCartOpen } = useCart();
//   const { wishlist } = useWishlist();
//   const { user, logout } = useAuth();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const query = e.target.search.value.trim();
//     navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
//   };

//   const goCategory = (cat) => {
//     navigate(`/shop?category=${encodeURIComponent(cat.query)}`);
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b" style={{ borderColor: "var(--border)" }}>
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-5">
//         <Link to="/" className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-2xl btn-primary grid place-items-center text-white font-black shadow-lg">M</div>
//           <div>
//             <h1 className="text-xl font-black theme-text leading-none">MGRM</h1>
//             <p className="text-xs tracking-widest text-gray-500 dark:text-zinc-400">MEDICARE</p>
//           </div>
//         </Link>

//         <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
//           <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-zinc-500" size={18} />
//           <input
//             name="search"
//             placeholder="Search products, category, body part..."
//             className="w-full theme-panel rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2"
//           />
//         </form>

//         <nav className="hidden lg:flex gap-6 font-semibold text-sm items-center">
//           <div className="group">
//             <button className="py-5">Shop</button>

//             <div className="hidden group-hover:block absolute left-0 right-0 top-[68px] bg-white dark:bg-slate-900 border-t shadow-2xl">
//               <div className="max-w-7xl mx-auto grid grid-cols-4 gap-x-16 gap-y-5 px-6 py-6">
//                 {mgrmCategories.map((cat) => (
//                   <button
//                     key={cat.name}
//                     onClick={() => goCategory(cat)}
//                     className="text-left hover:text-fuchsia-600 transition font-medium"
//                   >
//                     {cat.name}
//                   </button>
//                 ))}

//                 <div className="relative group/activity">
//                   <div className="flex items-center justify-between font-medium hover:text-fuchsia-600">
//                     Shop By Activity <ChevronRight size={16} />
//                   </div>

//                   <div className="absolute left-full top-0 hidden group-hover/activity:block bg-white dark:bg-slate-900 shadow-xl border rounded-xl min-w-44 p-3">
//                     {activities.map((activity) => (
//                       <button
//                         key={activity.name}
//                         onClick={() => navigate(`/shop?search=${encodeURIComponent(activity.name)}`)}
//                         className="block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg"
//                       >
//                         {activity.name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <NavLink to="/shop">Products</NavLink>
//           <a href="#science">Science</a>
//           <a href="#support">Support</a>
//         </nav>

//         <select value={theme} onChange={(e) => setTheme(e.target.value)} className="hidden md:block theme-panel rounded-xl px-2 py-2 text-sm font-bold">
//           <option value="blue">Blue</option>
//           <option value="teal">Teal</option>
//           <option value="purple">Purple</option>
//           <option value="luxury">Luxury</option>
//         </select>

//         <div className="flex gap-3 ml-auto items-center">
//           <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative">
//             <Heart size={20} />
//             {wishlist.length > 0 && (
//               <span className="absolute -top-1 -right-1 text-xs bg-pink-500 text-white rounded-full w-5 h-5 grid place-items-center">{wishlist.length}</span>
//             )}
//           </button>

//           {user?.role === "admin" && <Link to="/admin" className="font-bold text-sm theme-text">Admin</Link>}
//           {user && <Link to="/orders" className="font-bold text-sm theme-text">Orders</Link>}

//           {user ? (
//             <div className="flex items-center gap-2">
//               <span className="hidden md:block font-bold text-sm">Hi, {user.name}</span>
//               <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"><LogOut size={20} /></button>
//             </div>
//           ) : (
//             <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"><User size={20} /></Link>
//           )}

//           <button onClick={() => setCartOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative">
//             <ShoppingCart size={20} />
//             <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">{cartCount}</span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, HeartPulse , User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { bodyCategories, activities } from "../data/siteData";
import { trackSearch } from "../utils/recommendationBehavior";
import Logo3D from "./Logo3D";
import ThemeToggle from "./ThemeToggle";

// export default function Navbar({ theme, setTheme }) {
export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

const aboutLinks = [
  "Our History",
  "Achievements",
  "Quality Certifications",
  "MGRM Timelines",
  "Leadership",
  "Testimonials",
];

const handleSearch = (e) => {
  e.preventDefault();

  const q = e.target.search.value.trim();

  if (!q) {
    navigate("/shop");
    return;
  }


  // CHECK ACTIVITY MATCH
  const matchedActivity = activities.find((item) =>
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  // IF ACTIVITY FOUND
  if (matchedActivity) {
    navigate(
      `/shop-by-activity?activity=${encodeURIComponent(
        matchedActivity.name
      )}`
    );

    return;
  }

  // OTHERWISE NORMAL PRODUCT SEARCH
  trackSearch(q);

  navigate(`/shop?search=${encodeURIComponent(q)}`);
};
  

  return (
    
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-5">
       {/* <Link to="/" className="flex items-center gap-3 shrink-0">
  <img
    src="/logo.png"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
    alt="MGRM Medicare"
      className="h-14 md:h-16 w-auto object-contain hover:scale-105 transition duration-300"
  />
</Link> */}
<Logo3D />

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-zinc-500" size={18} />
          <input
            name="search"
            placeholder="Search products, category, body part..."
            className="w-full theme-panel rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 shadow-sm focus:ring-2 focus:ring-cyan-500/40 dark:focus:ring-cyan-400/35 transition-all duration-300"
          />
        </form>

        <nav className="hidden lg:flex items-center gap-6 font-bold text-sm text-slate-800 dark:text-zinc-200">
          <div className="group py-5">
            <button className="flex items-center gap-1">Find Support By Body Area <ChevronDown size={15} /></button>
            <div className="hidden group-hover:block absolute left-0 right-0 top-[70px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-t border-slate-100 dark:border-white/10">
              <div className="max-w-7xl mx-auto grid grid-cols-5 gap-5 p-6">
                {bodyCategories.map((cat) => (
                  <button key={cat.name} onClick={() => navigate(`/shop?category=${cat.query}`)} className="group/card flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-left">
                    <div className="w-12 h-12 rounded-xl grid place-items-center" style={{ background: `${cat.color}22` }}>
                      <img src={cat.image} onError={(e) => (e.currentTarget.src = "/products/knee.png")} className="w-10 h-10 object-cover rounded-lg" />
                    </div>
                    <div>
                      <p className="font-black group-hover/card:text-cyan-600">{cat.name}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">{cat.count} products</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="group py-5">
            <button className="flex items-center gap-1">Shop By Activity <ChevronDown size={15} /></button>
            <div className="hidden group-hover:block absolute left-0 right-0 top-[70px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-t">
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 p-6">
                {activities.map((item) => (
                  <button key={item.name} onClick={() => navigate(`/shop-by-activity?activity=${encodeURIComponent(item.name)}`)}className="relative h-28 rounded-2xl overflow-hidden group/activity text-left">
                    <img src={item.image} className="w-full h-full object-cover group-hover/activity:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-black/35" />
                    <span className="absolute left-4 bottom-4 text-white font-black">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div> */}

          <div className="group relative py-5">
  <button className="flex items-center gap-1">
    Shop By Activity <ChevronDown size={15} />
  </button>

  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 top-full w-[980px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/10 rounded-3xl z-[999] transition-all duration-300">
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-xs font-bold tracking-widest text-purple-600">
            SHOP BY ACTIVITY
          </p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100">
            Choose your lifestyle
          </h3>
        </div>

        <button
          onClick={() => navigate("/shop-by-activity")}
          className="text-sm font-bold text-purple-600 hover:text-purple-800"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {activities.slice(0, 12).map((item) => (
          <button
            key={item.name}
            onClick={() =>
              navigate(`/shop-by-activity?activity=${encodeURIComponent(item.name)}`)
            }
            className="relative h-28 rounded-2xl overflow-hidden group/activity shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
          >
            <img
              src={item.image}
              className="w-full h-full object-cover group-hover/activity:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover/activity:opacity-100 bg-purple-600/20 transition" />

            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
              <span className="text-white font-bold text-sm">{item.name}</span>
              <span className="opacity-0 group-hover/activity:opacity-100 translate-x-3 group-hover/activity:translate-x-0 transition text-white text-lg">
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
</div>

<div className="relative group">
  {/* <button className="text-slate-700 dark:text-zinc-300 font-semibold hover:text-cyan-600 transition">
    About Us
  </button> */}
  <Link to="/about-us">
  About Us
</Link>

  <div className="absolute top-full left-0 mt-4 w-72 rounded-3xl bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.10)] border border-slate-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 z-50">

    {aboutLinks.map((item) => (
   <Link
   key={item}
   to={`/about-us#${item.toLowerCase().replace(/\s+/g, "-")}`}
        className="block px-4 py-3 rounded-2xl hover:bg-cyan-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-cyan-700 dark:hover:text-cyan-400 font-medium transition"
      >
        {item}
        </Link>
    ))}
  </div>
</div>

          {/* <NavLink to="/shop">Products</NavLink> */}
          <NavLink to="/blogs">Blogs</NavLink>
          <NavLink to="/support">Support</NavLink>
        </nav>

        

        <div className="flex gap-2 ml-auto items-center">
          <ThemeToggle />
          {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="absolute -top-1 -right-1 text-xs bg-pink-500 text-white rounded-full w-5 h-5 grid place-items-center">{wishlist.length}</span>}
          </button> */}
          <button
  onClick={() => navigate("/wishlist")}
  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
>
  <HeartPulse  size={20} />

  {wishlist.length > 0 && (
    <span className="absolute -top-1 -right-1 text-xs bg-pink-500 text-white rounded-full w-5 h-5 grid place-items-center">
      {wishlist.length}
    </span>
  )}
</button>

          {user?.role === "admin" && <Link to="/admin" className="font-bold text-sm theme-text">Admin</Link>}
          {user && <Link to="/orders" className="font-bold text-sm theme-text">Orders</Link>}

          {user ? (
            <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"><LogOut size={20} /></button>
          ) : (
            <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"><User size={20} /></Link>
          )}

          <button onClick={() => setCartOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}