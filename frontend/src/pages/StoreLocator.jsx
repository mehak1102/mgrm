import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import FloatingLabelField from "../components/support/FloatingLabelField";
import { HeroHeading, FadeUpBlock } from "../components/typography/TypographyMotion";
import { PremiumReveal } from "../components/motion/PremiumMotion";
import {
  STORE_LOCATIONS,
  STORE_MAP_BG,
  STORE_CARD_ACCENTS,
  INDIAN_STATES,
  STORE_CITIES,
  PRODUCT_TYPES,
} from "../data/supportData";
import API from "../api";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import { useTheme } from "../context/ThemeContext";

function MapIllustration() {
  const { isBlue } = useTheme();
  const reduced = useReducedMotion();
  const pins = [
    { top: "18%", left: "42%", delay: 0 },
    { top: "35%", left: "28%", delay: 0.15 },
    { top: "52%", left: "55%", delay: 0.3 },
    { top: "68%", left: "38%", delay: 0.45 },
    { top: "42%", left: "72%", delay: 0.6 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto support-map-illustration">
      <div
        className={`support-map-illustration__frame absolute inset-0 rounded-[36px] overflow-hidden border border-white/60 dark:border-white/10 shadow-[0_30px_80px_rgba(6,182,212,0.15)]${
          isBlue ? " support-map-illustration__frame--blue" : ""
        }`}
      >
        <img
          src={STORE_MAP_BG}
          alt="MGRM India network map"
          className="support-map-illustration__image absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/products/pain-area.png";
          }}
        />
        {isBlue ? (
          <div
            className="support-map-illustration__overlay-blue absolute inset-0 pointer-events-none"
            aria-hidden
          />
        ) : (
          <>
            <div className="support-map-illustration__overlay absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-white/20 to-purple-500/20 dark:from-cyan-950/50 dark:via-slate-900/40 dark:to-purple-950/40" />
            <div className="support-map-illustration__blur absolute inset-0 backdrop-blur-[2px]" />

            <svg viewBox="0 0 400 400" className="support-map-illustration__svg absolute inset-0 w-full h-full opacity-20 dark:opacity-15 pointer-events-none">
              <path
                d="M50 200 Q120 80 200 120 T350 180 T280 320 T120 300 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-cyan-500/50"
              />
            </svg>
          </>
        )}

        {pins.map((pin, i) => (
          <motion.div
            key={i}
            className={`absolute ${isBlue ? "z-20" : ""}`}
            style={{ top: pin.top, left: pin.left }}
            animate={reduced ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: pin.delay, ease: "easeInOut" }}
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
              <MapPin className="text-red-500 drop-shadow-lg relative" size={28} fill="currentColor" />
            </div>
          </motion.div>
        ))}

        <div className={`absolute bottom-6 left-6 right-6 rounded-2xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 border border-white/50 dark:border-white/10 support-map-badge${isBlue ? " z-20" : ""}`}>
          <p className="text-xs font-bold text-brand tracking-widest support-map-badge-label">INDIA NETWORK</p>
          <p className="text-sm font-black text-fg support-map-badge-title">{STORE_LOCATIONS.length} Locations</p>
        </div>
      </div>
    </div>
  );
}

