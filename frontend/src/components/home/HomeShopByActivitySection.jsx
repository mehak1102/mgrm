// import { useCallback, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import API from "../../api";
// import { activities } from "../../data/siteData";
// import { getActivityFallbackProducts } from "../../data/activityProductsData";
// import ActivityProductRail from "./ActivityProductRail";

// function normalizeProduct(p, fallbackImage) {
//   return {
//     name: p.name,
//     slug: p.slug,
//     image: p.images?.[0] || p.image || fallbackImage,
//     _id: p._id,
//   };
// }

// export default function HomeShopByActivitySection() {
//   const navigate = useNavigate();
//   const maskRef = useRef(null);
//   const [hoveredActivity, setHoveredActivity] = useState(null);
//   const [hoverAnchorX, setHoverAnchorX] = useState(null);
//   const [productMap, setProductMap] = useState({});
//   const cacheRef = useRef({});
//   const fetchRef = useRef(null);
//   const leaveTimerRef = useRef(null);

//   const loadProducts = useCallback(async (activityName) => {
//     if (cacheRef.current[activityName]) {
//       setProductMap((prev) => ({ ...prev, [activityName]: cacheRef.current[activityName] }));
//       return;
//     }

//     if (fetchRef.current) fetchRef.current.abort();
//     const controller = new AbortController();
//     fetchRef.current = controller;

//     try {
//       const res = await API.get(
//         `/products?activity=${encodeURIComponent(activityName)}`,
//         { signal: controller.signal }
//       );
//       const apiProducts = (res.data.products || []).slice(0, 3).map((p) => normalizeProduct(p, "/products/knee.png"));
//       const merged =
//         apiProducts.length >= 2
//           ? apiProducts
//           : getActivityFallbackProducts(activityName, 3).map((p) => ({
//               ...p,
//               image: p.image || "/products/knee.png",
//             }));

//       cacheRef.current[activityName] = merged;
//       setProductMap((prev) => ({ ...prev, [activityName]: merged }));
//     } catch (err) {
//       if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
//       const fallback = getActivityFallbackProducts(activityName, 3);
//       cacheRef.current[activityName] = fallback;
//       setProductMap((prev) => ({ ...prev, [activityName]: fallback }));
//     }
//   }, []);

//   const updateAnchor = (el) => {
//     if (!maskRef.current || !el) return;
//     const maskRect = maskRef.current.getBoundingClientRect();
//     const cardRect = el.getBoundingClientRect();
//     setHoverAnchorX(cardRect.left + cardRect.width / 2 - maskRect.left);
//   };

//   const handleEnter = (activityName, el) => {
//     if (leaveTimerRef.current) {
//       clearTimeout(leaveTimerRef.current);
//       leaveTimerRef.current = null;
//     }
//     updateAnchor(el);
//     setHoveredActivity(activityName);
//     loadProducts(activityName);
//   };

//   const handleLeave = () => {
//     leaveTimerRef.current = setTimeout(() => {
//       setHoveredActivity(null);
//       setHoverAnchorX(null);
//       leaveTimerRef.current = null;
//     }, 150);
//   };

//   return (
//     <section className="max-w-[1500px] mx-auto px-6 py-28">
//       <div className="flex justify-between items-end mb-10">
//         <div>
//           <p className="text-cyan-600 font-black tracking-widest">LIFESTYLE SUPPORT</p>
//           <h2 className="text-[58px] font-black mt-2 text-slate-900 dark:text-zinc-100">Shop By Activity</h2>
//         </div>

//         <Link
//           to="/shop-by-activity"
//           className="hidden md:block bg-card shadow-lg rounded-full px-6 py-3 font-black text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
//         >
//           View All →
//         </Link>
//       </div>

//       <div
//         ref={maskRef}
//         className="activity-mask overflow-x-hidden overflow-y-visible relative"
//         onMouseLeave={handleLeave}
//       >
//         <div className="activity-track flex gap-8 w-max marquee-activity py-8">
//           {[...activities, ...activities].map((item, index) => (
//             // <div
//             //   key={`${item.name}-${index}`}
//             //   className="relative shrink-0 snap-center overflow-visible"
//             //   onMouseEnter={(e) => handleEnter(item.name, e.currentTarget)}
//             //   onFocus={(e) => handleEnter(item.name, e.currentTarget)}
//             // >
//             <div
//   key={`${item.name}-${index}`}
//   className="relative shrink-0 snap-center overflow-visible"
//   onMouseEnter={(e) => {
//     handleEnter(item.name, e.currentTarget);

//     const video = e.currentTarget.querySelector("video");
//     video?.play();
//   }}
//   onMouseLeave={(e) => {
//     handleLeave();

//     const video = e.currentTarget.querySelector("video");
//     if (video) {
//       video.pause();
//       video.currentTime = 0;
//     }
//   }}
//   onFocus={(e) => handleEnter(item.name, e.currentTarget)}
// >
//               <motion.button
//                 type="button"
//                 initial={{ opacity: 0, y: 28 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: (index % activities.length) * 0.04 }}
//                 onClick={() =>
//                   navigate(`/shop-by-activity?activity=${encodeURIComponent(item.name)}`)
//                 }
//                 className="activity-card relative h-72 w-[280px] shrink-0 rounded-[32px] overflow-hidden group shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
//               >
//                 {/* <img
//                   src={item.image}
//                   alt=""
//                   className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
//                 /> */}
//                 <video
//   src={item.video}
//   autoPlay
//   muted
//   loop
//   playsInline
//   preload="metadata"
//   className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
// >
//   Your browser does not support the video tag.
// </video>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

