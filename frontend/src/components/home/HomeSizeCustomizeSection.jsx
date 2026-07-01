import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Ruler, Send } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api";
import {
  PremiumWordHeader,
  PremiumReveal,
  FadeUpSlow,
} from "../motion/PremiumMotion";
import "../../theme/home-size-customize.css";

const SIZE_KEYS = ["xs", "s", "m", "l", "xl", "xxl", "custom"];
const BODY_PART_KEYS = [
  "knee",
  "back",
  "neck",
  "ankle",
  "wrist",
  "elbow",
  "shoulder",
  "hip",
  "other",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  productName: "",
  bodyPart: "knee",
  measurement: "",
  measurementUnit: "cm",
  message: "",
};

export default function HomeSizeCustomizeSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [preferredSize, setPreferredSize] = useState("M");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sizeOptions = useMemo(
    () =>
      SIZE_KEYS.map((key) => ({
        key,
        label: t(`sizeCustomize.sizes.${key}`),
        value: key === "custom" ? "Custom" : key.toUpperCase(),
      })),
    [t]
  );

  const bodyParts = useMemo(
    () =>
      BODY_PART_KEYS.map((key) => ({
        key,
        label: t(`sizeCustomize.bodyParts.${key}`),
        value: t(`sizeCustomize.bodyParts.${key}`),
      })),
    [t]
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error(t("sizeCustomize.nameMessageRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/size-customization", {
        ...form,
        bodyPart: t(`sizeCustomize.bodyParts.${form.bodyPart}`),
        preferredSize,
      });
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setPreferredSize("M");
      toast.success(t("sizeCustomize.success"));
    } catch (err) {
      toast.error(err.response?.data?.msg || t("sizeCustomize.sendFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="home-size-customize-section relative max-w-[1500px] mx-auto mt-10 md:mt-14 lg:mt-[72px] px-6 py-24 md:py-28">
      <div className="home-size-customize-section__bg absolute inset-0 rounded-[48px] border border-slate-100/80 dark:border-white/10 [data-theme=blue]:border-[var(--border-color)]" />

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start px-2 sm:px-6">
        <PremiumWordHeader
          label={t("sizeCustomize.badge")}
          title={t("sizeCustomize.title")}
          description={t("sizeCustomize.descriptionLong")}
          style="slideRight"
          titleClassName="text-4xl sm:text-[46px] font-black mt-2 text-slate-900 dark:text-zinc-100"
        />

        <PremiumReveal variant={FadeUpSlow} delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="home-size-customize-form p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg">
                <Ruler size={22} aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                  {t("sizeCustomize.sendSizeRequest")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {t("sizeCustomize.reviewedByAdmin")}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("sizeCustomize.yourNameRequired")}
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="home-size-customize-field"
                  placeholder={t("common.fullName")}
                  required
                />
              </label>

              <label className="block">
                <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("common.email")}
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="home-size-customize-field"
                  placeholder={t("common.enterEmail")}
                />
              </label>

              <label className="block">
                <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("common.phone")}
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="home-size-customize-field"
                  placeholder="+91 ..."
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("sizeCustomize.productName")}
                </span>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  className="home-size-customize-field"
                  placeholder={t("sizeCustomize.productPlaceholder")}
                />
              </label>

              <label className="block">
                <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("sizeCustomize.bodyPart")}
                </span>
                <select
                  value={form.bodyPart}
                  onChange={(e) => updateField("bodyPart", e.target.value)}
                  className="home-size-customize-field"
                >
                  {bodyParts.map((part) => (
                    <option key={part.key} value={part.key}>
                      {part.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("sizeCustomize.measurement")}
                </span>
                <div className="home-size-customize-measure-row">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.measurement}
                    onChange={(e) => updateField("measurement", e.target.value)}
                    className="home-size-customize-field home-size-customize-field--grow"
                    placeholder={t("sizeCustomize.measurementPlaceholder")}
                  />
                  <select
                    value={form.measurementUnit}
                    onChange={(e) => updateField("measurementUnit", e.target.value)}
                    className="home-size-customize-field home-size-customize-field--unit"
                    aria-label={t("sizeCustomize.unit")}
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </label>
            </div>

            <div>
              <span className="home-size-customize-label mb-3 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                {t("sizeCustomize.preferredSize")}
              </span>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.key}
                    type="button"
                    onClick={() => setPreferredSize(size.value)}
                    className={`home-size-customize-pill ${
                      preferredSize === size.value ? "home-size-customize-pill--active" : ""
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="home-size-customize-preview flex items-center gap-4 p-4">
              <span className="home-size-customize-preview-badge" aria-hidden>
                {preferredSize === "Custom" ? "★" : preferredSize}
              </span>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-zinc-100">
                  {t("sizeCustomize.selectedSize")}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {bodyParts.find((p) => p.key === form.bodyPart)?.label || form.bodyPart}
                  {form.measurement
                    ? ` • ${form.measurement} ${form.measurementUnit}`
                    : ""}
                </p>
              </div>
            </div>

            <label className="block">
              <span className="home-size-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                {t("sizeCustomize.yourQuery")}
              </span>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="home-size-customize-field min-h-[110px] resize-y"
                placeholder={t("sizeCustomize.messagePlaceholder")}
                required
              />
            </label>

            {submitted ? (
              <div className="home-size-customize-success flex items-start gap-3 p-4 text-sm font-semibold">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" aria-hidden />
                <p>{t("sizeCustomize.requestReceivedLong")}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black disabled:opacity-70"
            >
              <Send size={18} aria-hidden />
              {submitting ? t("sizeCustomize.sending") : t("sizeCustomize.submit")}
            </button>
          </form>
        </PremiumReveal>
      </div>
    </section>
  );
}
