import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PremiumWordHeader,
  TestimonialCard,
} from "../motion/PremiumMotion";

export default function HomeTestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = useMemo(
    () => [
      {
        name: t("homeSections.testimonial1Name"),
        text: t("homeSections.testimonial1Text"),
      },
      {
        name: t("homeSections.testimonial2Name"),
        text: t("homeSections.testimonial2Text"),
      },
      {
        name: t("homeSections.testimonial3Name"),
        text: t("homeSections.testimonial3Text"),
      },
    ],
    [t]
  );

  return (
    <section className="home-testimonials-section relative max-w-[1500px] mx-auto px-4 sm:px-6 py-12 sm:py-28">
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 px-1">
        <PremiumWordHeader
          label={t("homeSections.testimonialsLabel")}
          title={t("homeSections.testimonialsTitle")}
          description={t("homeSections.testimonialsDesc")}
          style="fadeUp"
          labelClassName="text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-[10px] sm:text-sm"
          titleClassName="justify-center text-2xl sm:text-4xl md:text-[52px] font-black mt-1 sm:mt-2 text-slate-900 dark:text-zinc-100 leading-tight"
          descriptionClassName="text-gray-500 dark:text-zinc-400 mt-2 sm:mt-3 max-w-xl text-xs sm:text-base mx-auto"
          className="text-center"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-8 pb-16 sm:pb-0">
        {testimonials.map((item, i) => (
          <TestimonialCard key={item.name} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
