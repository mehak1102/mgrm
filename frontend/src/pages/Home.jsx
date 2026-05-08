// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight, Search, ShieldCheck, Truck, RotateCcw, BadgeCheck } from "lucide-react";
// import API from "../api";
// import ProductCard from "../components/ProductCard";
// import { activities, blogs, bodyCategories } from "../data/siteData";
// import BodyFlowMap from "../components/BodyFlowMap";

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     API.get("/products")
//       .then((res) => setProducts(res.data.products || []))
//       .catch(() => setProducts([]));
//   }, []);

//   const goCategory = (category) => {
//     navigate(`/shop?category=${encodeURIComponent(category)}`);
//   };

//   return (
//     <main className="overflow-hidden bg-white">
// <section className="relative min-h-[92vh] pt-10 pb-20 overflow-hidden">
//   {/* BACKGROUND VIDEO */}
//   <video
//     className="absolute inset-0 w-full h-full object-cover opacity-[0.90]"
//     src="/videos/hero.mp4"
//     autoPlay
//     muted
//     loop
//     playsInline
//   />

//   {/* VIDEO OVERLAY */}
//   {/* <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/88 to-white/96" />
//    */}
//    <div className="absolute inset-0 bg-gradient-to-b from-white/78 via-white/60 to-white/82" />
//   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,167,220,0.16),transparent_45%)]" />

//   <div className="relative max-w-[1500px] mx-auto px-6">
//     <motion.h1
//       initial={{ opacity: 0, y: 35 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="text-[42px] md:text-[74px] leading-[0.95] font-black tracking-tight text-gray-700 max-w-6xl pt-4"
//     >
//       <span className="text-red-500">248</span> top certified products
//       {/* <br /> to heal and rehabilitate comfortably */}
//     </motion.h1>

//     <div className="grid lg:grid-cols-[330px_1fr_330px] gap-10 items-center mt-12">
//       {/* LEFT CATEGORY CARDS */}
//       <div className="space-y-4">
//         {bodyCategories.slice(0, 5).map((cat, index) => (
//           <motion.button
//             key={cat.name}
//             initial={{ opacity: 0, x: -35 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: index * 0.08 }}
//             onClick={() => goCategory(cat.query || cat.category || cat.name)}
//             className="w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 backdrop-blur-xl border border-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:bg-white transition"
//           >
//             <span
//               className="text-3xl font-light"
//               style={{ color: cat.color }}
//             >
//               {String(index + 1).padStart(2, "0")}
//             </span>

//             <div
//               className="w-16 h-16 rounded-2xl grid place-items-center"
//               style={{ background: `${cat.color}22` }}
//             >
//               <img
//                 src={cat.image}
//                 onError={(e) => {
//                   e.currentTarget.src = "/products/knee.png";
//                 }}
//                 className="w-14 h-14 object-cover rounded-xl"
//               />
//             </div>

//             <div>
//               <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
//               <p className="text-sm text-gray-500">{cat.count} products</p>
//             </div>
//           </motion.button>
//         ))}
//       </div>

//       {/* CENTER BODY */}
//       <div className="relative h-[690px] flex justify-center items-center rounded-[46px] bg-white/60 backdrop-blur-xl border border-white shadow-[0_35px_120px_rgba(15,23,42,0.10)] overflow-hidden">
//         <div className="absolute w-[560px] h-[560px] rounded-full bg-cyan-100/40 blur-3xl" />
//         <div className="absolute inset-x-20 top-12 h-24 bg-white/70 blur-3xl" />

//         <img
//           src="/products/body.png"
//           onError={(e) => {
//             e.currentTarget.src =
//               "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=80";
//           }}
//           className="relative z-10 h-[640px] object-contain floaty"
//         />

//         {bodyCategories.slice(0, 15).map((cat, index) => {
//           const positions = [
//             ["51%", "13%"],
//             ["41%", "24%"],
//             ["58%", "25%"],
//             ["66%", "36%"],
//             ["47%", "38%"],
//             ["57%", "45%"],
//             ["61%", "62%"],
//             ["58%", "84%"],
//             ["43%", "70%"],
//             ["51%", "20%"],
//             ["54%", "76%"],
//             ["38%", "31%"],
//             ["45%", "60%"],
//             ["64%", "43%"],
//             ["49%", "50%"],
//           ];

