import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ShoppingCart, HeartPulse, User, LogOut, ChevronDown, Menu, X, Briefcase, MapPin, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { bodyCategories, activitiess } from "../data/siteData";
import { useProductStats } from "../context/ProductStatsContext";
import { trackSearch } from "../utils/recommendationBehavior";
import { normalizeSearchQuery } from "../utils/searchNormalizer";
import Logo3D from "./Logo3D";
import NavbarBrandMark from "./NavbarBrandMark";
import ThemeSelector from "./ThemeSelector";
import { useTheme } from "../context/ThemeContext";
import "../theme/navbar-logo.css";
import { useTypewriterPlaceholder } from "../hooks/useTypewriterPlaceholder";

const ABOUT_LINKS = [
  { key: "nav.aboutLinks.history", slug: "our-history" },
  { key: "nav.aboutLinks.achievements", slug: "achievements" },
  { key: "nav.aboutLinks.quality", slug: "quality-certifications" },
  { key: "nav.aboutLinks.timelines", slug: "mgrm-timelines" },
  { key: "nav.aboutLinks.leadership", slug: "leadership" },
  { key: "nav.aboutLinks.testimonials", slug: "testimonials" },
];

const SUPPORT_LINKS = [
  { labelKey: "nav.supportLinks.careers", to: "/careers", Icon: Briefcase },
  { labelKey: "nav.supportLinks.storeLocator", to: "/support/store-locator", Icon: MapPin },
  { labelKey: "nav.supportLinks.warranty", to: "/support/warranty", Icon: ShieldCheck },
];

