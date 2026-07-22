import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";

export default function FloatingSiteControls({ hideLanguage = false }) {
  const { authReady } = useAuth();

  if (!authReady) return null;
  if (hideLanguage) return null;

  return (
    <div className="floating-site-controls fixed left-3 sm:left-5 bottom-4 sm:bottom-6 z-[999] flex flex-col items-start gap-2.5">
      <LanguageSwitcher variant="stacked" />
    </div>
  );
}
