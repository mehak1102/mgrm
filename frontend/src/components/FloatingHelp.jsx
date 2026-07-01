import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUp } from "lucide-react";
import Logo3D from "./Logo3D";

function WhatsAppIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const supportPhone =
  import.meta.env.VITE_SUPPORT_PHONE ||
  import.meta.env.VITE_SUPPORT_CALL_NUMBER ||
  "+919876543210";

const whatsappNumber =
  import.meta.env.VITE_SUPPORT_WHATSAPP || supportPhone.replace(/\D/g, "");

const whatsappHref = `https://wa.me/${whatsappNumber}`;

export default function FloatingHelp() {
  const { t } = useTranslation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-5 bottom-6 z-[999] flex w-14 flex-col items-center gap-3 sm:gap-3.5">
      <div className="relative flex h-[50px] w-full items-end justify-center overflow-visible pb-1 sm:h-[56px] sm:pb-1.5">
        <div className="pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom scale-[0.76] sm:bottom-2.5 sm:scale-[0.86]">
          <Logo3D />
        </div>
      </div>

      {/* WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-help-whatsapp flex w-14 h-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition hover:scale-110 hover:bg-[#20bd5a]"
        aria-label={t("global.chatWhatsapp")}
      >
        <WhatsAppIcon />
      </a>

      {/* Back to top */}
      {showTop && (
        <button
          type="button"
          onClick={scrollTop}
          className="w-12 h-12 shrink-0 rounded-full bg-card dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 shadow-lg hover:scale-110 transition flex items-center justify-center"
          aria-label={t("global.backToTop")}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}