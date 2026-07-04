import { useEffect, useState } from "react";
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

const TIMING = {
  markOut: 1400,
  lotus: 2100,
  mgrm: 3400,
  medicare: 5200,
  tagline: 7800,
  fade: 9200,
  done: 9900,
};

function LetterReveal({ text, step, stepAt, stepDelay, className, variant }) {
  if (step < stepAt) return null;

  return (
    <div className={className}>
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

  return createPortal(
    <div
      className={`splash-screen splash-screen--${theme} ${fading ? "splash-screen--fading" : ""}`}
      role="presentation"
      aria-label="MGRM Medicare Private Limited"
    >
      <div className="splash-screen__bg" aria-hidden="true" />

      <div className="splash-stage">
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

        <div className="splash-stage__text">
          <LetterReveal
            text="MGRM"
            step={step}
            stepAt={3}
            stepDelay={0.2}
            className="splash-stage__wordmark"
            variant="hero"
          />

          {step >= 4 && <div className="splash-stage__rule splash-stage__rule--in" />}

          <LetterReveal
            text="MEDICARE PRIVATE LIMITED"
            step={step}
            stepAt={4}
            stepDelay={0.055}
            className="splash-stage__medicare"
            variant="sub"
          />

          {step >= 5 && (
            <p className="splash-stage__tagline splash-stage__tagline--in">
              Comfort · Care · Cure
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
