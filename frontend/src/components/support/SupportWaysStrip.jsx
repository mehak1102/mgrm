import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../../theme/support-ways-strip.css";

const STRIP_ITEMS = [
  { id: "whatsapp", Illustration: IllusWhatsapp },
  { id: "call", Illustration: IllusCall },
  { id: "homeDelivery", Illustration: IllusHomeDelivery },
  { id: "express", Illustration: IllusExpress },
  { id: "sizeFit", Illustration: IllusSizeFit },
  { id: "returns", Illustration: IllusReturns },
];

function MotionLines() {
  return (
    <g className="ways-illus__motion" aria-hidden>
      <path d="M6 34h14M4 42h12M8 50h14" />
    </g>
  );
}

function IllusWhatsapp() {
  return (
    <svg viewBox="0 0 100 88" className="ways-illus" aria-hidden>
      <MotionLines />
      <g className="ways-illus__body ways-illus__bob">
        <path
          d="M34 18h38a8 8 0 0 1 8 8v28a8 8 0 0 1-8 8H48l-14 12v-12H34a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z"
          className="ways-illus__fill"
        />
        <path
          d="M44 34c2.5-5 9-7 14-4.5s7.5 7 5.5 13-9 7.5-14 5"
          className="ways-illus__line"
          fill="none"
        />
        <path d="M42 52l-5 10 10-4" className="ways-illus__line" fill="none" />
        <rect x="62" y="20" width="20" height="20" rx="4" className="ways-illus__accent" />
        <text x="72" y="34" textAnchor="middle" className="ways-illus__badge-text">
          24
        </text>
      </g>
    </svg>
  );
}

function IllusCall() {
  return (
    <svg viewBox="0 0 100 88" className="ways-illus" aria-hidden>
      <circle cx="50" cy="42" r="24" className="ways-illus__ring ways-illus__ring--a" />
      <circle cx="50" cy="42" r="30" className="ways-illus__ring ways-illus__ring--b" />
      <g className="ways-illus__body ways-illus__wiggle">
        <path
          d="M36 24c0-3 2.5-5.5 5.5-5.5h17c3 0 5.5 2.5 5.5 5.5v34c0 3-2.5 5.5-5.5 5.5h-17c-3 0-5.5-2.5-5.5-5.5V24z"
          className="ways-illus__fill"
        />
        <rect x="42" y="58" width="16" height="5" rx="2.5" className="ways-illus__accent" />
        <circle cx="50" cy="38" r="11" className="ways-illus__accent ways-illus__pulse" />
        <path d="M46 38h8M50 34v8" className="ways-illus__line-white" fill="none" />
      </g>
    </svg>
  );
}

function IllusHomeDelivery() {
  return (
    <svg viewBox="0 0 100 88" className="ways-illus" aria-hidden>
      <g className="ways-illus__body ways-illus__bob-slow">
        <rect x="18" y="36" width="38" height="24" rx="3" className="ways-illus__accent" />
        <path
          d="M56 40h16l10 12v8H56V40z"
          className="ways-illus__fill"
        />
        <rect x="22" y="40" width="16" height="12" rx="1.5" fill="#fff" opacity="0.9" />
        <circle cx="30" cy="66" r="6" className="ways-illus__fill" />
        <circle cx="68" cy="66" r="6" className="ways-illus__fill" />
        <circle cx="30" cy="66" r="2.5" className="ways-illus__wheel" />
        <circle cx="68" cy="66" r="2.5" className="ways-illus__wheel" />
        <path d="M18 48h38" className="ways-illus__line" fill="none" opacity="0.35" />
      </g>
    </svg>
  );
}

function IllusExpress() {
  return (
    <svg viewBox="0 0 100 88" className="ways-illus" aria-hidden>
      <MotionLines />
      <g className="ways-illus__body ways-illus__drive">
        <rect x="24" y="36" width="34" height="22" rx="3" className="ways-illus__accent" />
        <path d="M58 40h14l10 10v8H58V40z" className="ways-illus__fill" />
        <polygon points="66,44 76,44 71,50" fill="#fff" />
        <circle cx="34" cy="64" r="6" className="ways-illus__fill" />
        <circle cx="64" cy="64" r="6" className="ways-illus__fill" />
        <circle cx="34" cy="64" r="2.5" className="ways-illus__wheel ways-illus__wheel--fast" />
        <circle cx="64" cy="64" r="2.5" className="ways-illus__wheel ways-illus__wheel--fast" />
      </g>
    </svg>
  );
}

function IllusSizeFit() {
  return (
    <svg viewBox="0 0 100 88" className="ways-illus" aria-hidden>
      <g className="ways-illus__body ways-illus__bob">
        <path
          d="M24 24h48a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5H24a5 5 0 0 1-5-5V29a5 5 0 0 1 5-5z"
          className="ways-illus__fill"
        />
        <line x1="32" y1="34" x2="64" y2="34" className="ways-illus__line" />
        <line x1="32" y1="42" x2="58" y2="42" className="ways-illus__line" />
        <line x1="32" y1="50" x2="52" y2="50" className="ways-illus__line" />
        <path d="M70 18v44M66 18h8M66 62h8" className="ways-illus__accent-line" fill="none" />
        <circle cx="70" cy="40" r="5" className="ways-illus__accent ways-illus__pulse" />
        <text x="70" y="43" textAnchor="middle" className="ways-illus__badge-text ways-illus__badge-text--sm">
          S
        </text>
      </g>
    </svg>
  );
}

function IllusReturns() {
  return (
    <svg viewBox="0 0 100 88" className="ways-illus" aria-hidden>
      <g className="ways-illus__body ways-illus__spin-hint">
        <circle cx="50" cy="44" r="24" className="ways-illus__fill" />
        <path
          d="M50 26a18 18 0 0 1 16 9M66 35l-4 0 0-7M50 62a18 18 0 0 1-16-9M34 53l4 0 0 7"
          className="ways-illus__accent-line"
          fill="none"
        />
        <rect x="41" y="38" width="18" height="14" rx="2" className="ways-illus__accent" />
        <path d="M45 38V34a5 5 0 0 1 10 0v4" className="ways-illus__line" fill="none" />
      </g>
    </svg>
  );
}

export default function SupportWaysStrip() {
  const { t } = useTranslation();

  return (
    <section className="ways-strip" aria-labelledby="support-ways-title">
      <div className="ways-strip__banner">
        <h2 id="support-ways-title" className="ways-strip__heading">
          {t("support.waysStrip.heading")}
        </h2>

        <ul className="ways-strip__grid">
          {STRIP_ITEMS.map(({ id, Illustration }) => (
            <li key={id} className="ways-strip__cell">
              <div className="ways-strip__art">
                <Illustration />
              </div>
              <p className="ways-strip__label">{t(`support.waysStrip.items.${id}`)}</p>
            </li>
          ))}
        </ul>

        <p className="ways-strip__footnote">
          {t("support.waysStrip.footnote")}{" "}
          <Link to="/support#support-faq" className="ways-strip__link">
            {t("support.waysStrip.footnoteLink")}
          </Link>
        </p>
      </div>
    </section>
  );
}
