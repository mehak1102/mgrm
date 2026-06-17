import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  HeartPulse,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { bodyCategories, activitiess } from "../data/siteData";
import { trackSearch } from "../utils/recommendationBehavior";
import Logo3D from "./Logo3D";
import ThemeSelector from "./ThemeSelector";

const aboutLinks = [
  "Our History",
  "Achievements",
  "Quality Certifications",
  "MGRM Timelines",
  "Leadership",
  "Testimonials",
];

const navLinkClass = ({ isActive }) =>
  `font-bold text-sm transition ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-800 dark:text-zinc-200"}`;

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { openDashboard } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBodyOpen, setMobileBodyOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileBodyOpen(false);
    setMobileAboutOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const q = e.target.search.value.trim();

    if (!q) {
      navigate("/shop");
      closeMobile();
      return;
    }

    const matchedActivity = activitiess.find((item) =>
      item.name.toLowerCase().includes(q.toLowerCase())
    );

    if (matchedActivity) {
      navigate(
        `/shop-by-activity?activity=${encodeURIComponent(matchedActivity.name)}`
      );
      closeMobile();
      return;
    }

    trackSearch(q);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    closeMobile();
  };

  const goCategory = (query) => {
    navigate(`/shop?category=${query}`);
    closeMobile();
  };

  const searchInputClass =
    "w-full theme-panel rounded-2xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 shadow-sm focus:ring-2 focus:ring-cyan-500/40 dark:focus:ring-cyan-400/35 transition-all duration-300";

  return (
    <header className="sticky top-0 z-50 bg-app/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Logo3D />

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={18} />
            <input
              name="search"
              placeholder="Search products, category, body part..."
              className={searchInputClass}
            />
          </form>

          <nav className="hidden lg:flex items-center gap-6 font-bold text-sm text-slate-800 dark:text-zinc-200 shrink-0">
            <div className="group py-5">
              <button type="button" className="flex items-center gap-1">
                Find by Body Area <ChevronDown size={15} />
              </button>
              <div className="nav-body-panel hidden group-hover:block absolute left-0 right-0 top-[70px] bg-app/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-t border-slate-100 dark:border-white/10">
                <div className="max-w-7xl mx-auto nav-body-grid grid grid-cols-5 gap-5 p-6">
                  {bodyCategories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => goCategory(cat.query)}
                      className="body-area-chip group/card flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-left min-w-0"
                    >
                      <div
                        className="w-12 h-12 rounded-xl grid place-items-center shrink-0"
                        style={{ background: `${cat.color}22` }}
                      >
                        <img
                          src={cat.image}
                          onError={(e) => {
                            e.currentTarget.src = "/products/knee.png";
                          }}
                          className="w-10 h-10 object-cover rounded-lg"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="body-area-chip-label font-black group-hover/card:text-cyan-600 truncate">
                          {cat.name}
                        </p>
                        <p className="body-area-chip-count text-xs text-gray-500 dark:text-zinc-400">
                          {cat.count} products
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative py-5">
              <button type="button" className="flex items-center gap-1">
                Shop By Activity <ChevronDown size={15} />
              </button>

              <div className="nav-activity-panel invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 top-full w-[980px] max-w-[calc(100vw-2rem)] bg-app/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/10 rounded-3xl z-[999] transition-all duration-300">
                <div className="px-6 py-6">
                  <div className="flex justify-between items-center mb-5 gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-purple-600">
                        SHOP BY ACTIVITY
                      </p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-100">
                        Choose your lifestyle
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/shop-by-activity")}
                      className="text-sm font-bold text-purple-600 hover:text-purple-800 shrink-0"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activitiess.slice(0, 12).map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/shop-by-activity?activity=${encodeURIComponent(item.name)}`
                          )
                        }
                        className="relative h-28 rounded-2xl overflow-hidden group/activity shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover group-hover/activity:scale-110 transition duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute inset-0 opacity-0 group-hover/activity:opacity-100 bg-purple-600/20 transition" />
                        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
                          <span className="text-white font-bold text-sm truncate">{item.name}</span>
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
              <Link to="/about-us">About Us</Link>

              <div className="about-nav-dropdown absolute top-full left-0 mt-4 w-72 rounded-3xl bg-white/95 dark:bg-slate-900/96 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] border border-slate-200 dark:border-white/14 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 z-50">
                {aboutLinks.map((item) => (
                  <Link
                    key={item}
                    to={`/about-us#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="about-nav-dropdown-link block px-4 py-3 rounded-2xl hover:bg-cyan-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <NavLink to="/blogs" className={navLinkClass}>
              Blogs
            </NavLink>
            <NavLink to="/support" className={navLinkClass}>
              Support
            </NavLink>
          </nav>

          <div className="flex gap-1 sm:gap-2 ml-auto items-center shrink-0">
            <ThemeSelector />
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
              aria-label="Wishlist"
            >
              <HeartPulse size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-pink-500 text-white rounded-full w-5 h-5 grid place-items-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {user?.role === "admin" && (
              <Link to="/admin" className="font-bold text-sm theme-text hidden sm:inline">
                Admin
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={() => openDashboard()}
                className="font-bold text-sm theme-text hidden sm:inline hover:opacity-80 transition"
              >
                Dashboard
              </button>
            )}

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                aria-label="Log in"
              >
                <User size={20} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="md:hidden mt-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={17} />
          <input
            name="search"
            placeholder="Search products..."
            className={searchInputClass}
          />
        </form>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-white/10 bg-app/98 dark:bg-slate-950/98 backdrop-blur-xl max-h-[min(70vh,520px)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-1">
            <button
              type="button"
              onClick={() => setMobileBodyOpen((v) => !v)}
              className="w-full flex items-center justify-between py-3 font-bold text-slate-800 dark:text-zinc-100"
            >
              Find by Body Area
              <ChevronDown size={16} className={`transition ${mobileBodyOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileBodyOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3">
                {bodyCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => goCategory(cat.query)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 text-left min-w-0"
                  >
                    <img src={cat.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <span className="font-bold text-sm truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                navigate("/shop-by-activity");
                closeMobile();
              }}
              className="w-full text-left py-3 font-bold text-slate-800 dark:text-zinc-100"
            >
              Shop By Activity
            </button>

            <button
              type="button"
              onClick={() => setMobileAboutOpen((v) => !v)}
              className="w-full flex items-center justify-between py-3 font-bold text-slate-800 dark:text-zinc-100"
            >
              About Us
              <ChevronDown size={16} className={`transition ${mobileAboutOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileAboutOpen && (
              <div className="space-y-1 pb-3 pl-2">
                {aboutLinks.map((item) => (
                  <Link
                    key={item}
                    to={`/about-us#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={closeMobile}
                    className="block py-2 text-sm font-medium text-slate-700 dark:text-zinc-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}

            <NavLink to="/blogs" onClick={closeMobile} className={navLinkClass}>
              <span className="block py-3">Blogs</span>
            </NavLink>
            <NavLink to="/support" onClick={closeMobile} className={navLinkClass}>
              <span className="block py-3">Support</span>
            </NavLink>
            <NavLink to="/shop" onClick={closeMobile} className={navLinkClass}>
              <span className="block py-3">All Products</span>
            </NavLink>
            {user?.role === "admin" && (
              <Link to="/admin" onClick={closeMobile} className="block py-3 font-bold text-sm theme-text sm:hidden">
                Admin
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={() => {
                  openDashboard();
                  closeMobile();
                }}
                className="block w-full text-left py-3 font-bold text-sm theme-text sm:hidden"
              >
                Dashboard
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
