import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  className = "",
  compact = false,
}) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(98, Math.max(2, x)));
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => updatePosition(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none rounded-2xl ${
        compact ? "h-[200px] sm:h-[240px]" : "aspect-[4/3]"
      } ${className}`}
      onMouseDown={(e) => {
        setDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
    >
      <img
        src={afterImage}
        alt={t("common.after")}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={beforeImage}
          alt={t("common.before")}
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || "100%" }}
          loading="lazy"
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow grid place-items-center">
          <ChevronLeft size={12} className="text-slate-600 -mr-0.5" />
          <ChevronRight size={12} className="text-slate-600 absolute left-4" />
        </div>
      </div>

      <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {t("common.before")}
      </span>
      <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {t("common.after")}
      </span>
    </div>
  );
}

export function RecoveryStoryCard({ story, index = 0 }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const text = story.story || story.description || "";
  const title = story.title || story.patientName || t("global.recoveryStory");
  const duration = story.recoveryDuration || story.timeline || "";
  const author = story.userId?.name || story.patientName || t("common.customer");

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-edge bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
    >
      <BeforeAfterSlider
        beforeImage={story.beforeImage}
        afterImage={story.afterImage}
        compact
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-sm text-fg line-clamp-2">{title}</h3>
          {story.isFeatured && (
            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              {t("common.featured")}
            </span>
          )}
        </div>
        <p className="text-xs text-fg-muted">{author}</p>
        {duration && (
          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 w-fit">
            {duration}
          </span>
        )}
        {text && (
          <div className="mt-2 flex-1">
            <p className={`text-xs text-fg-muted leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
              {text}
            </p>
            {text.length > 120 && (
              <button
                type="button"
                onClick={() => setExpanded((p) => !p)}
                className="text-xs font-bold text-brand mt-1 hover:underline"
              >
                {expanded ? t("common.showLess") : t("common.readMore")}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
