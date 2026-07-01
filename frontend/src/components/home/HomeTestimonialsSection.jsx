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
    <section className="relative max-w-[1500px] mx-auto px-6 py-28">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <PremiumWordHeader
          label={t("homeSections.testimonialsLabel")}
          title={t("homeSections.testimonialsTitle")}
          description={t("homeSections.testimonialsDesc")}
          style="fadeUp"
          titleClassName="justify-center text-4xl sm:text-[52px] font-black mt-2 text-slate-900 dark:text-zinc-100"
          className="text-center"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((item, i) => (
          <TestimonialCard key={item.name} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
