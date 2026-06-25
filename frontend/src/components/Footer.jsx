import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const PAYMENT_LOGOS = [
  { name: "UPI", src: "/products/upi.png" },
  { name: "RuPay", src: "/products/rupay.png" },
  { name: "Net Banking", src: "/products/netbanking.png" },
  { name: "Mastercard", src: "/products/mastercard.png" },
  { name: "Visa", src: "/products/visa.png" },
];

const PAYMENT_STAGGER = 0.1;
const PAYMENT_REVEAL = 0.5;
const PAYMENT_EASE = [0, 0, 0.2, 1];

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Blogs", to: "/blogs" },
  { label: "Support", to: "/support" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/support" },
];

const FOOTER_CATEGORIES = [
  { label: "Knee Support", query: "Knee" },
  { label: "Back Support", query: "Back" },
  { label: "Cervical Support", query: "Neck" },
  { label: "Foot Care", query: "Ankle And Foot" },
  { label: "Rehabilitation", query: "Orthopedic Aids" },
];

function SocialIcon({ name, fill = "currentColor" }) {
  const cls = "h-[18px] w-[18px]";
  switch (name) {
    case "linkedin":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={fill} aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={fill} aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={fill} aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill={fill} aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}

const SOCIAL_LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    btnClass:
      "border-[#0A66C2]/35 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/16 hover:border-[#0A66C2]/55 hover:shadow-[0_0_18px_rgba(10,102,194,0.35)]",
    iconFill: "#0A66C2",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    btnClass:
      "border-pink-300/45 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] hover:shadow-[0_0_20px_rgba(225,48,108,0.45)]",
    iconFill: "#ffffff",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    btnClass:
      "border-[#1877F2]/35 bg-[#1877F2]/10 hover:bg-[#1877F2]/16 hover:border-[#1877F2]/55 hover:shadow-[0_0_18px_rgba(24,119,242,0.35)]",
    iconFill: "#1877F2",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com",
    btnClass:
      "border-[#FF0000]/35 bg-[#FF0000]/10 hover:bg-[#FF0000]/16 hover:border-[#FF0000]/55 hover:shadow-[0_0_18px_rgba(255,0,0,0.32)]",
    iconFill: "#FF0000",
  },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/support" },
  { label: "Terms & Conditions", to: "/support" },
  { label: "Shipping Policy", to: "/support" },
];

function surfaceCardClass(theme) {
  const base =
    "rounded-2xl border border-edge transition-colors duration-300 shadow-[0_12px_40px_rgba(15,23,42,0.06)]";
  if (theme === "dark") {
    return `${base} bg-zinc-900/55 backdrop-blur-xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]`;
  }
  if (theme === "blue") {
    return `${base} bg-card/75 backdrop-blur-md shadow-[0_12px_40px_rgba(2,132,199,0.1)]`;
  }
  return `${base} bg-card`;
}

function paymentCardClass(theme) {
  const base =
    "group/pay flex h-[76px] w-[108px] shrink-0 items-center justify-center rounded-2xl border px-3 transition-[box-shadow,border-color] duration-300 ease-out";
  if (theme === "dark") {
    return `${base} border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:border-white/18 hover:shadow-[0_14px_32px_rgba(0,0,0,0.35),0_0_24px_rgba(34,211,238,0.14)]`;
  }
  if (theme === "blue") {
    return `${base} border-[var(--border-color)] bg-white/65 backdrop-blur-sm shadow-[0_8px_24px_rgba(2,132,199,0.08)] hover:border-[var(--accent-primary)]/30 hover:shadow-[0_14px_32px_rgba(2,132,199,0.12),0_0_22px_rgba(0,183,255,0.12)]`;
  }
  return `${base} border-edge bg-card shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-[color-mix(in_srgb,var(--accent-primary)_25%,var(--border-color))] hover:shadow-[0_14px_32px_rgba(15,23,42,0.1),0_0_22px_rgba(34,211,238,0.1)]`;
}

function PaymentMethodCard({ logo, index, theme, reduce }) {
  const cardClass = paymentCardClass(theme);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: PAYMENT_REVEAL,
        ease: PAYMENT_EASE,
        delay: index * PAYMENT_STAGGER,
      }}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className={cardClass}
      title={logo.name}
    >
      <img
        src={logo.src}
        alt={logo.name}
        className="h-9 w-auto max-w-[4.5rem] object-contain transition-transform duration-300 ease-out group-hover/pay:scale-[1.03]"
        loading="lazy"
      />
    </motion.div>
  );
}