function NavbarSearchField({
  iconClassName,
  inputClassName,
  overlayClassName,
  iconSize = 17,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  animatedText,
  searchAriaLabel,
}) {
  const showOverlay = !value;

  return (
    <>
      <Search className={iconClassName} size={iconSize} />
      <input
        name="search"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder=""
        aria-label={searchAriaLabel}
        autoComplete="off"
        className={inputClassName}
      />
      {showOverlay && (
        <span
          className={`${overlayClassName} typewriter-placeholder transition-opacity duration-300 ease-out ${
            focused ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          <span className="typewriter-placeholder__text">{animatedText}</span>
          <span className="typewriter-placeholder__cursor" />
        </span>
      )}
    </>
  );
}

const NAV_MENU_CLOSE_DELAY = 280;
const NAVBAR_LOGO_LIGHT = "/products/logs.png";
const NAVBAR_LOGO_DARK = "/brand/mgrm-logo-navbar-dark.png";

const DASHBOARD_PENDING_KEY = "mgrm_dashboard_pending";

export default function Navbar() {
  const { t } = useTranslation();
  const { isLight } = useTheme();
  const navigate = useNavigate();
  const searchPlaceholder = t("nav.searchPlaceholder");
  const { categoriesWithCounts } = useProductStats();
  const location = useLocation();
  const { cartCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, authReady } = useAuth();
  const { openDashboard, closeDashboard } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBodyOpen, setMobileBodyOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileSupportOpen, setMobileSupportOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuCloseTimerRef = useRef(null);
  const typewriterPlaceholder = useTypewriterPlaceholder(
    searchPlaceholder,
    !searchDraft
  );

  const handleMenuEnter = (menuId) => {
    if (menuCloseTimerRef.current) {
      clearTimeout(menuCloseTimerRef.current);
      menuCloseTimerRef.current = null;
    }
    setOpenMenu(menuId);
  };

  const handleMenuLeave = () => {
    menuCloseTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, NAV_MENU_CLOSE_DELAY);
  };

  const handleDashboardClick = () => {
    if (!user) {
      sessionStorage.setItem(DASHBOARD_PENDING_KEY, "1");
      navigate("/register");
      return;
    }
    openDashboard();
  };

  const searchFieldProps = {
    value: searchDraft,
    onChange: (e) => setSearchDraft(e.target.value),
    focused: searchFocused,
    onFocus: () => setSearchFocused(true),
    onBlur: () => setSearchFocused(false),
    animatedText: typewriterPlaceholder,
    searchAriaLabel: searchPlaceholder,
  };

  useEffect(() => {
    setMobileOpen(false);
    setMobileBodyOpen(false);
    setMobileAboutOpen(false);
    setMobileSupportOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (menuCloseTimerRef.current) clearTimeout(menuCloseTimerRef.current);
    };
  }, []);

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

    const { display, search: apiQuery } = normalizeSearchQuery(q);

    const matchedActivity = activitiess.find((item) =>
      item.name.toLowerCase().includes(apiQuery.toLowerCase())
    );

    if (matchedActivity) {
      navigate(
        `/shop-by-activity?activity=${encodeURIComponent(matchedActivity.name)}`
      );
      setMobileOpen(false);
      return;
    }

    trackSearch(display);
    navigate(`/shop?search=${encodeURIComponent(display)}`);
    setMobileOpen(false);
  };

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
    <header className="site-navbar sticky top-0 z-50 relative bg-app/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3.5 flex items-center gap-1 sm:gap-2 lg:gap-2.5 xl:gap-3 min-w-0">
        {/* <Logo3D /> */}
        {/* <Link to="/" className="flex items-center h-14 overflow-hidden">
  <img
    src="/products/logs.png"
    alt="Logo"
    className="w-[150px] h-auto object-contain"
  />
</Link> */}
{/* <Link to="/" className="flex items-center h-14">
  <img
    src="/products/logs.png"
    alt="Logo"
    className="max-h-full w-auto object-contain"
  />
</Link> */}
{/* <Link to="/" className="flex items-center h-full">
  <img
    src="/products/mgrm.png"
    alt="Logo"
    className="max-h-full w-auto object-contain"
  />
</Link> */}
{/* <Link to="/" className="flex items-center h-full overflow-visible">
  <img
    src="/products/mgrm.png"
    alt="Logo"
    className="max-h-full w-auto object-contain scale-125 origin-left"
  />
</Link> */}

{/* <Link to="/" className="navbar-logo-link flex items-center h-14">
  <NavbarBrandMark />
  <img
    src={isLight ? NAVBAR_LOGO_LIGHT : NAVBAR_LOGO_DARK}
    alt="Logo"
    className="navbar-logo-img h-[80px] w-auto object-contain"
  />
</Link> */}
<Link to="/" className="navbar-logo-link flex items-center shrink-0">
  <img
    src={isLight ? "/products/mgrmlight.png" : "/products/mgrmdark.png"}
    alt="MGRM Medicare"
    className="navbar-logo-img"
  />
</Link>


        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 min-w-[9rem] lg:min-w-[11rem] xl:min-w-[14rem] relative mx-1 sm:mx-2"
        >
          <NavbarSearchField
            {...searchFieldProps}
            iconClassName="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none"
            inputClassName="w-full min-w-0 theme-panel rounded-2xl py-2 xl:py-2.5 pl-9 xl:pl-10 pr-3 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 shadow-sm focus:ring-2 focus:ring-cyan-500/40 dark:focus:ring-cyan-400/35 transition-all duration-300"
            overlayClassName="absolute left-9 xl:left-10 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-slate-500 dark:text-slate-400 truncate right-3"
          />
        </form>

        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 font-bold text-[13px] xl:text-sm text-slate-800 dark:text-zinc-200 shrink-0">
          <div
            className="py-3"
            onMouseEnter={() => handleMenuEnter("body")}
            onMouseLeave={handleMenuLeave}
          >
            <button type="button" className="flex items-center gap-1 whitespace-nowrap">
              {t("nav.findByBody")} <ChevronDown size={15} />
            </button>
            <div
              className={`absolute left-0 right-0 top-full -mt-8 pt-8 ${
                openMenu === "body" ? "block" : "hidden"
              } bg-app/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-t border-slate-100 dark:border-white/10 z-[999]`}
              onMouseEnter={() => handleMenuEnter("body")}
              onMouseLeave={handleMenuLeave}
            >
              <div className="max-w-7xl mx-auto grid grid-cols-5 gap-5 p-6">
                {categoriesWithCounts.map((cat) => (
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
                        {t("common.productsCount", { count: cat.count })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className="py-3"
            onMouseEnter={() => handleMenuEnter("activity")}
            onMouseLeave={handleMenuLeave}
          >
            <button type="button" className="flex items-center gap-1 whitespace-nowrap">
              {t("nav.shopByActivity")} <ChevronDown size={15} />
            </button>

            <div
              className={`activity-nav-dropdown absolute left-0 right-0 top-full -mt-8 pt-8 ${
                openMenu === "activity" ? "block" : "hidden"
              } bg-app/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl border-t border-slate-100 dark:border-white/10 z-[999] min-h-[calc(92vh-6rem)] max-h-[calc(92vh-6rem)] overflow-y-auto`}
              onMouseEnter={() => handleMenuEnter("activity")}
              onMouseLeave={handleMenuLeave}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(92vh-6rem)] flex flex-col">
                <div className="flex justify-between items-center mb-6 gap-4 shrink-0">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-purple-600">
                      {t("nav.shopByActivityLabel")}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-zinc-100">
                      {t("nav.chooseLifestyle")}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/shop-by-activity")}
                    className="text-sm font-bold text-purple-600 hover:text-purple-800 shrink-0"
                  >
                    {t("common.viewAll")}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 flex-1 content-start auto-rows-auto">
                  {activitiess.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/shop-by-activity?activity=${encodeURIComponent(item.name)}`
                        )
                      }
                      className="relative w-full aspect-[16/10] sm:aspect-[5/3] lg:aspect-[3/2] rounded-2xl overflow-hidden group/activity shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover/activity:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-0 opacity-0 group-hover/activity:opacity-100 bg-purple-600/20 transition" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <span className="text-white font-bold text-sm md:text-base truncate">{item.name}</span>
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

          <div
            className="relative py-3"
            onMouseEnter={() => handleMenuEnter("about")}
            onMouseLeave={handleMenuLeave}
          >
            <Link to="/about-us" className="whitespace-nowrap">
              {t("nav.aboutUs")}
            </Link>

            <div
              className={`about-nav-dropdown absolute top-full left-0 -mt-3 pt-3 w-72 rounded-3xl bg-white/95 dark:bg-slate-900/96 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] border border-slate-200 dark:border-white/14 transition-all duration-300 p-4 z-50 ${
                openMenu === "about"
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible translate-y-2 pointer-events-none"
              }`}
              onMouseEnter={() => handleMenuEnter("about")}
              onMouseLeave={handleMenuLeave}
            >
              {ABOUT_LINKS.map((item) => (
                <Link
                  key={item.key}
                  to={`/about-us#${item.slug}`}
                  className="about-nav-dropdown-link block px-4 py-3 rounded-2xl hover:bg-cyan-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/blogs" className="whitespace-nowrap">
            {t("nav.blogs")}
          </NavLink>

          <div
            className="relative py-3"
            onMouseEnter={() => handleMenuEnter("support")}
            onMouseLeave={handleMenuLeave}
          >
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `flex items-center gap-1 whitespace-nowrap transition ${
                  isActive || location.pathname.startsWith("/support/")
                    ? "text-cyan-600 dark:text-cyan-400"
                    : ""
                }`
              }
            >
              {t("nav.support")}{" "}
              <ChevronDown
                size={15}
                className={`transition-transform duration-250 ${
                  openMenu === "support" ? "rotate-180" : ""
                }`}
              />
            </NavLink>

            <div
              className={`support-nav-dropdown absolute top-full left-1/2 -translate-x-1/2 -mt-2 pt-2 w-72 rounded-[22px] bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-slate-200/80 dark:border-white/14 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] p-3 z-50 ${
                openMenu === "support"
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible translate-y-2 pointer-events-none"
              }`}
              onMouseEnter={() => handleMenuEnter("support")}
              onMouseLeave={handleMenuLeave}
            >
              {SUPPORT_LINKS.map(({ labelKey, to, Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`support-nav-dropdown-link flex items-center gap-3 px-4 py-3.5 rounded-[18px] font-medium transition-all duration-250 ${
                      active ? "support-nav-dropdown-link--active" : ""
                    }`}
                  >
                    <span className="support-nav-dropdown-icon w-9 h-9 rounded-xl grid place-items-center shrink-0 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                      <Icon size={18} />
                    </span>
                    {t(labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="flex gap-0.5 sm:gap-1.5 items-center shrink-0 ml-auto lg:ml-0">
          <ThemeSelector />
          <button
            type="button"
            onClick={() => navigate("/wishlist")}
            className="site-navbar-icon-btn p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
            aria-label={t("nav.wishlist")}
          >
            <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-[9px] sm:text-xs bg-pink-500 text-white rounded-full w-3.5 h-3.5 sm:w-5 sm:h-5 grid place-items-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {authReady && user?.role === "admin" && (
            <Link to="/admin" className="font-bold text-sm theme-text hidden xl:inline whitespace-nowrap">
              {t("common.admin")}
            </Link>
          )}
          {authReady && (
            <button
              type="button"
              onClick={handleDashboardClick}
              className="font-bold text-sm theme-text hidden xl:inline hover:opacity-80 transition whitespace-nowrap"
            >
              {t("common.dashboard")}
            </button>
          )}

          {!authReady ? null : user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="site-navbar-icon-btn p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
              aria-label={t("nav.logout")}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="site-navbar-icon-btn p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
              aria-label={t("nav.login")}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="site-navbar-icon-btn p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
            aria-label={t("nav.openCart")}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 text-[9px] sm:text-xs bg-red-500 text-white rounded-full w-3.5 h-3.5 sm:w-5 sm:h-5 grid place-items-center">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="site-navbar-icon-btn lg:hidden p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label={t("nav.openMenu")}
          >
            <Menu className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
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
              aria-label={t("nav.closeMenu")}
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="mobile-nav-drawer overlay-drawer-panel absolute right-0 top-0 bottom-0 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden z-10 text-fg"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 shrink-0">
                <span className="font-bold text-sm text-slate-800 dark:text-zinc-100">{t("common.menu")}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-hover text-slate-800 dark:text-zinc-100"
                  aria-label={t("nav.closeMenu")}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scroll overscroll-contain px-4 py-4 space-y-4">
                <form onSubmit={handleSearch} className="md:hidden relative">
                  <NavbarSearchField
                    {...searchFieldProps}
                    iconSize={18}
                    iconClassName="absolute left-3 top-3 text-gray-400 dark:text-zinc-500 pointer-events-none"
                    inputClassName="w-full min-w-0 theme-panel rounded-2xl py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15"
                    overlayClassName="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-slate-500 dark:text-slate-400 truncate right-4"
                  />
                </form>

                <div className="space-y-1 font-bold text-sm text-slate-800 dark:text-zinc-100">
                  <button
                    type="button"
                    onClick={() => setMobileBodyOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-surface-hover text-left text-inherit"
                  >
                    {t("nav.findByBody")}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${mobileBodyOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileBodyOpen && (
                    <div className="pl-2 pb-2 space-y-1 max-h-52 overflow-y-auto custom-scroll">
                      <button
                        type="button"
                        onClick={() => go("/shop")}
                        className="w-full text-left px-3 py-2 rounded-lg text-purple-600 font-bold"
                      >
                        {t("nav.viewAllBodyAreas")}
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
                    {t("nav.shopByActivity")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileAboutOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-surface-hover text-left text-inherit"
                  >
                    {t("nav.aboutUs")}
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
                        {t("nav.aboutOverview")}
                      </button>
                      {ABOUT_LINKS.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => go(`/about-us#${item.slug}`)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-hover font-medium text-inherit"
                        >
                          {t(item.key)}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => go("/blogs")}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-surface-hover text-inherit"
                  >
                    {t("nav.blogs")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileSupportOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-surface-hover text-left text-inherit"
                  >
                    {t("nav.support")}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-250 ${mobileSupportOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileSupportOpen && (
                    <div className="pl-2 pb-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => go("/support")}
                        className="w-full text-left px-3 py-2 rounded-lg text-cyan-600 font-bold"
                      >
                        {t("nav.contactSupport")}
                      </button>
                      {SUPPORT_LINKS.map(({ labelKey, to, Icon }) => (
                        <button
                          key={to}
                          type="button"
                          onClick={() => go(to)}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-surface-hover font-medium text-inherit"
                        >
                          <Icon size={16} className="text-cyan-600 shrink-0" />
                          {t(labelKey)}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => go("/shop")}
                    className="w-full text-left px-3 py-3 rounded-xl hover:bg-surface-hover text-inherit"
                  >
                    {t("common.shop")}
                  </button>
                </div>

                <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-2 text-slate-800 dark:text-zinc-100">
                  {authReady && user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => go("/admin")}
                      className="w-full text-left px-3 py-2 rounded-xl font-bold hover:bg-surface-hover text-inherit"
                    >
                      {t("common.admin")}
                    </button>
                  )}
                  {authReady && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDashboardClick();
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl font-bold hover:bg-surface-hover text-inherit"
                    >
                      {t("common.dashboard")}
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
