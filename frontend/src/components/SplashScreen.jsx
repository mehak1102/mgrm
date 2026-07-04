import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import {
  clearSplashPending,
  isSplashSeen,
  markSplashSeen,
} from "../utils/splashGate";
import "../theme/splash-screen.css";

const MARK_SRC = "/brand/splash-mark-clean.png";
const LOTUS_SRC = "/brand/splash-lotus-cleans.png";
const RING_RADIUS = 108;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

const TIMING = {
  markOut: 1600,
  lotus: 2400,
  mgrm: 4000,
  medicare: 5400,
  tagline: 7200,
  fade: 9800,
  done: 10500,
};

function LetterReveal({
  text,
  step,
  stepAt,
  stepDelay,
  className,
  variant,
  lineRef,
  style,
  spread,
}) {
  if (step < stepAt) return null;

  return (
    <div
      ref={lineRef}
      className={`${className}${spread ? " splash-stage__line--spread" : ""}`}
      style={style}
    >
      {[...text].map((ch, i) => (
        <span
          key={`${variant}-${i}-${ch}`}
          className={`splash-letter splash-letter--${variant}`}
          style={{ animationDelay: `${i * stepDelay}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

export default function SplashScreen({ onFinish }) {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const wordmarkRef = useRef(null);
  const [wordmarkWidth, setWordmarkWidth] = useState(null);

  useLayoutEffect(() => {
    if (step < 3) return undefined;

    const measure = () => {
      const slot = wordmarkRef.current;
      if (!slot) return;

      const scaled = slot.querySelector(".splash-stage__wordmark-scale");
      if (!scaled) return;

      const rect = scaled.getBoundingClientRect();
      setWordmarkWidth(rect.width);
      slot.style.height = `${rect.height}px`;
    };

    measure();
    const observer = new ResizeObserver(measure);
    const slot = wordmarkRef.current;
    if (slot) {
      observer.observe(slot);
      const scaled = slot.querySelector(".splash-stage__wordmark-scale");
      if (scaled) observer.observe(scaled);
    }
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [step]);

  useEffect(() => {
    if (isSplashSeen()) {
      clearSplashPending();
      onFinish?.();
      return undefined;
    }

    markSplashSeen();
    document.body.style.overflow = "hidden";

    const timers = [
      window.setTimeout(() => setStep(1), TIMING.markOut),
      window.setTimeout(() => setStep(2), TIMING.lotus),
      window.setTimeout(() => setStep(3), TIMING.mgrm),
      window.setTimeout(() => setStep(4), TIMING.medicare),
      window.setTimeout(() => setStep(5), TIMING.tagline),
      window.setTimeout(() => setFading(true), TIMING.fade),
      window.setTimeout(() => {
        clearSplashPending();
        onFinish?.();
      }, TIMING.done),
    ];

    return () => {
      timers.forEach(clearTimeout);
      clearSplashPending();
    };
  }, [onFinish]);

  const markClass =
    step === 0
      ? "splash-stage__mark--in"
      : step === 1
        ? "splash-stage__mark--out"
        : "";

  const visualClass =
    step >= 0 && step < 2
      ? "splash-stage__visual--ring"
      : step >= 2
        ? "splash-stage__visual--ring splash-stage__visual--glow"
        : "";

  return createPortal(
    <div
      className={`splash-screen splash-screen--${theme} ${fading ? "splash-screen--fading" : ""}`}
      role="presentation"
      aria-label="MGRM Medicare Private Limited"
    >
      <div className="splash-screen__bg" aria-hidden="true" />

      <div className="splash-stage">
        <div className={`splash-stage__visual ${visualClass}`}>
          <svg
            className="splash-stage__ring"
            viewBox="0 0 240 240"
            aria-hidden="true"
          >
            <circle
              className="splash-stage__ring-track"
              cx="120"
              cy="120"
              r={RING_RADIUS}
            />
            <circle
              className="splash-stage__ring-draw"
              cx="120"
              cy="120"
              r={RING_RADIUS}
              transform="rotate(-90 120 120)"
              style={{
                strokeDasharray: RING_CIRC,
                strokeDashoffset: RING_CIRC,
              }}
            />
          </svg>

          <div className="splash-stage__stack">
            {step < 2 && (
              <div className={`splash-stage__mark ${markClass}`}>
                <img src={MARK_SRC} alt="" draggable={false} />
              </div>
            )}

            {step >= 2 && (
              <div className="splash-stage__lotus splash-stage__lotus--in">
                <img src={LOTUS_SRC} alt="" draggable={false} />
              </div>
            )}
          </div>
        </div>

        <div className="splash-stage__text">
          <div className="splash-stage__text-inner">
            <div ref={wordmarkRef} className="splash-stage__wordmark-slot">
              <div className="splash-stage__wordmark-scale">
                <LetterReveal
                  text="MGRM"
                  step={step}
                  stepAt={3}
                  stepDelay={0.22}
                  className="splash-stage__line splash-stage__wordmark"
                  variant="hero"
                />
              </div>
            </div>

            <LetterReveal
              text="MEDICARE PRIVATE LIMITED"
              step={step}
              stepAt={4}
              stepDelay={0.048}
              className="splash-stage__line splash-stage__medicare"
              variant="sub"
              spread
              style={wordmarkWidth ? { width: wordmarkWidth } : undefined}
            />

            <LetterReveal
              text="COMFORT · CARE · CURE"
              step={step}
              stepAt={5}
              stepDelay={0.042}
              className="splash-stage__line splash-stage__tagline"
              variant="tag"
              spread
              style={wordmarkWidth ? { width: wordmarkWidth } : undefined}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
