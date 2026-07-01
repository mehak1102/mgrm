import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Award,
  Briefcase,
  Clock,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Wrench,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import {
  SectionLabel,
  HeroHeading,
  FadeUpText,
  FadeUpBlock,
  StaggerReveal,
  StaggerItem,
} from "../components/typography/TypographyMotion";
import { useTheme } from "../context/ThemeContext";
import "./Careers.css";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";

const IMAGE_STRIP = [
  {
    key: "innovation",
    image:
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: "purpose",
    image:
      "https://images.unsplash.com/flagged/photo-1576485436509-a7d286952b65?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: "impact",
    image:
      "https://plus.unsplash.com/premium_photo-1770249818460-995d59b60df2?q=80&w=1101&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const WHY_JOIN = [
  {
    icon: Target,
    title: "Purpose-Driven Work",
    text: "Help patients and clinicians access trusted orthopedic and rehabilitation solutions.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Credibility",
    text: "Build your career with a brand focused on movement, recovery, and long-term care outcomes.",
  },
  {
    icon: TrendingUp,
    title: "Growth & Learning",
    text: "Work across product, clinical support, operations, and customer experience.",
  },
];

const BENEFITS = [
  { icon: Shield, title: "Health support", text: "Wellness-first policies for you and your family." },
  { icon: GraduationCap, title: "Learning", text: "Certification assistance and skill development." },
  { icon: Clock, title: "Flexible growth", text: "Structured pathways across teams and roles." },
  { icon: Wrench, title: "Modern tools", text: "Efficient systems that support premium service delivery." },
  { icon: Award, title: "Performance rewards", text: "Recognition aligned with impact and excellence." },
  { icon: Users, title: "Team culture", text: "Collaborative, respectful, and patient-focused teams." },
];

const PROCESS = [
  { step: "Apply", text: "Submit your profile and resume for an open role." },
  { step: "Review", text: "Our HR and hiring team reviews your experience." },
  { step: "Interview", text: "Meet the team and discuss fit, skills, and goals." },
  { step: "Offer", text: "Successful candidates receive a formal offer letter." },
];

const FAQ = [
  {
    q: "How long does the hiring process take?",
    a: "Most roles are reviewed within 5–10 business days. Interview timelines vary by department.",
  },
  {
    q: "Can I apply for more than one role?",
    a: "Yes. Submit separate applications for each position that matches your profile.",
  },
  {
    q: "Do you hire across India?",
    a: "Yes. MGRM hires for field, clinical support, operations, and corporate roles across major cities.",
  },
];

const CULTURE = [
  { title: "Patient-First Mindset" },
  { title: "Precision in Care" },
  { title: "Team Recovery Culture" },
  { title: "Innovation with Trust" },
];

const PASTEL_BORDERS = [
  "careers-pastel-lavender",
  "careers-pastel-sky",
  "careers-pastel-mint",
  "careers-pastel-peach",
  "careers-pastel-rose",
  "careers-pastel-lemon",
];

const pastelBorder = (index) => PASTEL_BORDERS[index % PASTEL_BORDERS.length];

const WHY_JOIN_PASTELS = [
  "careers-section-why-lavender",
  "careers-section-why-sky",
  "careers-section-why-mint",
];

const BENEFITS_PASTELS = [
  "careers-section-benefits-peach",
  "careers-section-benefits-rose",
  "careers-section-benefits-lemon",
  "careers-section-benefits-sky",
  "careers-section-benefits-mint",
  "careers-section-benefits-lavender",
];

const PROCESS_PASTELS = [
  "careers-section-process-ice",
  "careers-section-process-lilac",
  "careers-section-process-aqua",
  "careers-section-process-apricot",
];

const CULTURE_PASTELS = [
  "careers-section-culture-rose",
  "careers-section-culture-mint",
  "careers-section-culture-sky",
  "careers-section-culture-lemon",
];

const sectionPastel = (palette, index) => palette[index % palette.length];

const emptyApply = {
  name: "",
  email: "",
  phone: "",
  coverLetter: "",
};

export default function Careers() {
  const { t } = useTranslation();
  const { isBlue } = useTheme();
  const heroRef = useRef(null);
  const positionsRef = useRef(null);
  const cultureRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyForm, setApplyForm] = useState(emptyApply);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get("/careers")
      .then((res) => setJobs(res.data.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const offset = Math.min(window.scrollY * 0.12, 72);
      hero.style.setProperty("--careers-parallax", `${offset}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openApply = (job) => {
    setSelectedJob(job);
    setApplyForm(emptyApply);
    setResumeFile(null);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    if (!resumeFile) {
      toast.error(t("careers.uploadResume"));
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", applyForm.name);
      fd.append("email", applyForm.email);
      fd.append("phone", applyForm.phone);
      fd.append("coverLetter", applyForm.coverLetter);
      fd.append("resume", resumeFile);

      await API.post(`/careers/${selectedJob._id}/apply`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t("careers.applicationSent"));
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || t("careers.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const primaryBtn = isBlue
    ? "bg-[#FFD700] text-[#12344f] hover:bg-[#ffe45a]"
    : "btn-primary";
  const outlineBtn =
    "border border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm";

  return (
    <main className="careers-page bg-app dark:bg-zinc-950 min-h-screen">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[58vh] md:min-h-[62vh] overflow-hidden">
        <img
          // src={HERO_IMAGE}
          src="/products/career.png" 
          alt=""
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="careers-hero-bg absolute inset-0 w-full h-[115%] object-cover object-[72%_center]"
        />
        <div className="careers-hero-overlay careers-hero-overlay--left absolute inset-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 py-24 md:py-32 w-full">
          <div className="max-w-lg md:max-w-md lg:max-w-lg text-left">
          <FadeUpBlock>
            <SectionLabel className="text-white/90 font-black tracking-[0.28em]">
              {t("careers.badge")}
            </SectionLabel>
          </FadeUpBlock>
          <BrandPillBadgeRow tone="on-dark" className="mt-2" />
          <HeroHeading
            text={t("careers.heroTitle")}
            as="h1"
            className="mt-3 text-white max-w-4xl"
            animateOnMount
          />
          <FadeUpText className="mt-5 text-white/85 max-w-2xl text-base md:text-lg" delay={0.15} animateOnMount>
            {t("careers.heroSubtitle")}
          </FadeUpText>
          <FadeUpBlock delay={0.25} className="mt-8 flex flex-col sm:flex-row gap-3 justify-start">
            <button
              type="button"
              onClick={() => scrollTo(positionsRef)}
              className={`px-6 py-3 rounded-xl font-black ${primaryBtn}`}
            >
              {t("careers.openPositions")}
            </button>
            <button
              type="button"
              onClick={() => scrollTo(cultureRef)}
              className={`px-6 py-3 rounded-xl font-black ${outlineBtn}`}
            >
              {t("careers.exploreCulture")}
            </button>
          </FadeUpBlock>
          </div>
        </div>
      </section>

      {/* IMAGE STRIP */}
      <section className="max-w-6xl mx-auto px-5 -mt-10 relative z-20 pb-16">
        <StaggerReveal className="grid md:grid-cols-3 gap-4">
          {IMAGE_STRIP.map((item, index) => (
            <StaggerItem key={item.key}>
              <article
                className={`careers-card careers-strip-card rounded-3xl overflow-hidden group ${pastelBorder(index)}`}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    width={900}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                </div>
                <div className="careers-strip-body p-5">
                  <h3 className="font-black text-fg">{t(`careers.imageStrip.${item.key}.title`)}</h3>
                  <p className="text-sm text-fg-muted mt-2">{t(`careers.imageStrip.${item.key}.text`)}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* OPEN POSITIONS */}
      <section ref={positionsRef} className="max-w-6xl mx-auto px-5 pb-20 scroll-mt-24">
        <FadeUpBlock className="careers-section-head flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="text-brand" size={20} />
              <p className="text-xs font-black uppercase tracking-widest text-brand">{t("careers.opportunities")}</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-fg">{t("careers.openPositions")}</h2>
          </div>
          {!loading && (
            <p className="text-sm text-fg-muted">{t("common.openRoles", { count: jobs.length })}</p>
          )}
        </FadeUpBlock>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="h-56 careers-skeleton rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className={`careers-card rounded-3xl p-10 text-center ${pastelBorder(0)}`}>
            <p className="text-fg font-black text-lg">{t("careers.noOpenings")}</p>
            <p className="text-fg-muted mt-2 text-sm max-w-md mx-auto">
              {t("careers.noOpeningsDetail")}
            </p>
          </div>
        ) : (
          <StaggerReveal className="grid md:grid-cols-2 gap-5">
            {jobs.map((job, index) => (
              <StaggerItem key={job._id}>
                <article
                  className={`careers-card careers-job-card rounded-3xl p-6 h-full flex flex-col ${pastelBorder(index)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="careers-dept-badge inline-flex text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {job.department}
                    </span>
                    <span className="text-[11px] font-bold text-fg-muted">{t("common.competitivePackage")}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-fg mt-4">{job.title}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-fg-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0 text-brand" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={14} className="shrink-0 text-brand" />
                      {job.type}
                    </span>
                    <span className="col-span-2">{job.experience}</span>
                  </div>
                  <p className="mt-4 text-sm text-fg-muted line-clamp-3 flex-1">{job.description}</p>
                  <button
                    type="button"
                    onClick={() => openApply(job)}
                    className={`mt-6 w-full sm:w-auto px-6 py-3 rounded-xl font-black ${primaryBtn}`}
                  >
                    {t("careers.applyNow")}
                  </button>
                </article>
              </StaggerItem>
            ))}
          </StaggerReveal>
        )}
      </section>

      {/* WHY JOIN */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <FadeUpBlock className="careers-section-head mb-8">
          <h2 className="text-3xl font-black text-fg">{t("careers.whyJoin")}</h2>
          <p className="text-fg-muted mt-2 max-w-2xl">
            {t("careers.whyJoinIntro")}
          </p>
        </FadeUpBlock>
        <StaggerReveal className="grid md:grid-cols-3 gap-5">
          {WHY_JOIN.map((item, index) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div
                  className={`careers-card rounded-3xl p-6 h-full ${sectionPastel(WHY_JOIN_PASTELS, index)}`}
                >
                  <div className="careers-icon-chip mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-fg">{t(`careers.whyJoinItems.${["purpose", "clinical", "growth"][index]}.title`)}</h3>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">{t(`careers.whyJoinItems.${["purpose", "clinical", "growth"][index]}.text`)}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <FadeUpBlock className="careers-section-head mb-8">
          <h2 className="text-3xl font-black text-fg">{t("careers.benefits")}</h2>
        </FadeUpBlock>
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div
                  className={`careers-card careers-benefit-card rounded-3xl p-5 flex flex-col ${sectionPastel(BENEFITS_PASTELS, index)}`}
                >
                  <Icon size={18} className="text-brand mb-3" />
                  <p className="font-black text-fg">{t(`careers.benefitsItems.${["health", "learning", "flexible", "tools", "rewards", "culture"][index]}.title`)}</p>
                  <p className="text-sm text-fg-muted mt-2">{t(`careers.benefitsItems.${["health", "learning", "flexible", "tools", "rewards", "culture"][index]}.text`)}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </section>

      {/* PROCESS */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <FadeUpBlock className="careers-section-head mb-8">
          <h2 className="text-3xl font-black text-fg">{t("careers.process")}</h2>
        </FadeUpBlock>
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCESS.map((item, index) => (
            <StaggerItem key={item.step}>
              <div className={`careers-card rounded-3xl p-5 h-full ${sectionPastel(PROCESS_PASTELS, index)}`}>
                <div className="careers-step-num mb-3">{index + 1}</div>
                <p className="font-black text-fg text-lg">{t(`careers.processSteps.${["apply", "review", "interview", "offer"][index]}.step`)}</p>
                <p className="text-sm text-fg-muted mt-2">{t(`careers.processSteps.${["apply", "review", "interview", "offer"][index]}.text`)}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* CULTURE */}
      <section ref={cultureRef} className="max-w-6xl mx-auto px-5 pb-20 scroll-mt-24">
        <FadeUpBlock className="careers-section-head flex items-center gap-2 mb-8">
          <Users size={22} className="text-brand" />
          <h2 className="text-3xl font-black text-fg">{t("careers.culture")}</h2>
        </FadeUpBlock>
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CULTURE.map((item, index) => (
            <StaggerItem key={item.title}>
              <div
                className={`careers-card careers-culture-card rounded-3xl p-6 ${sectionPastel(CULTURE_PASTELS, index)}`}
              >
                <HeartHandshake className="text-brand mb-3" size={22} />
                <p className="font-black text-fg">{t(`careers.cultureItems.${["patient", "precision", "team", "innovation"][index]}`)}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <FadeUpBlock className="careers-section-head mb-6">
          <h2 className="text-3xl font-black text-fg">{t("careers.faq")}</h2>
        </FadeUpBlock>
        <div className="space-y-4">
          {["timeline", "multiple", "india"].map((key, index) => (
            <details
              key={key}
              className={`careers-card careers-faq rounded-2xl p-5 group ${pastelBorder(index)}`}
            >
              <summary className="font-black text-fg cursor-pointer list-none flex justify-between gap-3">
                {t(`careers.faqItems.${key}.q`)}
                <span className="text-brand group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-sm text-fg-muted mt-3 leading-relaxed">{t(`careers.faqItems.${key}.a`)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <FadeUpBlock>
          <div
            className={`rounded-[32px] p-10 md:p-14 text-center ${
              isBlue
                ? "bg-[#003262] text-white border border-[#FFD700]/20"
                : "careers-glass-panel"
            }`}
          >
            <Sparkles className={`mx-auto mb-4 ${isBlue ? "text-[#FFD700]" : "text-brand"}`} size={28} />
            <h2 className={`text-2xl md:text-3xl font-black ${isBlue ? "text-white" : "text-fg"}`}>
              {t("careers.readyCta")}
            </h2>
            <p className={`mt-3 max-w-xl mx-auto ${isBlue ? "text-white/75" : "text-fg-muted"}`}>
              {t("careers.readyCtaSub")}
            </p>
            <button
              type="button"
              onClick={() => scrollTo(positionsRef)}
              className={`mt-6 px-7 py-3 rounded-xl font-black ${primaryBtn}`}
            >
              {t("careers.seeOpportunities")}
            </button>
          </div>
        </FadeUpBlock>
      </section>

      {/* APPLY MODAL — unchanged functionality */}
      {selectedJob && (
        <div className="fixed inset-0 z-[130] bg-black/40 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-lg careers-modal rounded-3xl p-6 relative max-h-[90vh] overflow-auto">
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-hover"
              aria-label={t("careers.closeApplication")}
            >
              <X size={18} />
            </button>

            <p className="text-xs font-black uppercase tracking-widest text-brand">{t("careers.application")}</p>
            <h3 className="text-xl font-black text-fg mt-1">{selectedJob.title}</h3>

            <form onSubmit={submitApplication} className="mt-5 space-y-3">
              {[
                ["name", t("common.fullName"), "text"],
                ["email", t("common.email"), "email"],
                ["phone", t("common.phone"), "tel"],
              ].map(([key, label, type]) => (
                <input
                  key={key}
                  required
                  type={type}
                  placeholder={label}
                  value={applyForm[key]}
                  onChange={(e) => setApplyForm({ ...applyForm, [key]: e.target.value })}
                  className="w-full border border-edge rounded-xl px-4 py-3 bg-card text-fg"
                />
              ))}

              <input
                required
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full border border-edge rounded-xl px-4 py-3 bg-card text-fg text-sm"
              />

              <textarea
                placeholder={t("careers.coverOptional")}
                value={applyForm.coverLetter}
                onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                className="w-full border border-edge rounded-xl px-4 py-3 bg-card text-fg min-h-24"
              />

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl font-black disabled:opacity-60 ${primaryBtn}`}
              >
                {submitting ? t("common.submitting") : t("careers.submitApplication")}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
