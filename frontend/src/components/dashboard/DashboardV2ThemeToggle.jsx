import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { THEME_OPTIONS } from "../../theme/tokens";

const SIDEBAR_THEMES = [
  THEME_OPTIONS.find((t) => t.id === "dark"),
  THEME_OPTIONS.find((t) => t.id === "light"),
  THEME_OPTIONS.find((t) => t.id === "blue"),
].filter(Boolean);

const THEME_ICONS = {
  dark: Moon,
  light: Sun,
  blue: ({ size = 13, className = "" }) => (
    <span
      className={`inline-block rounded-full bg-gradient-to-br from-sky-400 to-blue-600 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  ),
};

export default function DashboardV2ThemeToggle() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const activeIndex = Math.max(
    0,
    SIDEBAR_THEMES.findIndex((opt) => opt.id === theme)
  );
  const thumbClass =
    activeIndex === 2
      ? "dashboard-v2__theme-toggle-thumb--blue"
      : activeIndex === 1
        ? "dashboard-v2__theme-toggle-thumb--light"
        : "dashboard-v2__theme-toggle-thumb--dark";

  return (
    <div
      className="dashboard-v2__theme-toggle"
      role="group"
      aria-label={t("theme.label")}
    >
      <div className="dashboard-v2__theme-toggle-track">
        <span aria-hidden className={`dashboard-v2__theme-toggle-thumb ${thumbClass}`} />
        {SIDEBAR_THEMES.map((opt) => {
          const Icon = THEME_ICONS[opt.id];
          const selected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={selected}
              title={t(`theme.${opt.id}`)}
              className={`dashboard-v2__theme-toggle-btn ${selected ? "dashboard-v2__theme-toggle-btn--active" : ""}`}
            >
              {typeof Icon === "function" && opt.id === "blue" ? (
                <Icon size={11} />
              ) : (
                <Icon size={12} strokeWidth={2.15} className={opt.id === "light" ? "text-amber-500" : opt.id === "dark" ? "text-violet-300" : ""} />
              )}
              <span>{t(`theme.${opt.id}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
