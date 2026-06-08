import {
  PremiumWordHeader,
  TestimonialCard,
} from "../motion/PremiumMotion";

const TESTIMONIALS = [
  {
    name: "Dr P K Dave — AIIMS",
    text: "MGRM products are versatile, light and extremely user friendly. They meet clinical requirements across recovery pathways.",
  },
  {
    name: "Dr K K Saini — Academician",
    text: "Excellent orthopedic supports meeting clinical requirements. Patients appreciate the comfort and durability.",
  },
  {
    name: "Maj Gen B B Dutta — Academician",
    text: "MGRM products are highly appreciated in Armed Forces for reliability during active rehabilitation programs.",
  },
];

export default function HomeTestimonialsSection() {
  return (
    <section className="relative max-w-[1500px] mx-auto px-6 py-28">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <PremiumWordHeader
          label="TRUSTED BY EXPERTS"
          title="What Medical Professionals Say"
          description="Recovery specialists, surgeons and healthcare leaders across India trust MGRM for premium orthopedic support."
          style="fadeUp"
          titleClassName="justify-center text-4xl sm:text-[52px] font-black mt-2 text-slate-900 dark:text-zinc-100"
          className="text-center"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((item, i) => (
          <TestimonialCard key={item.name} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