//                 <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card dark:bg-zinc-900 rounded-full px-8 py-3 font-black shadow-xl group-hover:bg-fuchsia-600 group-hover:text-white transition">
//                   {item.name}
//                 </span>
//               </motion.button>
//             </div>
//           ))}
//         </div>

//         <ActivityProductRail
//           activity={hoveredActivity}
//           products={hoveredActivity ? productMap[hoveredActivity] : []}
//           anchorX={hoverAnchorX}
//         />
//       </div>
//     </section>
//   );
// }


import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import API from "../../api";
// import { activities } from "../../data/siteData";
import { activities, activitiess } from "../../data/siteData";
import { getActivityFallbackProducts } from "../../data/activityProductsData";
import ActivityProductRail from "./ActivityProductRail";

function normalizeProduct(p, fallbackImage) {
  return {
    name: p.name,
    slug: p.slug,
    image: p.images?.[0] || p.image || fallbackImage,
    _id: p._id,
  };
}

export default function HomeShopByActivitySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const maskRef = useRef(null);
  const [hoveredActivity, setHoveredActivity] = useState(null);
  const [hoverAnchorX, setHoverAnchorX] = useState(null);
  const [productMap, setProductMap] = useState({});
  const cacheRef = useRef({});
  const fetchRef = useRef(null);
  const leaveTimerRef = useRef(null);

  const loadProducts = useCallback(async (activityName) => {
    if (cacheRef.current[activityName]) {
      setProductMap((prev) => ({ ...prev, [activityName]: cacheRef.current[activityName] }));
      return;
    }

    if (fetchRef.current) fetchRef.current.abort();
    const controller = new AbortController();
    fetchRef.current = controller;

    try {
      const res = await API.get(
        `/products?activity=${encodeURIComponent(activityName)}`,
        { signal: controller.signal }
      );
      const apiProducts = (res.data.products || []).slice(0, 3).map((p) => normalizeProduct(p, "/products/knee.png"));
      const merged =
        apiProducts.length >= 2
          ? apiProducts
          : getActivityFallbackProducts(activityName, 3).map((p) => ({
              ...p,
              image: p.image || "/products/knee.png",
            }));

      cacheRef.current[activityName] = merged;
      setProductMap((prev) => ({ ...prev, [activityName]: merged }));
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      const fallback = getActivityFallbackProducts(activityName, 3);
      cacheRef.current[activityName] = fallback;
      setProductMap((prev) => ({ ...prev, [activityName]: fallback }));
    }
  }, []);

  const updateAnchor = (el) => {
    if (!maskRef.current || !el) return;
    const maskRect = maskRef.current.getBoundingClientRect();
    const cardRect = el.getBoundingClientRect();
    setHoverAnchorX(cardRect.left + cardRect.width / 2 - maskRect.left);
  };

  const handleEnter = (activityName, el) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    updateAnchor(el);
    setHoveredActivity(activityName);
    loadProducts(activityName);
  };

  const handleLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredActivity(null);
      setHoverAnchorX(null);
      leaveTimerRef.current = null;
    }, 150);
  };

  return (
    <section className="home-activity-section max-w-[1500px] mx-auto px-6 py-28">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="home-activity-label text-cyan-600 font-black tracking-widest">{t("homeSections.activityLabel")}</p>
          <h2 className="home-activity-heading text-[58px] font-black mt-2 text-slate-900 dark:text-zinc-100">{t("homeSections.activityTitle")}</h2>
        </div>

        <Link
          to="/shop-by-activity"
          className="home-activity-cta hidden md:block bg-card shadow-lg rounded-full px-6 py-3 font-black text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
        >
          {t("common.viewAll")}
        </Link>
      </div>

      <div
        ref={maskRef}
        className="activity-mask overflow-x-hidden overflow-y-visible relative"
        onMouseLeave={handleLeave}
      >
        <div className="activity-track flex gap-8 w-max marquee-activity py-8">
        {[...activities, ...activities].map((item, index) => {
  const activityImage =
    activitiess.find((a) => a.name === item.name)?.image;

  return (
          
            <div
  key={`${item.name}-${index}`}
  className="relative shrink-0 snap-center overflow-visible"
  onMouseEnter={(e) => {
    handleEnter(item.name, e.currentTarget);

    const video = e.currentTarget.querySelector("video");
    if (video && !video.getAttribute("src") && video.dataset.src) {
      video.setAttribute("src", video.dataset.src);
    }
    video?.play();
  }}
  onMouseLeave={(e) => {
    handleLeave();

    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }}
  onFocus={(e) => handleEnter(item.name, e.currentTarget)}
>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % activities.length) * 0.04 }}
                onClick={() =>
                  navigate(`/shop-by-activity?activity=${encodeURIComponent(item.name)}`)
                }
                className="activity-card relative h-72 w-[280px] shrink-0 rounded-[32px] overflow-hidden group shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
              >
                {/* <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                /> */}
                {/* <video
  src={item.video}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
>
  Your browser does not support the video tag.
</video> */}
<div className="relative w-full h-full">
  <img
    src={activityImage}
    alt={item.name}
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
  />

  <video
    data-src={item.video}
    muted
    loop
    playsInline
    preload="none"
    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
  />
</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                <span className="home-activity-chip absolute bottom-6 left-1/2 -translate-x-1/2 bg-card dark:bg-zinc-900 rounded-full px-8 py-3 font-black shadow-xl group-hover:bg-fuchsia-600 group-hover:text-white transition">
                  {item.name}
                </span>
              </motion.button>
            </div>
          // ))}
        );
      })}
        </div>

        <ActivityProductRail
          activity={hoveredActivity}
          products={hoveredActivity ? productMap[hoveredActivity] : []}
          anchorX={hoverAnchorX}
        />
      </div>
    </section>
  );
}
