/** Hero map illustration — light map graphic at public/products/all.png */
export const STORE_MAP_BG = "/products/all.png";

export const STORE_LOCATIONS = [
  {
    id: "head-office-hyderabad",
    name: "MGRM Medicare Head Office",
    city: "Hyderabad",
    state: "Telangana",
    productTypes: ["Orthopedic", "Rehabilitation", "Distribution"],
    address: "Kushal Towers, 6-3-1090/A, Raj Bhavan Road, Khairatabad, Hyderabad – 500082",
    phone: "+91 40 2335 4321",
    email: "contact@mgrmmedicare.com",
    hours: "Mon – Sat: 9:00 AM – 6:00 PM",
    image: "/products/hyd.png",
    lat: 17.4239,
    lng: 78.4738,
  },
  {
    id: "registered-office-gurugram",
    name: "MGRM Medicare Registered Office",
    city: "Gurugram",
    state: "Haryana",
    productTypes: ["Corporate", "Distribution", "Orthopedic"],
    address: "Plot No. 243, Udyog Vihar, Phase-IV, Gurugram – 122015",
    phone: "+91 124 456 7890",
    email: "contact@mgrmmedicare.com",
    hours: "Mon – Fri: 9:30 AM – 5:30 PM",
    image: "/products/gur.png",
    lat: 28.4950,
    lng: 77.0826,
  },
  {
    id: "hyderabad-cherlapally",
    name: "MGRM Medicare, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    productTypes: ["Manufacturing", "Orthopedic", "Sports Support"],
    address: "Plot No. 12, Industrial Development Area, Cherlapally, Hyderabad – 500051",
    phone: "+91 40 2726 1100",
    email: "mgrmhyd@mgrm.com",
    hours: "Mon – Sat: 8:30 AM – 6:30 PM",
    image: "/products/cher.png",
    lat: 17.4615,
    lng: 78.6062,
  },
  {
    id: "surat",
    name: "MGRM Medicare, Surat",
    city: "Surat",
    state: "Gujarat",
    productTypes: ["Retail", "Orthopedic", "Compression"],
    address: "Shop No. 4, Adatiya Awas, Bombay Market, Umarwada, Surat – 395010",
    phone: "+91 261 234 5678",
    email: "contact@mgrmmedicare.com",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM",
    image: "/products/surat.png",
    lat: 21.1702,
    lng: 72.8311,
  },
  {
    id: "mumbai",
    name: "MGRM Medicare, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    productTypes: ["Retail", "Clinic Supply", "Orthopedic"],
    address: "Unit 302, Dhamji Shamji Udyog Bhavan, Veera Desai Road, Andheri (West), Mumbai – 400053",
    phone: "+91 22 2674 3210",
    email: "contact@mgrmmedicare.com",
    hours: "Mon – Sat: 10:00 AM – 7:00 PM",
    image: "/products/mumbai.png",
    lat: 19.1364,
    lng: 72.8296,
  },
  {
    id: "jadcherla",
    name: "MGRM Medicare, Works Jadcherla",
    city: "Jadcherla",
    state: "Telangana",
    productTypes: ["Manufacturing", "Quality Control", "Distribution"],
    address: "Green Industrial Park, Mahabubnagar District, Jadcherla – 509301",
    phone: "+91 8542 278 900",
    email: "mgrmhyd@mgrm.com",
    hours: "Mon – Sat: 8:00 AM – 5:00 PM",
    image: "/products/tel.png",
    lat: 16.7600,
    lng: 78.1300,
  },
];

export const INDIAN_STATES = [...new Set(STORE_LOCATIONS.map((s) => s.state))].sort();
export const STORE_CITIES = [...new Set(STORE_LOCATIONS.map((s) => s.city))].sort();
export const PRODUCT_TYPES = [...new Set(STORE_LOCATIONS.flatMap((s) => s.productTypes))].sort();

