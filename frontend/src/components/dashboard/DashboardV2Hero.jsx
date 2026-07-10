import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DASHBOARD_ASSETS } from "./dashboardV2Data";

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
  const theme = themeId === "light" || themeId === "blue" ? themeId : "dark";

  return (
    <div className={`dashboard-v2__hero dashboard-v2__hero--${theme}`}>
      <div className="dashboard-v2__hero-copy">
        <h2>
          {t(getGreetingKey(), { name: firstName })}
          <span className="dashboard-v2__hero-wave" aria-hidden> 👋</span>
        </h2>
        <p className="dashboard-v2__hero-sub">{t("dashboard.v2.heroSubtitle")}</p>
        <button type="button" onClick={onExplore} className="dashboard-v2__explore-btn">
          {t("dashboard.v2.exploreProducts")}
          <ArrowUpRight size={15} className="ml-1.5" />
        </button>
      </div>

      <div className="dashboard-v2__hero-showcase" aria-hidden>
        <div className="dashboard-v2__hero-aura" />
        <div className="dashboard-v2__hero-ring dashboard-v2__hero-ring--outer" />
        <div className="dashboard-v2__hero-ring dashboard-v2__hero-ring--inner" />
        <div className="dashboard-v2__hero-product-wrap">
          <div className="dashboard-v2__hero-spheres">
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--1" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--2" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--3" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--4" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--5" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--6" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--7" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--8" />
            <span className="dashboard-v2__hero-sphere dashboard-v2__hero-sphere--9" />
          </div>
          <img
            src={heroImage || DASHBOARD_ASSETS.heroBrace}
            alt={heroName}
            className="dashboard-v2__hero-product"
          />
        </div>
      </div>
    </div>
  );
}
