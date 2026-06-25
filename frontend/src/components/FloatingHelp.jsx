import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";
import Logo3D from "./Logo3D";

const supportPhone =
  import.meta.env.VITE_SUPPORT_PHONE ||
  import.meta.env.VITE_SUPPORT_CALL_NUMBER ||
  "+919876543210";

const whatsappNumber =
  import.meta.env.VITE_SUPPORT_WHATSAPP || supportPhone.replace(/\D/g, "");

const whatsappHref = `https://wa.me/${whatsappNumber}`;

export default function FloatingHelp() {
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
        className="flex w-14 h-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg transition hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="mx-auto" />
      </a>

      {/* Back to top */}
      {showTop && (
        <button
          type="button"
          onClick={scrollTop}
          className="w-12 h-12 shrink-0 rounded-full bg-card dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-100 shadow-lg hover:scale-110 transition flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}