function socialBtnClass(theme) {
  const base =
    "footer-social-link flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300";
  if (theme === "dark") {
    return `${base} backdrop-blur-sm`;
  }
  if (theme === "blue") {
    return `${base} backdrop-blur-sm`;
  }
  return base;
}

function FooterLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`text-fg-muted hover:text-brand transition-colors duration-300 ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const surfaceCard = surfaceCardClass(theme);
  const socialBtn = socialBtnClass(theme);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <footer className="relative mt-24 border-t border-edge bg-app-muted text-fg transition-colors duration-300">
      <div
        className={`pointer-events-none absolute inset-0 ${
          theme === "blue"
            ? "bg-[radial-gradient(ellipse_at_top,rgba(0,183,255,0.12),transparent_55%)]"
            : theme === "dark"
              ? "bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.08),transparent_55%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_55%)]"
        }`}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Main grid */}
        <section className="pt-10 pb-10 lg:pt-12 lg:pb-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-black text-xl shadow-lg shadow-[color-mix(in_srgb,var(--accent-primary)_25%,transparent)]">
                M
              </div>
              <div>
                <span className="block text-xl font-black text-fg leading-none">MGRM</span>
                <span className="text-xs font-bold tracking-[0.2em] text-fg-muted uppercase">
                  Medicare
                </span>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-7 text-fg-muted max-w-sm">
              <span className="font-semibold text-fg">Comfort. Care. Cure.</span>
              <br />
              Advanced orthopedic and rehabilitation solutions trusted across India.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map(({ id, label, href, btnClass, iconFill }) => (
                <motion.a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  className={`${socialBtn} ${btnClass}`}
                >
                  <SocialIcon name={id} fill={iconFill} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to} className="text-sm font-semibold hover:translate-x-0.5 inline-block">
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand mb-5">
              Categories
            </h3>
            <ul className="space-y-3">
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <FooterLink
                    to={`/shop?category=${encodeURIComponent(cat.query)}`}
                    className="text-sm font-semibold"
                  >
                    {cat.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-brand">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">Phone</p>
                  <a
                    href="tel:+9118001234567"
                    className="text-sm font-semibold text-fg hover:text-brand transition-colors"
                  >
                    1800-123-4567 (Toll Free)
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-brand">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">Email</p>
                  <a
                    href="mailto:support@mgrmmedicare.com"
                    className="text-sm font-semibold text-fg hover:text-brand transition-colors break-all"
                  >
                    support@mgrmmedicare.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-brand">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fg-muted">Address</p>
                  <p className="text-sm font-semibold text-fg leading-relaxed">
                    MGRM Medicare Pvt. Ltd.
                    <br />
                    New Delhi, India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-10 lg:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`footer-newsletter-card relative overflow-hidden rounded-[28px] p-8 sm:p-10 lg:p-12 ${surfaceCard} !border-[var(--accent-primary)]/20`}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--accent-secondary)_12%,transparent)] blur-3xl"
              aria-hidden
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
                  Newsletter
                </p>
                <h3 className="footer-newsletter-title mt-2 text-2xl sm:text-3xl font-black text-fg">
                  Stay Updated With MGRM
                </h3>
                <p className="footer-newsletter-copy mt-3 text-sm text-fg-muted leading-relaxed">
                  Recovery tips, new product launches, and exclusive offers — delivered to your inbox.
                </p>
              </div>

              <form
                onSubmit={handleSubscribe}
                className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="theme-panel flex-1 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black whitespace-nowrap shadow-lg"
                >
                  Subscribe
                  <ArrowRight size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </section>

        {/* Payment methods + bottom bar */}
        <div className="border-t border-edge pt-8 pb-5 sm:pb-6">
          <section aria-labelledby="footer-payment-heading" className="mb-8">
            <motion.h3
              id="footer-payment-heading"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{ duration: PAYMENT_REVEAL, ease: PAYMENT_EASE }}
              className="text-center text-sm font-black uppercase tracking-[0.2em] text-brand"
            >
              Secure Payment Methods
            </motion.h3>
            <div
              className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              aria-label="Accepted payment methods"
            >
              {PAYMENT_LOGOS.map((logo, index) => (
                <PaymentMethodCard
                  key={logo.name}
                  logo={logo}
                  index={index}
                  theme={theme}
                  reduce={reduce}
                />
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-fg-muted text-center sm:text-left">
              © 2026 MGRM Medicare. All Rights Reserved.
            </p>
            <nav
              className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2"
              aria-label="Legal"
            >
              {LEGAL_LINKS.map((link) => (
                <FooterLink
                  key={link.label}
                  to={link.to}
                  className="text-sm font-semibold"
                >
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
