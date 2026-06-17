/** Central theme token definitions — applied to :root via data-theme on <html> */
export const THEME_IDS = ["light", "dark", "blue"];

export const STORAGE_KEY = "mgrm-theme";

export const THEME_TOKENS = {
  light: {
    "bg-primary": "#ffffff",
    "bg-secondary": "#f7f8fb",
    "card-bg": "#ffffff",
    "card-elevated": "#ffffff",
    "card-hover": "#f1f5f9",
    "border-color": "#e2e8f0",
    "accent-primary": "#25319a",
    "accent-secondary": "#22a7dc",
    "text-primary": "#0f172a",
    "text-secondary": "#64748b",
    "text-muted": "#64748b",
    "text-accent": "#25319a",
    "gradient-from": "#ffffff",
    "gradient-via": "#f8fbff",
    "gradient-to": "#eef8ff",
    primary: "#25319a",
    accent: "#22a7dc",
    soft: "#eef8ff",
    bg1: "#f8fbff",
    border: "#dbeafe",
    text: "#101828",
  },
  dark: {
    "bg-primary": "#020617",
    "bg-secondary": "#0f172a",
    "card-bg": "#18181b",
    "card-elevated": "#111827",
    "card-hover": "#27272a",
    "border-color": "rgba(255, 255, 255, 0.1)",
    "accent-primary": "#22d3ee",
    "accent-secondary": "#3b82f6",
    "text-primary": "#fafafa",
    "text-secondary": "#a1a1aa",
    "text-muted": "#71717a",
    "text-accent": "#67e8f9",
    "gradient-from": "#09090b",
    "gradient-via": "#020617",
    "gradient-to": "#18181b",
    /* Legacy vars — original dark theme (btn-primary, theme-text, etc.) */
    primary: "#25319a",
    accent: "#22a7dc",
    soft: "#18181b",
    bg1: "#09090b",
    border: "#3f3f46",
    text: "#fafafa",
  },
  blue: {
    "bg-primary": "#003262",
    "bg-secondary": "#00284E",
    "bg-elevated": "#003875",
    "card-bg": "rgba(255, 255, 255, 0.84)",
    "card-elevated": "rgba(255, 255, 255, 0.90)",
    "card-hover": "rgba(255, 255, 255, 0.92)",
    "card-border": "rgba(255, 255, 255, 0.28)",
    "border-color": "rgba(255, 255, 255, 0.12)",
    "border-hover": "rgba(255, 215, 0, 0.35)",
    "accent-primary": "#003262",
    "accent-secondary": "#FFD700",
    "accent-soft": "rgba(255, 215, 0, 0.12)",
    "action-primary": "#FFD700",
    "action-hover": "#FFE45A",
    "action-pressed": "#E8C100",
    "action-text": "#003262",
    "text-primary": "#FFFFFF",
    "text-secondary": "rgba(255, 255, 255, 0.82)",
    "text-muted": "rgba(255, 255, 255, 0.65)",
    "text-accent": "#FFD700",
    "text-on-card": "#12324a",
    "text-on-card-muted": "#4f6980",
    "gradient-from": "#003262",
    "gradient-via": "#003262",
    "gradient-to": "#00284E",
    primary: "#003262",
    accent: "#FFD700",
    soft: "rgba(255, 215, 0, 0.12)",
    bg1: "#003262",
    border: "rgba(255, 255, 255, 0.12)",
    text: "#FFFFFF",
  },
};

export const THEME_OPTIONS = [
  { id: "light", label: "Light", emoji: "☀️" },
  { id: "dark", label: "Dark", emoji: "🌙" },
  { id: "blue", label: "Blue", emoji: "🔵" },
];

/** Inline script in index.html — keep in sync with THEME_TOKENS */
export const FLASH_SCRIPT_TOKENS = THEME_TOKENS;

export function getStoredTheme() {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("mgrm-color-mode") ||
      localStorage.getItem("mgrm_theme");
    if (THEME_IDS.includes(stored)) return stored;
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function applyThemeTokens(themeId) {
  const tokens = THEME_TOKENS[themeId] || THEME_TOKENS.light;
  const root = document.documentElement;
  root.setAttribute("data-theme", themeId);
  root.classList.toggle("dark", themeId === "dark");
  root.style.colorScheme = themeId === "dark" ? "dark" : "light";

  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}
