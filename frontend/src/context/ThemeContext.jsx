import { createContext, useContext, useEffect, useState } from "react";
import {
  applyThemeTokens,
  getStoredTheme,
  STORAGE_KEY,
  THEME_IDS,
} from "../theme/tokens";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);

  useEffect(() => {
    applyThemeTokens(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = (next) => {
    const resolved = typeof next === "function" ? next(theme) : next;
    if (THEME_IDS.includes(resolved)) {
      setThemeState(resolved);
    }
  };

  const isDark = theme === "dark";
  const isBlue = theme === "blue";
  const isLight = theme === "light";
  const isDarkSurface = theme === "dark";

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDark, isBlue, isLight, isDarkSurface }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