/** Pastel border + glow per store card (index matches STORE_LOCATIONS order) */
export const STORE_CARD_ACCENTS = [
  { border: "rgba(103, 232, 249, 0.55)", hover: "rgba(34, 211, 238, 0.95)", glow: "rgba(34, 211, 238, 0.38)" },
  { border: "rgba(196, 181, 253, 0.55)", hover: "rgba(167, 139, 250, 0.95)", glow: "rgba(167, 139, 250, 0.38)" },
  { border: "rgba(253, 186, 116, 0.55)", hover: "rgba(251, 146, 60, 0.95)", glow: "rgba(251, 146, 60, 0.35)" },
  { border: "rgba(244, 114, 182, 0.5)", hover: "rgba(236, 72, 153, 0.92)", glow: "rgba(244, 114, 182, 0.35)" },
  { border: "rgba(125, 211, 252, 0.55)", hover: "rgba(56, 189, 248, 0.95)", glow: "rgba(56, 189, 248, 0.38)" },
  { border: "rgba(134, 239, 172, 0.55)", hover: "rgba(74, 222, 128, 0.95)", glow: "rgba(74, 222, 128, 0.35)" },
];

export const WARRANTY_POLICY_SECTIONS = [
  {
    id: "limited-warranty",
    title: "Limited Warranty",
    icon: "shield",
    content: `MGRM Medicare products sold in India, Nepal, Sri Lanka, Malaysia, and Singapore carry a limited warranty against defects in materials and workmanship under normal use. This warranty applies only when products are purchased from authorized MGRM dealers or the official MGRM Medicare store.`,
  },
  {
    id: "exclusions",
    title: "What Is Not Covered",
    icon: "alert",
    content: `The warranty does not apply if the product was not purchased from an authorized dealer, has been altered in any way, or was not used according to the Wearing Instructions provided with the product. Accidental damage, neglect, improper assembly, or misuse are also excluded from coverage.`,
  },
  {
    id: "repair-replace",
    title: "Repair or Replacement",
    icon: "refresh",
    content: `At MGRM's sole discretion, defective products covered under this limited warranty will be repaired or replaced with an equivalent product. MGRM reserves the right to substitute products of equal or greater value if the original model is discontinued.`,
  },
  {
    id: "return-policy",
    title: "Return Policy",
    icon: "package",
    content: `Non-warranty returns are accepted within 90 days from the date of delivery or purchase. Please inspect your order upon receipt and notify us of any errors within five working days. Prior authorization and an original order number are required for all returns.`,
  },
  {
    id: "return-conditions",
    title: "Return Conditions",
    icon: "check",
    content: `Credit or replacement is subject to inspection upon return. Altered, used beyond trial fitting, or discounted clearance items are non-returnable. Products must be returned in original packaging with all accessories and documentation included.`,
  },
  {
    id: "regions",
    title: "Applicable Regions",
    icon: "globe",
    content: `This warranty information applies to MGRM Medicare products sold in India, Nepal, Sri Lanka, Malaysia, and Singapore. For products purchased in other regions, please contact your local authorized distributor for region-specific warranty terms.`,
  },
];

export const WARRANTY_COVERAGE_CARDS = [
  {
    title: "Limited Warranty",
    description: "Protection against manufacturing defects in materials and workmanship.",
    icon: "shield",
    iconGradient: "from-cyan-500 to-blue-600",
    iconColor: "text-white",
  },
  {
    title: "Replacement Policy",
    description: "Eligible products repaired or replaced at MGRM's discretion.",
    icon: "refresh",
    iconGradient: "from-violet-500 to-purple-600",
    iconColor: "text-white",
  },
  {
    title: "Manufacturing Defects",
    description: "Coverage for defects discovered during normal, intended product use.",
    icon: "check",
    iconGradient: "from-emerald-500 to-teal-600",
    iconColor: "text-white",
  },
  {
    title: "Product Support",
    description: "Dedicated assistance for sizing, fitting, and warranty claims.",
    icon: "headphones",
    iconGradient: "from-amber-400 to-orange-500",
    iconColor: "text-white",
  },
];
