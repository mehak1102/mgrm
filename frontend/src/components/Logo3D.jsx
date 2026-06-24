import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const ORBITS = [
  {
    size: "w-[54px] h-[30px] sm:w-[62px] sm:h-[34px]",
    duration: 9,
    delay: 0,
    ring: "border-cyan-400/35",
    planet: "from-cyan-300 to-sky-500",
    glow: "shadow-[0_0_12px_rgba(34,211,238,0.75)]",
    planetSize: "w-2 h-2 sm:w-2.5 sm:h-2.5",
  },
  {
    size: "w-[72px] h-[40px] sm:w-[84px] sm:h-[46px]",
    duration: 14,
    delay: 0.4,
    ring: "border-violet-400/30",
    planet: "from-violet-300 to-fuchsia-500",
    glow: "shadow-[0_0_12px_rgba(167,139,250,0.7)]",
    planetSize: "w-2.5 h-2.5 sm:w-3 sm:h-3",
  },
  {
    size: "w-[88px] h-[48px] sm:w-[100px] sm:h-[54px]",
    duration: 20,
    delay: 0.8,
    ring: "border-amber-300/28",
    planet: "from-amber-200 to-orange-400",
    glow: "shadow-[0_0_14px_rgba(251,191,36,0.65)]",
    planetSize: "w-2 h-2 sm:w-2.5 sm:h-2.5",
  },
];

function OrbitRing({ orbit, reduceMotion }) {
  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border ${orbit.size} ${orbit.ring}`}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: orbit.duration,
              repeat: Infinity,
              ease: "linear",
              delay: orbit.delay,
            }
      }
    >
      <span
        className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${orbit.planet} ${orbit.planetSize} ${orbit.glow} border border-white/70`}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default function Logo3D({ asStatic = false, hideBranding = false, className = "" }) {
  const reduceMotion = useReducedMotion();

  const wrapperClass = `relative shrink-0 flex items-center justify-center w-[150px] sm:w-[180px] lg:w-[215px] h-[52px] sm:h-[58px] lg:h-[64px] overflow-visible ${className}`;

  const inner = (
    <>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.06, 1],
                  opacity: [0.35, 0.55, 0.35],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-gradient-to-br from-amber-200/50 via-cyan-300/35 to-violet-400/40 blur-2xl"
          aria-hidden="true"
        />

        {ORBITS.map((orbit, index) => (
          <OrbitRing key={index} orbit={orbit} reduceMotion={reduceMotion} />
        ))}

        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  boxShadow: [
                    "0 0 18px rgba(251,191,36,0.45)",
                    "0 0 28px rgba(34,211,238,0.5)",
                    "0 0 18px rgba(251,191,36,0.45)",
                  ],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-amber-300 via-yellow-200 to-orange-400 border border-white/80"
          aria-hidden="true"
        />
      </div>

      {!hideBranding && (
        <div className="relative z-20 text-center px-1">
          <h1
            className="text-[21px] sm:text-[23px] lg:text-[24px] font-black tracking-tight leading-none text-fg"
            style={{ textShadow: "0 2px 12px rgba(15,23,42,0.08)" }}
          >
            MGRM
          </h1>
          <p className="text-[7px] sm:text-[7.5px] uppercase tracking-[0.38em] sm:tracking-[0.42em] text-slate-500 dark:text-zinc-400 mt-[2px] font-bold">
            Medicare
          </p>
        </div>
      )}
    </>
  );

  if (asStatic) {
    return <div className={wrapperClass}>{inner}</div>;
  }

  return (
    <Link to="/" aria-label="MGRM Medicare home" className={wrapperClass}>
      {inner}
    </Link>
  );
}
