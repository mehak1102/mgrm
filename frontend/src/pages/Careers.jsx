import { useEffect, useRef, useState } from "react";
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

const IMAGE_STRIP = [
  {
    title: "Rehabilitation Innovation",
    text: "Work with products that support recovery, mobility, and clinical outcomes.",
    image:
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Purpose Driven Work",
    text: "Contribute to a mission centered on movement, dignity, and better care.",
    image:
      "https://images.unsplash.com/flagged/photo-1576485436509-a7d286952b65?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Patient Impact",
    text: "Help families and clinicians access trusted orthopedic support solutions.",
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

const emptyApply = {
  name: "",
  email: "",
  phone: "",
  coverLetter: "",
};

export default function Careers() {
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
      toast.error("Please upload your resume");
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

      toast.success("Application submitted successfully");
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Could not submit application");
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
              CAREERS
            </SectionLabel>
          </FadeUpBlock>
          <HeroHeading
            text="Build Recovery With Us"
            as="h1"
            className="mt-4 text-white max-w-4xl"
            animateOnMount
          />
          <FadeUpText className="mt-5 text-white/85 max-w-2xl text-base md:text-lg" delay={0.15} animateOnMount>
            Join MGRM and help improve movement and recovery across India.
          </FadeUpText>
          <FadeUpBlock delay={0.25} className="mt-8 flex flex-col sm:flex-row gap-3 justify-start">
            <button
              type="button"
              onClick={() => scrollTo(positionsRef)}
              className={`px-6 py-3 rounded-xl font-black ${primaryBtn}`}
            >
              View Open Positions
            </button>
            <button
              type="button"
              onClick={() => scrollTo(cultureRef)}
              className={`px-6 py-3 rounded-xl font-black ${outlineBtn}`}
            >
              Explore Culture
            </button>
          </FadeUpBlock>
          </div>
        </div>
      </section>

      {/* IMAGE STRIP */}
      <section className="max-w-6xl mx-auto px-5 -mt-10 relative z-20 pb-16">
        <StaggerReveal className="grid md:grid-cols-3 gap-4">
          {IMAGE_STRIP.map((item, index) => (
            <StaggerItem key={item.title}>
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
                  <h3 className="font-black text-fg">{item.title}</h3>
                  <p className="text-sm text-fg-muted mt-2">{item.text}</p>
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
              <p className="text-xs font-black uppercase tracking-widest text-brand">Opportunities</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-fg">Open Positions</h2>
          </div>
          {!loading && (
            <p className="text-sm text-fg-muted">{jobs.length} open role{jobs.length === 1 ? "" : "s"}</p>
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
            <p className="text-fg font-black text-lg">No open positions right now.</p>
            <p className="text-fg-muted mt-2 text-sm max-w-md mx-auto">
              Share your profile at careers@mgrm.com and we will reach out when a suitable role opens.
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
                    <span className="text-[11px] font-bold text-fg-muted">Competitive package</span>
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
                    Apply Now
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
          <h2 className="text-3xl font-black text-fg">Why Join MGRM</h2>
          <p className="text-fg-muted mt-2 max-w-2xl">
            A premium healthcare brand where clinical trust, innovation, and people-first culture come together.
          </p>
        </FadeUpBlock>
        <StaggerReveal className="grid md:grid-cols-3 gap-5">
          {WHY_JOIN.map((item, index) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className={`careers-card rounded-3xl p-6 h-full ${pastelBorder(index)}`}>
                  <div className="careers-icon-chip mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-fg">{item.title}</h3>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">{item.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <FadeUpBlock className="careers-section-head mb-8">
          <h2 className="text-3xl font-black text-fg">Benefits</h2>
        </FadeUpBlock>
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div
                  className={`careers-card careers-benefit-card rounded-3xl p-5 flex flex-col ${pastelBorder(index)}`}
                >
                  <Icon size={18} className="text-brand mb-3" />
                  <p className="font-black text-fg">{item.title}</p>
                  <p className="text-sm text-fg-muted mt-2">{item.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </section>

      {/* PROCESS */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <FadeUpBlock className="careers-section-head mb-8">
          <h2 className="text-3xl font-black text-fg">Recruitment Process</h2>
        </FadeUpBlock>
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCESS.map((item, index) => (
            <StaggerItem key={item.step}>
              <div className={`careers-card rounded-3xl p-5 h-full ${pastelBorder(index)}`}>
                <div className="careers-step-num mb-3">{index + 1}</div>
                <p className="font-black text-fg text-lg">{item.step}</p>
                <p className="text-sm text-fg-muted mt-2">{item.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* CULTURE */}
      <section ref={cultureRef} className="max-w-6xl mx-auto px-5 pb-20 scroll-mt-24">
        <FadeUpBlock className="careers-section-head flex items-center gap-2 mb-8">
          <Users size={22} className="text-brand" />
          <h2 className="text-3xl font-black text-fg">Employee Culture</h2>
        </FadeUpBlock>
        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CULTURE.map((item, index) => (
            <StaggerItem key={item.title}>
              <div className={`careers-card careers-culture-card rounded-3xl p-6 ${pastelBorder(index)}`}>
                <HeartHandshake className="text-brand mb-3" size={22} />
                <p className="font-black text-fg">{item.title}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <FadeUpBlock className="careers-section-head mb-6">
          <h2 className="text-3xl font-black text-fg">FAQ</h2>
        </FadeUpBlock>
        <div className="space-y-4">
          {FAQ.map((item, index) => (
            <details
              key={item.q}
              className={`careers-card careers-faq rounded-2xl p-5 group ${pastelBorder(index)}`}
            >
              <summary className="font-black text-fg cursor-pointer list-none flex justify-between gap-3">
                {item.q}
                <span className="text-brand group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-sm text-fg-muted mt-3 leading-relaxed">{item.a}</p>
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
              Ready to build recovery with us?
            </h2>
            <p className={`mt-3 max-w-xl mx-auto ${isBlue ? "text-white/75" : "text-fg-muted"}`}>
              Explore current openings and take the next step in your healthcare career.
            </p>
            <button
              type="button"
              onClick={() => scrollTo(positionsRef)}
              className={`mt-6 px-7 py-3 rounded-xl font-black ${primaryBtn}`}
            >
              See Opportunities
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
              aria-label="Close application form"
            >
              <X size={18} />
            </button>

            <p className="text-xs font-black uppercase tracking-widest text-brand">Application</p>
            <h3 className="text-xl font-black text-fg mt-1">{selectedJob.title}</h3>

            <form onSubmit={submitApplication} className="mt-5 space-y-3">
              {[
                ["name", "Full Name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
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
                placeholder="Cover letter (optional)"
                value={applyForm.coverLetter}
                onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                className="w-full border border-edge rounded-xl px-4 py-3 bg-card text-fg min-h-24"
              />

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl font-black disabled:opacity-60 ${primaryBtn}`}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
