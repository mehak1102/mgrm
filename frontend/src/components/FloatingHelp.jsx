import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";

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
    <div className="fixed right-5 bottom-6 flex flex-col gap-3 z-[999]">

      {/* Chat button */}
      <button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:scale-110 transition">
        <MessageCircle className="mx-auto" />
      </button>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={scrollTop}
          className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-lg hover:scale-110 transition flex items-center justify-center"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}