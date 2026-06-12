import { mgrmCategories } from "../siteData";

const categoryByName = Object.fromEntries(mgrmCategories.map((c) => [c.name, c]));

/** Maps product slug → mgrmCategories name for image + color */
const SLUG_TO_CATEGORY = {
  "abdominal-belt": "Abdominal",
  "post-surgery-abdominal-support": "Abdominal",
  "ankle-binder": "Ankle And Foot",
  "ankle-walker": "Ankle And Foot",
  "foot-drop-splint": "Ankle And Foot",
  "arm-sling": "Arm",
  "shoulder-immobilizer": "Shoulder",
  "elbow-support": "Elbow",
  "tennis-elbow-brace": "Elbow",
  "lumbo-sacral-belt": "Back",
  "dorso-lumbar-brace": "Back",
  "posture-corrector": "Back",
  "rib-belt": "Chest",
  "chest-support": "Chest",
  "finger-splint": "Finger",
  "mallet-finger-splint": "Finger",
  "trigger-finger-splint": "Finger",
  "knee-cap": "Knee",
  "patella-support": "Knee",
  "hinged-knee-brace": "Knee",
  "knee-immobilizer": "Knee",
  "calf-support": "Shin And Calf",
  "shin-splint-support": "Shin And Calf",
  "varicose-vein-stockings": "Leg",
  "thigh-support": "Thigh",
  "groin-support": "Thigh",
  "spondylosis-collar": "Neck",
  "cervical-traction-kit": "Neck",
  "soft-cervical-collar": "Neck",
  "wrist-splint": "Wrist",
  "wrist-wrap": "Wrist",
  "thumb-spica-splint": "Wrist",
  "clavicle-brace": "Shoulder",
  "walking-stick": "Orthopedic Aids",
  walker: "Orthopedic Aids",
  crutches: "Orthopedic Aids",
};

