/** Curated activity → product picks (fallback when API has no matches) */
export const activityProductFallbacks = {
  Walking: [
    { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Comfort for daily walks." },
    { name: "Ankle Binder", slug: "ankle-binder", image: "/products/ankle.png", description: "Stable steps on every stride." },
    { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", image: "/products/back.png", description: "Posture support for long walks." },
  ],
  Running: [
    { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Compression for active runners." },
    { name: "Patella Support", slug: "patella-support", image: "/products/knee.png", description: "Patella tracking during runs." },
    { name: "Ankle Binder", slug: "ankle-binder", image: "/products/ankle.png", description: "Sprain protection on the track." },
  ],
  Gym: [
    { name: "Wrist Splint", slug: "wrist-splint", image: "/products/wrist.png", description: "Wrist stability for lifting." },
    { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Joint confidence under load." },
    { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", image: "/products/back.png", description: "Core support during training." },
  ],
  Yoga: [
    { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Gentle knee cushioning." },
    { name: "Wrist Wrap", slug: "wrist-wrap", image: "/products/wrist.png", description: "Wrist comfort in poses." },
    { name: "Spondylosis Collar", slug: "spondylosis-collar", image: "/products/neck.png", description: "Neck relief after sessions." },
  ],
  Office: [
    { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", image: "/products/back.png", description: "Desk posture support." },
    { name: "Wrist Splint", slug: "wrist-splint", image: "/products/wrist.png", description: "Typing strain relief." },
    { name: "Spondylosis Collar", slug: "spondylosis-collar", image: "/products/neck.png", description: "Neck comfort at work." },
  ],
  Cycling: [
    { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Pedalling support." },
    { name: "Wrist Splint", slug: "wrist-splint", image: "/products/wrist.png", description: "Handlebar comfort." },
    { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", image: "/products/back.png", description: "Lower back on long rides." },
  ],
  Tennis: [
    { name: "Elbow Support", slug: "elbow-support", image: "/products/elbow.png", description: "Tennis elbow relief." },
    { name: "Wrist Wrap", slug: "wrist-wrap", image: "/products/wrist.png", description: "Racket stability." },
    { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Court movement support." },
  ],
  Football: [
    { name: "Knee Immobilizer", slug: "knee-immobilizer", image: "/products/knee.png", description: "Post-match recovery." },
    { name: "Ankle Binder", slug: "ankle-binder", image: "/products/ankle.png", description: "Pitch-ready stability." },
    { name: "Thigh Support", slug: "thigh-support", image: "/products/thigh.png", description: "Hamstring compression." },
  ],
};

export const defaultActivityProducts = [
  { name: "Knee Cap", slug: "knee-cap", image: "/products/knee.png", description: "Everyday joint support." },
  { name: "Wrist Splint", slug: "wrist-splint", image: "/products/wrist.png", description: "Active recovery essential." },
  { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", image: "/products/back.png", description: "Trusted daily support." },
];

export function getActivityFallbackProducts(activityName, limit = 2) {
  const list = activityProductFallbacks[activityName] || defaultActivityProducts;
  return list.slice(0, limit);
}

/** Activity-specific ambient glow for hover product previews */
const ACTIVITY_GLOW = {
  Walking: { rgb: "52, 211, 153" },
  Running: { rgb: "251, 146, 60" },
  Gym: { rgb: "248, 113, 113" },
  Yoga: { rgb: "192, 132, 252" },
  Cycling: { rgb: "34, 211, 238" },
  Football: { rgb: "74, 222, 128" },
  Tennis: { rgb: "250, 204, 21" },
  Basketball: { rgb: "251, 113, 133" },
  Cricket: { rgb: "96, 165, 250" },
  Badminton: { rgb: "45, 212, 191" },
  Volleyball: { rgb: "244, 114, 182" },
  Golf: { rgb: "134, 239, 172" },
  Athletics: { rgb: "251, 191, 36" },
  Aerobics: { rgb: "236, 72, 153" },
  Sleep: { rgb: "129, 140, 248" },
  Office: { rgb: "148, 163, 184" },
};

const DEFAULT_GLOW = { rgb: "34, 211, 238" };

export function getActivityGlow(activityName) {
  return ACTIVITY_GLOW[activityName] || DEFAULT_GLOW;
}
