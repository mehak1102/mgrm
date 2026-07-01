import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Ruler, ScanLine, CheckCircle2, ArrowRight } from "lucide-react";
import {
  PremiumWordHeader,
  PremiumStagger,
  PremiumStaggerItem,
  FadeUpSlow,
} from "../motion/PremiumMotion";
import { motion, useReducedMotion } from "framer-motion";

export default function HomeSmartSizeSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const steps = useMemo(
    () => [
      {
        icon: Ruler,
        title: t("smartSize.homeStep1Title"),
        text: t("smartSize.homeStep1Text"),
        iconWrap: "bg-sky-500 text-white shadow-[0_10px_28px_rgba(14,165,233,0.38)]",
        iconFill: false,
      },
      {
        icon: ScanLine,
        title: t("smartSize.homeStep2Title"),
        text: t("smartSize.homeStep2Text"),
        iconWrap: "bg-violet-500 text-white shadow-[0_10px_28px_rgba(139,92,246,0.38)]",
        iconFill: false,
      },
      {
        icon: CheckCircle2,
        title: t("smartSize.homeStep3Title"),
        text: t("smartSize.homeStep3Text"),
        iconWrap: "bg-emerald-500 text-white shadow-[0_10px_28px_rgba(16,185,129,0.38)]",
        iconFill: true,
      },
    ],
    [t]
  );

  const tips = useMemo(
    () => [
      t("smartSize.tipWorksOn"),
      t("smartSize.tipFast"),
      t("smartSize.tipEveryProduct"),
    ],
    [t]
  );

  return (
    <section className="home-smart-size-section relative max-w-[1500px] mx-auto mt-10 md:mt-14 lg:mt-[72px] px-6 py-28">
      <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/60 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 border border-slate-100/80 dark:border-white/10" />

      <div className="relative grid lg:grid-cols-2 gap-14 items-center px-4 sm:px-8">
        <PremiumWordHeader
          label={t("smartSize.badge")}
          title={t("smartSize.title")}
          description={t("smartSize.descriptionPrecision")}
          style="slideRight"
        />

        <PremiumStagger className="space-y-4" stagger={0.16}>
          {steps.map(({ icon: Icon, title, text, iconWrap, iconFill }) => (
            <PremiumStaggerItem key={title}>
              <div className="flex gap-5 rounded-[28px] border border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div
                  className={`home-smart-size-step-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconWrap}`}
                >
                  <Icon
                    size={26}
                    strokeWidth={iconFill ? 1.75 : 2.25}
                    fill={iconFill ? "currentColor" : "none"}
                    aria-hidden
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-zinc-100">{title}</h3>
                  <p className="mt-2 text-gray-500 dark:text-zinc-400 leading-7">{text}</p>
                </div>
              </div>
            </PremiumStaggerItem>
          ))}

          <PremiumStaggerItem>
            <PremiumStagger className="flex flex-wrap gap-3 mt-2" stagger={0.1}>
              {tips.map((tip) => (
                <PremiumStaggerItem key={tip}>
                  <span className="rounded-full border border-cyan-200/80 dark:border-cyan-500/20 bg-cyan-50/80 dark:bg-cyan-950/30 px-4 py-2 text-sm font-bold text-cyan-800 dark:text-cyan-300">
                    {tip}
                  </span>
                </PremiumStaggerItem>
              ))}
            </PremiumStagger>
          </PremiumStaggerItem>

          <PremiumStaggerItem>
            {reduce ? (
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 font-black">
                {t("smartSize.tryFinder")} <ArrowRight size={18} />
              </Link>
            ) : (
              <motion.div variants={FadeUpSlow}>
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 font-black shadow-lg hover:scale-[1.02] transition-transform duration-500"
                >
                  {t("smartSize.tryFinder")} <ArrowRight size={18} />
                </Link>
              </motion.div>
            )}
          </PremiumStaggerItem>
        </PremiumStagger>
      </div>
    </section>
  );
}
