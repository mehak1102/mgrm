import { useId } from "react";
import "../theme/navbar-brand-mark.css";

/**
 * Horizontal infinity path for the logo background.
 */
const RIBBON_PATH =
  "M 18 50 " +
  "C 28 28, 44 28, 58 50 " +
  "C 72 72, 88 72, 98 50 " +
  "C 108 28, 124 28, 138 50 " +
  "C 124 72, 108 72, 98 50 " +
  "C 88 28, 72 28, 58 50 " +
  "C 44 72, 28 72, 18 50";

export default function NavbarBrandMark({ variant = "navbar" }) {
  const uid = useId().replace(/:/g, "");
  const grad = `navbar-brand-mark-grad-${uid}`;
  const gradBlue = `navbar-brand-mark-grad-blue-${uid}`;

  return (
    <div
      className={`navbar-brand-mark ${variant === "hero" ? "navbar-brand-mark--hero" : ""}`}
      aria-hidden
      style={{
        "--nbm-grad": `url(#${grad})`,
        "--nbm-grad-blue": `url(#${gradBlue})`,
      }}
    >
      <svg viewBox="0 0 156 100" className="navbar-brand-mark__svg">
        <defs>
          <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="35%" stopColor="#ec4899" />
            <stop offset="68%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id={gradBlue} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="40%" stopColor="#f472b6" />
            <stop offset="75%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <g className="navbar-brand-mark__shape">
          <path pathLength="1" className="navbar-brand-mark__track" d={RIBBON_PATH} />
          <path pathLength="1" className="navbar-brand-mark__glow" d={RIBBON_PATH} />
          <path pathLength="1" className="navbar-brand-mark__draw" d={RIBBON_PATH} />
        </g>
      </svg>
    </div>
  );
}
