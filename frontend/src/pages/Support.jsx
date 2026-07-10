import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Phone,
  Mail,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Lightbulb,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Send,
} from "lucide-react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import MGRMBrandRing from "../components/brand/MGRMBrandRing";
import SupportCallPopup from "../components/support/SupportCallPopup";
import SupportFaq from "../components/support/SupportFaq";
import SupportWaysStrip from "../components/support/SupportWaysStrip";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import {
  SectionLabel,
  HeroHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";
import "../theme/support-suggestions.css";
import "../theme/support-faq.css";

const SUPPORT_TYPE_OPTIONS = [
  { value: "Product Help", key: "support.types.productHelp" },
  { value: "Size Guide", key: "support.types.sizeGuide" },
  { value: "Order Help", key: "support.types.orderHelp" },
  { value: "Return Request", key: "support.types.returnRequest" },
  { value: "Bulk Inquiry", key: "support.types.bulkInquiry" },
  { value: "Other", key: "support.types.other" },
];

const SUGGESTION_CATEGORY_OPTIONS = [
  { value: "Product Idea", key: "support.suggestionCategories.productIdea" },
  { value: "Website Feedback", key: "support.suggestionCategories.websiteFeedback" },
  { value: "Service Improvement", key: "support.suggestionCategories.serviceImprovement" },
  { value: "General Suggestion", key: "support.suggestionCategories.general" },
];

export default function Support() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Product Help",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [suggestionForm, setSuggestionForm] = useState({
    name: "",
    email: "",
    category: "General Suggestion",
    message: "",
  });
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionSuccess, setSuggestionSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: current.name || user.name || "",
      email: current.email || user.email || "",
    }));
  }, [user]);

  const submitSupport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await API.post("/support", {
        ...form,
        name: form.name?.trim() || user?.name || "",
        email: user?.email || form.email?.trim() || "",
      });

      setSuccess(t("support.submitSuccess"));
      window.dispatchEvent(new Event("mgrm:support-submitted"));

      setForm({
        name: "",
        email: "",
        phone: "",
        type: "Product Help",
        message: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || t("common.somethingWrong"));
    } finally {
      setLoading(false);
    }
  };

  const submitSuggestion = async (e) => {
    e.preventDefault();
    setSuggestionLoading(true);
    setSuggestionSuccess(false);

    try {
      await API.post("/suggestions", suggestionForm);
      setSuggestionSuccess(true);
      setSuggestionForm({
        name: "",
        email: "",
        category: "General Suggestion",
        message: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || t("common.somethingWrong"));
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <main className="support-page relative bg-[#f6f7fb] bg-app dark:bg-zinc-950 min-h-screen overflow-hidden">
      {/* Full-viewport cinematic hero — first thing users see */}
      {/* <MGRMBrandRing /> */}


      {/* HERO VIDEO */}
<section className="relative overflow-hidden rounded-[24px] sm:rounded-[42px] mx-3 sm:mx-5 mt-4 sm:mt-6 shadow-[0_40px_120px_rgba(0,0,0,0.12)] lg:block">

<div className="relative min-h-[280px] sm:min-h-[520px] lg:min-h-[720px]">

  {/* VIDEO */}
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      scale-[1.02]
      animate-[supportZoom_12s_ease-in-out_infinite_alternate]
    "
  >
    <source src="/videos/support.mp4" type="video/mp4" />
  </video>

  {/* OVERLAY */}
  <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-black/72
      via-black/38
      to-transparent
    "
  />

  {/* SOFT GLOW */}
  <div
    className="
      absolute
      inset-0
      bg-[radial-gradient(circle_at_20%_50%,rgba(0,174,255,.18),transparent_45%)]
    "
  />

  {/* CONTENT */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-24">

    <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">

      {/* LEFT */}
      <div className="max-w-2xl">

        <div
          className="
            inline-flex
            rounded-full
            px-3 py-1.5 sm:px-4 sm:py-2
            bg-white/10
            backdrop-blur-xl
            text-cyan-300
            text-[10px] sm:text-sm
            tracking-[0.2em] sm:tracking-[0.28em]
            font-black
          "
        >
          {t("support.badge")}
        </div>

        <BrandPillBadgeRow tone="on-dark" className="mt-2" />

        <h1
          className="
            mt-4
            text-white
            typo-hero-title
          "
        >
          {t("support.heroTitle")}
        </h1>

        <p
          className="
            mt-4
            sm:mt-6
            text-white/80
            typo-body-lg
            max-w-xl
          "
        >
          {t("support.heroSubtitle")}
        </p>

        {/* CHIPS */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-6 sm:mt-10">

          {[
            t("support.certifiedProducts"),
            t("support.sizeAssistance"),
            t("support.fastSupport"),
          ].map((item) => (
            <div
              key={item}
              className="
                px-3 py-2 sm:px-5 sm:py-3
                rounded-full
                bg-white/10
                backdrop-blur-xl
                border
                border-white/15
                text-white
                text-xs sm:text-base
                font-semibold
              "
            >
              ✓ {item}
            </div>
          ))}

        </div>
      </div>

      {/* RIGHT FORM — desktop only (main form below) */}
      <form
        id="support-form-video"
        onSubmit={submitSupport}
        className="
          hidden lg:block
          bg-white/88
          dark:bg-zinc-900/88
          backdrop-blur-3xl
          rounded-[38px]
          p-8
          shadow-2xl
        "
      >
        {/* KEEP EXISTING FORM */}
      </form>

    </div>

  </div>

</div>

</section>

      <FloatingMedicalBg />

      <div className="relative z-10">

        {/* HERO + FORM */}
        <section className="relative py-10 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 grid lg:grid-cols-[0.95fr_1.05fr] gap-6 sm:gap-10 items-center">

            {/* LEFT */}
            <div>
              <SectionLabel className="typo-label text-purple-700 font-black tracking-widest">
                {t("support.badge")}
              </SectionLabel>

              <HeroHeading
                text={t("support.heroTitle")}
                className="typo-hero-title mt-3 sm:mt-4 leading-[1.05]"
              />

              <FadeUpText className="typo-body-lg text-gray-500 dark:text-zinc-400 mt-3 sm:mt-6 max-w-2xl">
                {t("support.heroSubtitle")}
              </FadeUpText>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                {[
                  [t("support.certifiedProducts"), ShieldCheck],
                  [t("support.sizeAssistance"), Ruler],
                  [t("support.fastSupport"), MessageCircle],
                ].map(([title, Icon]) => (
                  <div key={title} className="bg-card dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow">
                    <Icon className="text-purple-700 w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="font-black mt-2 sm:mt-3 text-xs sm:text-base leading-tight">{title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form
              id="support-form"
              onSubmit={submitSupport}
              className="bg-card dark:bg-zinc-900 rounded-[24px] sm:rounded-[38px] p-5 sm:p-8 shadow-xl"
            >
              <h2 className="typo-section-subtitle mb-3 sm:mb-4">{t("support.contactSupport")}</h2>

              {success && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl">
                  {success}
                </div>
              )}

              <input
                required
                placeholder={t("common.name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <input
                placeholder={t("common.phone")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <input
                placeholder={t("common.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              >
                {SUPPORT_TYPE_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {t(type.key)}
                  </option>
                ))}
              </select>

              <textarea
                required
                rows="4"
                placeholder={t("common.message")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full mb-4 px-4 py-3 rounded-xl border"
              />

              <button className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold">
                {loading ? t("common.submitting") : t("common.submit")}
              </button>
            </form>
          </div>
        </section>

        {/* SUGGESTIONS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-5 pb-10 sm:pb-16">
          <div className="support-suggestions-section p-5 sm:p-8 md:p-12 lg:p-14">
            <div
              className="support-suggestions-section__glow support-suggestions-section__glow--one"
              aria-hidden
            />
            <div
              className="support-suggestions-section__glow support-suggestions-section__glow--two"
              aria-hidden
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <div className="support-suggestions-section__label">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {t("support.yourVoice")}
                </div>

                <h2 className="support-suggestions-section__title">
                  {t("support.hearFromYou")}
                </h2>

                <p className="support-suggestions-section__intro">
                  {t("support.suggestionsIntro")}
                </p>

                <div className="support-suggestions-section__pills mt-8">
                  {[
                    {
                      title: t("support.productIdeas"),
                      text: t("support.productIdeasText"),
                      icon: Lightbulb,
                    },
                    {
                      title: t("support.betterExperience"),
                      text: t("support.betterExperienceText"),
                      icon: HeartHandshake,
                    },
                    {
                      title: t("support.openFeedback"),
                      text: t("support.openFeedbackText"),
                      icon: MessageCircle,
                    },
                  ].map((item) => (
                    <div key={item.title} className="support-suggestions-section__pill">
                      <span className="support-suggestions-section__pill-icon" aria-hidden>
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div className="support-suggestions-section__pill-body min-w-0">
                        <p className="support-suggestions-section__pill-title">{item.title}</p>
                        <p className="support-suggestions-section__pill-text">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="support-suggestions-form">
                {suggestionSuccess && (
                  <div className="support-suggestions-success">
                    <div>
                      <span className="support-suggestions-success__icon" aria-hidden>
                        <CheckCircle2 className="h-9 w-9" />
                      </span>
                      <p className="support-suggestions-success__title">{t("common.thankYou")}</p>
                      <p className="support-suggestions-success__text">
                        {t("support.suggestionThanks")}
                      </p>
                    </div>
                  </div>
                )}

                <h3 className="support-suggestions-form__title">{t("support.shareSuggestion")}</h3>
                <p className="support-suggestions-form__subtitle">
                  {t("support.shareSubtitle")}
                </p>

                <form onSubmit={submitSuggestion} className="mt-6 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      required
                      placeholder={t("common.yourName")}
                      value={suggestionForm.name}
                      onChange={(e) =>
                        setSuggestionForm({ ...suggestionForm, name: e.target.value })
                      }
                      className="support-suggestions-field"
                    />
                    <input
                      type="email"
                      placeholder={t("common.emailOptional")}
                      value={suggestionForm.email}
                      onChange={(e) =>
                        setSuggestionForm({ ...suggestionForm, email: e.target.value })
                      }
                      className="support-suggestions-field"
                    />
                  </div>

                  <select
                    value={suggestionForm.category}
                    onChange={(e) =>
                      setSuggestionForm({ ...suggestionForm, category: e.target.value })
                    }
                    className="support-suggestions-field"
                  >
                    {SUGGESTION_CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {t(category.key)}
                      </option>
                    ))}
                  </select>

                  <textarea
                    required
                    rows="5"
                    placeholder={t("support.describeIdea")}
                    value={suggestionForm.message}
                    onChange={(e) =>
                      setSuggestionForm({ ...suggestionForm, message: e.target.value })
                    }
                    className="support-suggestions-field resize-none"
                  />

                  <button
                    type="submit"
                    disabled={suggestionLoading}
                    className="support-suggestions-submit"
                  >
                    {suggestionLoading ? t("common.sending") : t("support.shareMyIdea")}
                    {!suggestionLoading && <Send className="h-4 w-4" aria-hidden />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ACTION CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-5 pb-12 sm:pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">

            {[
              {
                title: t("support.whatsapp"),
                text: t("support.whatsappText"),
                icon: MessageCircle,
                action: t("support.openWhatsapp"),
                onClick: () =>
                  window.open("https://wa.me/919876543210", "_blank"),
              },
              {
                title: t("support.callSupport"),
                text: t("support.callText"),
                icon: Phone,
                action: t("support.callNow"),
                onClick: () =>
                  (window.location.href = "tel:+919876543210"),
              },
              {
                title: t("support.emailSupport"),
                text: t("support.emailText"),
                icon: Mail,
                action: t("support.sendEmail"),
                onClick: () =>
                  (window.location.href =
                    "mailto:support@mgrmmedicare.com"),
              },
              {
                title: t("support.sizeGuide"),
                text: t("support.sizeGuideText"),
                icon: Ruler,
                action: t("support.openForm"),
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                title: t("support.shipping"),
                text: t("support.shippingText"),
                icon: Truck,
                action: t("support.openForm"),
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                title: t("support.returns"),
                text: t("support.returnsText"),
                icon: RotateCcw,
                action: t("support.openForm"),
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
            ].map((item) => (
              <div key={item.title} className="bg-card dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow">
                <item.icon className="text-purple-700 w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="font-black mt-2 sm:mt-4 text-xs sm:text-base leading-tight">{item.title}</h3>
                <p className="text-gray-500 dark:text-zinc-400 mt-1.5 sm:mt-2 text-[11px] sm:text-base leading-snug">{item.text}</p>

                <button
                  onClick={item.onClick}
                  className="mt-2 sm:mt-4 text-purple-700 font-bold text-[11px] sm:text-base"
                >
                  {item.action} →
                </button>
              </div>
            ))}
          </div>
        </section>

        <SupportFaq />

      </div>

      <SupportWaysStrip />
      <SupportCallPopup />
    </main>
  );
}
