import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { THEME_OPTIONS } from "../theme/tokens";

export default function ThemeSelector({ className = "" }) {
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
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select theme"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 h-11 px-3 rounded-full border border-edge bg-surface hover:bg-surface-hover text-fg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
      >
        <span className="text-base leading-none" aria-hidden>
          {active.emoji}
        </span>
        <span className="hidden sm:inline text-sm font-semibold">{active.label}</span>
        <ChevronDown
          size={16}
          className={`text-fg-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl border border-edge bg-card shadow-xl py-1 z-[200] transition-colors duration-300"
        >
          {THEME_OPTIONS.map((opt) => (
            <li key={opt.id} role="option" aria-selected={theme === opt.id}>
              <button
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors duration-300 hover:bg-surface-hover ${
                  theme === opt.id
                    ? "text-brand bg-surface-hover"
                    : "text-fg"
                }`}
              >
                <span aria-hidden>{opt.emoji}</span>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
