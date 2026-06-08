import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const EASE_LUXURY = [0.16, 1, 0.3, 1];
const BREATH_DURATION = 9;

/** Per-theme motion & effect levels — light mostly unchanged, dark/blue calmer */
const RING_CONFIG = {
  rotation: 72,
  particles: 96,
  denseCrust: true,
  trails: true,
  hud: false,
  sparks: false,
  orbit: false,
  lens: false,
  reflection: true,
  bloomScale: [1, 1.12, 1],
  bloomOpacity: [0.66, 0.92, 0.66],
  shimmer: [0.78, 0.92, 0.78],
};

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildParticles(count, seed) {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: rand() * 360,
    radius: 0.34 + rand() * 0.22,
    size: 1 + rand() * 4.5,
    blur: rand() > 0.55 ? 0.5 + rand() * 2.5 : 0,
    opacity: 0.3 + rand() * 0.7,
    driftX: (rand() - 0.5) * 32,
    driftY: (rand() - 0.5) * 32,
    duration: 12 + rand() * 20,
    delay: rand() * 5,
    orbitDir: rand() > 0.5 ? 1 : -1,
    isGold: rand() > 0.25,
  }));
}

function buildSparks(count, seed) {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: rand() * 360,
    radius: 0.435 + rand() * 0.055,
    size: 1.5 + rand() * 3.5,
    duration: 8 + rand() * 14,
    delay: rand() * 4,
    direction: rand() > 0.5 ? 1 : -1,
  }));
}

function buildStreaks(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    duration: 5.5 + i * 1.4,
    delay: i * 1.1,
    width: 3 + (i % 3),
    direction: i % 2 === 0 ? 1 : -1,
  }));
}

const PARTICLE_FIELD = buildParticles(96, 42);
const DENSE_CRUST = buildParticles(64, 77).map((p) => ({
  ...p,
  radius: 0.435 + (p.id % 6) * 0.01,
  size: 1 + (p.id % 5) * 1.1,
  isGold: true,
}));
const ORBIT_PARTICLES = buildParticles(28, 155).map((p) => ({
  ...p,
  radius: 0.44 + (p.id % 4) * 0.008,
  isGold: true,
}));
const ENERGY_SPARKS = buildSparks(36, 99);
const HUD_STREAKS = buildStreaks(6);
const LIGHT_TRAILS = [0, 1, 2];

const LENS_FLARES = [
  { top: "16%", left: "64%", w: 140, h: 36, rot: -22 },
  { top: "74%", left: "26%", w: 100, h: 28, rot: 18 },
  { top: "44%", left: "80%", w: 80, h: 24, rot: -38 },
];