//           const [left, top] = positions[index] || ["50%", "50%"];

//           return (
//             <motion.button
//               key={cat.name}
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.35 + index * 0.05 }}
//               onClick={() => goCategory(cat.query || cat.category || cat.name)}
//               className="absolute z-20 group"
//               style={{ left, top }}
//               title={cat.name}
//             >
//               <span
//                 className="absolute inset-0 rounded-full animate-ping opacity-30"
//                 style={{ background: cat.color }}
//               />
//               <span
//                 className="relative w-7 h-7 rounded-full border-2 border-white shadow-lg grid place-items-center text-[10px] font-black text-white transition group-hover:scale-125"
//                 style={{ background: cat.color }}
//               >
//                 {String(index + 1).padStart(2, "0")}
//               </span>

//               <span className="absolute left-8 top-0 whitespace-nowrap rounded-full bg-black/80 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition">
//                 {cat.name}
//               </span>
//             </motion.button>
//           );
//         })}
//       </div>

//       {/* RIGHT CATEGORY CARDS */}
//       <div className="space-y-4">
//         {bodyCategories.slice(5, 10).map((cat, i) => {
//           const index = i + 5;

//           return (
//             <motion.button
//               key={cat.name}
//               initial={{ opacity: 0, x: 35 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.08 }}
//               onClick={() => goCategory(cat.query || cat.category || cat.name)}
//               className="w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 backdrop-blur-xl border border-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:bg-white transition"
//             >
//               <span
//                 className="text-3xl font-light"
//                 style={{ color: cat.color }}
//               >
//                 {String(index + 1).padStart(2, "0")}
//               </span>

//               <div
//                 className="w-16 h-16 rounded-2xl grid place-items-center"
//                 style={{ background: `${cat.color}22` }}
//               >
//                 <img
//                   src={cat.image}
//                   onError={(e) => {
//                     e.currentTarget.src = "/products/knee.png";
//                   }}
//                   className="w-14 h-14 object-cover rounded-xl"
//                 />
//               </div>

//               <div>
//                 <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
//                 <p className="text-sm text-gray-500">{cat.count} products</p>
//               </div>
//             </motion.button>
//           );
//         })}
//       </div>
//     </div>

//     {/* BOTTOM EXTRA CATEGORIES */}
//     <div className="mt-10 flex flex-wrap justify-center gap-3">
//       {bodyCategories.slice(10).map((cat, i) => {
//         const index = i + 10;

//         return (
//           <motion.button
//             key={cat.name}
//             initial={{ opacity: 0, y: 18 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.07 }}
//             onClick={() => goCategory(cat.query || cat.category || cat.name)}
//             className="rounded-full px-5 py-3 font-bold shadow-md hover:scale-105 transition bg-white/80 backdrop-blur border"
//             style={{ borderColor: `${cat.color}66`, color: cat.color }}
//           >
//             {String(index + 1).padStart(2, "0")} &nbsp; {cat.name}
//           </motion.button>
//         );
//       })}
//     </div>
//   </div>
// </section>
// <BodyFlowMap />
//       <section className="max-w-7xl mx-auto px-5 py-16">
//         <div className="grid md:grid-cols-4 gap-5">
//           {[
//             ["Certified Products", ShieldCheck],
//             ["Free Shipping", Truck],
//             ["Easy Returns", RotateCcw],
//             ["Original MGRM", BadgeCheck],
//           ].map(([text, Icon]) => (
//             <div key={text} className="card rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 transition">
//               <Icon className="text-cyan-600" />
//               <b>{text}</b>
//             </div>
//           ))}
//         </div>
//       </section>

//      {/* BEST SELLERS */}
// <section className="relative max-w-[1500px] mx-auto px-6 py-20 overflow-hidden">
//   <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 rounded-[50px]" />

//   <div className="relative flex justify-between items-end mb-10">
//     <div>
//       <p className="text-cyan-600 font-black tracking-widest">TOP CATEGORIES</p>
//       <h2 className="text-5xl font-black mt-2">Best Sellers</h2>
//       <p className="text-gray-500 mt-3">Most trusted support categories for daily recovery.</p>
//     </div>

//     <div className="hidden md:flex gap-3 text-gray-400">
//       <button className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center">
//         <ChevronLeft size={26} />
//       </button>
//       <button className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center">
//         <ChevronRight size={26} />
//       </button>
//     </div>
//   </div>

