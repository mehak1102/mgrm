import { mgrmCategories, activitiess } from "./siteData";
import { getBlogArticle, getBlogReadMinutes } from "./blog";

const BODY_PART_COPY = {
  Abdominal: {
    title: "Best Supports For Core Recovery",
    excerpt:
      "Understand abdominal belts and core supports for post-surgery comfort, stability during movement and guided recovery at home.",
  },
  "Ankle And Foot": {
    title: "Ankle & Foot Support Essentials",
    excerpt:
      "From sprains to daily stability — learn how ankle binders, walkers and foot supports protect mobility and speed up recovery.",
  },
  Arm: {
    title: "Arm Support & Immobilization Guide",
    excerpt:
      "Slings, braces and compression supports for arm injuries, fracture care and controlled rehabilitation with MGRM solutions.",
  },
  Back: {
    title: "Complete Guide To Back Support & Recovery",
    excerpt:
      "Lumbar belts, posture supports and clinical braces explained — for desk workers, lifting strain and chronic lower back discomfort.",
  },
  Chest: {
    title: "Chest & Rib Support Recovery Guide",
    excerpt:
      "Rib belts and chest supports for rib injuries, postural strain and breathing comfort during the healing process.",
  },
  Elbow: {
    title: "Elbow Pain Support & Prevention",
    excerpt:
      "Tennis elbow, repetitive strain and joint stability — choosing the right elbow brace for sports, work and daily activity.",
  },
  Finger: {
    title: "Finger Splint & Protection Guide",
    excerpt:
      "Finger splints for mallet finger, trigger finger and sports injuries — sizing, wear time and recovery best practices.",
  },
  Knee: {
    title: "How To Choose Knee Support",
    excerpt:
      "Knee caps, hinged braces and immobilizers compared — find the right support for pain, sports, surgery recovery and daily walking.",
  },
  Leg: {
    title: "Leg Compression & Support Guide",
    excerpt:
      "Compression sleeves and leg supports for circulation, muscle fatigue and confident movement during rehab and active days.",
  },
  Neck: {
    title: "Neck Pain Prevention Guide",
    excerpt:
      "Cervical collars, traction and posture supports for neck stiffness, spondylosis care and screen-time strain relief.",
  },
  "Shin And Calf": {
    title: "Shin & Calf Support For Active Recovery",
    excerpt:
      "Calf compression and shin supports for runners, walkers and anyone managing lower-leg strain or swelling.",
  },
  Shoulder: {
    title: "Shoulder Stability & Recovery Guide",
    excerpt:
      "Immobilizers, slings and clavicle braces for shoulder injuries, rotator cuff care and post-surgical protection.",
  },
  Thigh: {
    title: "Thigh Support For Sports & Rehab",
    excerpt:
      "Hamstring compression and thigh braces for gym training, field sports and muscle strain recovery.",
  },
  Wrist: {
    title: "Wrist Support For Daily & Sports Use",
    excerpt:
      "Splints and wraps for typing strain, carpal fatigue, gym workouts and wrist injury prevention.",
  },
  "Orthopedic Aids": {
    title: "Orthopedic Aids & Mobility Guide",
    excerpt:
      "Walking aids, splints and rehabilitation essentials — how scientifically designed orthopedic products support daily independence.",
  },
};

