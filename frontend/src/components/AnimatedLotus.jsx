import { motion } from "framer-motion";

export default function AnimatedLotus() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: i * 0.35,
        duration: 3.2,
        ease: "easeInOut",
      },
    }),
  };

  const lines = [
    "M250 295 C220 250 225 190 250 140 C275 190 280 250 250 295",
    "M245 300 C190 270 165 215 185 165 C230 190 250 245 245 300",
    "M255 300 C310 270 335 215 315 165 C270 190 250 245 255 300",
    "M230 315 C155 310 95 270 70 220 C145 210 215 250 230 315",
    "M270 315 C345 310 405 270 430 220 C355 210 285 250 270 315",
    "M115 330 C180 365 320 365 385 330",
    "M160 360 C215 385 285 385 340 360",
  ];

  return (
    <div
      className="
        relative w-full h-full overflow-hidden
        bg-gradient-to-br from-[#fbfdff] via-[#eef8ff] to-[#f8f2ff]
        dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-800
        transition-colors duration-300
      "
    >
      {/* Dark-mode glow overlay */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 dark:opacity-100
          bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_40%)]
          transition-opacity duration-300
        "
        aria-hidden
      />
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 dark:opacity-100
          bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.10),transparent_45%)]
          transition-opacity duration-300
        "
        aria-hidden
      />

      <div className="absolute -top-24 -right-20 w-[420px] h-[420px] bg-cyan-300/25 dark:bg-cyan-500/10 rounded-full blur-3xl transition-colors duration-300" />
      <div className="absolute -bottom-24 -left-20 w-[420px] h-[420px] bg-purple-300/25 dark:bg-purple-500/10 rounded-full blur-3xl transition-colors duration-300" />

      <div className="absolute inset-x-0 top-8 h-[44%] grid place-items-center z-10">
        {/* <img
          src="/logo.png"
          alt="MGRM Medicare"
          className="absolute top-2 h-12 object-contain opacity-90 dark:brightness-110 dark:drop-shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all duration-300"
        /> */}
        <svg viewBox="0 0 500 430" className="w-[70%] max-w-[430px] mt-8">
          <g
            fill="none"
            stroke="currentColor"
            className="text-[#6d28d9] dark:text-cyan-400/90"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {lines.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                variants={draw}
                initial="hidden"
                animate="visible"
                custom={i}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="absolute left-10 right-10 bottom-12 z-10">
        {/* <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.8 }}
          className="text-cyan-600 dark:text-cyan-400 tracking-[0.3em] font-black text-sm transition-colors duration-300 pt-10"
        >
          MGRM MEDICARE
        </motion.p> */}

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8 }}
          className="text-slate-950 dark:text-white text-5xl font-black mt-4 leading-tight transition-colors duration-300"
        >
          Comfort.
          <br />
          Care.
          <br />
          Cure.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="mt-5 max-w-md leading-7"
        >
          <p className="text-slate-500 dark:text-slate-300 transition-colors duration-300">
            Premium orthopedic and recovery products crafted for movement,
            stability and everyday healing.
          </p>
          <p className="mt-3 text-lg font-black text-purple-700 dark:text-cyan-400 transition-colors duration-300">
            Bandage to Splintage™
          </p>
        </motion.div>
      </div>
    </div>
  );
}