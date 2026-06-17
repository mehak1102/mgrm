/** Vibrant poster palette — theme-aware card + shell tokens */

export function getPosterCardTheme(siteTheme) {
  if (siteTheme === "light") {
    return {
      isLight: true,
      border: "border-slate-200/90",
      bgBlur: "",
      bgOverlay: "bg-gradient-to-br from-white/50 via-white/20 to-slate-100/40",
      textScrim: "bg-gradient-to-t from-white/95 via-white/75 to-transparent",
      label: "text-slate-500",
      title: "text-slate-900",
      subtitle: "text-slate-600",
      iconStar: "text-amber-500",
      iconSparkle: "text-orange-500",
      settingsIcon: "text-slate-700",
      settingsBg: "bg-white/80 border-slate-200/80",
      settingsText: "text-slate-900",
      settingsMuted: "text-slate-500",
    };
  }
  return {
    isLight: false,
    border: "border-white/20",
    bgBlur: "scale-110 blur-lg opacity-95",
    bgOverlay: "bg-gradient-to-br from-white/12 via-transparent to-black/20",
    textScrim: "bg-gradient-to-t from-black/92 via-black/55 to-transparent",
    label: "text-white/80",
    title: "text-white",
    subtitle: "text-white/90",
    iconStar: "text-yellow-300",
    iconSparkle: "text-amber-200",
    settingsIcon: "text-white",
    settingsBg: "bg-white/15 border-white/25",
    settingsText: "text-white",
    settingsMuted: "text-white/90",
  };
}

export function getDashboardTheme(theme) {
  const vibrantBlobs = [
    { color: "rgba(59,130,246,0.35)", x: "5%", y: "5%", size: 480 },
    { color: "rgba(168,85,247,0.32)", x: "88%", y: "12%", size: 420 },
    { color: "rgba(6,182,212,0.28)", x: "72%", y: "68%", size: 500 },
    { color: "rgba(236,72,153,0.22)", x: "18%", y: "78%", size: 400 },
    { color: "rgba(249,115,22,0.18)", x: "48%", y: "42%", size: 360 },
  ];

  const lightBlobs = [
    { color: "rgba(191,219,254,0.7)", x: "8%", y: "10%", size: 440 },
    { color: "rgba(233,213,255,0.65)", x: "85%", y: "15%", size: 400 },
    { color: "rgba(165,243,252,0.55)", x: "55%", y: "70%", size: 480 },
    { color: "rgba(254,205,211,0.45)", x: "20%", y: "75%", size: 380 },
  ];

  const base = {
    accent: "text-cyan-300",
    stat: "text-white",
    muted: "text-white/80",
    label: "text-white/70",
    chip: "bg-white/10 border border-white/15 text-white backdrop-blur-xl",
    card: "bg-white/[0.08] backdrop-blur-3xl border border-white/12 shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
    headerBorder: "border-white/10",
    headerBg: "bg-black/35",
    closeBtn: "bg-white/12 hover:bg-white/20 text-white backdrop-blur-xl",
    panelBg: "bg-[#0c0c10]/92",
    panelText: "text-white",
    secondary: "text-[rgba(255,255,255,0.78)]",
    input:
      "w-full rounded-xl px-3 py-2.5 text-sm bg-black/20 border border-white/16 text-white placeholder:text-white/55 focus:border-cyan-300/55 focus:ring-2 focus:ring-cyan-300/20 outline-none",
    subtleAction: "text-cyan-200 hover:text-cyan-100 hover:bg-cyan-300/10",
    blobs: vibrantBlobs,
    poster: getPosterCardTheme("dark"),
  };

  if (theme === "blue") {
    return {
      id: "blue",
      shell: "bg-[#020817]",
      ...base,
      accent: "text-cyan-300",
      muted: "text-[rgba(255,255,255,0.55)]",
      secondary: "text-[rgba(255,255,255,0.78)]",
      chip: "bg-[#0b1931]/78 border border-cyan-300/20 text-white backdrop-blur-xl",
      card: "bg-[#0a162b]/72 backdrop-blur-3xl border border-cyan-300/18 shadow-[0_22px_70px_rgba(3,10,30,0.55)]",
      headerBorder: "border-cyan-300/16",
      headerBg: "bg-[#040d1f]/72",
      closeBtn: "bg-cyan-300/14 hover:bg-cyan-300/24 text-white backdrop-blur-xl",
      panelBg: "bg-[#061020]/96",
      panelText: "text-white",
      input:
        "w-full rounded-xl px-3 py-2.5 text-sm bg-[#081a34]/78 border border-cyan-300/25 text-white placeholder:text-white/55 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/25 outline-none",
      subtleAction: "text-cyan-200 hover:text-cyan-100 hover:bg-cyan-300/10",
      poster: getPosterCardTheme("blue"),
    };
  }
  if (theme === "dark") {
    return {
      id: "dark",
      shell: "bg-[#050508]",
      ...base,
      accent: "text-amber-300",
      poster: getPosterCardTheme("dark"),
      blobs: [
        { color: "rgba(255,136,0,0.28)", x: "8%", y: "8%", size: 460 },
        { color: "rgba(255,215,0,0.2)", x: "85%", y: "15%", size: 400 },
        { color: "rgba(168,85,247,0.25)", x: "60%", y: "70%", size: 480 },
        { color: "rgba(59,130,246,0.2)", x: "20%", y: "75%", size: 380 },
      ],
    };
  }
  return {
    id: "light",
    shell: "bg-gradient-to-br from-slate-50 via-blue-50/80 to-violet-100/60",
    accent: "text-indigo-600",
    stat: "text-slate-900",
    muted: "text-slate-600",
    label: "text-slate-500",
    chip: "bg-white/90 border border-slate-200 text-slate-800 shadow-sm",
    card: "bg-white/90 backdrop-blur-3xl border border-slate-200 shadow-lg",
    headerBorder: "border-slate-200/80",
    headerBg: "bg-white/75",
    closeBtn: "bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm backdrop-blur-xl",
    panelBg: "bg-white/95",
    panelText: "text-slate-900",
    secondary: "text-slate-600",
    input:
      "w-full rounded-xl px-3 py-2.5 text-sm bg-white/90 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none",
    subtleAction: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100",
    blobs: lightBlobs,
    poster: getPosterCardTheme("light"),
  };
}

