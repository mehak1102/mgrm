import { useState } from "react";
import { useTranslation } from "react-i18next";
import { loadHindiBundle } from "../i18n";

const LANGUAGES = [
  { code: "en", labelKey: "language.english", native: "English" },
  { code: "hi", labelKey: "language.hindi", native: "हिंदी" },
];

function LanguageSymbol({ code, className = "" }) {
  if (code === "hi") {
    return (
      <span
        className={`language-switcher__symbol language-switcher__symbol--hi ${className}`}
        aria-hidden
      >
        अ
      </span>
    );
  }

  return (
    <span
      className={`language-switcher__symbol language-switcher__symbol--en ${className}`}
      aria-hidden
    >
      A
    </span>
  );
}

function LanguageToggleTrack({ currentCode, switching, onSelect, compact = false }) {
  const { t } = useTranslation();

  return (
    <div
      className={`language-switcher__track relative inline-grid grid-cols-2 rounded-full border border-slate-200 dark:border-white/10 bg-card dark:bg-zinc-900 shadow-[0_10px_28px_rgba(15,23,42,0.18)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)] ${
        compact ? "p-0.5 gap-0.5" : "p-1 gap-1"
      }`}
      role="group"
      aria-label={t("language.label")}
      data-active={currentCode}
    >
      <span
        aria-hidden
        className={`language-switcher__thumb language-switcher__thumb--${currentCode} pointer-events-none absolute top-1 bottom-1 left-1 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-slate-100 dark:border-white/10 transition-transform duration-300 ease-out ${
          compact ? "w-[calc(50%-2px)]" : "w-[calc(50%-6px)]"
        }`}
      />

      {LANGUAGES.map((lang) => {
        const selected = currentCode === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            disabled={switching || selected}
            onClick={() => onSelect(lang.code)}
            aria-label={t(lang.labelKey)}
            aria-pressed={selected}
            title={t(lang.labelKey)}
            className={`language-switcher__segment relative z-10 flex items-center justify-center rounded-full transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
              compact ? "w-10 h-10" : "w-11 h-11"
            } ${selected ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
          >
            <LanguageSymbol
              code={lang.code}
              className={compact ? "language-switcher__symbol--compact" : ""}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function LanguageSwitcher({ variant = "floating", className = "" }) {
  const { i18n } = useTranslation();
  const [switching, setSwitching] = useState(false);

  const currentCode = i18n.language?.startsWith("hi") ? "hi" : "en";

  const selectLanguage = async (code) => {
    if (code === currentCode || switching) return;
    setSwitching(true);
    try {
      if (code === "hi") await loadHindiBundle();
      await i18n.changeLanguage(code);
    } finally {
      setSwitching(false);
    }
  };

  if (variant === "drawer") {
    return (
      <div className={`language-switcher language-switcher--drawer ${className}`}>
        <LanguageToggleTrack
          currentCode={currentCode}
          switching={switching}
          onSelect={selectLanguage}
        />
      </div>
    );
  }

  return (
    <div
      className={`language-switcher language-switcher--floating fixed left-3 sm:left-5 bottom-4 sm:bottom-6 z-[999] ${className}`}
    >
      <LanguageToggleTrack
        currentCode={currentCode}
        switching={switching}
        onSelect={selectLanguage}
      />
    </div>
  );
}
