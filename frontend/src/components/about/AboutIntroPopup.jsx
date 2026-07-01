import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Logo3D from "../Logo3D";

const STORAGE_KEY = "mgrm_about_intro_seen";
const OPEN_DELAY_MS = 300;
const HINT_DELAY_MS = 4000;
const EXIT_MS = 400;

const EASE = [0.22, 1, 0.36, 1];

const ORBS = [
  {
    id: "cyan",
    className: "bg-cyan-400/25",
    style: { width: 280, height: 280, left: "8%", top: "12%" },
    animate: { x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.12, 0.95, 1] },
    duration: 16,
  },
  {
    id: "violet",
    className: "bg-violet-500/20",
    style: { width: 340, height: 340, right: "5%", top: "18%" },
    animate: { x: [0, -50, 25, 0], y: [0, 35, -25, 0], scale: [1, 0.92, 1.08, 1] },
    duration: 20,
  },
  {
    id: "amber",
    className: "bg-amber-400/18",
    style: { width: 220, height: 220, left: "38%", bottom: "8%" },
    animate: { x: [0, 30, -35, 0], y: [0, -20, 15, 0], scale: [1, 1.15, 1, 1] },
    duration: 14,
  },
];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${4 + ((i * 13) % 92)}%`,
  top: `${3 + ((i * 19) % 94)}%`,
  size: i % 5 === 0 ? 5 + (i % 3) : 2 + (i % 3),
  duration: 3.5 + (i % 6),
  delay: (i % 9) * 0.28,
  bokeh: i % 5 === 0,
}));

function AboutIntroPopup() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return undefined;
    } catch {
      return undefined;
    }

    const openTimer = window.setTimeout(() => setVisible(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(openTimer);
  }, [mounted]);

  useEffect(() => {
    if (!visible) return undefined;

    const hintTimer = window.setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => window.clearTimeout(hintTimer);
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  const close = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, close]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={() => setShowHint(false)}>
      {visible && (
        <motion.div
          key="about-intro"
          role="dialog"
          aria-modal="true"
          aria-label={t("about.introAriaLabel")}
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          exit={
            reduce
              ? undefined
              : {
                  opacity: 0,
                  transition: { duration: EXIT_MS / 1000, ease: EASE },
                }
          }
          className="about-intro-root fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-4 sm:p-6"
          onClick={close}
        >
          <div
            className="pointer-events-none absolute inset-0 backdrop-blur-xl"
            aria-hidden
          />
          <div className="about-intro-vignette pointer-events-none absolute inset-0" aria-hidden />
          <div className="about-intro-grain pointer-events-none absolute inset-0" aria-hidden />

          {!reduce &&
            ORBS.map((orb) => (
              <motion.div
                key={orb.id}
                aria-hidden
                className={`about-intro-orb pointer-events-none absolute ${orb.className}`}
                style={orb.style}
                animate={orb.animate}
                transition={{
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

          <div className="about-intro-sweep" aria-hidden />

          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden
              className={`pointer-events-none absolute rounded-full bg-white/25 ${
                p.bokeh ? "about-intro-particle--bokeh" : ""
              }`}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
              }}
              animate={
                reduce
                  ? undefined
                  : {
                      opacity: p.bokeh ? [0.08, 0.4, 0.08] : [0.12, 0.5, 0.12],
                      y: [0, p.bokeh ? -18 : -10, 0],
                      x: [0, p.id % 2 === 0 ? 6 : -6, 0],
                    }
              }
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          ))}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute right-4 top-4 z-[10001] group/close flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label={t("about.introClose")}
          >
            <X
              size={20}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover/close:rotate-90"
            />
          </button>

          <motion.div
            initial={
              reduce
                ? false
                : { opacity: 0, scale: 0.92, filter: "blur(8px)" }
            }
            animate={
              reduce
                ? undefined
                : { opacity: 1, scale: 1, filter: "blur(0px)" }
            }
            exit={
              reduce
                ? undefined
                : {
                    opacity: 0,
                    scale: 0.94,
                    filter: "blur(10px)",
                    transition: { duration: EXIT_MS / 1000, ease: EASE },
                  }
            }
            transition={{ duration: 1.2, ease: EASE }}
            className="relative z-[10000] flex max-w-lg flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-6 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-white/70">
              {t("global.welcomeTo")
                .split("")
                .map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="about-intro-welcome-char"
                  initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={
                    reduce
                      ? undefined
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  transition={{
                    delay: 0.2 + i * 0.04,
                    duration: 0.55,
                    ease: EASE,
                  }}
                >
                  {char === " " ? "\u00a0" : char}
                </motion.span>
              ))}
            </p>

            <div className="about-intro-logo-stage">
              <span className="about-intro-ring about-intro-ring--1" aria-hidden />
              <span className="about-intro-ring about-intro-ring--2" aria-hidden />
              <span className="about-intro-ring about-intro-ring--3" aria-hidden />
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.88 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 1.1, ease: EASE }}
              >
                <div className="about-intro-logo-scale flex items-center justify-center">
                  <Logo3D asStatic />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
              className="mt-8 flex w-full max-w-xs items-center gap-3 sm:max-w-sm"
            >
              <motion.span
                className="about-intro-rule flex-1"
                initial={reduce ? false : { scaleX: 0 }}
                animate={reduce ? undefined : { scaleX: 1 }}
                transition={{ delay: 0.85, duration: 0.9, ease: EASE }}
              />
              <motion.span
                className="h-1 w-1 shrink-0 rounded-full bg-white/50"
                initial={reduce ? false : { scale: 0 }}
                animate={reduce ? undefined : { scale: 1 }}
                transition={{ delay: 1.1, duration: 0.4, ease: EASE }}
              />
              <motion.span
                className="about-intro-rule flex-1"
                initial={reduce ? false : { scaleX: 0 }}
                animate={reduce ? undefined : { scaleX: 1 }}
                transition={{ delay: 0.85, duration: 0.9, ease: EASE }}
              />
            </motion.div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.9, ease: EASE }}
              className="about-intro-subtitle mt-5 max-w-sm text-sm font-light leading-relaxed tracking-[0.06em] text-white/80 sm:text-base"
            >
              {t("about.introSubtitle")}{" "}
              <motion.span
                className="about-intro-year font-normal text-white"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.7, ease: EASE }}
              >
                1994
              </motion.span>
            </motion.p>

            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="about-intro-hint mt-10 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/50"
                >
                  {t("about.introTapToContinue")}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default AboutIntroPopup;
