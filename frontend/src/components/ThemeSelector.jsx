import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { THEME_OPTIONS } from "../theme/tokens";

export default function ThemeSelector({ className = "" }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const active = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={rootRef} className={`theme-selector relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("theme.select")}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 min-[420px]:gap-2 h-9 min-[420px]:h-11 px-2 min-[420px]:px-3 rounded-full border border-edge dark:border-white/10 bg-card dark:bg-zinc-800 hover:bg-surface-hover dark:hover:bg-zinc-700 text-fg dark:text-zinc-100 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
      >
        <span className="text-base leading-none" aria-hidden>
          {active.emoji}
        </span>
        <span className="hidden sm:inline text-sm font-semibold">{t(`theme.${active.id}`)}</span>
        <ChevronDown
          size={16}
          className={`hidden min-[420px]:block text-gray-500 dark:text-zinc-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("theme.label")}
          className="absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl border border-edge dark:border-white/10 bg-card dark:bg-zinc-900 shadow-xl py-1 z-[200] transition-colors duration-300"
        >
          {THEME_OPTIONS.map((opt) => (
            <li key={opt.id} role="option" aria-selected={theme === opt.id}>
              <button
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                  theme === opt.id
                    ? "text-brand bg-surface-hover"
                    : "text-fg"
                }`}
              >
                <span aria-hidden>{opt.emoji}</span>
                {t(`theme.${opt.id}`)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
