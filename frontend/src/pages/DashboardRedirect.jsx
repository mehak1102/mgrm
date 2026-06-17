import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

/** Opens overlay and returns home — no full-page dashboard route */
export default function DashboardRedirect() {
  const { openDashboard } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    openDashboard();
    navigate("/", { replace: true });
  }, [openDashboard, navigate]);

  return null;
}
