import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  ShoppingBag,
  Heart,
  MapPin,
  Headphones,
  BookOpen,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Star,
  Truck,
  Shield,
  Zap,
  Award,
  Menu,
  X,
  ArrowUpRight,
  Medal,
  LogOut,
} from "lucide-react";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useHomeRecommendations } from "../../hooks/useRecommendations";
import { productPriceSaleProps } from "../../utils/productPriceStyle";
import LanguageSwitcher from "../LanguageSwitcher";
import DashboardLayoutToggle from "./DashboardLayoutToggle";
import DashboardV2ThemeToggle from "./DashboardV2ThemeToggle";
import DashboardV2Hero from "./DashboardV2Hero";
import DashboardV2CategoryCarousel from "./DashboardV2CategoryCarousel";
import DashboardV2CatalogCard from "./DashboardV2CatalogCard";
import {
  countOpenSupportTickets,
  getDeliveredTrend,
  getNewOrderCount,
  getOrderTrend,
  resolveHeroProduct,
} from "./dashboardV2Metrics";
import {
  DASHBOARD_ASSETS,
  PHYSIO_DOCTORS,
  buildCatalogRotatorSlides,
  resolvePopularProducts,
} from "./dashboardV2Data";
import { useProductStats } from "../../context/ProductStatsContext";
import { productMatchesCategory } from "../../utils/categoryProductMatch";
import { bodyCategories } from "../../data/siteData";
import { getDashboardV2Theme } from "./dashboardTheme";

const QUICK_ACTIONS = [
  { key: "shop", icon: ShoppingBag, color: "#8b5cf6", labelKey: "dashboard.v2.quickShop", action: "route", target: "/shop" },
  { key: "categories", icon: LayoutGrid, color: "#3b82f6", labelKey: "dashboard.v2.quickCategories", action: "route", target: "/shop-by-body" },
  { key: "orders", icon: Package, color: "#10b981", labelKey: "dashboard.v2.quickOrders", action: "section", target: "orders" },
  { key: "wishlist", icon: Heart, color: "#ec4899", labelKey: "dashboard.v2.quickWishlist", action: "route", target: "/wishlist" },
  { key: "addresses", icon: MapPin, color: "#f59e0b", labelKey: "dashboard.v2.quickAddresses", action: "section", target: "addresses" },
  { key: "support", icon: Headphones, color: "#06b6d4", labelKey: "dashboard.v2.quickSupport", action: "route", target: "/support" },
];

function formatOrderStatus(status) {
  const s = status || "Processing";
  if (s === "Delivered") return { label: "Delivered", badge: "delivered" };
  if (s === "Shipped") return { label: "Shipped", badge: "shipped" };
  return { label: "Processing", badge: "processing" };
}