/** Dark-theme poster washes */
export const POSTER_WASH_DARK = {
  shop: "linear-gradient(145deg, rgba(59,130,246,0.75) 0%, rgba(124,58,237,0.65) 45%, rgba(236,72,153,0.45) 100%)",
  categories: "linear-gradient(145deg, rgba(6,182,212,0.7) 0%, rgba(59,130,246,0.6) 50%, rgba(168,85,247,0.5) 100%)",
  featured: "linear-gradient(145deg, rgba(168,85,247,0.75) 0%, rgba(236,72,153,0.55) 60%, rgba(249,115,22,0.4) 100%)",
  recommended: "linear-gradient(145deg, rgba(249,115,22,0.7) 0%, rgba(236,72,153,0.55) 50%, rgba(124,58,237,0.5) 100%)",
  recovery: "linear-gradient(145deg, rgba(16,185,129,0.65) 0%, rgba(6,182,212,0.55) 50%, rgba(124,58,237,0.45) 100%)",
  orders: "linear-gradient(145deg, rgba(59,130,246,0.7) 0%, rgba(6,182,212,0.6) 100%)",
  wishlist: "linear-gradient(145deg, rgba(236,72,153,0.75) 0%, rgba(168,85,247,0.6) 100%)",
  profile: "linear-gradient(145deg, rgba(124,58,237,0.7) 0%, rgba(59,130,246,0.55) 50%, rgba(6,182,212,0.45) 100%)",
  addresses: "linear-gradient(145deg, rgba(6,182,212,0.65) 0%, rgba(59,130,246,0.55) 100%)",
  settings: "linear-gradient(145deg, rgba(30,41,59,0.85) 0%, rgba(51,65,85,0.75) 100%)",
};

/** Light-theme pastel washes */
export const POSTER_WASH_LIGHT = {
  shop: "linear-gradient(145deg, #dbeafe 0%, #e9d5ff 55%, #fce7f3 100%)",
  categories: "linear-gradient(145deg, #cffafe 0%, #dbeafe 50%, #ede9fe 100%)",
  featured: "linear-gradient(145deg, #ede9fe 0%, #fce7f3 55%, #ffedd5 100%)",
  recommended: "linear-gradient(145deg, #ffedd5 0%, #fce7f3 50%, #e9d5ff 100%)",
  recovery: "linear-gradient(145deg, #d1fae5 0%, #cffafe 50%, #ede9fe 100%)",
  orders: "linear-gradient(145deg, #dbeafe 0%, #cffafe 100%)",
  wishlist: "linear-gradient(145deg, #fce7f3 0%, #ede9fe 100%)",
  profile: "linear-gradient(145deg, #ede9fe 0%, #dbeafe 55%, #cffafe 100%)",
  addresses: "linear-gradient(145deg, #cffafe 0%, #dbeafe 100%)",
  settings: "linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)",
};

export function getPosterWash(siteTheme, key) {
  const map = siteTheme === "light" ? POSTER_WASH_LIGHT : POSTER_WASH_DARK;
  return map[key] || map.shop;
}

export const POSTER_GLOW = {
  shop: "0 24px 60px rgba(124,58,237,0.25)",
  categories: "0 24px 60px rgba(6,182,212,0.22)",
  featured: "0 24px 60px rgba(236,72,153,0.22)",
  recommended: "0 24px 60px rgba(249,115,22,0.2)",
  recovery: "0 24px 60px rgba(16,185,129,0.2)",
  orders: "0 20px 50px rgba(59,130,246,0.2)",
  wishlist: "0 20px 50px rgba(236,72,153,0.22)",
  profile: "0 24px 60px rgba(124,58,237,0.22)",
  addresses: "0 20px 50px rgba(6,182,212,0.18)",
  settings: "0 16px 40px rgba(15,23,42,0.1)",
};

export const SECTION_LABELS = {
  profile: "Profile",
  addresses: "Saved Addresses",
  orders: "My Orders",
  wishlist: "Wishlist",
  recovery: "Recovery Stories",
  settings: "Settings",
};

// backward compat
export const POSTER_WASH = POSTER_WASH_DARK;
