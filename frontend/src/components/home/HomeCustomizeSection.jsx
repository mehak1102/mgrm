import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Palette, Ruler, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api";
import {
  PremiumWordHeader,
  PremiumReveal,
  FadeUpSlow,
} from "../motion/PremiumMotion";
import Logo3D from "../Logo3D";
import "../../theme/home-customize.css";
import "../../theme/navbar-logo.css";

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

const COLOR_PRESET_KEYS = [
  { labelKey: "colorCustomize.presetClassicBlack", value: "#111827" },
  { labelKey: "colorCustomize.presetNavyBlue", value: "#1e3a8a" },
  { labelKey: "colorCustomize.presetMedicalGrey", value: "#64748b" },
  { labelKey: "colorCustomize.presetBeige", value: "#d6c4a8" },
  { labelKey: "colorCustomize.presetRoyalBlue", value: "#2563eb" },
  { labelKey: "colorCustomize.presetBurgundy", value: "#9f1239" },
  { labelKey: "colorCustomize.presetOlive", value: "#4d7c0f" },
  { labelKey: "colorCustomize.presetWhite", value: "#f8fafc" },
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

function CustomizeField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="home-customize-label mb-1.5 block text-sm font-bold text-slate-700 dark:text-zinc-200">
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionDivider({ icon: Icon, title, included, onIncludeChange, includeLabel }) {
  return (
    <div className="home-customize-divider flex flex-wrap items-center gap-3 pt-1">
      <span className="home-customize-divider__icon">
        <Icon size={18} aria-hidden />
      </span>
      <h4 className="text-sm font-black uppercase tracking-[0.14em] text-slate-800 dark:text-zinc-100">
        {title}
      </h4>
      <span className="home-customize-divider__line hidden min-w-[1.5rem] flex-1 sm:block" aria-hidden />
      <label className="home-customize-section-toggle ml-auto flex cursor-pointer items-center gap-2 text-xs font-semibold">
        <input
          type="checkbox"
          className="home-customize-section-toggle__input"
          checked={included}
          onChange={(e) => onIncludeChange(e.target.checked)}
        />
        <span>{includeLabel}</span>
      </label>
    </div>
  );
}

export default function HomeCustomizeSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [preferredSize, setPreferredSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESET_KEYS[0].value);
  const [customColor, setCustomColor] = useState("#25319a");
  const [useCustomPicker, setUseCustomPicker] = useState(false);
  const [wantSize, setWantSize] = useState(true);
  const [wantColour, setWantColour] = useState(true);
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

  const colorPresets = useMemo(
    () =>
      COLOR_PRESET_KEYS.map((preset) => ({
        ...preset,
        label: t(preset.labelKey),
      })),
    [t]
  );

  const activeColor = useCustomPicker ? customColor : selectedColor;
  const activeColorLabel =
    colorPresets.find((c) => c.value === selectedColor)?.label ||
    (useCustomPicker ? t("colorCustomize.customColour") : t("colorCustomize.selectedColour"));

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.message.trim()) {
      toast.error(t("customize.nameMessageRequired"));
      return;
    }

    if (!wantSize && !wantColour) {
      toast.error(t("customize.pickAtLeastOne"));
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      productName: form.productName,
      message: form.message,
    };

    const requests = [];
    if (wantSize) {
      requests.push(
        API.post("/size-customization", {
          ...payload,
          bodyPart: t(`sizeCustomize.bodyParts.${form.bodyPart}`),
          measurement: form.measurement,
          measurementUnit: form.measurementUnit,
          preferredSize,
        })
      );
    }
    if (wantColour) {
      requests.push(
        API.post("/color-customization", {
          ...payload,
          preferredColor: activeColor,
          colorLabel: activeColorLabel,
        })
      );
    }

    setSubmitting(true);
    try {
      await Promise.all(requests);

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setPreferredSize("M");
      setSelectedColor(COLOR_PRESET_KEYS[0].value);
      setUseCustomPicker(false);
      setWantSize(true);
      setWantColour(true);
      toast.success(t("customize.success"));
    } catch (err) {
      toast.error(err.response?.data?.msg || t("customize.sendFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const bodyPartLabel =
    bodyParts.find((p) => p.key === form.bodyPart)?.label || form.bodyPart;

  return (
    <section className="home-customize-section relative max-w-[1500px] mx-auto mt-10 md:mt-14 lg:mt-[72px] px-6 py-24 md:py-28">
      <div className="home-customize-section__bg absolute inset-0 rounded-[48px] border border-slate-100/80 dark:border-white/10" />

      <div className="home-customize-layout relative grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch px-2 sm:px-6">
        <div className="home-customize-intro flex min-h-0 flex-col">
          <PremiumWordHeader
            label={t("customize.badge")}
            title={t("customize.title")}
            description={t("customize.description")}
            style="slideRight"
            titleClassName="text-4xl sm:text-[46px] font-black mt-2 text-slate-900 dark:text-zinc-100"
          />

          <div className="home-customize-intro__logo">
            <Logo3D asStatic className="home-customize-brand-logo" />
          </div>
        </div>

        <PremiumReveal variant={FadeUpSlow} delay={0.15}>
          <form onSubmit={handleSubmit} className="home-customize-form p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <span className="home-customize-form-icon home-customize-form-icon--unified">
                <Ruler size={20} aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                  {t("customize.formTitle")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {t("customize.reviewedByAdmin")}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <CustomizeField label={t("customize.yourNameRequired")} className="sm:col-span-2">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="home-customize-field"
                  placeholder={t("common.fullName")}
                  required
                />
              </CustomizeField>

              <CustomizeField label={t("common.email")}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="home-customize-field"
                  placeholder={t("common.enterEmail")}
                />
              </CustomizeField>

              <CustomizeField label={t("common.phone")}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="home-customize-field"
                  placeholder="+91 ..."
                />
              </CustomizeField>

              <CustomizeField label={t("customize.productName")} className="sm:col-span-2">
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  className="home-customize-field"
                  placeholder={t("customize.productPlaceholder")}
                />
              </CustomizeField>
            </div>

            <p className="text-xs text-gray-500 dark:text-zinc-400">{t("customize.sectionHint")}</p>

            <SectionDivider
              icon={Ruler}
              title={t("customize.sizeSection")}
              included={wantSize}
              onIncludeChange={setWantSize}
              includeLabel={t("customize.includeInRequest")}
            />

            {wantSize ? (
              <div className="home-customize-section-panel space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CustomizeField label={t("sizeCustomize.bodyPart")}>
                    <select
                      value={form.bodyPart}
                      onChange={(e) => updateField("bodyPart", e.target.value)}
                      className="home-customize-field"
                    >
                      {bodyParts.map((part) => (
                        <option key={part.key} value={part.key}>
                          {part.label}
                        </option>
                      ))}
                    </select>
                  </CustomizeField>

                  <CustomizeField label={t("sizeCustomize.measurement")}>
                    <div className="home-customize-measure-row">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={form.measurement}
                        onChange={(e) => updateField("measurement", e.target.value)}
                        className="home-customize-field home-customize-field--grow"
                        placeholder={t("sizeCustomize.measurementPlaceholder")}
                      />
                      <select
                        value={form.measurementUnit}
                        onChange={(e) => updateField("measurementUnit", e.target.value)}
                        className="home-customize-field home-customize-field--unit"
                        aria-label={t("sizeCustomize.unit")}
                      >
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                      </select>
                    </div>
                  </CustomizeField>
                </div>

                <div>
                  <span className="home-customize-label mb-3 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                    {t("customize.preferredSizeLabel")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.key}
                        type="button"
                        onClick={() => setPreferredSize(size.value)}
                        className={`home-customize-pill ${
                          preferredSize === size.value ? "home-customize-pill--active" : ""
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <SectionDivider
              icon={Palette}
              title={t("customize.colourSection")}
              included={wantColour}
              onIncludeChange={setWantColour}
              includeLabel={t("customize.includeInRequest")}
            />

            {wantColour ? (
              <div className="home-customize-section-panel">
                <span className="home-customize-label mb-3 block text-sm font-bold text-slate-700 dark:text-zinc-200">
                  {t("customize.preferredColourLabel")}
                </span>
                <div className="flex flex-wrap gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      title={preset.label}
                      aria-label={preset.label}
                      onClick={() => {
                        setUseCustomPicker(false);
                        setSelectedColor(preset.value);
                      }}
                      className={`home-customize-swatch ${
                        !useCustomPicker && selectedColor === preset.value
                          ? "home-customize-swatch--active"
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
                      aria-label={t("colorCustomize.pickCustomColour")}
                    />
                    <Sparkles size={16} className="text-slate-500 dark:text-zinc-400" />
                  </label>
                </div>
              </div>
            ) : null}

            {wantSize || wantColour ? (
              <div
                className={`home-customize-preview grid gap-4 p-4 ${
                  wantSize && wantColour ? "sm:grid-cols-2" : ""
                }`}
              >
                {wantSize ? (
                  <div className="flex items-center gap-3">
                    <span className="home-customize-preview-badge" aria-hidden>
                      {preferredSize === "Custom" ? "★" : preferredSize}
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-zinc-100">
                        {t("sizeCustomize.selectedSize")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        {bodyPartLabel}
                        {form.measurement ? ` • ${form.measurement} ${form.measurementUnit}` : ""}
                      </p>
                    </div>
                  </div>
                ) : null}
                {wantColour ? (
                  <div className="flex items-center gap-3">
                    <span
                      className="h-12 w-12 shrink-0 rounded-xl border border-white/70 shadow-md"
                      style={{ backgroundColor: activeColor }}
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-zinc-100">
                        {activeColorLabel}
                      </p>
                      <p className="text-xs font-mono text-gray-500 dark:text-zinc-400">{activeColor}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <CustomizeField label={t("customize.yourQuery")}>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                className="home-customize-field min-h-[110px] resize-y"
                placeholder={t("customize.messagePlaceholder")}
                required
              />
            </CustomizeField>

            {submitted ? (
              <div className="home-customize-success flex items-start gap-3 p-4 text-sm font-semibold">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" aria-hidden />
                <p>{t("customize.requestReceivedLong")}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black disabled:opacity-70"
            >
              <Send size={18} aria-hidden />
              {submitting ? t("customize.sending") : t("customize.submit")}
            </button>
          </form>
        </PremiumReveal>
      </div>
    </section>
  );
}