const THEMES = {
  light: {
    bg: "linear-gradient(180deg, #fffaf5 0%, #fdf6ee 35%, #f8f0e4 70%, #f0e8dc 100%)",
    horizon:
      "radial-gradient(ellipse 92% 48% at 50% 90%, rgba(212,175,100,0.28) 0%, rgba(34,211,238,0.06) 42%, transparent 72%)",
    skyGlow:
      "radial-gradient(ellipse 72% 55% at 50% 42%, rgba(255,249,240,0.95) 0%, rgba(232,212,168,0.2) 40%, rgba(34,211,238,0.05) 55%, transparent 74%)",
    gold: "#C9A45C",
    goldBright: "#F5E6C8",
    goldChampagne: "#E8D4A8",
    goldDeep: "#A67C3D",
    warmWhite: "#FFF9F0",
    cyanAccent: "rgba(34,211,238,0.28)",
    outerBloom: "rgba(245,230,200,0.72)",
    innerBloom: "rgba(232,212,168,0.48)",
    warmAura: "rgba(212,175,100,0.42)",
    trailA:
      "conic-gradient(from 0deg, transparent 0%, rgba(245,230,200,0.95) 6%, rgba(255,249,240,1) 10%, rgba(201,164,92,0.75) 14%, transparent 20%, transparent 40%, rgba(255,249,240,0.85) 46%, rgba(34,211,238,0.25) 50%, rgba(232,212,168,0.6) 54%, transparent 60%)",
    trailB:
      "conic-gradient(from 160deg, transparent 0%, rgba(232,212,168,0.7) 8%, rgba(255,249,240,0.55) 14%, transparent 22%, rgba(201,164,92,0.45) 52%, transparent 62%)",
    streak: "rgba(255,249,240,0.95)",
    streakBright: "rgba(245,230,200,1)",
    particle: "#F5E6C8",
    particleGold: "#D4AF37",
    particleGlow: "rgba(245,230,200,0.9)",
    spark: "#FFF9F0",
    flare:
      "linear-gradient(90deg, transparent, rgba(255,249,240,0.85), rgba(232,212,168,0.6), rgba(34,211,238,0.2), transparent)",
    reflection: "rgba(245,230,200,0.55)",
    reflectionAccent: "rgba(212,175,100,0.3)",
    glassBg: "rgba(255, 252, 248, 0.12)",
    glassBorder: "rgba(255, 249, 240, 0.35)",
    glassInner: "rgba(255, 255, 255, 0.08)",
    brand: "text-slate-900",
    tagline: "text-amber-800/80",
    since: "text-slate-500",
    label: "text-amber-700/90",
    logoFilter:
      "drop-shadow(0 0 32px rgba(212,175,100,0.45)) drop-shadow(0 4px 16px rgba(0,0,0,0.06))",
    ringShadow:
      "0 0 24px rgba(255,249,240,0.95), 0 0 72px rgba(245,230,200,0.72), 0 0 144px rgba(212,175,100,0.42), 0 0 240px rgba(201,164,92,0.24), 0 0 20px rgba(34,211,238,0.12)",
    outerGlowRing: "rgba(245,230,200,0.55)",
    innerGlassRing: "rgba(255,249,240,0.22)",
    metalDark: "#A67C3D",
    metalMid: "#C9A45C",
    metalLight: "#F5E6C8",
    metalHighlight: "#FFF9F0",
    ringBackdrop: null,
    bloomBlur: 12,
  },
  dark: {
    bg: "radial-gradient(ellipse 115% 78% at 50% 16%, #0c1428 0%, #050a14 42%, #010204 72%, #000000 100%)",
    horizon:
      "radial-gradient(ellipse 92% 48% at 50% 90%, rgba(212,175,100,0.14) 0%, rgba(34,211,238,0.04) 42%, transparent 72%)",
    skyGlow:
      "radial-gradient(ellipse 72% 55% at 50% 42%, rgba(255,249,240,0.1) 0%, rgba(232,212,168,0.14) 40%, rgba(34,211,238,0.04) 55%, transparent 74%)",
    gold: "#C9A45C",
    goldBright: "#F5E6C8",
    goldChampagne: "#E8D4A8",
    goldDeep: "#A67C3D",
    warmWhite: "#FFF9F0",
    cyanAccent: "rgba(34,211,238,0.28)",
    outerBloom: "rgba(245,230,200,0.72)",
    innerBloom: "rgba(232,212,168,0.48)",
    warmAura: "rgba(212,175,100,0.42)",
    trailA:
      "conic-gradient(from 0deg, transparent 0%, rgba(245,230,200,0.95) 6%, rgba(255,249,240,1) 10%, rgba(201,164,92,0.75) 14%, transparent 20%, transparent 40%, rgba(255,249,240,0.85) 46%, rgba(34,211,238,0.25) 50%, rgba(232,212,168,0.6) 54%, transparent 60%)",
    trailB:
      "conic-gradient(from 160deg, transparent 0%, rgba(232,212,168,0.7) 8%, rgba(255,249,240,0.55) 14%, transparent 22%, rgba(201,164,92,0.45) 52%, transparent 62%)",
    streak: "rgba(255,249,240,0.95)",
    streakBright: "rgba(245,230,200,1)",
    particle: "#F5E6C8",
    particleGold: "#D4AF37",
    particleGlow: "rgba(245,230,200,0.9)",
    spark: "#FFF9F0",
    flare:
      "linear-gradient(90deg, transparent, rgba(255,249,240,0.85), rgba(232,212,168,0.6), rgba(34,211,238,0.2), transparent)",
    reflection: "rgba(245,230,200,0.55)",
    reflectionAccent: "rgba(212,175,100,0.3)",
    glassBg: "rgba(255, 252, 248, 0.12)",
    glassBorder: "rgba(255, 249, 240, 0.35)",
    glassInner: "rgba(255, 255, 255, 0.08)",
    brand: "text-white",
    tagline: "text-amber-200/75",
    since: "text-zinc-400",
    label: "text-amber-300/80",
    logoFilter:
      "drop-shadow(0 0 32px rgba(212,175,100,0.45)) drop-shadow(0 4px 16px rgba(0,0,0,0.2))",
    ringShadow:
      "0 0 24px rgba(255,249,240,0.95), 0 0 72px rgba(245,230,200,0.72), 0 0 144px rgba(212,175,100,0.42), 0 0 240px rgba(201,164,92,0.24), 0 0 20px rgba(34,211,238,0.12)",
    outerGlowRing: "rgba(245,230,200,0.55)",
    innerGlassRing: "rgba(255,249,240,0.22)",
    metalDark: "#A67C3D",
    metalMid: "#C9A45C",
    metalLight: "#F5E6C8",
    metalHighlight: "#FFF9F0",
    ringBackdrop: null,
    bloomBlur: 12,
  },
  blue: {
    bg: "radial-gradient(ellipse 110% 75% at 50% 14%, #123a62 0%, #0a2240 38%, #061828 68%, #040c18 100%)",
    horizon:
      "radial-gradient(ellipse 92% 48% at 50% 90%, rgba(212,175,100,0.12) 0%, rgba(34,167,220,0.1) 42%, transparent 72%)",
    skyGlow:
      "radial-gradient(ellipse 72% 55% at 50% 42%, rgba(255,249,240,0.08) 0%, rgba(232,212,168,0.12) 40%, rgba(34,167,220,0.08) 55%, transparent 74%)",
    gold: "#C9A45C",
    goldBright: "#F5E6C8",
    goldChampagne: "#E8D4A8",
    goldDeep: "#A67C3D",
    warmWhite: "#FFF9F0",
    cyanAccent: "rgba(34,167,220,0.28)",
    outerBloom: "rgba(245,230,200,0.72)",
    innerBloom: "rgba(232,212,168,0.48)",
    warmAura: "rgba(212,175,100,0.38)",
    trailA:
      "conic-gradient(from 0deg, transparent 0%, rgba(245,230,200,0.95) 6%, rgba(255,249,240,1) 10%, rgba(201,164,92,0.75) 14%, transparent 20%, transparent 40%, rgba(255,249,240,0.85) 46%, rgba(34,167,220,0.3) 50%, rgba(232,212,168,0.6) 54%, transparent 60%)",
    trailB:
      "conic-gradient(from 160deg, transparent 0%, rgba(232,212,168,0.7) 8%, rgba(255,249,240,0.55) 14%, transparent 22%, rgba(201,164,92,0.45) 52%, transparent 62%)",
    streak: "rgba(255,249,240,0.95)",
    streakBright: "rgba(245,230,200,1)",
    particle: "#F5E6C8",
    particleGold: "#D4AF37",
    particleGlow: "rgba(245,230,200,0.9)",
    spark: "#FFF9F0",
    flare:
      "linear-gradient(90deg, transparent, rgba(255,249,240,0.85), rgba(232,212,168,0.6), rgba(34,167,220,0.25), transparent)",
    reflection: "rgba(245,230,200,0.55)",
    reflectionAccent: "rgba(34,167,220,0.2)",
    glassBg: "rgba(255, 252, 248, 0.12)",
    glassBorder: "rgba(255, 249, 240, 0.35)",
    glassInner: "rgba(255, 255, 255, 0.08)",
    brand: "text-white",
    tagline: "text-amber-200/70",
    since: "text-blue-200/55",
    label: "text-amber-200/75",
    logoFilter:
      "drop-shadow(0 0 32px rgba(212,175,100,0.4)) drop-shadow(0 0 24px rgba(34,167,220,0.15)) drop-shadow(0 4px 16px rgba(0,0,0,0.2))",
    ringShadow:
      "0 0 24px rgba(255,249,240,0.95), 0 0 72px rgba(245,230,200,0.72), 0 0 144px rgba(212,175,100,0.42), 0 0 240px rgba(201,164,92,0.24), 0 0 28px rgba(34,167,220,0.15)",
    outerGlowRing: "rgba(245,230,200,0.55)",
    innerGlassRing: "rgba(255,249,240,0.22)",
    metalDark: "#A67C3D",
    metalMid: "#C9A45C",
    metalLight: "#F5E6C8",
    metalHighlight: "#FFF9F0",
    ringBackdrop: null,
    bloomBlur: 12,
  },
};

