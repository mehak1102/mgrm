import { useState } from "react";
import { CheckCircle2, Palette, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api";
import {
  PremiumWordHeader,
  PremiumReveal,
  FadeUpSlow,
} from "../motion/PremiumMotion";
import "../../theme/home-color-customize.css";

const COLOR_PRESETS = [
  { label: "Classic Black", value: "#111827" },
  { label: "Navy Blue", value: "#1e3a8a" },
  { label: "Medical Grey", value: "#64748b" },
  { label: "Beige", value: "#d6c4a8" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Burgundy", value: "#9f1239" },
  { label: "Olive", value: "#4d7c0f" },
  { label: "White", value: "#f8fafc" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  productName: "",
  message: "",
};

export default function HomeColorCustomizeSection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [customColor, setCustomColor] = useState("#25319a");
  const [useCustomPicker, setUseCustomPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeColor = useCustomPicker ? customColor : selectedColor;
  const activeLabel =
    COLOR_PRESETS.find((c) => c.value === selectedColor)?.label ||
    (useCustomPicker ? "Custom colour" : "Selected colour");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please enter your name and customization request");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/color-customization", {
        ...form,
        preferredColor: activeColor,
        colorLabel: activeLabel,
      });
      setSubmitted(true);
      setForm(EMPTY_FORM);
      toast.success("Request sent! Our team will review your colour preference.");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Could not send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="home-color-customize-section relative max-w-[1500px] mx-auto mt-10 md:mt-14 lg:mt-[72px] px-6 py-24 md:py-28">
      <div className="home-color-customize-section__bg absolute inset-0 rounded-[48px] border border-slate-100/80 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)]" />

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start px-2 sm:px-6">
        <PremiumWordHeader
          label="PERSONALIZE YOUR SUPPORT"
          title="Customize Your Colour"
          description="Want your brace or support in a specific shade? Tell us your product and preferred colour — our team will check if customization is possible and get back to you."
          style="slideRight"
          titleClassName="text-4xl sm:text-[46px] font-black mt-2 text-slate-900 dark:text-zinc-100"
        />

        <PremiumReveal variant={FadeUpSlow} delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="home-color-customize-form p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg">
                <Palette size={22} aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                  Send colour request
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Reviewed by MGRM admin before confirmation
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="home-color-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  Your name *
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="home-color-customize-field"
                  placeholder="Full name"
                  required
                />
              </label>

              <label className="block">
                <span className="home-color-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="home-color-customize-field"
                  placeholder="you@email.com"
                />
              </label>

              <label className="block">
                <span className="home-color-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  Phone
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="home-color-customize-field"
                  placeholder="+91 ..."
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="home-color-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  Product name
                </span>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  className="home-color-customize-field"
                  placeholder="e.g. Knee Cap, Lumbo Sacral Belt"
                />
              </label>
            </div>

            <div>
              <span className="home-color-customize-label mb-3 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                Preferred colour *
              </span>
              <div className="flex flex-wrap gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    title={preset.label}
                    aria-label={preset.label}
                    onClick={() => {
                      setUseCustomPicker(false);
                      setSelectedColor(preset.value);
                    }}
                    className={`home-color-customize-swatch ${
                      !useCustomPicker && selectedColor === preset.value
                        ? "home-color-customize-swatch--active"
                        : ""
                    }`}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
                <label className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 dark:border-zinc-600">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setUseCustomPicker(true);
                    }}
                    className="absolute inset-0 h-[140%] w-[140%] cursor-pointer opacity-0"
                    aria-label="Pick custom colour"
                  />
                  <Sparkles size={16} className="text-slate-500 dark:text-zinc-400" />
                </label>
              </div>
            </div>

            <div className="home-color-customize-preview flex items-center gap-4 p-4">
              <span
                className="h-14 w-14 shrink-0 rounded-2xl border border-white/70 shadow-md"
                style={{ backgroundColor: activeColor }}
                aria-hidden
              />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-zinc-100">
                  {activeLabel}
                </p>
                <p className="text-xs font-mono text-gray-500 dark:text-zinc-400">{activeColor}</p>
              </div>
            </div>

            <label className="block">
              <span className="home-color-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                Your query / special notes *
              </span>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="home-color-customize-field min-h-[110px] resize-y"
                placeholder="Describe the colour shade, quantity, or any reference you have in mind..."
                required
              />
            </label>

            {submitted ? (
              <div className="home-color-customize-success flex items-start gap-3 p-4 text-sm font-semibold">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" aria-hidden />
                <p>
                  Thank you! Your colour customization request has been sent to our admin team.
                  They will review whether it can be customized and contact you soon.
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black disabled:opacity-70"
            >
              <Send size={18} aria-hidden />
              {submitting ? "Sending request..." : "Submit colour request"}
            </button>
          </form>
        </PremiumReveal>
      </div>
    </section>
  );
}