const BODY_PART_PRODUCTS = {
  Abdominal: [
    { name: "Abdominal Belt", slug: "abdominal-belt", description: "Core compression for post-surgical comfort and everyday stability." },
    { name: "Post-Surgery Abdominal Support", slug: "post-surgery-abdominal-support", description: "Adjustable support designed for controlled recovery after abdominal procedures." },
    { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", description: "Pairs core support with lower-back alignment during standing and walking." },
  ],
  "Ankle And Foot": [
    { name: "Ankle Binder", slug: "ankle-binder", description: "Stabilises the ankle after sprains and during return-to-activity." },
    { name: "Ankle Walker", slug: "ankle-walker", description: "Offloads weight while protecting healing ligaments and fractures." },
    { name: "Foot Drop Splint", slug: "foot-drop-splint", description: "Supports dorsiflexion for safer walking and reduced trip risk." },
  ],
  Arm: [
    { name: "Arm Sling", slug: "arm-sling", description: "Immobilises the arm after fracture, dislocation or soft-tissue injury." },
    { name: "Shoulder Immobilizer", slug: "shoulder-immobilizer", description: "Limits harmful movement while tissues heal in the early recovery phase." },
    { name: "Elbow Support", slug: "elbow-support", description: "Light compression for strain relief during gradual return to use." },
  ],
  Back: [
    { name: "Lumbo Sacral Belt", slug: "lumbo-sacral-belt", description: "Lumbar support for desk work, lifting and chronic lower-back discomfort." },
    { name: "Dorso Lumbar Brace", slug: "dorso-lumbar-brace", description: "Broader coverage for thoracic and lumbar stability during recovery." },
    { name: "Posture Corrector", slug: "posture-corrector", description: "Gentle cueing for upright sitting and reduced slouch-related strain." },
  ],
  Chest: [
    { name: "Rib Belt", slug: "rib-belt", description: "Compression for rib injuries that makes breathing and movement less painful." },
    { name: "Chest Support", slug: "chest-support", description: "Stabilises the chest wall during coughing, turning and daily activity." },
    { name: "Posture Corrector", slug: "posture-corrector", description: "Reduces upper-back rounding that can worsen chest wall strain." },
  ],
  Elbow: [
    { name: "Elbow Support", slug: "elbow-support", description: "Targeted compression for tennis elbow and repetitive strain." },
    { name: "Tennis Elbow Brace", slug: "tennis-elbow-brace", description: "Offloads the extensor tendon during gripping and racket sports." },
    { name: "Arm Sling", slug: "arm-sling", description: "Rests the elbow when acute pain needs a period of reduced loading." },
  ],
  Finger: [
    { name: "Finger Splint", slug: "finger-splint", description: "Keeps an injured finger in a safe position for tendon and joint healing." },
    { name: "Mallet Finger Splint", slug: "mallet-finger-splint", description: "Maintains extension for classic mallet-finger presentations." },
    { name: "Trigger Finger Splint", slug: "trigger-finger-splint", description: "Limits triggering by supporting the affected pulley region." },
  ],
  Knee: [
    { name: "Knee Cap", slug: "knee-cap", description: "Everyday patellar compression for walking, stairs and light activity." },
    { name: "Hinged Knee Brace", slug: "hinged-knee-brace", description: "Added stability for ligament recovery and sport return." },
    { name: "Knee Immobilizer", slug: "knee-immobilizer", description: "Full control in the early phase after surgery or acute injury." },
  ],
  Leg: [
    { name: "Calf Support", slug: "calf-support", description: "Compression for muscle fatigue, mild swelling and shin comfort." },
    { name: "Thigh Support", slug: "thigh-support", description: "Hamstring and quadriceps support during sport and rehab." },
    { name: "Varicose Vein Stockings", slug: "varicose-vein-stockings", description: "Graduated compression to support circulation on long days." },
  ],
  Neck: [
    { name: "Spondylosis Collar", slug: "spondylosis-collar", description: "Cervical support for stiffness, screen strain and spondylosis care." },
    { name: "Cervical Traction Kit", slug: "cervical-traction-kit", description: "Home traction option when advised as part of a broader plan." },
    { name: "Soft Cervical Collar", slug: "soft-cervical-collar", description: "Gentle reminder support rather than rigid immobilisation." },
  ],
  "Shin And Calf": [
    { name: "Calf Support", slug: "calf-support", description: "Compression for runners managing calf tightness and post-run soreness." },
    { name: "Shin Splint Support", slug: "shin-splint-support", description: "Targeted lower-leg support during return-to-running programmes." },
    { name: "Ankle Binder", slug: "ankle-binder", description: "Pairs with calf care when foot and ankle mechanics contribute to strain." },
  ],
  Shoulder: [
    { name: "Shoulder Immobilizer", slug: "shoulder-immobilizer", description: "Protects the joint after dislocation, fracture or rotator cuff repair." },
    { name: "Clavicle Brace", slug: "clavicle-brace", description: "Draws the shoulders back to support clavicle fracture alignment." },
    { name: "Arm Sling", slug: "arm-sling", description: "Unloads the shoulder while soft tissues recover." },
  ],
  Thigh: [
    { name: "Thigh Support", slug: "thigh-support", description: "Hamstring and quadriceps compression for sport and strain recovery." },
    { name: "Groin Support", slug: "groin-support", description: "Targeted compression for adductor and groin discomfort." },
    { name: "Knee Cap", slug: "knee-cap", description: "Useful when thigh strain changes knee tracking during movement." },
  ],
  Wrist: [
    { name: "Wrist Splint", slug: "wrist-splint", description: "Neutral wrist positioning for typing strain and acute flare-ups." },
    { name: "Wrist Wrap", slug: "wrist-wrap", description: "Adjustable compression for gym, sport and repetitive tasks." },
    { name: "Thumb Spica Splint", slug: "thumb-spica-splint", description: "Stabilises the thumb base when De Quervain or sprain is suspected." },
  ],
  "Orthopedic Aids": [
    { name: "Walking Stick", slug: "walking-stick", description: "Lightweight mobility aid for balance and reduced load on painful joints." },
    { name: "Walker", slug: "walker", description: "Stable four-point support during early rehab or frailty." },
    { name: "Crutches", slug: "crutches", description: "Temporary offloading for lower-limb injuries when prescribed." },
  ],
};

const ACTIVITY_PRODUCTS = {
  Walking: ["knee-cap", "ankle-binder", "lumbo-sacral-belt"],
  Running: ["knee-cap", "patella-support", "ankle-binder"],
  Gym: ["wrist-splint", "knee-cap", "lumbo-sacral-belt"],
  Yoga: ["knee-cap", "wrist-wrap", "spondylosis-collar"],
  Office: ["lumbo-sacral-belt", "wrist-splint", "spondylosis-collar"],
  Cycling: ["knee-cap", "wrist-splint", "lumbo-sacral-belt"],
  Tennis: ["elbow-support", "wrist-wrap", "knee-cap"],
  Football: ["knee-immobilizer", "ankle-binder", "thigh-support"],
  Aerobics: ["knee-cap", "ankle-binder", "wrist-wrap"],
  Athletics: ["knee-cap", "thigh-support", "ankle-binder"],
  Badminton: ["wrist-wrap", "knee-cap", "elbow-support"],
  Basketball: ["ankle-binder", "knee-cap", "thigh-support"],
  Cricket: ["lumbo-sacral-belt", "knee-cap", "elbow-support"],
  Golf: ["lumbo-sacral-belt", "wrist-splint", "elbow-support"],
  Volleyball: ["knee-cap", "ankle-binder", "thigh-support"],
  Sleep: ["spondylosis-collar", "lumbo-sacral-belt", "soft-cervical-collar"],
};

const ALL_PRODUCTS = Object.values(BODY_PART_PRODUCTS).flat();
const productBySlug = Object.fromEntries(ALL_PRODUCTS.map((p) => [p.slug, p]));

const DEFAULT_SLUGS = ["knee-cap", "lumbo-sacral-belt", "wrist-splint"];

function resolveCategoryName(slug, blogCategory) {
  return SLUG_TO_CATEGORY[slug] || blogCategory || "Knee";
}

export function enrichSupportProduct(product, blogCategory) {
  const catName = resolveCategoryName(product.slug, blogCategory);
  const cat = categoryByName[catName] || categoryByName.Knee;
  return {
    ...product,
    image: cat.image,
    color: cat.color,
    categoryName: cat.name,
    shopCategory: cat.query,
  };
}

function slugsToProducts(slugs, blogCategory) {
  return slugs
    .map((slug) => productBySlug[slug])
    .filter(Boolean)
    .map((p) => enrichSupportProduct(p, blogCategory));
}

export function getRecommendedProducts(blog) {
  const blogCategory = blog.category || blog.bodyPart;

  if (blog.type === "activity" && blog.activity) {
    const slugs = ACTIVITY_PRODUCTS[blog.activity] || DEFAULT_SLUGS;
    return slugsToProducts(slugs, blogCategory);
  }

  const list = BODY_PART_PRODUCTS[blogCategory] || slugsToProducts(DEFAULT_SLUGS, blogCategory);
  return list.map((p) => enrichSupportProduct(p, blogCategory));
}
