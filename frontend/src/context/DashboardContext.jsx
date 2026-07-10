import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LAYOUT_KEY = "mgrm-dashboard-layout";

function getStoredLayout() {
  try {
    const v = localStorage.getItem(LAYOUT_KEY);
    return v === "modern" ? "modern" : "classic";
  } catch {
    return "classic";
  }
}

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollTarget, setScrollTarget] = useState(null);
  const [layoutVariant, setLayoutVariantState] = useState(getStoredLayout);

  const setLayoutVariant = useCallback((variant) => {
    const next = variant === "modern" ? "modern" : "classic";
    setLayoutVariantState(next);
    try {
      localStorage.setItem(LAYOUT_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const openDashboard = useCallback((section = null) => {
    setScrollTarget(section);
    setIsOpen(true);
  }, []);

  const closeDashboard = useCallback(() => {
    setIsOpen(false);
    setScrollTarget(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      scrollTarget,
      setScrollTarget,
      openDashboard,
      closeDashboard,
      layoutVariant,
      setLayoutVariant,
    }),
    [isOpen, scrollTarget, openDashboard, closeDashboard, layoutVariant, setLayoutVariant]
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
