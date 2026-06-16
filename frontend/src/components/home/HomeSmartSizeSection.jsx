import { Link } from "react-router-dom";
import { Ruler, ScanLine, CheckCircle2, ArrowRight } from "lucide-react";
import {
  PremiumWordHeader,
  PremiumStagger,
  PremiumStaggerItem,
  FadeUpSlow,
} from "../motion/PremiumMotion";
import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  {
    icon: Ruler,
    title: "Enter your measurement",
    text: "Add circumference or length for accurate brace sizing.",
  },
  {
    icon: ScanLine,
    title: "AI-assisted recommendation",
    text: "Our smart finder suggests the best size for your product.",
  },
  {
    icon: CheckCircle2,
    title: "Shop with confidence",
    text: "Add to cart knowing your support will fit properly.",
  },
];

const TIPS = [
  "Works on knee, wrist, neck and back supports",
  "Takes less than 60 seconds",
  "Available on every product page",
];

export default function HomeSmartSizeSection() {
  const reduce = useReducedMotion();

  return (
    <section className="home-smart-size-section relative max-w-[1500px] mx-auto mt-10 md:mt-14 lg:mt-[72px] px-6 py-28">
      <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-cyan-50/80 via-white to-blue-50/60 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-950 border border-slate-100/80 dark:border-white/10" />

      <div className="relative grid lg:grid-cols-2 gap-14 items-center px-4 sm:px-8">
        <PremiumWordHeader
          label="SMART SIZE FINDER"
          title="Find Your Perfect Fit"
          description="Precision sizing powered by product-aware recommendations — so every brace and support fits comfortably from day one."
          style="slideRight"
        />

        <PremiumStagger className="space-y-4" stagger={0.16}>
          {STEPS.map(({ icon: Icon, title, text }) => (
            <PremiumStaggerItem key={title}>
              <div className="flex gap-5 rounded-[28px] border border-slate-200 dark:border-white/10 bg-card/90 dark:bg-zinc-900/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Icon size={26} />
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
              {TIPS.map((tip) => (
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
                Try Smart Size Finder <ArrowRight size={18} />
              </Link>
            ) : (
              <motion.div variants={FadeUpSlow}>
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 font-black shadow-lg hover:scale-[1.02] transition-transform duration-500"
                >
                  Try Smart Size Finder <ArrowRight size={18} />
                </Link>
              </motion.div>
            )}
          </PremiumStaggerItem>
        </PremiumStagger>
      </div>
    </section>
  );
}