/* ~35% thicker ring band than previous */
const RING_MASK =
  "radial-gradient(circle at 50% 50%, transparent 41.6%, black 42.8%, black 48.4%, transparent 49.8%)";

const TRAIL_MASK =
  "radial-gradient(circle at 50% 50%, transparent 40.2%, black 42%, black 49.2%, transparent 50.8%)";

const OUTER_GLOW_MASK =
  "radial-gradient(circle at 50% 50%, transparent 38.5%, black 40.5%, black 51%, transparent 53%)";

const STREAK_MASK =
  "radial-gradient(circle at 50% 50%, transparent 42%, black 43%, black 48%, transparent 49%)";

function FloatingParticle({ p, palette, reduce, slow = false }) {
  const left = 50 + Math.cos((p.angle * Math.PI) / 180) * p.radius * 100;
  const top = 50 + Math.sin((p.angle * Math.PI) / 180) * p.radius * 100;
  const color = p.isGold ? palette.particleGold : palette.particle;
  const driftMul = slow ? 0.35 : 1;
  const durMul = slow ? 1.8 : 1;
  const glowMul = slow ? 0.4 : 1;

  const style = {
    left: `${left}%`,
    top: `${top}%`,
    width: p.size,
    height: p.size,
    background: color,
    boxShadow: slow
      ? `0 0 ${2 + p.size}px ${palette.particleGlow}`
      : `0 0 ${5 + p.size * 2.5}px ${palette.particleGlow}`,
    filter: p.blur ? `blur(${p.blur}px)` : undefined,
    opacity: slow ? p.opacity * 0.55 : p.opacity,
  };

  if (reduce) {
    return (
      <span
        className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={style}
      />
    );
  }

  return (
    <motion.span
      className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={style}
      animate={{
        x: [0, p.driftX * driftMul, -p.driftX * 0.3 * driftMul, 0],
        y: [0, p.driftY * driftMul, -p.driftY * 0.35 * driftMul, 0],
        opacity: slow
          ? [p.opacity * 0.25, p.opacity * 0.45, p.opacity * 0.25]
          : [p.opacity * 0.45, p.opacity, p.opacity * 0.7, p.opacity, p.opacity * 0.45],
      }}
      transition={{
        x: { duration: p.duration * durMul, repeat: Infinity, ease: "easeInOut", delay: p.delay },
        y: { duration: p.duration * durMul * 1.15, repeat: Infinity, ease: "easeInOut", delay: p.delay },
        opacity: {
          duration: slow ? 10 + p.id : 2.8 + (p.id % 5) * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: p.delay,
        },
      }}
    />
  );
}

