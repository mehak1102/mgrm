import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, Shield, AlertTriangle, RefreshCw, Package, CheckCircle2, Globe } from "lucide-react";

const ICON_MAP = {
  shield: Shield,
  alert: AlertTriangle,
  refresh: RefreshCw,
  package: Package,
  check: CheckCircle2,
  globe: Globe,
};

const ICON_STYLES = {
  shield: { gradient: "from-cyan-500 to-blue-600", color: "text-white" },
  alert: { gradient: "from-rose-500 to-red-600", color: "text-white" },
  refresh: { gradient: "from-violet-500 to-purple-600", color: "text-white" },
  package: { gradient: "from-indigo-500 to-blue-600", color: "text-white" },
  check: { gradient: "from-emerald-500 to-teal-600", color: "text-white" },
  globe: { gradient: "from-sky-400 to-cyan-600", color: "text-white" },
};

export default function PolicyAccordion({ sections }) {
  const [openId, setOpenId] = useState(sections[0]?.id || null);
  const reduced = useReducedMotion();

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const Icon = ICON_MAP[section.icon] || Shield;
        const style = ICON_STYLES[section.icon] || ICON_STYLES.shield;
        const isOpen = openId === section.id;

        return (
          <div
            key={section.id}
            className="policy-accordion-item card support-glass rounded-[28px] border border-edge backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.06)] overflow-hidden transition-shadow duration-250 hover:shadow-[0_24px_70px_rgba(6,182,212,0.12)]"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="w-full flex items-center gap-4 px-6 py-5 text-left"
            >
              <span
                className={`policy-accordion-icon warranty-coverage-icon w-12 h-12 rounded-2xl bg-gradient-to-br ${style.gradient} shadow-md grid place-items-center shrink-0`}
              >
                <Icon className={`policy-accordion-icon-svg warranty-coverage-icon-svg ${style.color}`} size={22} />
              </span>
              <span className="flex-1 font-black text-lg text-fg">
                {section.title}
              </span>
              <ChevronDown
                size={20}
                className={`text-fg-muted transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={reduced ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 pt-0 text-fg-muted leading-relaxed pl-[5.5rem]">
                    {section.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
