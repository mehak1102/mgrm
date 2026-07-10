import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";

export default function DashboardLayoutToggle({ onGuestPick, inline = false, compact = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { layoutVariant, setLayoutVariant, openDashboard } = useDashboard();
  const isModern = layoutVariant === "modern";

  const pickLayout = (variant) => {
    setLayoutVariant(variant);
    if (!user) {
      onGuestPick?.();
      return;
    }
    if (variant === "modern") {
      navigate("/dashboard");
      return;
    }
    if (location.pathname === "/dashboard") {
      navigate("/");
    }
    openDashboard();
  };

  const btnSize = compact ? "h-7" : inline ? "h-9" : "w-11 h-11";
  const iconSize = compact ? 11 : inline ? 13 : 16;
  const labelClass = compact ? "text-[6px]" : "text-[7px]";

  return (
    <div
      className={`dashboard-layout-toggle ${inline ? "dashboard-layout-toggle--inline w-full" : ""} ${compact ? "dashboard-layout-toggle--compact" : ""}`}
      role="group"
      aria-label={t("dashboard.v2.layoutToggle")}
    >
      <div className={`dashboard-layout-toggle__track relative inline-grid grid-cols-2 rounded-full p-0.5 gap-0.5 ${inline ? "w-full" : ""}`}>
        <span
          aria-hidden
          className={`dashboard-layout-toggle__thumb pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full transition-transform duration-300 ease-out ${
            isModern ? "dashboard-layout-toggle__thumb--modern" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => pickLayout("classic")}
          aria-pressed={!isModern}
          title={t("dashboard.v2.classicView")}
          className={`dashboard-layout-toggle__btn relative z-10 flex flex-col items-center justify-center rounded-full transition-opacity ${btnSize} ${!isModern ? "dashboard-layout-toggle__btn--active opacity-100" : "opacity-45 hover:opacity-80"}`}
        >
          <LayoutGrid size={iconSize} className="dashboard-layout-toggle__icon dashboard-layout-toggle__icon--classic" />
          <span className={`dashboard-layout-toggle__symbol ${labelClass} mt-0.5`}>{t("dashboard.v2.classicShort")}</span>
        </button>
        <button
          type="button"
          onClick={() => pickLayout("modern")}
          aria-pressed={isModern}
          title={t("dashboard.v2.modernView")}
          className={`dashboard-layout-toggle__btn relative z-10 flex flex-col items-center justify-center rounded-full transition-opacity ${btnSize} ${isModern ? "dashboard-layout-toggle__btn--active opacity-100" : "opacity-45 hover:opacity-80"}`}
        >
          <Sparkles size={iconSize} className="dashboard-layout-toggle__icon dashboard-layout-toggle__icon--modern" />
          <span className={`dashboard-layout-toggle__symbol ${labelClass} mt-0.5`}>{t("dashboard.v2.modernShort")}</span>
        </button>
      </div>
    </div>
  );
}
