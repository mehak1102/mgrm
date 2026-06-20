import { useCallback, useEffect, useRef, useState } from "react";

/** Session-only states: hidden → open | bubble */
export function useSupportPopup() {
  const [view, setView] = useState("hidden");
  const triggeredRef = useRef(false);

  const open = useCallback(() => setView("open"), []);
  const minimize = useCallback(() => setView("bubble"), []);

  useEffect(() => {
    if (triggeredRef.current) return;

    const reveal = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setView("open");
    };

    const delay = 1800 + Math.floor(Math.random() * 700);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      if (doc.scrollTop / max >= 0.2) reveal();
    };

    const timerId = window.setTimeout(reveal, delay);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return {
    isMounted: view !== "hidden",
    isOpen: view === "open",
    isBubble: view === "bubble",
    open,
    minimize,
  };
}