//   <div className="relative overflow-hidden">
//     <div className="flex gap-10 w-max marquee py-4">
//       {[...bodyCategories, ...bodyCategories].map((cat, i) => (
//         <button
//           key={`${cat.name}-${i}`}
//           onClick={() => goCategory(cat.query || cat.category || cat.name)}
//           className="w-52 shrink-0 text-center group"
//         >
//           <div className="relative w-48 h-48 mx-auto rounded-full bg-white shadow-[0_25px_70px_rgba(15,23,42,0.12)] overflow-hidden border border-white group-hover:-translate-y-2 transition duration-500">
//             <div
//               className="absolute inset-3 rounded-full opacity-25"
//               style={{ background: cat.color }}
//             />
//             <img
//               src={cat.image}
//               onError={(e) => (e.currentTarget.src = "/products/knee.png")}
//               className="relative w-full h-full object-cover group-hover:scale-110 transition duration-700"
//             />
//           </div>

//           <h3 className="mt-5 text-xl font-black">{cat.name}</h3>
//           <p className="text-gray-500 mt-1">{cat.count} items</p>
//         </button>
//       ))}
//     </div>
//   </div>
// </section>

// {/* LOCATE PAIN AREA */}
// <section className="relative max-w-[1400px] mx-auto px-6 py-20">
//   <div className="text-center mb-12">
//     <p className="text-cyan-600 font-black tracking-widest">BODY-BASED SEARCH</p>
//     <h2 className="text-5xl font-black mt-2">Locate Your Pain Area</h2>
//     <p className="text-gray-500 mt-3 text-lg">Get the right support where you need it</p>
//   </div>

//   <div className="relative rounded-[42px] overflow-hidden shadow-[0_35px_100px_rgba(15,23,42,0.18)]">
//    <img
//   src="/products/pain-area.png"
//   onError={(e) => {
//     e.currentTarget.src = "/products/body-blue.png";
//   }}
//   className="w-full h-[760px] object-contain bg-white"
// />

//     <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/50 via-transparent to-blue-950/35" />

//     {/* {bodyCategories.slice(0, 10).map((cat, i) => (
//        */}
//        {[
//   bodyCategories.find((c) => c.query === "Neck"),
//   bodyCategories.find((c) => c.query === "Shoulder"),
//   bodyCategories.find((c) => c.query === "Arm"),
//   bodyCategories.find((c) => c.query === "Abdominal"),
//   bodyCategories.find((c) => c.query === "Thigh"),
//   bodyCategories.find((c) => c.query === "Knee"),
//   bodyCategories.find((c) => c.query === "Shin And Calf"),
//   bodyCategories.find((c) => c.query === "Ankle And Foot"),
//   bodyCategories.find((c) => c.query === "Leg"),
//   bodyCategories.find((c) => c.query === "Back"),
// ].filter(Boolean).map((cat, i) => (
//       <button
//         key={cat.name}
//         onClick={() => goCategory(cat.query || cat.category || cat.name)}
//         className="absolute group"
//         // style={{
//         //   left: ["46%", "38%", "57%", "50%", "42%", "58%", "61%", "60%", "43%", "48%"][i],
//         //   top: ["20%", "31%", "29%", "43%", "56%", "54%", "76%", "87%", "72%", "18%"][i],
//         // }}
//         style={{
//   left: [
//     "50%", // 01 Neck
//     "46%", // 02 Shoulder
//     "58%", // 03 Arm / Elbow
//     "52%", // 04 Abdomen
//     "44%", // 05 Hip / Thigh
//     "55%", // 06 Knee
//     "54%", // 07 Shin / Calf
//     "55%", // 08 Ankle / Foot
//     "45%", // 09 Leg
//     "51%", // 10 Upper back / neck
//   ][i],
//   top: [
//     "12%", // 01 Neck
//     "26%", // 02 Shoulder
//     "30%", // 03 Arm / Elbow
//     "43%", // 04 Abdomen
//     "56%", // 05 Hip / Thigh
//     "63%", // 06 Knee
//     "77%", // 07 Shin / Calf
//     "90%", // 08 Ankle / Foot
//     "69%", // 09 Leg
//     "20%", // 10 Upper back
//   ][i],
// }}
//         title={cat.name}
//       >
//         <span
//           className="absolute inset-0 rounded-full animate-ping opacity-40"
//           style={{ background: cat.color }}
//         />
//         <span
//           className="relative w-12 h-12 rounded-full border-2 border-white shadow-xl grid place-items-center text-white text-xs font-black group-hover:scale-125 transition"
//           style={{ background: cat.color }}
//         >
//           {String(i + 1).padStart(2, "0")}
//         </span>