function initials(name) {
  return (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function UserAvatar({ name, image, className = "", imageClassName = "" }) {
  if (image) {
    return (
      <div className={`dashboard-v2__avatar ${className}`}>
        <img src={image} alt="" className={imageClassName} />
      </div>
    );
  }

  return (
    <div className={`dashboard-v2__avatar dashboard-v2__avatar--fallback ${className}`}>
      {initials(name)}
    </div>
  );
}

export default function DashboardV2Layout({ pageMode = true, onSection, onRoute, onExplore, onClose }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { theme, isBlue } = useTheme();
  const v2 = getDashboardV2Theme(theme);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [supportTicketCount, setSupportTicketCount] = useState(0);
  const [supportOpenCount, setSupportOpenCount] = useState(0);

  const loadSupportTickets = useCallback(() => {
    if (!user) {
      setSupportTicketCount(0);
      setSupportOpenCount(0);
      return;
    }
    API.get("/support/my")
      .then((r) => {
        const messages = r.data?.messages ?? [];
        const count = Number(r.data?.count ?? messages.length) || 0;
        const openCount =
          Number(r.data?.openCount ?? countOpenSupportTickets(messages)) || 0;
        setSupportTicketCount(Math.max(0, count));
        setSupportOpenCount(Math.max(0, openCount));
      })
      .catch(() => {
        /* Keep last known counts if refresh fails (e.g. brief auth blip). */
      });
  }, [user]);

  const { products: recommended } = useHomeRecommendations({ cart, limit: 6 });
  const displayName = user?.name?.trim() || t("common.there");
  const firstName = displayName.split(" ")[0];
  const profileImage = profile?.profileImage || "";

  const loadProfile = useCallback(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    API.get("/users/me")
      .then((r) => setProfile(r.data))
      .catch(() => setProfile(null));
  }, [user]);

  useEffect(() => {
    API.get("/products").then((r) => setProducts(r.data.products || [])).catch(() => {});
    API.get("/orders/my").then((r) => setOrders(r.data || [])).catch(() => {});
    loadSupportTickets();
    loadProfile();
  }, [loadSupportTickets, loadProfile]);

  useEffect(() => {
    const onProfileUpdated = () => loadProfile();
    window.addEventListener("mgrm:profile-updated", onProfileUpdated);
    return () => window.removeEventListener("mgrm:profile-updated", onProfileUpdated);
  }, [loadProfile]);

  useEffect(() => {
    const onSupportSubmitted = () => {
      setSupportOpenCount((count) => Math.max(0, count) + 1);
      setSupportTicketCount((count) => Math.max(0, count) + 1);
      loadSupportTickets();
    };
    window.addEventListener("mgrm:support-submitted", onSupportSubmitted);
    return () => window.removeEventListener("mgrm:support-submitted", onSupportSubmitted);
  }, [loadSupportTickets]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") loadSupportTickets();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadSupportTickets]);

  const deliveredCount = useMemo(() => orders.filter((o) => o.status === "Delivered").length, [orders]);
  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );
  const popularProducts = useMemo(
    () => resolvePopularProducts(products, recommended),
    [products, recommended]
  );

  const { categoriesWithCounts, bodyTotal, formatProductCount } = useProductStats();
  const [categoryIndex, setCategoryIndex] = useState(0);

  const rotatableCategories = useMemo(() => {
    const showcaseSlides = buildCatalogRotatorSlides(categoriesWithCounts);
    if (showcaseSlides.length) return showcaseSlides;

    const mapped = categoriesWithCounts.map((cat) => {
      const match = products.find(
        (p) => p?.images?.[0] && productMatchesCategory(p, cat.query)
      );
      return {
        ...cat,
        name: cat.name?.replace(/ And /g, " & ") || cat.name,
        productImage: match?.images?.[0] || null,
        productName: match?.name || null,
      };
    });

    const withProductPhotos = mapped.filter((c) => c.productImage);
    if (withProductPhotos.length) {
      const seen = new Set();
      return withProductPhotos.filter((cat) => {
        if (seen.has(cat.query)) return false;
        seen.add(cat.query);
        return true;
      });
    }

    return products
      .filter((p) => p?.images?.[0])
      .slice(0, bodyCategories.length)
      .map((p, i) => {
        const cat = bodyCategories[i % bodyCategories.length];
        return {
          ...cat,
          name: cat.name.replace(/ And /g, " & "),
          query: cat.query,
          count: 1,
          productImage: p.images[0],
          productName: p.name,
        };
      });
  }, [categoriesWithCounts, products]);

  useEffect(() => {
    if (!rotatableCategories.length) return undefined;
    const timer = setInterval(() => {
      setCategoryIndex((i) => (i + 1) % rotatableCategories.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [rotatableCategories.length]);

  const heroProduct = useMemo(
    () => resolveHeroProduct(products, recommended),
    [products, recommended]
  );
  const orderTrend = useMemo(() => getOrderTrend(orders), [orders]);
  const newOrderCount = useMemo(() => getNewOrderCount(orders), [orders]);
  const deliveredTrend = useMemo(() => getDeliveredTrend(orders), [orders]);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, labelKey: "dashboard.v2.navDashboard", active: true },
    { id: "products", icon: Package, labelKey: "dashboard.v2.navProducts" },
    { id: "categories", icon: LayoutGrid, labelKey: "dashboard.v2.navCategories" },
    { id: "orders", icon: ShoppingBag, labelKey: "dashboard.v2.navOrders" },
    { id: "wishlist", icon: Heart, labelKey: "dashboard.v2.navWishlist" },
    { id: "addresses", icon: MapPin, labelKey: "dashboard.v2.navAddresses" },
    { id: "support", icon: Headphones, labelKey: "dashboard.v2.navSupport" },
    { id: "recovery", icon: BookOpen, labelKey: "dashboard.v2.navRecovery" },
  ];

  const handleNav = (id) => {
    setSidebarOpen(false);
    switch (id) {
      case "dashboard": break;
      case "products":
        onRoute("/shop");
        break;
      case "categories":
        onRoute("/shop-by-body");
        break;
      case "orders": onSection("orders"); break;
      case "wishlist": onRoute("/wishlist"); break;
      case "addresses": onSection("addresses"); break;
      case "support": onRoute("/support"); break;
      case "recovery": onSection("recovery"); break;
      default: break;
    }
  };

  const handleQuickAction = (item) => {
    if (item.action === "section") onSection(item.target);
    else if (item.action === "route") onRoute(item.target);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) onRoute(`/shop?search=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
  };

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onDoc = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [profileOpen]);

  const statusBadgeClass = (badge) => {
    if (badge === "delivered") return v2.badgeDelivered;
    if (badge === "shipped") return v2.badgeShipped;
    return v2.badgeProcessing;
  };

  const stats = useMemo(
    () => [
      {
        key: "orders",
        labelKey: "dashboard.v2.totalOrders",
        value: orders.length,
        trend: orderTrend,
        icon: ShoppingBag,
        color: "#8b5cf6",
        glow: "rgba(139, 92, 246, 0.55)",
        cardBg: "rgba(139, 92, 246, 0.1)",
        cardBorder: "rgba(139, 92, 246, 0.22)",
        onClick: () => onSection("orders"),
      },
      {
        key: "wishlist",
        labelKey: "dashboard.v2.wishlistItems",
        value: wishlist.length,
        trend: wishlist.length > 0 ? `${wishlist.length} ${t("dashboard.v2.itemsSaved", { defaultValue: "saved" })}` : null,
        trendPlain: true,
        icon: Heart,
        color: "#ec4899",
        glow: "rgba(236, 72, 153, 0.55)",
        cardBg: "rgba(236, 72, 153, 0.1)",
        cardBorder: "rgba(236, 72, 153, 0.22)",
        iconFill: true,
        onClick: () => onRoute("/wishlist"),
      },
      {
        key: "delivered",
        labelKey: "dashboard.v2.ordersDelivered",
        value: deliveredCount,
        trend: deliveredTrend,
        icon: Truck,
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.55)",
        cardBg: "rgba(16, 185, 129, 0.1)",
        cardBorder: "rgba(16, 185, 129, 0.22)",
        onClick: () => onSection("orders"),
      },
      {
        key: "support",
        labelKey: "dashboard.v2.supportTickets",
        value: Math.max(0, supportOpenCount),
        totalSubmitted: supportTicketCount,
        trendKey:
          supportOpenCount > 0
            ? "dashboard.v2.openTickets"
            : supportTicketCount > 0
              ? "dashboard.v2.allResolved"
              : "dashboard.v2.noTicketsYet",
        isTextTrend: true,
        icon: Headphones,
        color: "#3b82f6",
        glow: "rgba(59, 130, 246, 0.55)",
        cardBg: "rgba(59, 130, 246, 0.1)",
        cardBorder: "rgba(59, 130, 246, 0.22)",
        onClick: () => onRoute("/support"),
      },
    ],
    [
      orders.length,
      wishlist.length,
      deliveredCount,
      supportOpenCount,
      supportTicketCount,
      orderTrend,
      deliveredTrend,
      t,
      onSection,
      onRoute,
    ]
  );

  return (
    <div className={`dashboard-v2 flex h-full min-h-0 ${pageMode ? "dashboard-v2--page" : ""} ${v2.pageBg || v2.shell}`}>
      {sidebarOpen && (
        <button type="button" className="dashboard-v2__sidebar-backdrop lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden />
      )}

      <aside className={`dashboard-v2__sidebar ${v2.sidebar} ${sidebarOpen ? "dashboard-v2__sidebar--open" : ""}`}>
        <div className="p-3 pb-2 border-b border-inherit shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 grid place-items-center text-white font-black text-base">M</div>
            <div>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${v2.accent}`}>MGRM</p>
              <p className={`text-xs font-bold ${v2.stat}`}>MEDICARE</p>
            </div>
          </div>
        </div>

        <div className="dashboard-v2__sidebar-scroll">
          <nav className="dashboard-v2__nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`dashboard-v2__nav-btn mb-0.5 ${item.active ? v2.navActive : v2.navIdle}`}
              >
                <item.icon size={15} strokeWidth={2} />
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          <div className="dashboard-v2__sidebar-panel">
            <div className={`dashboard-v2__physio ${v2.glass}`}>
              <p className={`text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 ${v2.muted}`}>
                <Medal size={11} className="text-amber-400 shrink-0" />
                {t("dashboard.grid.recommendedPhysio")}
              </p>
              {PHYSIO_DOCTORS.map((doc) => (
                <div key={doc.name} className="dashboard-v2__physio-doc">
                  <img src={doc.image} alt="" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-bold truncate ${v2.stat}`}>{doc.name}</p>
                    <p className={`text-[9px] truncate ${v2.muted}`}>{doc.title}</p>
                  </div>
                  <Star size={8} className="text-amber-400 fill-amber-400 shrink-0" />
                </div>
              ))}
              <button
                type="button"
                onClick={() => onExplore ? onExplore({ type: "therapy", title: t("dashboard.grid.recommendedPhysio") }) : onRoute("/recommended-by-physiotherapist")}
                className={`w-full flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg border ${v2.navActive}`}
              >
                {t("dashboard.v2.viewRecommendations")} <ChevronRight size={12} />
              </button>
            </div>

            <button type="button" onClick={() => onSection("profile")} className="dashboard-v2__sidebar-profile">
              <UserAvatar
                name={user?.name}
                image={profileImage}
                className="dashboard-v2__avatar--sidebar"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${v2.stat}`}>{user?.name}</p>
                <p className={`text-[10px] truncate ${v2.muted}`}>{user?.email}</p>
              </div>
            </button>

            <DashboardV2ThemeToggle />
          </div>
        </div>

        <div className="dashboard-v2__sidebar-bottom">
          <LanguageSwitcher variant="drawer" compact className="language-switcher--sidebar" />
          {pageMode && <DashboardLayoutToggle inline compact />}
        </div>
      </aside>

      <div className="dashboard-v2__main-col">
        <header className={`dashboard-v2__topbar border-b ${v2.headerBorder} ${v2.headerBg}`}>
          <button type="button" onClick={() => setSidebarOpen(true)} className={`lg:hidden w-9 h-9 rounded-lg grid place-items-center ${v2.closeBtn}`} aria-label="Menu"><Menu size={18} /></button>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className={`dashboard-v2__search border ${v2.searchBg}`}>
              <Search size={16} className={v2.muted} />
              <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("dashboard.v2.searchPlaceholder", { defaultValue: "Search products, categories..." })} />
              <kbd className={`hidden sm:inline text-[9px] font-mono px-1 py-0.5 rounded ${v2.chip}`}>⌘K</kbd>
            </div>
          </form>
          <div className="dashboard-v2__topbar-corner">
            <button
              type="button"
              className={`dashboard-v2__topbar-icon-btn relative ${v2.closeBtn}`}
              onClick={() => onSection("orders")}
              aria-label={t("dashboard.v2.newOrders", { defaultValue: "New orders", count: newOrderCount })}
            >
              <Bell size={16} />
              {newOrderCount > 0 && (
                <span className="dashboard-v2__topbar-badge">
                  {newOrderCount > 9 ? "9+" : newOrderCount}
                </span>
              )}
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className={`dashboard-v2__topbar-profile ${v2.glass}`}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <div className="dashboard-v2__topbar-avatar">
                  <UserAvatar
                    name={user?.name}
                    image={profileImage}
                    className="dashboard-v2__avatar--topbar"
                  />
                </div>
                <span className={`dashboard-v2__topbar-profile-name ${v2.stat}`}>
                  {user?.name?.trim() || "MGRM Medicare"}
                </span>
                <ChevronDown size={12} className={`dashboard-v2__topbar-chevron ${v2.muted} ${profileOpen ? "dashboard-v2__topbar-chevron--open" : ""}`} />
              </button>
              {profileOpen && (
                <div className={`dashboard-v2__topbar-menu ${v2.glassStrong}`} role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { onSection("profile"); setProfileOpen(false); }}
                    className={`dashboard-v2__topbar-menu-item ${v2.navIdle}`}
                  >
                    {t("dashboard.sections.profile")}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { onSection("settings"); setProfileOpen(false); }}
                    className={`dashboard-v2__topbar-menu-item ${v2.navIdle}`}
                  >
                    {t("dashboard.sections.settings")}
                  </button>
                  <div className="dashboard-v2__topbar-menu-divider" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="dashboard-v2__topbar-menu-item dashboard-v2__topbar-menu-item--logout"
                  >
                    <LogOut size={13} strokeWidth={2.15} />
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
            {onClose && (
              <button type="button" onClick={onClose} className={`dashboard-v2__topbar-icon-btn ${v2.closeBtn}`} aria-label={t("dashboard.close")}>
                <X size={16} />
              </button>
            )}
          </div>
        </header>

        <div className="dashboard-v2__grid">
          <div className="dashboard-v2__row dashboard-v2__row--hero">
            <DashboardV2Hero
              firstName={firstName}
              heroImage={heroProduct.image}
              heroName={heroProduct.name}
              themeId={theme}
              onExplore={() => onRoute("/shop")}
            />
            <div className="dashboard-v2__overview">
              <p className={`dashboard-v2__overview-title ${v2.stat}`}>{t("dashboard.v2.todaysOverview")}</p>
              <div className="dashboard-v2__stats">
                {stats.map((stat) => (
                  <button
                    key={stat.key}
                    type="button"
                    onClick={stat.onClick}
                    className="dashboard-v2__stat"
                    style={{
                      background: stat.cardBg,
                      borderColor: stat.cardBorder,
                    }}
                  >
                    <div
                      className="dashboard-v2__stat-icon"
                      style={{
                        color: stat.color,
                        background: `${stat.color}22`,
                        boxShadow: `0 0 28px ${stat.glow}, 0 0 48px ${stat.glow.replace("0.55", "0.2")}`,
                      }}
                    >
                      <stat.icon size={22} strokeWidth={2} fill={stat.iconFill ? stat.color : "none"} />
                    </div>
                    <div className="dashboard-v2__stat-body">
                      <p className={`dashboard-v2__stat-label ${v2.muted}`}>{t(stat.labelKey)}</p>
                      <p className={`dashboard-v2__stat-val ${v2.stat}`}>
                        {String(Math.max(0, Number(stat.value) || 0)).padStart(2, "0")}
                      </p>
                      <p className={`dashboard-v2__stat-trend ${v2.muted}`}>
                        {stat.isTextTrend
                          ? t(stat.trendKey, {
                              defaultValue:
                                stat.trendKey === "dashboard.v2.openTickets"
                                  ? "Open tickets"
                                  : stat.trendKey === "dashboard.v2.allResolved"
                                    ? "All resolved"
                                    : "No tickets yet",
                            })
                          : stat.trendPlain
                            ? stat.trend || t("dashboard.v2.noActivityYet", { defaultValue: "No recent activity" })
                            : stat.trend
                              ? `${stat.trend} ${t("dashboard.v2.vsLastWeek")}`
                              : t("dashboard.v2.noActivityYet", { defaultValue: "No recent activity" })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <DashboardV2CatalogCard
              categories={rotatableCategories}
              activeIndex={categoryIndex}
              bodyTotal={bodyTotal}
              formatProductCount={formatProductCount}
              onClick={(cat) =>
                onRoute(
                  cat?.query
                    ? `/shop?category=${encodeURIComponent(cat.query)}`
                    : "/shop"
                )
              }
            />
          </div>

          <div className="dashboard-v2__body">
            <div className="dashboard-v2__quick-section">
              <p className={`dashboard-v2__section-title ${v2.stat}`}>{t("dashboard.v2.quickActions")}</p>
              <div className="dashboard-v2__row dashboard-v2__row--quick">
                {QUICK_ACTIONS.map((item) => (
                  <button key={item.key} type="button" onClick={() => handleQuickAction(item)} className="dashboard-v2__quick">
                    <div
                      className="dashboard-v2__quick-icon"
                      style={{ "--quick-accent": item.color, "--quick-glow": `${item.color}70` }}
                    >
                      <item.icon size={30} strokeWidth={2.15} />
                  </div>
                  <span className={`dashboard-v2__quick-label ${v2.stat}`}>{t(item.labelKey)}</span>
                  <span className={`dashboard-v2__quick-arrow ${v2.muted}`}>
                    <ArrowUpRight size={11} strokeWidth={2.15} />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`dashboard-v2__panel dashboard-v2__panel--categories ${v2.glassStrong}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`dashboard-v2__panel-title mb-0 ${v2.stat}`}>{t("dashboard.v2.browseCategories")}</p>
                <button type="button" onClick={() => onRoute("/shop")} className={`dashboard-v2__categories-viewall ${v2.accent}`}>
                  {t("common.viewAll")}
                </button>
              </div>
              <DashboardV2CategoryCarousel
                labelClassName={v2.stat}
                onSelect={(cat) => onRoute(`/shop?category=${encodeURIComponent(cat.query)}`)}
              />
            </div>

            <div className="dashboard-v2__aside">
              <div className="dashboard-v2__recovery-card">
                <div className="dashboard-v2__recovery-copy">
                  <h3 className="dashboard-v2__recovery-title">{t("dashboard.v2.recoveryBetter")}</h3>
                  <p className="dashboard-v2__recovery-sub">{t("dashboard.v2.recoveryBetterSub")}</p>
                  <button type="button" onClick={() => onSection("recovery")} className="dashboard-v2__recovery-btn">
                    {t("dashboard.v2.exploreNow")}
                    <ArrowUpRight size={14} className="ml-1 inline" />
                  </button>
                </div>
                <div className="dashboard-v2__recovery-art-wrap">
                  <div className="dashboard-v2__recovery-glow" aria-hidden />
                  <img src={DASHBOARD_ASSETS.recoveryCardArt} alt="" className="dashboard-v2__recovery-art-side" />
                </div>
              </div>

              <div className="dashboard-v2__support-card">
                <div className="dashboard-v2__support-head">
                  <div className="dashboard-v2__support-icon">
                    <Headphones size={18} strokeWidth={2} />
                  </div>
                  <div className="dashboard-v2__support-copy">
                    <p className="dashboard-v2__support-title">{t("dashboard.v2.supportCardTitle")}</p>
                    <p className="dashboard-v2__support-sub">{t("dashboard.v2.quickSupportSub")}</p>
                  </div>
                </div>
                <button type="button" onClick={() => onRoute("/support")} className="dashboard-v2__support-btn">
                  {t("dashboard.v2.raiseTicket")}
                </button>
              </div>
            </div>

            <div className="dashboard-v2__row dashboard-v2__row--bottom">
              <div className={`dashboard-v2__panel dashboard-v2__panel--orders ${v2.glassStrong}`}>
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <p className={`dashboard-v2__panel-title mb-0 ${v2.stat}`}>{t("dashboard.v2.recentOrders")}</p>
                  <button type="button" onClick={() => onSection("orders")} className={`dashboard-v2__orders-viewall ${v2.accent}`}>
                    {t("common.viewAll")}
                  </button>
                </div>
                <div className="dashboard-v2__orders-scroll">
                  <table className="dashboard-v2__table">
                    <thead>
                      <tr className={v2.muted}>
                        <th>{t("dashboard.v2.colProduct")}</th>
                        <th>{t("orders.orderId")}</th>
                        <th>{t("dashboard.v2.colDate")}</th>
                        <th>{t("dashboard.v2.colStatus")}</th>
                        <th>{t("common.total")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr><td colSpan={5} className={`py-4 text-center ${v2.muted}`}>{t("dashboard.grid.noOrders")}</td></tr>
                      ) : recentOrders.map((order) => {
                        const item = order.items?.[0];
                        const { label, badge } = formatOrderStatus(order.status);
                        return (
                          <tr key={order._id} className="cursor-pointer" onClick={() => onSection("orders")}>
                            <td>
                              <div className="flex items-center gap-1.5">
                                {item?.image && <img src={item.image} alt="" className="w-7 h-7 rounded object-cover" />}
                                <span className={`dashboard-v2__product-name max-w-[90px] ${v2.stat}`}>{item?.name || t("common.product")}</span>
                              </div>
                            </td>
                            <td className={v2.muted}>#{order._id.slice(-6).toUpperCase()}</td>
                            <td className={v2.muted}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td><span className={`dashboard-v2__badge border ${statusBadgeClass(badge)}`}>{label}</span></td>
                            <td className={`font-bold ${v2.stat}`}>₹{order.total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={`dashboard-v2__panel dashboard-v2__panel--popular ${v2.glassStrong}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`dashboard-v2__panel-title mb-0 ${v2.stat}`}>{t("dashboard.v2.popularProducts")}</p>
                  <button type="button" onClick={() => onRoute("/shop")} className={`text-[10px] font-bold ${v2.accent}`}>{t("common.viewAll")}</button>
                </div>
                <div className="dashboard-v2__popular-wrap">
                  <div className="dashboard-v2__popular-grid">
                    {popularProducts.map((product) => (
                      <button
                        key={product.key}
                        type="button"
                        onClick={() => (product.slug ? onRoute(`/product/${product.slug}`) : onRoute("/shop"))}
                        className="dashboard-v2__popular-card"
                      >
                        <span
                          className="dashboard-v2__popular-wish"
                          onClick={(e) => { e.stopPropagation(); onRoute("/wishlist"); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onRoute("/wishlist"); } }}
                          role="button"
                          tabIndex={0}
                          aria-label="Wishlist"
                        >
                          <Heart size={10} strokeWidth={2} />
                        </span>
                        <div className={`dashboard-v2__popular-stage dashboard-v2__popular-stage--${product.pedestal}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="dashboard-v2__popular-meta">
                          <p className={`dashboard-v2__popular-name ${v2.stat}`}>{product.name}</p>
                          <div className="dashboard-v2__popular-row">
                            <p {...productPriceSaleProps(isBlue, `dashboard-v2__popular-price ${v2.stat}`)}>₹{product.price.toLocaleString("en-IN")}</p>
                            <div className="dashboard-v2__popular-rating">
                              <Star size={9} className="text-amber-400 fill-amber-400" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className={`dashboard-v2__footer border-t ${v2.footer}`}>
          {[
            { icon: Award, labelKey: "dashboard.v2.premiumQuality" },
            { icon: Truck, labelKey: "dashboard.v2.fastDelivery" },
            { icon: Shield, labelKey: "dashboard.v2.securePayments" },
            { icon: Zap, labelKey: "dashboard.v2.expertRecommended" },
          ].map((item) => (
            <div key={item.labelKey} className={`dashboard-v2__footer-item ${v2.muted}`}>
              <item.icon size={12} className={v2.accent} />
              {t(item.labelKey)}
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
}
