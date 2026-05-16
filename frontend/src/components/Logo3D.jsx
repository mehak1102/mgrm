// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Logo3D() {
//   return (
//     <Link
//       to="/"
//       className="relative shrink-0 flex items-center justify-center w-[190px] h-[64px] overflow-hidden"
//     >
//       {/* SOFT BACK GLOW */}
//       <div className="absolute w-28 h-28 bg-violet-200/40 blur-3xl rounded-full" />

//       {/* INFINITY LINE */}
//       <motion.svg
//         viewBox="0 0 300 120"
//         fill="none"
//         className="absolute w-[170px] h-[60px] opacity-70"
//         animate={{
//           rotate: [0, 2, -2, 0],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <path
//           d="
//             M75,60
//             C75,20 130,20 150,60
//             C170,100 225,100 225,60
//             C225,20 170,20 150,60
//             C130,100 75,100 75,60
//           "
//           stroke="url(#grad)"
//           strokeWidth="1.4"
//         />

//         <defs>
//           <linearGradient id="grad">
//             <stop offset="0%" stopColor="#c4b5fd" />
//             <stop offset="50%" stopColor="#93c5fd" />
//             <stop offset="100%" stopColor="#f9a8d4" />
//           </linearGradient>
//         </defs>
//       </motion.svg>

//       {/* LEFT FLOATING GLASS */}
//       <motion.div
//         animate={{
//           y: [-5, 5, -5],
//           rotate: [0, 8, -8, 0],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           left-[38px]
//           w-8
//           h-8
//           rounded-2xl
//           bg-gradient-to-br
//           from-cyan-200
//           via-violet-200
//           to-pink-200
//           shadow-[0_12px_30px_rgba(168,85,247,0.18)]
//           backdrop-blur-2xl
//           border
//           border-white/50
//         "
//         style={{
//           transform: "rotateX(55deg)",
//         }}
//       />

//       {/* RIGHT GLASS BALL */}
//       <motion.div
//         animate={{
//           y: [5, -5, 5],
//           x: [0, 4, 0],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           right-[40px]
//           w-6
//           h-6
//           rounded-full
//           bg-white/70
//           border
//           border-slate-200
//           backdrop-blur-xl
//           shadow-[0_10px_25px_rgba(15,23,42,0.08)]
//         "
//       />

//       {/* STATIC TEXT */}
//       <div className="relative z-20 text-center">
//         <h1
//           className="
//             bg-gradient-to-b
//             from-slate-600
//             via-slate-600
//             to-slate-900
//             bg-clip-text
//             text-transparent
//             font-black
//             text-[22px]
//             leading-none
//             tracking-tight
//           "
//           style={{
//             textShadow: "0 2px 10px rgba(7, 13, 27, 0.08)",
//           }}
//         >
//           MGRM
//         </h1>

//         <p
//           className="
//             text-slate-400
//             text-[8px]
//             tracking-[0.38em]
//             uppercase
//             mt-[2px]
//           "
//         >
//           Medicare
//         </p>
//       </div>

//       {/* SMALL FLOATING PARTICLE */}
//       <motion.div
//         animate={{
//           y: [-8, 8, -8],
//           opacity: [0.4, 1, 0.4],
//         }}
//         transition={{
//           duration: 4,
//           repeat: Infinity,
//         }}
//         className="
//           absolute
//           top-[10px]
//           right-[54px]
//           w-2
//           h-2
//           rounded-full
//           bg-cyan-300
//           shadow-[0_0_12px_rgba(34,211,238,0.7)]
//         "
//       />
//     </Link>
//   );
// }


// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Logo3D() {
//   return (
//     <Link
//       to="/"
//       className="relative shrink-0 flex items-center justify-center w-[210px] h-[62px] overflow-hidden"
//     >
//       {/* SOFT GLOW */}
//       <motion.div
//         animate={{
//           scale: [1, 1.12, 1],
//           opacity: [0.2, 0.45, 0.2],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           w-28
//           h-28
//           rounded-full
//           bg-gradient-to-r
//           from-cyan-200/40
//           via-violet-200/40
//           to-pink-200/40
//           blur-3xl
//         "
//       />

