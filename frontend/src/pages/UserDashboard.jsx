import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { useTheme } from "../context/ThemeContext";
import { getDashboardTheme } from "../components/dashboard/dashboardTheme";

const DashboardSections = lazy(() => import("../components/dashboard/DashboardSections"));
const DashboardExplorePanel = lazy(() => import("../components/dashboard/DashboardExplorePanel"));
const DashboardV2Layout = lazy(() => import("../components/dashboard/DashboardV2Layout"));

const ACCOUNT_SECTIONS = new Set([
  "profile",
  "addresses",
  "orders",
  "wishlist",
  "recovery",
  "settings",
]);

const ease = [0.22, 1, 0.36, 1];

/** Modern dashboard — dedicated /dashboard route only */
export default function UserDashboard() {
  const { t } = useTranslation();
  const { user, authReady } = useAuth();
  const { scrollTarget, setScrollTarget } = useDashboard();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dt = getDashboardTheme(theme);

  const [view, setView] = useState("hero");
  const [activeSection, setActiveSection] = useState(null);
  const [exploreTarget, setExploreTarget] = useState(null);
  const [isZooming, setIsZooming] = useState(false);

  const sectionLabel = (key) =>
    t(`dashboard.sections.${key}`, { defaultValue: t("dashboard.account") });

  const backToHero = useCallback(() => {
    setView("hero");
    setTimeout(() => {
      setActiveSection(null);
      setExploreTarget(null);
    }, 320);
  }, []);

  const openSection = (id) => {
    setIsZooming(true);
    setActiveSection(id);
    setTimeout(() => {
      setView("section");
      setIsZooming(false);
    }, 280);
  };

  const openExplore = (target) => {
    if (view === "explore") {
      setExploreTarget(target);
      return;
    }
    setIsZooming(true);
    setExploreTarget(target);
    setTimeout(() => {
      setView("explore");
      setIsZooming(false);
    }, 280);
  };

  const goRoute = (path) => navigate(path);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const applyOverflow = () => {
      document.body.style.overflow = mq.matches ? "" : "hidden";
    };
    applyOverflow();
    mq.addEventListener("change", applyOverflow);
    if (scrollTarget && ACCOUNT_SECTIONS.has(scrollTarget)) {
      setActiveSection(scrollTarget);
      setView("section");
      setScrollTarget(null);
    }
    return () => {
      mq.removeEventListener("change", applyOverflow);
      document.body.style.overflow = "";
    };
  }, [scrollTarget, setScrollTarget]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (view === "section" || view === "explore") backToHero();
      else navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, backToHero, navigate]);

  if (!authReady) return null;
  if (!user) return <Navigate to="/register" replace />;

  return (
    <div className="dashboard-page dashboard-page--modern">
      <div className="dashboard-page__shell">
        <div className="dashboard-page__body relative min-h-0 flex-1">
          <motion.div
            className="absolute inset-0"
            animate={
              view === "section" || view === "explore" || isZooming
                ? { opacity: 0.12, scale: 0.98, filter: "blur(8px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.4, ease }}
          >
            <Suspense fallback={null}>
              <DashboardV2Layout
                pageMode
                onSection={openSection}
                onRoute={goRoute}
                onExplore={openExplore}
                onClose={() => navigate("/")}
              />
            </Suspense>
          </motion.div>

          <AnimatePresence>
            {view === "explore" && exploreTarget && (
              <Suspense fallback={null}>
                <DashboardExplorePanel
                  target={exploreTarget}
                  dt={dt}
                  onBack={backToHero}
                  onExplore={openExplore}
                />
              </Suspense>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {view === "section" && activeSection && (
              <>
                <motion.div
                  className="absolute inset-0 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={backToHero}
                  aria-hidden
                />
                <motion.aside
                  className={`dashboard-section-drawer overlay-drawer-panel absolute z-30 top-0 right-0 bottom-0 ${
                    activeSection === "orders" ? "dashboard-section-drawer--wide" : ""
                  } flex flex-col border-l ${dt.headerBorder} ${dt.panelBg} ${dt.panelText}`}
                  initial={{ x: "100%", opacity: 0.9 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0.9 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <div className={`flex shrink-0 items-center justify-between gap-3 px-5 py-3 border-b ${dt.headerBorder}`}>
                    <button type="button" onClick={backToHero} className={`w-9 h-9 rounded-full grid place-items-center ${dt.closeBtn}`} aria-label={t("dashboard.backToGrid")}>
                      <ArrowLeft size={17} />
                    </button>
                    <p className={`text-sm font-semibold truncate ${dt.stat}`}>{sectionLabel(activeSection)}</p>
                    <button type="button" onClick={backToHero} className={`w-9 h-9 rounded-full grid place-items-center ${dt.closeBtn}`} aria-label={t("dashboard.closeSection")}>
                      <X size={17} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scroll overscroll-contain px-5 py-6">
                    <Suspense fallback={null}>
                      <DashboardSections dt={dt} onRoute={goRoute} section={activeSection} />
                    </Suspense>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
