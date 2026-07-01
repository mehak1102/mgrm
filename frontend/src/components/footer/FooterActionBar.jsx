import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { getCatalogPdfUrl } from "../../utils/shareProduct";

function SocialIcon({ name }) {
  const cls = "h-[18px] w-[18px]";
  switch (name) {
    case "youtube":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}

const FOLLOW_LINKS = [
  { id: "youtube", label: "YouTube", href: "https://youtube.com" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/mgrmmedicare/" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "twitter", label: "X (Twitter)", href: "https://twitter.com" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
];

export default function FooterActionBar() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error(t("footer.enterEmailError"));
      return;
    }
    toast.success(t("footer.subscribeSuccess"));
    setEmail("");
  };

  const handleCatalogDownload = () => {
    setDownloading(true);
    window.open(getCatalogPdfUrl(), "_blank", "noopener,noreferrer");
    toast.success(t("footerBar.catalogStarted"));
    setTimeout(() => setDownloading(false), 1400);
  };

  return (
    <section className="footer-action-bar border-b border-edge bg-card">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          <button
            type="button"
            onClick={handleCatalogDownload}
            disabled={downloading}
            className="footer-catalog-card lg:col-span-4 group relative w-full overflow-hidden rounded-2xl text-left transition disabled:opacity-85"
            aria-label={t("footerBar.downloadCatalog")}
          >
            <span className="footer-catalog-card__glow" aria-hidden />
            <span className="footer-catalog-card__shine" aria-hidden />

            <div className="relative z-[1] flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
              <div className="footer-catalog-card__cover shrink-0">
                <img src="/products/all.png" alt="" className="footer-catalog-card__cover-img" />
                <span className="footer-catalog-card__cover-badge">PDF</span>
              </div>

              <div className="min-w-0 flex-1">
                <span className="footer-catalog-card__eyebrow inline-flex items-center gap-1.5">
                  <Sparkles size={13} aria-hidden />
                  {t("common.freeDownload")}
                </span>
                <p className="footer-catalog-card__title mt-1.5">
                  {t("footerBar.catalogTitle")}
                </p>
                <span className="footer-catalog-card__cta mt-3 inline-flex items-center gap-2">
                  {downloading ? (
                    <>
                      <FileText size={16} className="animate-pulse" aria-hidden />
                      {t("footerBar.preparingPdf")}
                    </>
                  ) : (
                    <>
                      <Download size={16} aria-hidden />
                      {t("footerBar.downloadCatalog")}
                    </>
                  )}
                </span>
              </div>
            </div>
          </button>

          <div className="lg:col-span-3 flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-fg-muted">{t("common.followUs")}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
              {FOLLOW_LINKS.map(({ id, label, href }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-action-bar__social flex h-11 w-11 items-center justify-center rounded-md bg-[#3d3d3d] text-white transition hover:bg-[#252525]"
                >
                  <SocialIcon name={id} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-fg-muted text-center lg:text-left">
              {t("footerBar.signupCopy")}
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch"
            >
              <label htmlFor="footer-action-email" className="sr-only">
                {t("common.emailAddress")}
              </label>
              <input
                id="footer-action-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("common.emailAddress")}
                className="theme-panel min-h-11 flex-1 rounded-md border border-edge px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/35"
              />
              <button
                type="submit"
                className="footer-action-bar__signup min-h-11 shrink-0 rounded-md px-6 text-sm font-bold text-white transition hover:brightness-105"
              >
                {t("common.signUp")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
