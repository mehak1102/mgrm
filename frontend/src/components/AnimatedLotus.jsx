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
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#fbfdff] via-[#eef8ff] to-[#f8f2ff]">
      <div className="absolute -top-24 -right-20 w-[420px] h-[420px] bg-cyan-300/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-20 w-[420px] h-[420px] bg-purple-300/25 rounded-full blur-3xl" />

      <div className="absolute inset-x-0 top-10 h-[48%] grid place-items-center">
        <svg viewBox="0 0 500 430" className="w-[70%] max-w-[430px]">
          <g
            fill="none"
            stroke="#6d28d9"
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

      <div className="absolute left-10 right-10 bottom-12">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.8 }}
          className="text-cyan-600 tracking-[0.3em] font-black text-sm"
        >
          MGRM MEDICARE
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8 }}
          className="text-slate-950 text-5xl font-black mt-4 leading-tight"
        >
          Comfort.<br />
          Care.<br />
          Cure.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="text-slate-500 mt-5 max-w-md leading-7"
        >
          Premium orthopedic and recovery products crafted for movement,
          stability and everyday healing.
          <h2>Bandage to Splintage</h2>
        </motion.p>
      </div>
    </div>
  );
}