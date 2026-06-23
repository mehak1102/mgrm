import { bodyCategories } from "./siteData";

function meta(query) {
  const cat = bodyCategories.find((c) => c.query === query);
  return {
    query,
    label: cat?.name || query,
    color: cat?.color || "#0ea5e9",
    image: cat?.image || "/products/knee2.png",
    count: cat?.count ?? 0,
  };
}

/**
 * Every body category appears exactly once across specialties
 * (Abdominal intentionally appears in Sports + Core per clinical mapping).
 */
export const therapySections = [
  {
    id: "sports",
    title: "Sports Physiotherapy",
    shortLabel: "Sports",
    tagline: "Return to motion. Supports for athletic strain, impact, and field recovery.",
    story: "Built for athletes rebuilding power from core to calf.",
    categories: ["Abdominal", "Shin And Calf", "Thigh"].map((q) => meta(q).query),
    accent: meta("Thigh").color,
    mood: "dynamic",
    heroImage: "/cardiology/sports.png",
  },
  {
    id: "upper-limb",
    title: "Upper Limb Physiotherapy",
    shortLabel: "Upper Limb",
    tagline: "Precision rehabilitation from shoulder girdle through the elbow.",
    story: "Restoring reach, grip, and overhead confidence.",
    categories: ["Arm", "Elbow"].map((q) => meta(q).query),
    accent: meta("Arm").color,
    mood: "fluid",
    heroImage: "/cardiology/upperlimb.png",
  },
  {
    id: "lower-limb",
    title: "Lower Limb Physiotherapy",
    shortLabel: "Lower Limb",
    tagline: "Grounded recovery from hip descent to foot strike.",
    story: "Stability for every step of the gait cycle.",
    categories: ["Ankle And Foot", "Leg"].map((q) => meta(q).query),
    accent: meta("Leg").color,
    mood: "grounded",
    heroImage: "/cardiology/lower.png",
  },
  {
    id: "musculoskeletal",
    title: "Musculoskeletal Physiotherapy",
    shortLabel: "MSK",
    tagline: "Structural support for the spine's load-bearing architecture.",
    story: "When the back needs clinical-grade stabilization.",
    categories: ["Back"].map((q) => meta(q).query),
    accent: meta("Back").color,
    mood: "structural",
    heroImage: "/cardiology/back.png",
  },
  {
    id: "cardio-respiratory",
    title: "Cardio-Respiratory Physiotherapy",
    shortLabel: "Cardio",
    tagline: "Breath-led recovery. Chest support for pulmonary rehabilitation.",
    story: "Supports that work in rhythm with respiration.",
    categories: ["Chest"].map((q) => meta(q).query),
    accent: meta("Chest").color,
    mood: "vital",
    heroImage: "/cardiology/cardio.png",
  },
  {
    id: "orthopedic",
    title: "Orthopedic Physiotherapy",
    shortLabel: "Orthopedic",
    tagline: "Joint-centric care for the body's most stressed hinge.",
    story: "Knee support engineered for surgical and sports rehab.",
    categories: ["Knee"].map((q) => meta(q).query),
    accent: meta("Knee").color,
    mood: "precision",
    heroImage: "/cardiology/orth.png",
  },
  {
    id: "spine-posture",
    title: "Spine & Posture Physiotherapy",
    shortLabel: "Spine",
    tagline: "Cervical alignment and postural integrity, clinically supported.",
    story: "Neck supports for desk strain, whiplash, and daily posture.",
    categories: ["Neck"].map((q) => meta(q).query),
    accent: meta("Neck").color,
    mood: "aligned",
    heroImage: "/cardiology/spine.png",
  },
  {
    id: "hand-therapy",
    title: "Hand Therapy",
    shortLabel: "Hand",
    tagline: "Dexterity restored. Fine motor rehabilitation at the fingertip.",
    story: "Micro-support for tendons, joints, and grip recovery.",
    categories: ["Finger"].map((q) => meta(q).query),
    accent: meta("Finger").color,
    mood: "delicate",
    heroImage: "/cardiology/hand.png",
  },
  {
    id: "shoulder-rehab",
    title: "Shoulder Rehabilitation",
    shortLabel: "Shoulder",
    tagline: "Rotator cuff to deltoid — dedicated shoulder recovery systems.",
    story: "Immobilization and mobilization for the most mobile joint.",
    categories: ["Shoulder"].map((q) => meta(q).query),
    accent: meta("Shoulder").color,
    mood: "elevated",
    heroImage: "/cardiology/shoulder.png",
  },
  {
    id: "hand-wrist",
    title: "Hand & Wrist Physiotherapy",
    shortLabel: "Wrist",
    tagline: "Carpal stability and wrist alignment for daily function.",
    story: "Supports that protect the wrist through full flexion cycles.",
    categories: ["Wrist"].map((q) => meta(q).query),
    accent: meta("Wrist").color,
    mood: "articulate",
    heroImage: "/cardiology/wrist.png",
  },
  {
    id: "core-rehab",
    title: "Core Rehabilitation",
    shortLabel: "Core",
    tagline: "Center your strength. Abdominal support for core stability.",
    story: "Post-surgical and postpartum abdominal recovery systems.",
    categories: ["Abdominal"].map((q) => meta(q).query),
    accent: meta("Abdominal").color,
    mood: "centered",
    heroImage: "/cardiology/core.png",
  },
  {
    id: "general-orthopedic",
    title: "General Orthopedic Rehabilitation",
    shortLabel: "General",
    tagline: "Mobility aids and orthopedic assists for everyday independence.",
    story: "Walking aids, braces, and supports beyond a single body region.",
    categories: ["Orthopedic Aids"].map((q) => meta(q).query),
    accent: meta("Orthopedic Aids").color,
    mood: "assistive",
    heroImage: "/cardiology/gor.png",
  },
];

export function getCategoryMeta(query) {
  return meta(query);
}

export function therapyShopUrl(categories = []) {
  const first = categories[0];
  if (!first) return "/shop";
  return `/shop?category=${encodeURIComponent(first)}`;
}