function OrbitParticle({ p, palette, reduce }) {
  const radiusPx = `clamp(175px, 44vw, 305px)`;
  const color = palette.particleGold;

  if (reduce) {
    return (
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{ width: 0, height: 0, transform: `rotate(${p.angle}deg)` }}
      >
        <span
          className="absolute block rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: -p.size / 2,
            left: radiusPx,
            marginLeft: -p.size / 2,
            background: color,
            boxShadow: `0 0 10px ${palette.particleGlow}`,
            opacity: 0.6,
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{ width: 0, height: 0 }}
      animate={{ rotate: [p.angle, p.angle + 360 * p.orbitDir] }}
      transition={{
        duration: 22 + (p.id % 8) * 3,
        repeat: Infinity,
        ease: "linear",
        delay: p.delay,
      }}
    >
      <motion.span
        className="absolute block rounded-full"
        style={{
          width: p.size,
          height: p.size,
          top: -p.size / 2,
          left: radiusPx,
          marginLeft: -p.size / 2,
          background: color,
          boxShadow: `0 0 12px ${palette.particleGlow}`,
        }}
        animate={{
          opacity: [0.3, 0.9, 0.3],
          x: [0, p.driftX * 0.15, 0],
          y: [0, p.driftY * 0.15, 0],
        }}
        transition={{
          opacity: { duration: 2.5 + (p.id % 4), repeat: Infinity, ease: "easeInOut" },
          x: { duration: 4 + p.id * 0.2, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 5 + p.id * 0.15, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </motion.div>
  );
}

function EnergySpark({ s, palette, reduce }) {
  const radiusPx = `clamp(178px, 44.5vw, 308px)`;

  if (reduce) {
    return (
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{ width: 0, height: 0, transform: `rotate(${s.angle}deg)` }}
      >
        <span
          className="absolute block rounded-full"
          style={{
            width: s.size,
            height: s.size,
            top: -s.size / 2,
            left: radiusPx,
            marginLeft: -s.size / 2,
            background: palette.spark,
            boxShadow: `0 0 14px ${palette.particleGold}`,
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{ width: 0, height: 0 }}
      animate={{ rotate: [s.angle, s.angle + 360 * s.direction] }}
      transition={{ duration: s.duration, repeat: Infinity, ease: "linear", delay: s.delay }}
    >
      <motion.span
        className="absolute block rounded-full"
        style={{
          width: s.size,
          height: s.size,
          top: -s.size / 2,
          left: radiusPx,
          marginLeft: -s.size / 2,
          background: palette.spark,
          boxShadow: `0 0 14px ${palette.particleGold}, 0 0 28px ${palette.particleGlow}`,
        }}
        animate={{ opacity: [0.25, 1, 0.25], scale: [0.75, 1.25, 0.75] }}
        transition={{ duration: 1.4 + (s.id % 3) * 0.35, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function HudEnergyStreak({ streak, palette, reduce }) {
  const streakGradient = `conic-gradient(from 0deg, transparent 0deg, ${palette.streak} 1.5deg, ${palette.streakBright} 3.5deg, ${palette.cyanAccent} 5deg, transparent 9deg)`;

  if (reduce) {
    return (
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-60"
        style={{ background: streakGradient, WebkitMask: STREAK_MASK, mask: STREAK_MASK }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none will-change-transform"
      style={{
        background: streakGradient,
        WebkitMask: STREAK_MASK,
        mask: STREAK_MASK,
        filter: "blur(0.5px)",
        opacity: 0.85,
      }}
      animate={{ rotate: streak.direction > 0 ? 360 : -360 }}
      transition={{
        duration: streak.duration,
        repeat: Infinity,
        ease: "linear",
        delay: streak.delay,
      }}
    />
  );
}

function EnergyRing({ reduce }) {
  const { theme } = useTheme();
  const palette = THEMES[theme] || THEMES.light;
  const cfg = RING_CONFIG;
  const shellClass = "absolute inset-0" + (reduce ? "" : " will-change-transform");
  const gradId = `mgrm-gold-grad-${theme}`;
  const bloomId = `mgrm-gold-bloom-${theme}`;
  const particles = PARTICLE_FIELD.slice(0, cfg.particles);

  return (
    <div className="relative w-[min(92vw,700px)] h-[min(92vw,700px)] mx-auto">
      {palette.ringBackdrop && (
        <div
          className="absolute inset-[-5%] rounded-full pointer-events-none"
          style={{ background: palette.ringBackdrop }}
        />
      )}

      <motion.div
        className="absolute inset-[-14%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.outerBloom} 0%, ${palette.warmAura} 22%, ${palette.innerBloom} 38%, transparent 64%)`,
          filter: "blur(56px)",
        }}
        animate={
          reduce ? undefined : { scale: cfg.bloomScale, opacity: cfg.bloomOpacity }
        }
        transition={{ duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[-8%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.warmAura} 0%, ${palette.cyanAccent} 30%, transparent 58%)`,
          filter: "blur(38px)",
        }}
        animate={reduce ? undefined : { scale: [1.06, 1, 1.06], opacity: [0.54, 0.9, 0.54] }}
        transition={{ duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle
            key={p.id}
            p={p}
            palette={palette}
            reduce={reduce}
          />
        ))}
      </div>

      <motion.div
        className={shellClass}
        animate={reduce ? false : { rotate: 360 }}
        transition={{ duration: cfg.rotation, repeat: Infinity, ease: "linear" }}
      >
        {/* Layer 1: Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, transparent 60%, ${palette.outerGlowRing} 100%)`,
            WebkitMask: OUTER_GLOW_MASK,
            mask: OUTER_GLOW_MASK,
            filter: "blur(6px)",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: `2px solid ${palette.goldChampagne}`,
            WebkitMask: OUTER_GLOW_MASK,
            mask: OUTER_GLOW_MASK,
            boxShadow: palette.ringShadow,
            opacity: 0.5,
          }}
          animate={reduce ? undefined : { opacity: cfg.shimmer }}
          transition={{ duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut" }}
        />

        {cfg.denseCrust && (
          <div className="absolute inset-0 pointer-events-none">
            {DENSE_CRUST.map((p) => (
              <FloatingParticle
                key={`crust-${p.id}`}
                p={{ ...p, driftX: p.driftX * 0.35, driftY: p.driftY * 0.35, duration: p.duration * 0.65 }}
                palette={palette}
                reduce={reduce}
              />
            ))}
          </div>
        )}

        {cfg.trails &&
          LIGHT_TRAILS.map((layer) =>
          reduce ? (
            <div
              key={layer}
              className="absolute inset-0 rounded-full pointer-events-none opacity-75"
              style={{
                background: layer === 0 ? palette.trailA : palette.trailB,
                WebkitMask: TRAIL_MASK,
                mask: TRAIL_MASK,
                filter: "blur(1.5px)",
              }}
            />
          ) : (
            <motion.div
              key={layer}
              className="absolute inset-0 rounded-full pointer-events-none will-change-transform"
              style={{
                background: layer === 0 ? palette.trailA : palette.trailB,
                WebkitMask: TRAIL_MASK,
                mask: TRAIL_MASK,
                filter: layer === 0 ? "blur(0.8px)" : "blur(1.5px)",
                opacity: layer === 0 ? 0.92 : 0.72,
              }}
              animate={{ rotate: layer % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: cfg.rotation + layer * 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )
        )}

        {cfg.hud &&
          HUD_STREAKS.map((streak) => (
            <HudEnergyStreak key={streak.id} streak={streak} palette={palette} reduce={reduce} />
          ))}

        {/* Outer + main metallic ring */}
        <svg
          viewBox="0 0 700 700"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor={palette.metalDark} />
              <stop offset="28%" stopColor={palette.metalMid} />
              <stop offset="50%" stopColor={palette.metalLight} />
              <stop offset="72%" stopColor={palette.metalHighlight} />
              <stop offset="100%" stopColor={palette.metalDark} />
            </linearGradient>
            <filter id={bloomId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="b1" />
              <feGaussianBlur stdDeviation="12" result="b2" />
              <feGaussianBlur stdDeviation="26" result="b3" />
              <feMerge>
                <feMergeNode in="b3" />
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="350"
            cy="350"
            r="320"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={7}
            opacity={0.35}
            filter={`url(#${bloomId})`}
          />
          <motion.circle
            cx="350"
            cy="350"
            r="322"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={4.5}
            filter={`url(#${bloomId})`}
            animate={reduce ? undefined : { opacity: cfg.shimmer }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle
            cx="350"
            cy="350"
            r="322"
            fill="none"
            stroke={palette.warmWhite}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <circle
            cx="350"
            cy="350"
            r="318"
            fill="none"
            stroke={palette.cyanAccent}
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-[15%] rounded-full pointer-events-none"
        style={{
          border: `1px solid ${palette.innerGlassRing}`,
          background: `radial-gradient(circle at 35% 30%, ${palette.metalHighlight}22 0%, ${palette.glassInner} 40%, transparent 72%)`,
          backdropFilter: "blur(8px)",
          boxShadow: palette.ringShadow,
        }}
        animate={reduce ? undefined : { opacity: cfg.shimmer, scale: [1, 1.01, 1] }}
        transition={{ duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut" }}
      />

      {cfg.orbit &&
        ORBIT_PARTICLES.map((p) => (
          <OrbitParticle key={`orbit-${p.id}`} p={p} palette={palette} reduce={reduce} />
        ))}

      {cfg.sparks &&
        ENERGY_SPARKS.map((s) => (
          <EnergySpark key={s.id} s={s} palette={palette} reduce={reduce} />
        ))}

      {cfg.lens &&
        !reduce &&
        LENS_FLARES.map((flare, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: flare.top,
              left: flare.left,
              width: flare.w,
              height: flare.h,
              background: palette.flare,
              filter: "blur(5px)",
              transform: `rotate(${flare.rot}deg)`,
            }}
            animate={{ opacity: [0.12, 0.55, 0.12] }}
            transition={{ duration: 3.8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}

      {/* Glassmorphism center */}
      <div
        className="absolute inset-[27%] rounded-full pointer-events-none z-[1]"
        style={{
          background: palette.glassBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${palette.glassBorder}`,
          boxShadow: `inset 0 1px 1px rgba(255,255,255,0.12), inset 0 0 48px rgba(255,255,255,0.04)`,
        }}
      />

      {/* Center brand */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
        >
          <motion.img
            src="/logo.png"
            alt="MGRM Medicare"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain relative z-10"
            style={{ filter: palette.logoFilter }}
            initial={reduce ? false : { opacity: 0, scale: 0.88, y: 16 }}
            animate={reduce ? false : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE_LUXURY }}
          />
        </motion.div>

        <motion.h1
          className={`mt-5 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${palette.brand}`}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease: EASE_LUXURY }}
        >
          MGRM Medicare
        </motion.h1>

        <motion.p
          className={`mt-3 text-xs sm:text-sm font-bold tracking-[0.32em] uppercase ${palette.tagline}`}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE_LUXURY }}
        >
          Comfort. Care. Cure.
        </motion.p>

        <motion.p
          className={`mt-4 text-sm font-semibold tracking-widest ${palette.since}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 1.35, ease: EASE_LUXURY }}
        >
          Trusted Since 1994
        </motion.p>
      </div>

      {cfg.reflection && (
        <>
          <div
            className="absolute left-1/2 bottom-[-4%] w-[78%] h-[22%] pointer-events-none -translate-x-1/2"
            style={{
              background: `radial-gradient(ellipse at center, ${palette.reflection} 0%, ${palette.reflectionAccent} 38%, transparent 74%)`,
              filter: "blur(22px)",
              transform: "translateX(-50%) scaleY(0.28)",
              opacity: 0.78,
            }}
          />
          <motion.div
            className="absolute left-1/2 bottom-[1%] w-[58%] h-[8%] pointer-events-none -translate-x-1/2 rounded-full"
            style={{
              background: `linear-gradient(to top, ${palette.reflection}, transparent)`,
              filter: "blur(16px)",
            }}
            animate={reduce ? undefined : { opacity: [0.35, 0.72, 0.35] }}
            transition={{ duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}

export default function MGRMBrandRing() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const palette = THEMES[theme] || THEMES.light;

  const entrance = useMemo(
    () => ({
      initial: reduce ? false : { opacity: 0, scale: 0.9 },
      animate: reduce ? false : { opacity: 1, scale: 1 },
      transition: { duration: 1.6, ease: EASE_LUXURY },
    }),
    [reduce]
  );

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: palette.bg }}
      aria-label="MGRM Experience Ring"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0" style={{ background: palette.skyGlow }} />
        <div className="absolute inset-0" style={{ background: palette.horizon }} />
        {palette.ringBackdrop && (
          <div
            className="absolute inset-0"
            style={{ background: palette.ringBackdrop, opacity: 0.85 }}
          />
        )}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/4 to-transparent dark:from-black/25" />
      </div>

      <div className="relative z-10 w-full px-4 flex flex-col items-center justify-center flex-1 py-16">
        <motion.p
          className={`mb-8 sm:mb-10 text-xs sm:text-sm font-black tracking-[0.4em] uppercase ${palette.label}`}
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE_LUXURY }}
        >
          The MGRM Experience
        </motion.p>

        <motion.div {...entrance} className="w-full flex justify-center">
          <EnergyRing reduce={reduce} />
        </motion.div>

        <motion.p
          className={`mt-10 sm:mt-12 text-sm sm:text-base max-w-md text-center ${palette.since} opacity-80`}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.6, ease: EASE_LUXURY }}
        >
          Premium healthcare technology — engineered for recovery, trusted by professionals across India.
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? false : { opacity: 0.45 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${palette.since}`}>
          Scroll
        </span>
        <motion.div
          className={`w-px h-8 ${theme === "light" ? "bg-amber-600/40" : "bg-amber-300/40"}`}
          animate={reduce ? undefined : { scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
