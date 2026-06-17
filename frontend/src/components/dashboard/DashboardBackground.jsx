import { motion } from "framer-motion";

export default function DashboardBackground({ dt }) {
  const blobs = dt.blobs || [];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className={`absolute inset-0 ${dt.shell}`} />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.25), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.2), transparent 45%)",
        }}
      />
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[90px] sm:blur-[120px]"
          style={{
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            background: blob.color,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: [0, i % 2 ? 40 : -36, 0],
            y: [0, i % 2 ? -32 : 36, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 12 + i * 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