function StoreCard({ store, index }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  const accent = STORE_CARD_ACCENTS[index % STORE_CARD_ACCENTS.length];

  return (
    <PremiumReveal delay={index * 0.08}>
      <article
        className="support-store-card store-card-pastel card support-glass group rounded-[32px] overflow-hidden border-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:-translate-y-2 transition-all duration-300"
        style={{
          "--store-border": accent.border,
          "--store-border-hover": accent.hover,
          "--store-glow": accent.glow,
        }}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            onError={(e) => {
              e.currentTarget.src = "/products/knee.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 store-card-overlay">
            <p className="text-white font-black text-lg leading-tight">{store.name}</p>
            <p className="text-white/80 text-sm">{store.city}, {store.state}</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-fg-muted flex gap-2">
            <MapPin size={16} className="shrink-0 text-brand mt-0.5" />
            {store.address}
          </p>
          <p className="text-sm text-fg-muted flex gap-2">
            <Phone size={16} className="shrink-0 text-brand" />
            {store.phone}
          </p>
          <p className="text-sm text-fg-muted flex gap-2">
            <Mail size={16} className="shrink-0 text-brand" />
            {store.email}
          </p>
          <p className="text-sm text-fg-muted flex gap-2">
            <Clock size={16} className="shrink-0 text-brand" />
            {store.hours}
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg transition"
          >
            <Navigation size={16} />
            Get Directions
          </a>
        </div>
      </article>
    </PremiumReveal>
  );
}

export default function StoreLocator() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [productType, setProductType] = useState("");
  const [searched, setSearched] = useState(false);
  const storesRef = useRef(null);
  const reduced = useReducedMotion();

  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredStores = useMemo(() => {
    if (!searched && !city && !state && !productType) return STORE_LOCATIONS;
    return STORE_LOCATIONS.filter((s) => {
      const matchCity = !city || s.city === city;
      const matchState = !state || s.state === state;
      const matchProduct = !productType || s.productTypes.includes(productType);
      return matchCity && matchState && matchProduct;
    });
  }, [city, state, productType, searched]);

  const handleSearch = () => {
    setSearched(true);
    storesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/store-feedback", feedback);
      setSuccess(true);
      setFeedback({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success("Thank you! Your feedback has been submitted.");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="support-page relative min-h-screen overflow-hidden">
      <FloatingMedicalBg />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeUpBlock>
              <p className="text-xs font-bold tracking-[0.2em] text-brand mb-2">
                STORE LOCATOR
              </p>
              <BrandPillBadgeRow className="mb-3" />
            </FadeUpBlock>
            <HeroHeading
              text="Find MGRM Near You"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-fg leading-tight"
            />
            <FadeUpBlock delay={0.15}>
              <p className="text-lg text-fg-muted mt-5 max-w-lg leading-relaxed">
                Locate trusted MGRM stores, clinics and distribution centers across India.
                Contact your nearest office or email{" "}
                <a href="mailto:contact@mgrmmedicare.com" className="text-brand font-bold hover:underline">
                  contact@mgrmmedicare.com
                </a>{" "}
                to find retail stores near you.
              </p>
            </FadeUpBlock>
            <FadeUpBlock delay={0.25}>
              <button
                type="button"
                onClick={() => storesRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="mt-8 px-8 py-4 rounded-[22px] btn-primary font-black shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-250"
              >
                Find Nearby
              </button>
            </FadeUpBlock>
          </div>
          <FadeUpBlock delay={0.2}>
            <MapIllustration />
          </FadeUpBlock>
        </div>
      </section>

      {/* Search */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        <PremiumReveal>
          <div className="card support-glass rounded-[36px] p-8 border border-edge backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-black text-fg mb-6 flex items-center gap-2">
              <Search className="text-brand" size={24} />
              Search Stores
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={city}
                onChange={(e) => { setCity(e.target.value); setSearched(true); }}
                className="theme-panel rounded-[22px] px-5 py-4 text-fg"
              >
                <option value="">All Cities</option>
                {STORE_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={state}
                onChange={(e) => { setState(e.target.value); setSearched(true); }}
                className="theme-panel rounded-[22px] px-5 py-4 text-fg"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={productType}
                onChange={(e) => { setProductType(e.target.value); setSearched(true); }}
                className="theme-panel rounded-[22px] px-5 py-4 text-fg"
              >
                <option value="">All Product Types</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="mt-6 px-8 py-4 rounded-[22px] btn-primary font-black"
            >
              Search Stores
            </button>
            {searched && (
              <p className="mt-4 text-sm text-fg-muted">
                Showing {filteredStores.length} location{filteredStores.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </PremiumReveal>
      </section>

      {/* Store Cards */}
      <section ref={storesRef} className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-black text-fg mb-8">
          Our Locations
        </h2>
        {filteredStores.length === 0 ? (
          <div className="card rounded-[32px] p-12 text-center text-fg-muted">
            No stores match your filters. Try adjusting city, state, or product type.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Feedback */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <PremiumReveal>
          <div className="card support-glass rounded-[36px] p-8 md:p-12 border border-edge backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-brand mb-3">
                  CONTACT SUPPORT
                </p>
                <h2 className="text-3xl font-black text-fg">
                  Share Your Feedback
                </h2>
                <p className="text-fg-muted mt-4 leading-relaxed">
                  Have suggestions about our stores or need help finding a location?
                  We&apos;d love to hear from you.
                </p>
              </div>

              <div className="relative">
                {success && (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-10 rounded-[28px] bg-emerald-500/95 backdrop-blur-md grid place-items-center text-white p-8 text-center"
                  >
                    <CheckCircle2 size={56} className="mb-4" />
                    <p className="text-xl font-black">Thank You!</p>
                    <p className="mt-2 opacity-90">Your feedback has been received.</p>
                  </motion.div>
                )}
                <form onSubmit={submitFeedback} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FloatingLabelField
                      id="fb-name"
                      label="Name"
                      value={feedback.name}
                      onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                      required
                    />
                    <FloatingLabelField
                      id="fb-email"
                      label="Email"
                      type="email"
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      required
                    />
                  </div>
                  <FloatingLabelField
                    id="fb-phone"
                    label="Phone"
                    type="tel"
                    value={feedback.phone}
                    onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })}
                  />
                  <FloatingLabelField
                    id="fb-subject"
                    label="Subject"
                    value={feedback.subject}
                    onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
                  />
                  <FloatingLabelField
                    id="fb-message"
                    label="Message"
                    as="textarea"
                    rows={4}
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 rounded-[22px] btn-primary font-black disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Submitting..." : (
                      <>
                        <Sparkles size={18} />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </PremiumReveal>
      </section>
    </main>
  );
}