//       {/* INFINITY ORBIT */}
//       <motion.svg
//         viewBox="0 0 300 120"
//         fill="none"
//         className="absolute w-[180px] h-[70px]"
//         animate={{
//           rotate: [0, 3, -3, 0],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         {/* MAIN INFINITY */}
//         <path
//           d="
//             M75,60
//             C75,22 128,22 150,60
//             C172,98 225,98 225,60
//             C225,22 172,22 150,60
//             C128,98 75,98 75,60
//           "
//           stroke="url(#mainGradient)"
//           strokeWidth="2"
//           strokeLinecap="round"
//         />

//         {/* GLOW PATH */}
//         <motion.path
//           d="
//             M75,60
//             C75,22 128,22 150,60
//             C172,98 225,98 225,60
//             C225,22 172,22 150,60
//             C128,98 75,98 75,60
//           "
//           stroke="url(#glowGradient)"
//           strokeWidth="5"
//           strokeLinecap="round"
//           opacity="0.18"
//           animate={{
//             pathLength: [0.2, 1, 0.2],
//           }}
//           transition={{
//             duration: 5,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />

//         <defs>
//           <linearGradient id="mainGradient">
//             <stop offset="0%" stopColor="#7dd3fc" />
//             <stop offset="50%" stopColor="#c4b5fd" />
//             <stop offset="100%" stopColor="#f9a8d4" />
//           </linearGradient>

//           <linearGradient id="glowGradient">
//             <stop offset="0%" stopColor="#67e8f9" />
//             <stop offset="100%" stopColor="#e879f9" />
//           </linearGradient>
//         </defs>
//       </motion.svg>

//       {/* FLOATING ORB LEFT */}
//       <motion.div
//         animate={{
//           x: [-6, 6, -6],
//           y: [-4, 4, -4],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           left-[34px]
//           w-5
//           h-5
//           rounded-full
//           bg-gradient-to-br
//           from-cyan-200
//           to-violet-300
//           border
//           border-white/70
//           shadow-[0_0_20px_rgba(125,211,252,0.45)]
//           backdrop-blur-xl
//         "
//       />

//       {/* FLOATING ORB RIGHT */}
//       <motion.div
//         animate={{
//           x: [6, -6, 6],
//           y: [4, -4, 4],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           right-[34px]
//           w-4
//           h-4
//           rounded-full
//           bg-gradient-to-br
//           from-pink-200
//           to-violet-300
//           border
//           border-white/70
//           shadow-[0_0_18px_rgba(244,114,182,0.35)]
//         "
//       />

//       {/* CENTER TEXT */}
//       <div className="relative z-20 text-center">
//         <motion.h1
//           animate={{
//             backgroundPosition: [
//               "0% 50%",
//               "100% 50%",
//               "0% 50%",
//             ],
//           }}
//           transition={{
//             duration: 6,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="
//             text-[24px]
//             font-black
//             tracking-tight
//             leading-none
//             text-transparent
//             bg-clip-text
//             bg-[length:200%_200%]
//           "
//           style={{
//             backgroundImage:
//               "linear-gradient(135deg,#d1d5db,#475569,#e2e8f0,#0f172a)",
//             textShadow:
//               "0 4px 14px rgba(0, 1, 3, 0.08)",
//           }}
//         >
//           MGRM
//         </motion.h1>

//         <p
//           className="
//             text-[7px]
//             uppercase
//             tracking-[0.42em]
//             text-slate-400
//             mt-[2px]
//           "
//         >
//           Medicare
//         </p>
//       </div>