//         <span className="absolute left-14 top-1 whitespace-nowrap bg-white text-gray-900 rounded-full px-4 py-2 font-bold text-sm opacity-0 group-hover:opacity-100 transition shadow-lg">
//           {cat.name}
//         </span>
//       </button>
//     ))}

//     <div className="absolute left-8 bottom-8 bg-white/90 backdrop-blur-xl rounded-3xl p-6 max-w-sm shadow-xl">
//       <p className="text-cyan-600 font-black text-sm">SMART GUIDE</p>
//       <h3 className="text-3xl font-black mt-1">Find support faster</h3>
//       <p className="text-gray-500 mt-2">Tap any pain point and jump directly to matching products.</p>
//     </div>
//   </div>
// </section>

// {/* SHOP BY ACTIVITY */}
// <section className="max-w-[1500px] mx-auto px-6 py-20">
//   <div className="flex justify-between items-end mb-10">
//     <div>
//       <p className="text-cyan-600 font-black tracking-widest">LIFESTYLE SUPPORT</p>
//       <h2 className="text-5xl font-black mt-2">Shop By Activity</h2>
//     </div>

//     <div className="hidden md:flex gap-3 text-gray-400">
//       <ChevronLeft size={32} />
//       <ChevronRight size={32} />
//     </div>
//   </div>

//   {/* <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8"> */}
//   {/* <div className="overflow-hidden relative">
//   <div className="flex gap-8 w-max marquee-activity py-4"> */}
//   <div className="activity-mask overflow-hidden relative">
//   <div className="activity-track flex gap-8 w-max marquee-activity py-8 snap-x snap-mandatory">
//     {/* {activities.map((item, index) => ( */}
//     {[...activities, ...activities].map((item, index) => (
//       <motion.button
//         key={item.name}
//         initial={{ opacity: 0, y: 28 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.08 }}
//         onClick={() => navigate(`/shop?search=${item.name}`)}
//         // className="relative h-72 rounded-[28px] overflow-hidden group shadow-[0_25px_70px_rgba(15,23,42,0.12)]"
//         // className="relative h-64 w-[260px] shrink-0 rounded-[28px] overflow-hidden group shadow-[0_25px_70px_rgba(15,23,42,0.12)]"
//         className="activity-card relative h-72 w-[280px] shrink-0 snap-center rounded-[32px] overflow-hidden group shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
//       >
//         <img
//           src={item.image}
//           className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

//         <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-8 py-3 font-black shadow-xl group-hover:bg-fuchsia-600 group-hover:text-white transition">
//           {item.name}
//         </span>
//       </motion.button>
      
//     ))}
//       </div>
//   </div>
// </section>

// {/* FEATURED PRODUCTS */}
// <section className="relative max-w-7xl mx-auto px-5 py-20">
//   <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-[50px]" />

//   <div className="relative flex justify-between items-end mb-10">
//     <div>
//       <p className="text-cyan-600 font-black tracking-widest">FEATURED PRODUCTS</p>
//       <h2 className="text-5xl font-black mt-2">Recommended Supports</h2>
//       <p className="text-gray-500 mt-3">Handpicked supports for comfort, stability and recovery.</p>
//     </div>

//     <Link to="/shop" className="btn-primary px-6 py-3 rounded-full font-black shadow-lg">
//       View all
//     </Link>
//   </div>

//   <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
//     {products.slice(0, 8).map((p) => (
//       <ProductCard key={p._id} product={p} />
//     ))}
//   </div>
// </section>

// {/* BLOGS */}
// <section className="max-w-7xl mx-auto px-5 py-20">
//   <div className="mb-10">
//     <p className="text-cyan-600 font-black tracking-widest">LEARN & RECOVER</p>
//     <h2 className="text-5xl font-black mt-2">Health Blogs & Guides</h2>
//   </div>

