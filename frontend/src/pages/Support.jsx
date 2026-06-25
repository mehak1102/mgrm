import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import API from "../api";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import MGRMBrandRing from "../components/brand/MGRMBrandRing";
import SupportCallPopup from "../components/support/SupportCallPopup";
import {
  SectionLabel,
  HeroHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";

const supportTypes = [
  "Product Help",
  "Size Guide",
  "Order Help",
  "Return Request",
  "Bulk Inquiry",
  "Other",
];

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Product Help",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const submitSupport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await API.post("/support", form);

      setSuccess("Your request has been submitted. Our team will contact you soon.");
      window.dispatchEvent(new Event("mgrm:support-submitted"));

      setForm({
        name: "",
        email: "",
        phone: "",
        type: "Product Help",
        message: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="support-page relative bg-[#f6f7fb] bg-app dark:bg-zinc-950 min-h-screen overflow-hidden">
      {/* Full-viewport cinematic hero — first thing users see */}
      {/* <MGRMBrandRing /> */}


      {/* HERO VIDEO */}
<section className="relative overflow-hidden rounded-[42px] mx-5 mt-6 shadow-[0_40px_120px_rgba(0,0,0,0.12)]">

<div className="relative min-h-[720px]">

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
  <div className="relative z-10 max-w-7xl mx-auto px-5 py-24">

    <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">

      {/* LEFT */}
      <div className="max-w-2xl">

        <div
          className="
            inline-flex
            rounded-full
            px-4
            py-2
            bg-white/10
            backdrop-blur-xl
            text-cyan-300
            text-sm
            tracking-[0.28em]
            font-black
          "
        >
          CUSTOMER SUPPORT
        </div>

        <h1
          className="
            mt-6
            text-white
            text-5xl
            md:text-7xl
            font-black
            leading-[0.96]
          "
        >
          Need Help
          <br />
          Choosing The
          <br />
          Right Support?
        </h1>

        <p
          className="
            mt-6
            text-white/80
            text-lg
            max-w-xl
          "
        >
          Ask us about product selection,
          sizing, delivery, returns,
          recovery and bulk orders.
        </p>

        {/* CHIPS */}
        <div className="flex flex-wrap gap-4 mt-10">

          {[
            "Certified Products",
            "Size Assistance",
            "Fast Support",
          ].map((item) => (
            <div
              key={item}
              className="
                px-5
                py-3
                rounded-full
                bg-white/10
                backdrop-blur-xl
                border
                border-white/15
                text-white
                font-semibold
              "
            >
              ✓ {item}
            </div>
          ))}

        </div>
      </div>

      {/* RIGHT FORM */}
      <form
        id="support-form"
        onSubmit={submitSupport}
        className="
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
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">

            {/* LEFT */}
            <div>
              <SectionLabel className="text-purple-700 font-black tracking-widest">
                CUSTOMER SUPPORT
              </SectionLabel>

              <HeroHeading
                text="Need help choosing the right support?"
                className="text-6xl md:text-8xl font-black mt-4 leading-[1.02]"
              />

              <FadeUpText className="text-gray-500 dark:text-zinc-400 text-lg mt-6 max-w-2xl">
                Ask us about product selection, sizing, orders, returns or bulk queries.
              </FadeUpText>

              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  ["Certified Products", ShieldCheck],
                  ["Size Assistance", Ruler],
                  ["Fast Support", MessageCircle],
                ].map(([title, Icon]) => (
                  <div key={title} className="bg-card dark:bg-zinc-900 rounded-3xl p-5 shadow">
                    <Icon className="text-purple-700" />
                    <p className="font-black mt-3">{title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form
              id="support-form"
              onSubmit={submitSupport}
              className="bg-card dark:bg-zinc-900 rounded-[38px] p-8 shadow-xl"
            >
              <h2 className="text-3xl font-black mb-4">Contact Support</h2>

              {success && (
                <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl">
                  {success}
                </div>
              )}

              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mb-3 px-4 py-3 rounded-xl border"
              >
                {supportTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <textarea
                required
                rows="4"
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full mb-4 px-4 py-3 rounded-xl border"
              />

              <button className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold">
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>

        {/* ACTION CARDS */}
        <section className="max-w-7xl mx-auto px-5 pb-20">
          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                title: "WhatsApp Support",
                text: "Chat instantly",
                icon: MessageCircle,
                action: "Open WhatsApp",
                onClick: () =>
                  window.open("https://wa.me/919876543210", "_blank"),
              },
              {
                title: "Call Support",
                text: "Talk directly",
                icon: Phone,
                action: "Call Now",
                onClick: () =>
                  (window.location.href = "tel:+919876543210"),
              },
              {
                title: "Email Support",
                text: "Send query",
                icon: Mail,
                action: "Send Email",
                onClick: () =>
                  (window.location.href =
                    "mailto:support@mgrmmedicare.com"),
              },
              {
                title: "Size Guide",
                text: "Get help",
                icon: Ruler,
                action: "Open Form",
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                title: "Shipping",
                text: "Delivery help",
                icon: Truck,
                action: "Open Form",
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                title: "Returns",
                text: "Replacement help",
                icon: RotateCcw,
                action: "Open Form",
                onClick: () =>
                  document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" }),
              },
            ].map((item) => (
              <div key={item.title} className="bg-card dark:bg-zinc-900 rounded-3xl p-6 shadow">
                <item.icon className="text-purple-700" />
                <h3 className="font-black mt-4">{item.title}</h3>
                <p className="text-gray-500 dark:text-zinc-400 mt-2">{item.text}</p>

                <button
                  onClick={item.onClick}
                  className="mt-4 text-purple-700 font-bold"
                >
                  {item.action} →
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
      <SupportCallPopup />
    </main>
  );
}
