import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

const DASHBOARD_PENDING_KEY = "mgrm_dashboard_pending";

/** Opens overlay and returns home — guests are sent to sign up first */
export default function DashboardRedirect() {
  const { user, authReady } = useAuth();
  const { openDashboard } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      sessionStorage.setItem(DASHBOARD_PENDING_KEY, "1");
      navigate("/register", { replace: true });
      return;
    }

    openDashboard();
    navigate("/", { replace: true });
  }, [authReady, user, openDashboard, navigate]);

  return null;
}
