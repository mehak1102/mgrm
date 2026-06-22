import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const CIRCLE_LEN = 1005;

function TherapyAnatomyVisual({ src = "/cardiology/heart.png", accent = "#ef4444", alt = "Clinical focus" }) {
  const reduce = useReducedMotion();

  return (
    <div className="therapy-anatomy relative flex items-center justify-center">
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.7, 0.3],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute h-[240px] w-[240px] rounded-full blur-3xl md:h-[280px] md:w-[280px]"
        style={{ backgroundColor: `${accent}4d` }}
        aria-hidden
      />

      <motion.img
        src={src}
        alt={alt}
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        whileHover={
          reduce
            ? undefined
            : {
                scale: 1.08,
                rotate: 2,
                filter: `drop-shadow(0px 0px 40px ${accent}e6)`,
              }
        }
        animate={
          reduce
            ? undefined
            : {
                y: [0, -10, 0],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        viewport={{ once: true }}
        className="relative z-10 h-[220px] cursor-pointer object-contain transition-all duration-500 md:h-[300px]"
      />

      <svg
        className="absolute h-[300px] w-[300px] -rotate-90 md:h-[340px] md:w-[340px]"
        viewBox="0 0 500 500"
        aria-hidden
      >
        <motion.circle
          cx="250"
          cy="250"
          r="160"
          stroke={accent}
          strokeWidth="2.5"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={CIRCLE_LEN}
          strokeDashoffset={CIRCLE_LEN}
          animate={
            reduce
              ? undefined
              : {
                  strokeDashoffset: [CIRCLE_LEN, 0],
                }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatDelay: 0.2,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
}

export default memo(TherapyAnatomyVisual);
