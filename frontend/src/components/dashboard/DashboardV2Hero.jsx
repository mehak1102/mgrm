import { ArrowUpRight, Award, Heart, ShieldCheck, Truck, Wallet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DASHBOARD_ASSETS } from "./dashboardV2Data";

const RING_RADIUS = 92;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const RING_STROKE = {
  dark: "#8b5cf6",
  light: "#7c3aed",
  blue: "#22d3ee",
};

const HERO_TRUST_ITEMS = [
  {
    icon: Award,
    titleKey: "dashboard.v2.premiumQuality",
    subKey: "dashboard.v2.trustedReliable",
  },
  {
    icon: Truck,
    titleKey: "dashboard.v2.fastDelivery",
    subKey: "dashboard.v2.acrossIndia",
  },
  {
    icon: Wallet,
    titleKey: "dashboard.v2.securePayments",
    subKey: "dashboard.v2.protected100",
  },
];

function getGreetingKey() {
  const h = new Date().getHours();
  if (h < 12) return "dashboard.v2.goodMorning";
  if (h < 17) return "dashboard.v2.goodAfternoon";
  return "dashboard.v2.goodEvening";
}

export default function DashboardV2Hero({
  firstName,
  heroImage,
  heroName,
  themeId = "dark",
  onExplore,
}) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const theme = themeId === "light" || themeId === "blue" ? themeId : "dark";

  return (
    <div className={`dashboard-v2__hero dashboard-v2__hero--${theme}`}>
      <div className="dashboard-v2__hero-body">
        <div className="dashboard-v2__hero-copy">
          <h2>
            {t(getGreetingKey(), { name: firstName })}
            <span className="dashboard-v2__hero-wave" aria-hidden>
              {" "}
              👋
            </span>
          </h2>
          <p className="dashboard-v2__hero-sub">{t("dashboard.v2.heroSubtitle")}</p>
          <button type="button" onClick={onExplore} className="dashboard-v2__explore-btn">
            {t("dashboard.v2.exploreProducts")}
            <ArrowUpRight size={15} className="ml-1.5" />
          </button>
        </div>

        <div className="dashboard-v2__hero-showcase" aria-hidden>
          <div className="dashboard-v2__hero-product-wrap">
            <svg className="dashboard-v2__hero-draw-ring" viewBox="0 0 240 240" aria-hidden>
              <motion.circle
                cx="120"
                cy="120"
                r={RING_RADIUS}
                stroke={RING_STROKE[theme]}
                strokeWidth="2.25"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                animate={
                  reduceMotion
                    ? { strokeDashoffset: 0 }
                    : { strokeDashoffset: [RING_CIRCUMFERENCE, 0] }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 4.8,
                        repeat: Infinity,
                        repeatDelay: 0.2,
                        ease: "linear",
                      }
                }
              />
            </svg>

            <div className="dashboard-v2__hero-ring-badges" aria-hidden>
              <span className="dashboard-v2__hero-ring-badge dashboard-v2__hero-ring-badge--heart">
                <Heart size={13} strokeWidth={2.25} fill="currentColor" />
              </span>
              <span className="dashboard-v2__hero-ring-badge dashboard-v2__hero-ring-badge--shield">
                <ShieldCheck size={14} strokeWidth={2.25} />
              </span>
              <span className="dashboard-v2__hero-ring-badge dashboard-v2__hero-ring-badge--mobility">
                <img src="/dashboard/catalog/catalog-leg.png" alt="" />
              </span>
            </div>

            <img
              src={heroImage || DASHBOARD_ASSETS.heroBrace}
              alt={heroName}
              className="dashboard-v2__hero-product"
            />
          </div>
        </div>
      </div>

      <div className="dashboard-v2__hero-trust">
        {HERO_TRUST_ITEMS.map((item) => (
          <div key={item.titleKey} className="dashboard-v2__hero-trust-item">
            <span className="dashboard-v2__hero-trust-icon" aria-hidden>
              <item.icon size={16} strokeWidth={2} />
            </span>
            <span className="dashboard-v2__hero-trust-copy">
              <span className="dashboard-v2__hero-trust-title">{t(item.titleKey)}</span>
              <span className="dashboard-v2__hero-trust-sub">{t(item.subKey)}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