//   <div className="grid md:grid-cols-3 gap-8">
//     {blogs.map((blog, index) => (
//       <motion.article
//         key={blog.title}
//         initial={{ opacity: 0, y: 28 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.1 }}
//         className="group bg-white rounded-[34px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500"
//       >
//         <div className="h-64 overflow-hidden">
//           <img
//             src={blog.image}
//             onError={(e) => (e.currentTarget.src = "/products/knee.png")}
//             className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
//           />
//         </div>

//         <div className="p-7">
//           <span className="text-cyan-600 font-black text-sm">{blog.tag}</span>
//           <h3 className="text-2xl font-black mt-3">{blog.title}</h3>
//           <p className="text-gray-500 mt-3">
//             Learn how to choose, wear and care for your support product.
//           </p>

//           <button className="mt-5 font-black text-cyan-600">
//             Read guide →
//           </button>
//         </div>
//       </motion.article>
//     ))}
//   </div>
// </section>


//     </main>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  Award,
  CheckCircle2,
} from "lucide-react";
import API from "../api";
import ProductCard from "../components/ProductCard";
// import { activities, blogs, bodyCategories } from "../data/siteData";
import { activities, bodyCategories } from "../data/siteData";
import { blogPosts } from "../data/blogData";
import BodyFlowMap from "../components/BodyFlowMap";
import FloatingMedicalBg from "../components/FloatingMedicalBg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [productStart, setProductStart] = useState(0);
  const [blogStart, setBlogStart] = useState(0);
  const navigate = useNavigate();

  const certifications = [
  {
    title: "ISO Certified",
    subtitle: "International quality standards",
    image: "/certifications/iso.png",
    glow: "cyan",
  },
  {
    title: "WHO-GMP",
    subtitle: "Global manufacturing compliance",
    image: "/certifications/who-gmp.png",
    glow: "emerald",
  },
  {
    title: "FDA Approved",
    subtitle: "Trusted medical safety",
    image: "/certifications/fda.png",
    glow: "fuchsia",
  },
  {
    title: "Quality Brands",
    subtitle: "Recognized healthcare excellence",
    image: "/certifications/quality.png",
    glow: "orange",
  },
  {
    title: "CE Certified",
    subtitle: "European conformity standards",
    image: "/certifications/ce.png",
    glow: "slate",
  },
];

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const goCategory = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const nextProducts = () => {
    if (productStart + 4 < products.length) {
      setProductStart(productStart + 4);
    }
  };

  const prevProducts = () => {
    if (productStart - 4 >= 0) {
      setProductStart(productStart - 4);
    }
  };

  const nextBlogs = () => {
    // if (blogStart + 4 < blogs.length) {
    if (blogStart + 4 < blogPosts.length) {
      setBlogStart(blogStart + 4);
    }
  };

  const prevBlogs = () => {
    if (blogStart - 4 >= 0) {
      setBlogStart(blogStart - 4);
    }
  };

  return (
    <main className="relative overflow-hidden bg-white">
      <FloatingMedicalBg />

      <div className="relative z-10">
        {/* HERO */}
        <section className="relative min-h-[92vh] pt-10 pb-20 overflow-hidden">
        {/* <section className="relative min-h-screen pt-10 pb-20 overflow-hidden bg-white"> */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-[0.90]"
      
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/78 via-white/60 to-white/82" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,167,220,0.16),transparent_45%)]" />

          <div className="relative max-w-[1500px] mx-auto px-6">
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[42px] md:text-[74px] leading-[0.95] font-black tracking-tight text-gray-700 max-w-6xl pt-4"
              // className="text-[34px] sm:text-[46px] md:text-[64px] xl:text-[74px] leading-[0.95] font-black tracking-tight text-gray-700 max-w-6xl pt-4"
            >
              <span className="text-red-500">248</span> top certified products
            </motion.h1>

            <div className="grid lg:grid-cols-[330px_1fr_330px] gap-10 items-center mt-12">
              <div className="space-y-4">
                {bodyCategories.slice(0, 5).map((cat, index) => (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, x: -35 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => goCategory(cat.query || cat.category || cat.name)}
                    className="w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 backdrop-blur-xl border border-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:bg-white transition"
                  >
                    <span className="text-3xl font-light" style={{ color: cat.color }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div
                      className="w-16 h-16 rounded-2xl grid place-items-center"
                      style={{ background: `${cat.color}22` }}
                    >
                      <img
                        src={cat.image}
                        onError={(e) => {
                          e.currentTarget.src = "/products/knee.png";
                        }}
                        className="w-14 h-14 object-cover rounded-xl"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
                      <p className="text-sm text-gray-500">{cat.count} products</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="relative h-[690px] flex justify-center items-center rounded-[46px] bg-white/60 backdrop-blur-xl border border-white shadow-[0_35px_120px_rgba(15,23,42,0.10)] overflow-hidden">
                <div className="absolute w-[560px] h-[560px] rounded-full bg-cyan-100/40 blur-3xl" />
                <div className="absolute inset-x-20 top-12 h-24 bg-white/70 blur-3xl" />

                <img
                  src="/products/body.png"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=80";
                  }}
                  className="relative z-10 h-[640px] object-contain floaty"
                />

                {bodyCategories.slice(0, 15).map((cat, index) => {
                  const positions = [
                    ["51%", "13%"],
                    ["41%", "24%"],
                    ["58%", "25%"],
                    ["66%", "36%"],
                    ["47%", "38%"],
                    ["57%", "45%"],
                    ["61%", "62%"],
                    ["58%", "84%"],
                    ["43%", "70%"],
                    ["51%", "20%"],
                    ["54%", "76%"],
                    ["38%", "31%"],
                    ["45%", "60%"],
                    ["64%", "43%"],
                    ["49%", "50%"],
                  ];

                  const [left, top] = positions[index] || ["50%", "50%"];

                  return (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      onClick={() => goCategory(cat.query || cat.category || cat.name)}
                      className="absolute z-20 group"
                      style={{ left, top }}
                      title={cat.name}
                    >
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ background: cat.color }}
                      />
                      <span
                        className="relative w-7 h-7 rounded-full border-2 border-white shadow-lg grid place-items-center text-[10px] font-black text-white transition group-hover:scale-125"
                        style={{ background: cat.color }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="absolute left-8 top-0 whitespace-nowrap rounded-full bg-black/80 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition">
                        {cat.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {bodyCategories.slice(5, 10).map((cat, i) => {
                  const index = i + 5;

                  return (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, x: 35 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => goCategory(cat.query || cat.category || cat.name)}
                      className="w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 backdrop-blur-xl border border-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:bg-white transition"
                    >
                      <span className="text-3xl font-light" style={{ color: cat.color }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div
                        className="w-16 h-16 rounded-2xl grid place-items-center"
                        style={{ background: `${cat.color}22` }}
                      >
                        <img
                          src={cat.image}
                          onError={(e) => {
                            e.currentTarget.src = "/products/knee.png";
                          }}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{cat.count} products</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {bodyCategories.slice(10).map((cat, i) => {
                const index = i + 10;

                return (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => goCategory(cat.query || cat.category || cat.name)}
                    className="rounded-full px-5 py-3 font-bold shadow-md hover:scale-105 transition bg-white/80 backdrop-blur border"
                    style={{ borderColor: `${cat.color}66`, color: cat.color }}
                  >
                    {String(index + 1).padStart(2, "0")} &nbsp; {cat.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        <BodyFlowMap />

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="grid md:grid-cols-4 gap-5">
            {[
              ["Certified Products", ShieldCheck],
              ["Free Shipping", Truck],
              ["Easy Returns", RotateCcw],
              ["Original MGRM", BadgeCheck],
            ].map(([text, Icon]) => (
              <div
                key={text}
                className="card rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 transition"
              >
                <Icon className="text-cyan-600" />
                <b>{text}</b>
              </div>
            ))}
          </div>
        </section>


        {/* GLOBAL CERTIFICATIONS */}
<section className="relative max-w-[1500px] mx-auto px-6 py-20 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 rounded-[50px]" />

  <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
    
    {/* LEFT */}
    <div className="overflow-hidden">
      <div className="flex gap-7 w-max marquee-cert py-4">
        {[...certifications, ...certifications].map((item, i) => {
          // const Icon = item.icon;

          return (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % certifications.length) * 0.08 }}
              className="w-[280px] shrink-0 rounded-[34px] bg-white/85 backdrop-blur-xl border border-white shadow-[0_25px_70px_rgba(15,23,42,0.10)] p-7 group hover:-translate-y-2 transition duration-500"
            >
              {/* <div
                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition`}
              >
                <Icon size={38} strokeWidth={2.3} />
              </div> */}
<div
  // className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition"
  className="w-28 h-28 rounded-[30px] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] flex items-center justify-center border border-slate-100 group-hover:scale-110 transition"
>
  <img
    src={item.image}
    alt={item.title}
    // className="w-16 h-16 object-contain"
    className="w-20 h-20 object-contain"
  />
</div>
              <h3 className="mt-6 text-2xl font-black text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-slate-500 leading-7">
                {item.subtitle}
              </p>

              <div className="mt-5 flex items-center gap-2 text-emerald-600 font-black text-sm">
                <CheckCircle2 size={16} />
                Verified Standard
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>

    {/* RIGHT */}
    <div className="relative">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl" />

      <div className="relative bg-white/80 backdrop-blur-xl rounded-[40px] p-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] border border-white">
        <p className="text-emerald-600 font-black tracking-[0.25em] text-sm">
          TRUST & SAFETY
        </p>

        <h2 className="text-5xl font-black mt-4 leading-tight text-slate-900">
          Expect The <br /> Best
        </h2>

        <p className="mt-6 text-lg text-slate-500 leading-8">
          MGRM’s strong focus on quality ensures every orthopedic and
          recovery product meets internationally recognized healthcare
          standards for comfort, durability and safety.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            "Medical Grade Quality",
            "International Standards",
            "Premium Materials",
            "Trusted Recovery",
          ].map((text) => (
            <div
              key={text}
              className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>

              <span className="font-bold text-slate-700 text-sm">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

        {/* BEST SELLERS */}
        <section className="relative max-w-[1500px] mx-auto px-6 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 rounded-[50px]" />

          <div className="relative flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">TOP CATEGORIES</p>
              <h2 className="text-5xl font-black mt-2">Best Sellers</h2>
              <p className="text-gray-500 mt-3">
                Most trusted support categories for daily recovery.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-10 w-max marquee py-4">
              {[...bodyCategories, ...bodyCategories].map((cat, i) => (
                <button
                  key={`${cat.name}-${i}`}
                  onClick={() => goCategory(cat.query || cat.category || cat.name)}
                  className="w-52 shrink-0 text-center group"
                >
                  <div className="relative w-48 h-48 mx-auto rounded-full bg-white shadow-[0_25px_70px_rgba(15,23,42,0.12)] overflow-hidden border border-white group-hover:-translate-y-2 transition duration-500">
                    <div
                      className="absolute inset-3 rounded-full opacity-25"
                      style={{ background: cat.color }}
                    />
                    <img
                      src={cat.image}
                      onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                      className="relative w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black">{cat.name}</h3>
                  <p className="text-gray-500 mt-1">{cat.count} items</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LOCATE PAIN AREA */}
        <section className="relative max-w-[1400px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-cyan-600 font-black tracking-widest">BODY-BASED SEARCH</p>
            <h2 className="text-5xl font-black mt-2">Locate Your Pain Area</h2>
            <p className="text-gray-500 mt-3 text-lg">
              Get the right support where you need it
            </p>
          </div>

          <div className="relative rounded-[42px] overflow-hidden shadow-[0_35px_100px_rgba(15,23,42,0.18)]">
            <img
              src="/products/pain-area.png"
              onError={(e) => {
                e.currentTarget.src = "/products/body-blue.png";
              }}
              className="w-full h-[760px] object-contain bg-white"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/50 via-transparent to-blue-950/35" />

            {[
              bodyCategories.find((c) => c.query === "Neck"),
              bodyCategories.find((c) => c.query === "Shoulder"),
              bodyCategories.find((c) => c.query === "Arm"),
              bodyCategories.find((c) => c.query === "Abdominal"),
              bodyCategories.find((c) => c.query === "Thigh"),
              bodyCategories.find((c) => c.query === "Knee"),
              bodyCategories.find((c) => c.query === "Shin And Calf"),
              bodyCategories.find((c) => c.query === "Ankle And Foot"),
              bodyCategories.find((c) => c.query === "Leg"),
              bodyCategories.find((c) => c.query === "Back"),
            ]
              .filter(Boolean)
              .map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => goCategory(cat.query || cat.category || cat.name)}
                  className="absolute group"
                  style={{
                    left: ["50%", "46%", "58%", "52%", "44%", "55%", "54%", "55%", "45%", "51%"][i],
                    top: ["12%", "26%", "30%", "43%", "56%", "63%", "77%", "90%", "69%", "20%"][i],
                  }}
                  title={cat.name}
                >
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-40"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="relative w-12 h-12 rounded-full border-2 border-white shadow-xl grid place-items-center text-white text-xs font-black group-hover:scale-125 transition"
                    style={{ background: cat.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="absolute left-14 top-1 whitespace-nowrap bg-white text-gray-900 rounded-full px-4 py-2 font-bold text-sm opacity-0 group-hover:opacity-100 transition shadow-lg">
                    {cat.name}
                  </span>
                </button>
              ))}

            <div className="absolute left-8 bottom-8 bg-white/90 backdrop-blur-xl rounded-3xl p-6 max-w-sm shadow-xl">
              <p className="text-cyan-600 font-black text-sm">SMART GUIDE</p>
              <h3 className="text-3xl font-black mt-1">Find support faster</h3>
              <p className="text-gray-500 mt-2">
                Tap any pain point and jump directly to matching products.
              </p>
            </div>
          </div>
        </section>

        {/* SHOP BY ACTIVITY */}
        <section className="max-w-[1500px] mx-auto px-6 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">LIFESTYLE SUPPORT</p>
              <h2 className="text-5xl font-black mt-2">Shop By Activity</h2>
            </div>

            <Link
              to="/shop-by-activity"
              className="hidden md:block bg-white shadow-lg rounded-full px-6 py-3 font-black text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
            >
              View All →
            </Link>
          </div>

          <div className="activity-mask overflow-hidden relative">
            <div className="activity-track flex gap-8 w-max marquee-activity py-8 snap-x snap-mandatory">
              {[...activities, ...activities].map((item, index) => (
                <motion.button
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % activities.length) * 0.04 }}
                  onClick={() =>
                    navigate(`/shop-by-activity?activity=${encodeURIComponent(item.name)}`)
                  }
                  className="activity-card relative h-72 w-[280px] shrink-0 snap-center rounded-[32px] overflow-hidden group shadow-[0_30px_90px_rgba(15,23,42,0.16)]"
                >
                  <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-8 py-3 font-black shadow-xl group-hover:bg-fuchsia-600 group-hover:text-white transition">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="relative max-w-7xl mx-auto px-5 py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-[50px]" />

          <div className="relative flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">FEATURED PRODUCTS</p>
              <h2 className="text-5xl font-black mt-2">Recommended Supports</h2>
              <p className="text-gray-500 mt-3">
                Handpicked supports for comfort, stability and recovery.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevProducts}
                className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextProducts}
                className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronRight size={24} />
              </button>
              <Link
                to="/shop"
                className="btn-primary px-6 py-3 rounded-full font-black shadow-lg"
              >
                More
              </Link>
            </div>
          </div>

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.slice(productStart, productStart + 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>

        {/* BLOGS */}
        <section className="max-w-7xl mx-auto px-5 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">LEARN & RECOVER</p>
              <h2 className="text-5xl font-black mt-2">Health Blogs & Guides</h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevBlogs}
                className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextBlogs}
                className="w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronRight size={24} />
              </button>
              <Link
                to="/blogs"
                className="btn-primary px-6 py-3 rounded-full font-black shadow-lg"
              >
                More
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {/* {blogs.slice(blogStart, blogStart + 4).map((blog, index) => (
               */}
               {blogPosts.slice(blogStart, blogStart + 4).map((blog, index) => (
              <motion.article
                key={`${blog.title}-${index}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group bg-white rounded-[34px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 hover:bg-cyan-50 transition duration-500"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <span className="text-cyan-600 font-black text-sm">
                    {blog.tag || blog.category || "Guide"}
                  </span>
                  <h3 className="text-xl font-black mt-3 group-hover:text-cyan-600 transition">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 mt-3 line-clamp-2">
                    Learn how to choose, wear and care for your support product.
                  </p>
<Link
  to={`/blogs/${blog.slug}`}
  className="mt-5 inline-block font-black text-cyan-600"
>
  Read guide →
</Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}