import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { useProductStats } from "../../context/ProductStatsContext";
import { useTheme } from "../../context/ThemeContext";
import { getDashboardTheme } from "./dashboardTheme";

const DashboardSections = lazy(() => import("./DashboardSections"));
const DashboardExplorePanel = lazy(() => import("./DashboardExplorePanel"));
const DashboardBackground = lazy(() => import("./DashboardBackground"));
const DashboardHeroGrid = lazy(() => import("./DashboardHeroGrid"));

const ACCOUNT_SECTIONS = new Set([
  "profile",
  "addresses",
  "orders",
  "wishlist",
  "recovery",
  "settings",
]);

const ease = [0.22, 1, 0.36, 1];

function isCountChar(text, index) {
  const firstSpace = text.indexOf(" ");
  if (firstSpace === -1) return text[index] !== " ";
  return index < firstSpace && text[index] !== " ";
}

function FlowingLetterText({ text, countColor, textColor }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!text) return;
    let count = 0;
    let timer;

    const step = () => {
      if (count <= text.length) {
        setVisible(count);
        count += 1;
        timer = setTimeout(step, 88);
      } else {
        timer = setTimeout(() => {
          count = 0;
          setVisible(0);
          timer = setTimeout(step, 500);
        }, 2600);
      }
    };

    step();
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <h1
      className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight mt-1 leading-[1.05]"
      aria-label={text}
    >
      {text.split("").map((char, i) => {
        const shown = i < visible;
        const isCount = isCountChar(text, i);

        return (
          <span
            key={`${char}-${i}`}
            className={`dashboard-flow-letter ${isCount ? "font-black" : "font-bold"}`}
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? "translateX(0)" : "translateX(-8px)",
              transitionDelay: shown ? `${i * 18}ms` : "0ms",
              color: isCount ? countColor : textColor,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
      <span
        className="dashboard-flow-caret ml-0.5 inline-block w-[3px] h-[0.82em] align-[-0.1em] rounded-full"
        style={{
          backgroundColor: textColor,
          opacity: visible > 0 && visible < text.length ? 1 : 0.35,
        }}
      />
    </h1>
  );
}

export default function UserDashboardOverlay() {
  const { t } = useTranslation();
  const { isOpen, closeDashboard, scrollTarget, setScrollTarget } = useDashboard();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dt = getDashboardTheme(theme);

  const { bodyTotal } = useProductStats();
  const [view, setView] = useState("hero");
  const [activeSection, setActiveSection] = useState(null);
  const [exploreTarget, setExploreTarget] = useState(null);
  const [isZooming, setIsZooming] = useState(false);

  const productCountLabel = t("dashboard.productCountLabel", { count: bodyTotal });

  const sectionLabel = (key) => t(`dashboard.sections.${key}`, { defaultValue: t("dashboard.account") });

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

  const goRoute = (path) => {
    closeDashboard();
    navigate(path);
  };

  useEffect(() => {
    if (!isOpen) {
      setView("hero");
      setActiveSection(null);
      setExploreTarget(null);
      setIsZooming(false);
      return;
    }
    document.body.style.overflow = "hidden";
    if (scrollTarget && ACCOUNT_SECTIONS.has(scrollTarget)) {
      setActiveSection(scrollTarget);
      setView("section");
      setScrollTarget(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, scrollTarget, setScrollTarget]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (view === "section" || view === "explore") {
        backToHero();
      } else {
        closeDashboard();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, view, closeDashboard, backToHero]);

  if (!user) return null;

  const isLight = dt.id === "light";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Light scrim — site stays visible behind dashboard */}
          <motion.div
            className="fixed inset-0 z-[299] bg-slate-900/10 dark:bg-black/20 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("dashboard.commandCenter")}
            className="fixed inset-0 z-[300] w-screen h-screen overflow-hidden flex flex-col bg-transparent"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute inset-0"
            >
              <Suspense fallback={null}>
                <DashboardBackground dt={dt} />
              </Suspense>
            </motion.div>

            <motion.header
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className={`relative z-20 flex shrink-0 items-center justify-between px-5 sm:px-10 py-3.5 border-b ${dt.headerBorder} backdrop-blur-2xl ${dt.headerBg}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {view !== "hero" && (
                  <button
                    type="button"
                    onClick={backToHero}
                    className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${dt.closeBtn}`}
                    aria-label={t("dashboard.backToGrid")}
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="min-w-0">
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${dt.accent}`}>
                    MGRM Medicare
                  </p>
                  {view === "section" ? (
                    <h2 className={`text-base sm:text-xl font-semibold tracking-tight mt-0.5 ${dt.stat}`}>
                      {sectionLabel(activeSection)}
                    </h2>
                  ) : view === "explore" ? (
                    <h2 className={`text-base sm:text-xl font-semibold tracking-tight mt-0.5 ${dt.stat}`}>
                      {exploreTarget?.title || t("dashboard.account")}
                    </h2>
                  ) : (
                    <FlowingLetterText
                      text={productCountLabel}
                      countColor={dt.flowCountColor}
                      textColor={dt.flowTextColor}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                {view === "hero" && (
                  <p className={`text-sm sm:text-xl font-semibold tracking-tight whitespace-nowrap ${dt.stat}`}>
                    {t("dashboard.hello", {
                      name: user.name?.split(" ")[0] || t("common.there"),
                    })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={closeDashboard}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center ${dt.closeBtn}`}
                  aria-label={t("dashboard.close")}
                >
                  <X size={20} />
                </button>
              </div>
            </motion.header>

            <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 overflow-hidden px-4 sm:px-8 lg:px-10 py-3 sm:py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  view === "section" || view === "explore" || isZooming
                    ? { opacity: 0.2, y: 0, scale: 0.94, filter: "blur(12px)" }
                    : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                }
                transition={{ duration: 0.5, delay: view === "hero" && !isZooming ? 0.25 : 0, ease }}
                style={{ transformOrigin: "center center" }}
              >
                <motion.div
                  className="h-full min-h-0"
                  animate={isZooming ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.28, ease }}
                >
                  <Suspense fallback={null}>
                    <DashboardHeroGrid onSection={openSection} onRoute={goRoute} onExplore={openExplore} />
                  </Suspense>
                </motion.div>
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
                      } flex flex-col border-l ${dt.headerBorder} ${dt.panelBg} ${dt.panelText} backdrop-blur-3xl`}
                      initial={{ x: "100%", opacity: 0.9 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "100%", opacity: 0.9 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <div
                        className={`dashboard-section-drawer__header flex shrink-0 items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-b ${dt.headerBorder}`}
                      >
                        <button
                          type="button"
                          onClick={backToHero}
                          className={`dashboard-section-drawer__nav-btn w-9 h-9 rounded-full grid place-items-center shrink-0 ${dt.closeBtn}`}
                          aria-label={t("dashboard.backToGrid")}
                        >
                          <ArrowLeft size={17} />
                        </button>
                        <p className={`text-sm sm:text-base font-semibold tracking-tight truncate ${dt.stat}`}>
                          {sectionLabel(activeSection)}
                        </p>
                        <button
                          type="button"
                          onClick={backToHero}
                          className={`dashboard-section-drawer__nav-btn w-9 h-9 rounded-full grid place-items-center shrink-0 ${dt.closeBtn}`}
                          aria-label={t("dashboard.closeSection")}
                        >
                          <X size={17} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scroll overscroll-contain px-5 sm:px-7 py-6 sm:py-8">
                        <Suspense
                          fallback={
                            <div className="space-y-4">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`h-20 rounded-3xl animate-pulse ${dt.chip}`}
                                />
                              ))}
                            </div>
                          }
                        >
                          <DashboardSections
                            dt={dt}
                            onRoute={goRoute}
                            section={activeSection}
                          />
                        </Suspense>
                      </div>
                    </motion.aside>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
