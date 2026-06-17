import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollTarget, setScrollTarget] = useState(null);

  const openDashboard = useCallback((section = null) => {
    setScrollTarget(section);
    setIsOpen(true);
  }, []);

  const closeDashboard = useCallback(() => {
    setIsOpen(false);
    setScrollTarget(null);
  }, []);

  const value = useMemo(
    () => ({ isOpen, scrollTarget, setScrollTarget, openDashboard, closeDashboard }),
    [isOpen, scrollTarget, openDashboard, closeDashboard]
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
