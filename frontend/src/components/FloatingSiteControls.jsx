import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const DashboardLayoutToggle = lazy(() => import("./dashboard/DashboardLayoutToggle"));

const DASHBOARD_PENDING_KEY = "mgrm_dashboard_pending";

export default function FloatingSiteControls({ hideLanguage = false }) {
  const { authReady } = useAuth();
  const navigate = useNavigate();

  if (!authReady) return null;

  const onGuestLayoutPick = () => {
    sessionStorage.setItem(DASHBOARD_PENDING_KEY, "1");
    navigate("/register");
  };

  return (
    <div className="floating-site-controls fixed left-3 sm:left-5 bottom-4 sm:bottom-6 z-[999] flex flex-col items-start gap-2.5">
      <Suspense fallback={null}>
        <DashboardLayoutToggle onGuestPick={onGuestLayoutPick} />
      </Suspense>
      {!hideLanguage && <LanguageSwitcher variant="stacked" />}
    </div>
  );
}