//       {/* TOP PARTICLE */}
//       <motion.div
//         animate={{
//           y: [-8, 8, -8],
//           opacity: [0.2, 1, 0.2],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Infinity,
//         }}
//         className="
//           absolute
//           top-[8px]
//           right-[56px]
//           w-2
//           h-2
//           rounded-full
//           bg-cyan-300
//           shadow-[0_0_14px_rgba(34,211,238,0.9)]
//         "
//       />
//     </Link>
//   );
// }

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Logo3D() {
//   return (
//     <Link
//       to="/"
//       className="
//         relative
//         shrink-0
//         flex
//         items-center
//         justify-center
//         w-[215px]
//         h-[64px]
//         overflow-hidden
//       "
//     >
//       {/* SOFT PREMIUM GLOW */}
//       <motion.div
//         animate={{
//           scale: [1, 1.1, 1],
//           opacity: [0.2, 0.38, 0.2],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           w-32
//           h-32
//           rounded-full
//           bg-gradient-to-r
//           from-cyan-200/30
//           via-violet-300/30
//           to-fuchsia-200/30
//           blur-3xl
//         "
//       />

//       {/* INFINITY DRAW ANIMATION */}
//       <motion.svg
//         viewBox="0 0 300 120"
//         fill="none"
//         className="absolute w-[185px] h-[72px]"
//       >
//         {/* BASE INFINITY */}
//         <path
//           d="
//             M75,60
//             C75,22 128,22 150,60
//             C172,98 225,98 225,60
//             C225,22 172,22 150,60
//             C128,98 75,98 75,60
//           "
//           stroke="url(#baseGradient)"
//           strokeWidth="2"
//           strokeLinecap="round"
//           opacity="0.22"
//         />

//         {/* DRAWING PATH */}
//         <motion.path
//           d="
//             M75,60
//             C75,22 128,22 150,60
//             C172,98 225,98 225,60
//             C225,22 172,22 150,60
//             C128,98 75,98 75,60
//           "
//           stroke="url(#drawGradient)"
//           strokeWidth="3.2"
//           strokeLinecap="round"
//           initial={{
//             pathLength: 0,
//             opacity: 0,
//           }}
//           animate={{
//             pathLength: [0, 1, 1],
//             opacity: [0, 1, 1],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             repeatDelay: 1,
//             ease: "easeInOut",
//           }}
//           style={{
//             filter:
//               "drop-shadow(0 0 10px rgba(168,85,247,0.35))",
//           }}
//         />

//         {/* MOVING ENERGY */}
//         <motion.circle
//           r="4"
//           fill="#c084fc"
//           animate={{
//             offsetDistance: ["0%", "100%"],
//           }}
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           style={{
//             offsetPath: `path(
//               "M75,60
//               C75,22 128,22 150,60
//               C172,98 225,98 225,60
//               C225,22 172,22 150,60
//               C128,98 75,98 75,60"
//             )`,
//             filter:
//               "drop-shadow(0 0 10px rgba(192,132,252,0.9))",
//           }}
//         />

//         <defs>
//           {/* LIGHT + DARK MIX */}
//           <linearGradient id="baseGradient">
//             <stop offset="0%" stopColor="#cbd5e1" />
//             <stop offset="50%" stopColor="#94a3b8" />
//             <stop offset="100%" stopColor="#d8b4fe" />
//           </linearGradient>

//           <linearGradient id="drawGradient">
//             <stop offset="0%" stopColor="#67e8f9" />
//             <stop offset="50%" stopColor="#7c3aed" />
//             <stop offset="100%" stopColor="#f472b6" />
//           </linearGradient>
//         </defs>
//       </motion.svg>

//       {/* LEFT ORB */}
//       <motion.div
//         animate={{
//           x: [-5, 5, -5],
//           y: [-4, 4, -4],
//         }}
//         transition={{
//           duration: 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           left-[34px]
//           w-5
//           h-5
//           rounded-full
//           bg-gradient-to-br
//           from-slate-600
//           via-violet-400
//           to-cyan-300
//           shadow-[0_0_18px_rgba(168,85,247,0.28)]
//         "
//       />

//       {/* RIGHT ORB */}
//       <motion.div
//         animate={{
//           x: [5, -5, 5],
//           y: [4, -4, 4],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           absolute
//           right-[34px]
//           w-4
//           h-4
//           rounded-full
//           bg-gradient-to-br
//           from-slate-700
//           via-fuchsia-300
//           to-violet-400
//           shadow-[0_0_16px_rgba(244,114,182,0.25)]
//         "
//       />

//       {/* CENTER TEXT */}
//       <div className="relative z-20 text-center">
//         {/* <motion.h1
//           animate={{
//             backgroundPosition: [
//               "0% 50%",
//               "100% 50%",
//               "0% 50%",
//             ],
//           }}
//           transition={{
//             duration: 6,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="
//             text-[24px]
//             font-black
//             tracking-tight
//             leading-none
//             text-transparent
//             bg-clip-text
//             bg-[length:200%_200%]
//           "
//           style={{
//             backgroundImage:
//               "linear-gradient(135deg,#0f172a,#64748b,#e2e8f0,#7c3aed,#0f172a)",
//             textShadow:
//               "0 4px 14px rgba(15,23,42,0.08)",
//           }}
//         >
//           MGRM
//         </motion.h1> */}

//         <motion.h1
//   className="
//     text-[24px]
//     font-black
//     tracking-tight
//     leading-none
//     text-black
//   "
//   style={{
//     textShadow:
//       "0 4px 14px rgba(15,23,42,0.08)",
//   }}
// >
//   MGRM
// </motion.h1>

//         <p
//           className="
//             text-[7px]
//             uppercase
//             tracking-[0.42em]
//             text-slate-500
//             mt-[2px]
//           "
//         >
//           Medicare
//         </p>
//       </div>

//       {/* FLOATING PARTICLE */}
//       <motion.div
//         animate={{
//           y: [-8, 8, -8],
//           opacity: [0.2, 1, 0.2],
//         }}
//         transition={{
//           duration: 3,
//           repeat: Infinity,
//         }}
//         className="
//           absolute
//           top-[8px]
//           right-[56px]
//           w-2
//           h-2
//           rounded-full
//           bg-cyan-300
//           shadow-[0_0_14px_rgba(34,211,238,0.8)]
//         "
//       />
//     </Link>
//   );
// }


import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Logo3D() {
  return (
    <Link
      to="/"
      className="
        relative
        shrink-0
        flex
        items-center
        justify-center
        w-[215px]
        h-[64px]
        overflow-hidden
      "
    >
      {/* SOFT PREMIUM GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.18, 0.32, 0.18],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-32
          h-32
          rounded-full
          bg-gradient-to-r
          from-cyan-200/30
          via-violet-300/25
          to-fuchsia-200/30
          blur-3xl
        "
      />

      {/* INFINITY SVG */}
      <motion.svg
        viewBox="0 0 300 120"
        fill="none"
        className="absolute w-[185px] h-[72px]"
      >
        {/* STATIC LIGHT BASE */}
        <path
          d="
            M75,60
            C75,22 128,22 150,60
            C172,98 225,98 225,60
            C225,22 172,22 150,60
            C128,98 75,98 75,60
          "
          stroke="url(#baseGradient)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.18"
        />

        {/* DRAWING INFINITY */}
        <motion.path
          d="
            M75,60
            C75,22 128,22 150,60
            C172,98 225,98 225,60
            C225,22 172,22 150,60
            C128,98 75,98 75,60
          "
          stroke="url(#drawGradient)"
          strokeWidth="2.6"
          strokeLinecap="round"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            filter:
              "drop-shadow(0 0 10px rgba(192,132,252,0.22))",
          }}
        />

        {/* MOVING ENERGY DOT */}
        <motion.circle
          r="3.5"
          fill="#d8b4fe"
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            offsetPath: `path(
              "M75,60
              C75,22 128,22 150,60
              C172,98 225,98 225,60
              C225,22 172,22 150,60
              C128,98 75,98 75,60"
            )`,
            filter:
              "drop-shadow(0 0 8px rgba(216,180,254,0.75))",
          }}
        />

        <defs>
          {/* LIGHT BASE */}
          <linearGradient id="baseGradient">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f5d0fe" />
          </linearGradient>

          {/* PREMIUM DRAW */}
          <linearGradient id="drawGradient">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* LEFT FLOATING ORB */}
      <motion.div
        animate={{
          x: [-5, 5, -5],
          y: [-4, 4, -4],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[34px]
          w-5
          h-5
          rounded-full
          bg-gradient-to-br
          from-cyan-200
          via-violet-300
          to-slate-500
          shadow-[0_0_18px_rgba(168,85,247,0.22)]
          backdrop-blur-xl
        "
      />

      {/* RIGHT FLOATING ORB */}
      <motion.div
        animate={{
          x: [5, -5, 5],
          y: [4, -4, 4],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          right-[34px]
          w-4
          h-4
          rounded-full
          bg-gradient-to-br
          from-fuchsia-200
          via-violet-300
          to-slate-600
          shadow-[0_0_16px_rgba(244,114,182,0.18)]
        "
      />

      {/* CENTER TEXT */}
      <div className="relative z-20 text-center">
        <h1
          className="
            text-[24px]
            font-black
            tracking-tight
            leading-none
            text-slate-900 dark:text-white
          "
          style={{
            textShadow:
              "0 4px 12px rgba(15,23,42,0.05)",
          }}
        >
          MGRM
        </h1>

        <p
          className="
            text-[7px]
            uppercase
            tracking-[0.42em]
            text-slate-500 dark:text-zinc-400
            mt-[2px]
          "
        >
          Medicare
        </p>
      </div>

      {/* FLOATING TOP PARTICLE */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="
          absolute
          top-[8px]
          right-[56px]
          w-2
          h-2
          rounded-full
          bg-cyan-300
          shadow-[0_0_14px_rgba(34,211,238,0.7)]
        "
      />
    </Link>
  );
}