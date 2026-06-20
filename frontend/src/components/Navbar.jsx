import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, HeartPulse, User, LogOut, ChevronDown, Menu, X } from "lucide-react";
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

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, authReady } = useAuth();
  const { openDashboard, closeDashboard } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBodyOpen, setMobileBodyOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setMobileBodyOpen(false);
    setMobileAboutOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    closeDashboard();
    setMobileOpen(false);
    await logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const q = e.target.search.value.trim();

    if (!q) {
      navigate("/shop");
      setMobileOpen(false);
      return;
    }

    const matchedActivity = activitiess.find((item) =>
      item.name.toLowerCase().includes(q.toLowerCase())
    );

    if (matchedActivity) {
      navigate(
        `/shop-by-activity?activity=${encodeURIComponent(matchedActivity.name)}`
      );
      setMobileOpen(false);
      return;
    }

    trackSearch(q);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-app/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 min-w-0 overflow-x-clip">
        <Logo3D />

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0 max-w-xl relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-zinc-500" size={18} />
          <input
            name="search"
            placeholder="Search products, category, body part..."
            className="w-full min-w-0 theme-panel rounded-2xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 shadow-sm focus:ring-2 focus:ring-cyan-500/40 dark:focus:ring-cyan-400/35 transition-all duration-300"
          />
        </form>

        <nav className="hidden lg:flex items-center gap-6 font-bold text-sm text-slate-800 dark:text-zinc-200 shrink-0">
          <div className="group py-5">
            <button type="button" className="flex items-center gap-1 whitespace-nowrap">
              Find by Body Area <ChevronDown size={15} />
            </button>
            <div className="hidden group-hover:block absolute left-0 right-0 top-[70px] bg-app/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-t border-slate-100 dark:border-white/10">
              <div className="max-w-7xl mx-auto grid grid-cols-5 gap-5 p-6">
                {bodyCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => navigate(`/shop?category=${cat.query}`)}
                    className="body-area-chip group/card flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition text-left"
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
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg"
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
            <button type="button" className="flex items-center gap-1 whitespace-nowrap">
              Shop By Activity <ChevronDown size={15} />
            </button>

            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-1/2 -translate-x-1/2 top-full w-[980px] max-w-[calc(100vw-2rem)] bg-app/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/10 rounded-3xl z-[999] transition-all duration-300">
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
                    type="button"
                    onClick={() => navigate("/shop-by-activity")}
                    className="text-sm font-bold text-purple-600 hover:text-purple-800"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
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
                        <span className="opacity-0 group-hover/activity:opacity-100 translate-x-3 group-hover/activity:translate-x-0 transition text-white text-lg shrink-0">
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
            <Link to="/about-us" className="whitespace-nowrap">
              About Us
            </Link>

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

          <NavLink to="/blogs" className="whitespace-nowrap">
            Blogs
          </NavLink>
          <NavLink to="/support" className="whitespace-nowrap">
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

          {authReady && user?.role === "admin" && (
            <Link to="/admin" className="font-bold text-sm theme-text hidden md:inline whitespace-nowrap">
              Admin
            </Link>
          )}
          {authReady && user && (
            <button
              type="button"
              onClick={() => openDashboard()}
              className="font-bold text-sm theme-text hidden md:inline hover:opacity-80 transition whitespace-nowrap"
            >
              Dashboard
            </button>
          )}

          {!authReady ? null : user ? (
            <button
              type="button"
              onClick={handleLogout}
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
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>

      {mobileOpen &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[400]">
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="mobile-nav-drawer absolute right-0 top-0 bottom-0 w-[min(100vw-3rem,340px)] bg-card dark:bg-slate-950 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden z-10 text-fg"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 shrink-0">
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-hover text-slate-800 dark:text-zinc-100"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scroll overscroll-contain px-4 py-4 space-y-4">
                <form onSubmit={handleSearch} className="md:hidden relative">
                  <Search className="absolute left-3 top-3 text-gray-400 dark:text-zinc-500" size={18} />
                  <input
                    name="search"
                    placeholder="Search products..."
                    className="w-full min-w-0 theme-panel rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15"
                  />
                </form>

                <div className="space-y-1 font-bold text-sm text-slate-800 dark:text-zinc-100">
                  <button
                    type="button"
                    onClick={() => setMobileBodyOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-surface-hover text-left text-inherit"
                  >
                    Find by Body Area
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${mobileBodyOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileBodyOpen && (
                    <div className="pl-2 pb-2 space-y-1 max-h-52 overflow-y-auto custom-scroll">
                      <button
                        type="button"
                        onClick={() => go("/shop-by-body")}
                        className="w-full text-left px-3 py-2 rounded-lg text-purple-600 font-bold"
                      >
                        View all body areas
                      </button>
                      {bodyCategories.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => go(`/shop?category=${encodeURIComponent(cat.query)}`)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-hover font-medium text-inherit"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => go("/shop-by-activity")}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-surface-hover text-inherit"
                  >
                    Shop By Activity
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileAboutOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-surface-hover text-left text-inherit"
                  >
                    About Us
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileAboutOpen && (
                    <div className="pl-2 pb-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => go("/about-us")}
                        className="w-full text-left px-3 py-2 rounded-lg text-purple-600 font-bold"
                      >
                        About overview
                      </button>
                      {aboutLinks.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            go(`/about-us#${item.toLowerCase().replace(/\s+/g, "-")}`)
                          }
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-hover font-medium text-inherit"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => go("/blogs")}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-surface-hover text-inherit"
                  >
                    Blogs
                  </button>
                  <button
                    type="button"
                    onClick={() => go("/support")}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-surface-hover text-inherit"
                  >
                    Support
                  </button>
                  <button
                    type="button"
                    onClick={() => go("/shop")}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-surface-hover text-inherit"
                  >
                    Shop
                  </button>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-2 text-slate-800 dark:text-zinc-100">
                  {authReady && user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => go("/admin")}
                      className="w-full text-left px-3 py-2 rounded-xl font-bold hover:bg-surface-hover text-inherit"
                    >
                      Admin
                    </button>
                  )}
                  {authReady && user && (
                    <button
                      type="button"
                      onClick={() => {
                        openDashboard();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl font-bold hover:bg-surface-hover text-inherit"
                    >
                      Dashboard
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
