import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getDashboardTheme, SECTION_LABELS } from "./dashboardTheme";
import DashboardBackground from "./DashboardBackground";
import DashboardHeroGrid from "./DashboardHeroGrid";

const DashboardSections = lazy(() => import("./DashboardSections"));

const ACCOUNT_SECTIONS = new Set([
  "profile",
  "addresses",
  "orders",
  "wishlist",
  "recovery",
  "settings",
]);

const ease = [0.22, 1, 0.36, 1];

export default function UserDashboardOverlay() {
  const { isOpen, closeDashboard, scrollTarget, setScrollTarget } = useDashboard();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dt = getDashboardTheme(theme);

  const [view, setView] = useState("hero");
  const [activeSection, setActiveSection] = useState(null);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setView("hero");
      setActiveSection(null);
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
      if (view === "section") {
        setView("hero");
        setActiveSection(null);
      } else {
        closeDashboard();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, view, closeDashboard]);

  const openSection = (id) => {
    setIsZooming(true);
    setActiveSection(id);
    setTimeout(() => {
      setView("section");
      setIsZooming(false);
    }, 280);
  };

  const goRoute = (path) => {
    closeDashboard();
    navigate(path);
  };

  const backToHero = () => {
    setView("hero");
    setTimeout(() => setActiveSection(null), 320);
  };

  if (!user) return null;

  const isLight = dt.id === "light";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Cinematic backdrop — blur + fade before dashboard */}
          <motion.div
            className="fixed inset-0 z-[299] bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.45, ease }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="MGRM Command Center"
            className={`fixed inset-0 z-[300] w-screen h-screen overflow-hidden flex flex-col ${dt.shell}`}
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
              <DashboardBackground dt={dt} />
            </motion.div>

            <motion.header
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className={`relative z-20 flex shrink-0 items-center justify-between px-5 sm:px-10 py-3.5 border-b ${dt.headerBorder} backdrop-blur-2xl ${dt.headerBg}`}
            >
              <div className="flex items-center gap-3">
                {view === "section" && (
                  <button
                    type="button"
                    onClick={backToHero}
                    className={`w-10 h-10 rounded-full grid place-items-center ${dt.closeBtn}`}
                    aria-label="Back to grid"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${dt.accent}`}>
                    MGRM Medicare
                  </p>
                  <h1 className={`text-base sm:text-xl font-semibold tracking-tight mt-0.5 ${dt.stat}`}>
                    {view === "section"
                      ? SECTION_LABELS[activeSection] || "Account"
                      : `Hello, ${user.name?.split(" ")[0] || "there"}`}
                  </h1>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDashboard}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center ${dt.closeBtn}`}
                aria-label="Close dashboard"
              >
                <X size={20} />
              </button>
            </motion.header>

            <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 overflow-hidden px-4 sm:px-8 lg:px-10 py-3 sm:py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  view === "section" || isZooming
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
                  <DashboardHeroGrid onSection={openSection} onRoute={goRoute} />
                </motion.div>
              </motion.div>

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
                      className={`absolute z-30 top-0 right-0 bottom-0 w-full sm:w-[min(520px,92vw)]
                        flex flex-col border-l ${dt.headerBorder} ${dt.panelBg} ${dt.panelText} backdrop-blur-3xl`}
                      initial={{ x: "100%", opacity: 0.9 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "100%", opacity: 0.9 }}
                      transition={{ duration: 0.45, ease }}
                    >
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