const ACTIVITY_COPY = {
  Aerobics: {
    title: "Aerobics Support & Joint Care",
    excerpt:
      "Low-impact joint protection for aerobics classes — knee, ankle and wrist supports that move with your routine.",
  },
  Athletics: {
    title: "Athletics Injury Prevention Guide",
    excerpt:
      "Track and field supports for sprinters and jumpers — stabilizing joints under high-intensity training loads.",
  },
  Badminton: {
    title: "Badminton Wrist & Knee Support",
    excerpt:
      "Racket sports demand quick pivots — protect wrists, elbows and knees during badminton sessions.",
  },
  Basketball: {
    title: "Basketball Ankle & Knee Protection",
    excerpt:
      "Jumping and lateral cuts need reliable support — braces and binders trusted by court athletes.",
  },
  Cricket: {
    title: "Cricket Support For Field & Batting",
    excerpt:
      "Back, knee and elbow supports for long innings, bowling strain and match-day confidence.",
  },
  Cycling: {
    title: "Cycling Support For Long Rides",
    excerpt:
      "Knee and lower-back supports for cyclists — comfort on climbs, commutes and endurance rides.",
  },
  Football: {
    title: "Football Joint Protection Guide",
    excerpt:
      "Ankle and knee supports built for pitch intensity — prevention and recovery for football players.",
  },
  Golf: {
    title: "Golf Posture & Wrist Support",
    excerpt:
      "Back and wrist supports for a smooth swing — reduce strain during practice and tournament play.",
  },
  Gym: {
    title: "Support For Training Recovery",
    excerpt:
      "Wrist wraps, lumbar belts and knee caps for lifting, HIIT and gym recovery — train with confidence.",
  },
  Running: {
    title: "Running Injury Prevention",
    excerpt:
      "Knee caps and ankle supports for runners — manage impact, patella tracking and post-run recovery.",
  },
  Tennis: {
    title: "Tennis Elbow & Wrist Support",
    excerpt:
      "Elbow braces and wrist wraps for racket sports — prevent overuse injuries and play longer.",
  },
  Volleyball: {
    title: "Volleyball Jump & Landing Support",
    excerpt:
      "Knee and ankle protection for repetitive jumps — supports designed for court athletes.",
  },
  Walking: {
    title: "Daily Walking Support Guide",
    excerpt:
      "Comfortable knee and ankle supports for daily walks — stability for seniors, commuters and active lifestyles.",
  },
  Yoga: {
    title: "Stretching + Recovery Support",
    excerpt:
      "Gentle knee and wrist supports for yoga practice — protect joints in poses without restricting flow.",
  },
  Sleep: {
    title: "Sleeping Support Guide",
    excerpt:
      "Neck collars and lumbar supports for better sleep posture — wake up with less stiffness and strain.",
  },
  Office: {
    title: "Posture & Work Support",
    excerpt:
      "Lumbar belts and wrist splints for desk workers — ergonomic support for long sitting and typing hours.",
  },
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function normalizeBlog(blog) {
  const coverImage = blog.coverImage || blog.image;
  const normalized = {
    ...blog,
    coverImage,
    image: coverImage,
    featured: !!blog.featured,
    publishedAt: blog.publishedAt || daysAgo(14),
  };
  return {
    ...normalized,
    readTime: blog.readTime ?? getBlogReadMinutes(normalized),
  };
}

export function generateBodyPartBlogs() {
  return mgrmCategories.map((cat, index) => {
    const copy = BODY_PART_COPY[cat.name] || {
      title: `Complete ${cat.name} Support Guide`,
      excerpt: `Expert MGRM guidance on ${cat.name.toLowerCase()} supports — sizing, daily use and recovery best practices.`,
    };

    return normalizeBlog({
      slug: slugify(copy.title),
      title: copy.title,
      excerpt: copy.excerpt,
      coverImage: cat.image,
      category: cat.name,
      type: "bodyPart",
      bodyPart: cat.query,
      activity: null,
      color: cat.color,
      relatedProducts: [],
      featured: index === 0,
      publishedAt: daysAgo(2 + index),
    });
  });
}

export function generateActivityBlogs() {
  return activitiess.map((act, index) => {
    const copy = ACTIVITY_COPY[act.name] || {
      title: `${act.name} Support & Recovery Guide`,
      excerpt: `Lifestyle supports for ${act.name.toLowerCase()} — injury prevention, comfort and MGRM recovery essentials.`,
    };

    return normalizeBlog({
      slug: slugify(`${act.name}-${copy.title}`),
      title: copy.title,
      excerpt: copy.excerpt,
      coverImage: act.image,
      category: act.name,
      type: "activity",
      bodyPart: null,
      activity: act.name,
      color: null,
      relatedProducts: [],
      featured: false,
      publishedAt: daysAgo(20 + index),
    });
  });
}

export function combineBlogs() {
  return [...generateBodyPartBlogs(), ...generateActivityBlogs()];
}

let _cache = null;

export function getAllBlogs() {
  if (!_cache) _cache = combineBlogs();
  return _cache;
}

export function getBodyPartBlogs() {
  return generateBodyPartBlogs();
}

export function getActivityBlogs() {
  return generateActivityBlogs();
}

export function getBlogBySlug(slug) {
  return getAllBlogs().find((b) => b.slug === slug) || null;
}

export function getFeaturedBlog() {
  return getBodyPartBlogs()[0] || null;
}

export function getBodyPartStripItems() {
  return getBodyPartBlogs().map((blog) => ({
    name: blog.category,
    query: blog.bodyPart,
    image: blog.coverImage,
    count: 1,
    slug: blog.slug,
  }));
}

export function filterBlogsByType(type = "bodyPart") {
  if (type === "all") return getAllBlogs();
  if (type === "activity") return getActivityBlogs();
  return getBodyPartBlogs();
}

export function getBlogContent(blog) {
  return getBlogArticle(blog);
}

export function getBlogsForProduct(product) {
  if (!product) return [];
  const category = product.category || "";
  const byBody = getBodyPartBlogs().filter(
    (b) =>
      b.bodyPart === category ||
      category.toLowerCase().includes(b.category?.toLowerCase() || "")
  );
  return byBody.slice(0, 3);
}
