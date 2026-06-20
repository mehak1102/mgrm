import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Headphones, MessageCircle, Phone, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSupportPopup } from "../../hooks/useSupportPopup";
import "./SupportCallPopup.css";

const supportPhone =
  import.meta.env.VITE_SUPPORT_PHONE ||
  import.meta.env.VITE_SUPPORT_CALL_NUMBER ||
  "+919876543210";

const whatsappNumber =
  import.meta.env.VITE_SUPPORT_WHATSAPP ||
  supportPhone.replace(/\D/g, "");

const telHref = `tel:${supportPhone.replace(/\s/g, "")}`;
const whatsappHref = `https://wa.me/${whatsappNumber}`;

export default function SupportCallPopup() {
  const { isBlue } = useTheme();
  const { isMounted, isOpen, isBubble, open, minimize } = useSupportPopup();
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const root = panelRef.current;
    const focusables = root.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        minimize();
        return;
      }

      if (e.key !== "Tab" || focusables.length === 0) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, minimize]);

  if (!isMounted) return null;

  const ui = (
    <>
      {isOpen && (
        <div
          className="support-call-backdrop"
          aria-hidden="true"
          onClick={minimize}
        />
      )}

      <div
        className={`support-call-shell${isOpen ? " support-call-shell--open" : ""}${
          isBubble ? " support-call-shell--bubble" : ""
        }`}
        aria-live="polite"
      >
        {isOpen && (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-call-title"
            aria-describedby="support-call-desc"
            className="support-call-widget"
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={minimize}
              className="support-call-widget__close"
              aria-label="Minimize support call widget"
            >
              <X size={18} />
            </button>

            <p className="support-call-widget__label">Need quick help?</p>
            <h2 id="support-call-title" className="support-call-widget__title">
              Talk To Our Support Team
            </h2>
            <p id="support-call-desc" className="support-call-widget__text">
              Get guidance for products, orders, recovery support, and assistance.
            </p>

            <div className="support-call-widget__actions">
              <a
                href={telHref}
                className={`support-call-widget__btn support-call-widget__btn--primary ${
                  isBlue ? "support-call-widget__btn--blue" : ""
                }`}
              >
                <Phone size={18} aria-hidden />
                Call Now
              </a>
              <button
                type="button"
                onClick={minimize}
                className="support-call-widget__btn support-call-widget__btn--secondary"
              >
                Continue Browsing
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="support-call-widget__btn support-call-widget__btn--whatsapp"
              >
                <MessageCircle size={18} aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        {isBubble && (
          <div className="support-call-bubble-wrap">
            <span className="support-call-bubble-tooltip" role="tooltip">
              Need help? Call support
            </span>
            <button
              type="button"
              onClick={open}
              className="support-call-bubble support-call-bubble--pulse"
              aria-label="Open support call options"
            >
              <Headphones size={22} />
            </button>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(ui, document.body);
}
