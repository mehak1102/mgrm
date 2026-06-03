import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const PARALLAX_X = 14;
const PARALLAX_Y = 10;

export default function HeroAnatomicalRunner({ className = "" }) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, {
    stiffness: 120,
    damping: 22,
    mass: 0.35,
  });
  const springY = useSpring(pointerY, {
    stiffness: 120,
    damping: 22,
    mass: 0.35,
  });

  const onPointerMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el || reduceMotion) return;

    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(nx * PARALLAX_X);
    pointerY.set(ny * PARALLAX_Y);
  }, [pointerX, pointerY, reduceMotion]);

  const onPointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const idle = reduceMotion
    ? { y: 0, rotateY: 0, scale: 1 }
    : {
        y: [0, -16, -8, -18, 0],
        rotateY: [-7, 5, -4, 6, -7],
        scale: [1, 1.035, 1.02, 1.04, 1],
      };

  const idleTransition = {
    y: { duration: 7.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
    rotateY: { duration: 11, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
    scale: { duration: 5.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative z-10 flex h-full min-h-[560px] w-full items-center justify-center [perspective:1400px] ${className}`}
      aria-hidden
    >
      {/* Holographic base — breathing glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={
          reduceMotion
            ? { opacity: 0.5 }
            : {
                opacity: [0.35, 0.65, 0.45, 0.7, 0.35],
                scale: [0.92, 1.08, 0.96, 1.1, 0.92],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="h-[72%] w-[58%] rounded-full bg-cyan-400/25 blur-[72px] dark:bg-cyan-400/20" />
        <div className="absolute h-[55%] w-[42%] rounded-full bg-sky-500/15 blur-[56px] dark:bg-sky-400/12" />
      </motion.div>

      {/* Scan ring */}
      <motion.div
        className="pointer-events-none absolute h-[78%] w-[52%] rounded-[50%] border border-cyan-400/20 dark:border-cyan-300/15"
        animate={
          reduceMotion
            ? {}
            : {
                rotateZ: [0, 360],
                opacity: [0.25, 0.45, 0.25],
              }
        }
        transition={{
          rotateZ: { duration: 28, repeat: Infinity, ease: "linear" },
          opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Runner — float + Y-rotate + breathe + parallax */}
      <motion.div
        className="relative will-change-transform [transform-style:preserve-3d]"
        style={{
          x: springX,
          y: springY,
          marginTop: "40px",
        }}
      >
        <motion.div
          className="relative [transform-style:preserve-3d]"
          animate={idle}
          transition={idleTransition}
        >
          <motion.img
            src="/products/bo.png"
            alt=""
            decoding="async"
            draggable={false}
            className="relative mx-auto h-[min(640px,72vh)] w-full max-w-[520px] object-contain drop-shadow-[0_32px_64px_rgba(34,211,238,0.18)] dark:drop-shadow-[0_32px_72px_rgba(34,211,238,0.28)]"
            animate={
              reduceMotion
                ? {}
                : {
                    filter: [
                      "brightness(1) contrast(1.02) saturate(1.05)",
                      "brightness(1.06) contrast(1.04) saturate(1.12)",
                      "brightness(1) contrast(1.02) saturate(1.05)",
                    ],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Holographic shimmer overlay */}
          <motion.div
            className="pointer-events-none absolute inset-[8%] rounded-[40%] bg-gradient-to-tr from-cyan-400/0 via-cyan-300/10 to-transparent mix-blend-screen dark:via-cyan-200/15"
            animate={
              reduceMotion
                ? {}
                : { opacity: [0.2, 0.55, 0.25, 0.5, 0.2] }
            }
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Floor reflection */}
      <motion.div
        className="pointer-events-none absolute bottom-[6%] left-1/2 h-16 w-[45%] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-cyan-500/25 to-transparent blur-2xl dark:from-cyan-400/20"
        animate={
          reduceMotion
            ? {}
            : { opacity: [0.3, 0.55, 0.3], scaleX: [0.9, 1.05, 0.9] }
        }
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
