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

import { activities, bodyCategories } from "../data/siteData";
import { blogPosts } from "../data/blogData";
import BodyFlowMap from "../components/BodyFlowMap";
import FloatingMedicalBg from "../components/FloatingMedicalBg";


const text = "248 top certified products- to cure your body";


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
    image: "/certifications/cee.png",
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
    <main className="relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <FloatingMedicalBg />

      <div className="relative z-10">
        {/* HERO */}
        <section className="relative min-h-[92vh] pt-10 pb-20 overflow-hidden">
    
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-[0.90]"
      
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/78 via-white/60 to-white/82 dark:from-zinc-950/88 dark:via-zinc-950/72 dark:to-zinc-950/90 transition-colors duration-500" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,167,220,0.16),transparent_45%)]" />

          <div className="relative max-w-[1500px] mx-auto px-6">

            <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="text-[28px] md:text-[52px] leading-[0.95] font-black tracking-tight text-gray-700 dark:text-white max-w-6xl pt-4 transition-colors duration-300 flex flex-wrap"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: 100,
            filter: "blur(14px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            delay: index * 0.07,
            duration: 1.4,
            ease: [0.19, 1, 0.22, 1],
          }}
          className={`inline-block will-change-transform ${
            index < 3 ? "text-red-500" : ""
          }`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
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
                    className="w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 dark:bg-slate-900/78 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:bg-white dark:bg-slate-900 transition"
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
                      <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100">{cat.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">{cat.count} products</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="relative h-[690px] flex justify-center items-center rounded-[46px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_35px_120px_rgba(15,23,42,0.10)] overflow-hidden">
                <div className="absolute w-[560px] h-[560px] rounded-full bg-cyan-100/40 blur-3xl" />
                <div className="absolute inset-x-20 top-12 h-24 bg-white/70 blur-3xl" />

                <img
                  src="/products/bo.png"
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
                      className="w-full rounded-[24px] p-4 flex items-center gap-4 text-left bg-white/78 dark:bg-slate-900/78 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:bg-white dark:bg-slate-900 transition"
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
                        <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100">{cat.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{cat.count} products</p>
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
                    className="rounded-full px-6 py-3 font-bold shadow-md hover:scale-105 transition bg-white/80 backdrop-blur border"
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
        <section className="max-w-[1500px] mx-auto px-6 py-28">
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
<section className="relative max-w-[1450px] mx-auto px-6 py-28 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-zinc-950 rounded-[48px] transition-colors duration-300" />


  <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-20 items-center min-h-[720px]">
    
    {/* LEFT */}
    <div className="overflow-hidden">
      <div className="flex gap-7 w-max marquee-cert py-4">
        {[...certifications, ...certifications].map((item, i) => {
         

          return (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % certifications.length) * 0.08 }}
              className="w-[280px] shrink-0 rounded-[34px] bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_25px_70px_rgba(15,23,42,0.10)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-7 group hover:-translate-y-2 transition-all duration-500"
            >

<div
  className="w-28 h-28 rounded-[30px] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)] flex items-center justify-center border border-slate-100 dark:border-zinc-800 group-hover:scale-110 transition"
>
  <img
    src={item.image}
    alt={item.title}
    className="w-20 h-20 object-contain"
  />
</div>
              <h3 className="mt-6 text-2xl font-black text-slate-900 dark:text-zinc-100">
                {item.title}
              </h3>

              <p className="mt-3 text-slate-500 dark:text-gray-300 leading-7">
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

      <div className="relative bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-[42px] p-12 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)] border border-white dark:border-white/10 transition-colors duration-300">
        <p className="text-emerald-600 dark:text-emerald-400 font-black tracking-[0.25em] text-sm">
          TRUST & SAFETY
        </p>

        <h2 className="text-6xl font-black mt-5 leading-[1] text-slate-900 dark:text-white">
          Expect The <br /> Best
        </h2>

        <p className="mt-8 text-xl text-slate-500 dark:text-gray-300 leading-8">
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
              className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 rounded-2xl px-4 py-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>

              <span className="font-bold text-slate-700 dark:text-zinc-300 text-sm">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* ================= CARDIOLOGY AWARENESS SECTION ================= */}


<section className="relative overflow-hidden py-28">

  <div className="relative z-10 mx-auto max-w-[1500px] px-6">

    {/* MAIN CARD */}
    <div
      className="
        rounded-[42px]
         min-h-[760px]
        border

        border-black/5
        dark:border-white/10

        bg-gradient-to-br

        from-[#f8fbff]
        via-[#eef4ff]
        to-[#f3f7ff]

        dark:from-[#0d1b34]
        dark:via-[#142544]
        dark:to-[#10203d]

        p-8
        shadow-[0_30px_100px_rgba(0,0,0,0.12)]
        dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]

        backdrop-blur-xl
        md:p-12
      "
    >

      {/* TOP */}
      <div className="grid items-center gap-10 lg:grid-cols-2">

        {/* LEFT */}
        <div>

          {/* ATTENTION */}
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="
                text-[58px]
                font-light
                tracking-wide
                text-red-500
                md:text-6xl
              "
            >
              Attention
            </motion.h2>
          </div>

          {/* CARDIOLOGISTS */}
          <motion.h3
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: true }}
            className="
              mt-2
              text-4xl
              font-light

              text-[#111827]
              dark:text-white

              md:text-6xl
            "
          >
            Cardiologists
          </motion.h3>

          {/* TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            viewport={{ once: true }}
            className="
              mt-8
              max-w-xl
              text-base
              leading-8

              text-[#4b5563]
              dark:text-white/70

              md:text-lg
            "
          >
            248 world-class certified products designed for
            relief, recovery and rehabilitation with trusted
            orthopedic and post-surgical support solutions.
          </motion.p>

          {/* RED LINE */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '160px' }}
            transition={{ delay: 1, duration: 1 }}
            viewport={{ once: true }}
            className="mt-7 h-[3px] rounded-full bg-red-500"
          />
        </div>

        {/* RIGHT HEART */}
        <div className="relative flex items-center justify-center">

          {/* GLOW */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              absolute
              h-[280px]
              w-[280px]
              rounded-full
              bg-red-500/30
              blur-3xl
            "
          />

          {/* HEART */}
          <motion.img
            src="/cardiology/heart.png"
            alt="heart"
            initial={{
              opacity: 0,
              scale: 0.6,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            whileHover={{
              scale: 1.08,
              rotate: 2,
              filter:
                'drop-shadow(0px 0px 40px rgba(255,0,0,0.9))',
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            viewport={{ once: true }}
            className="
              relative
              z-10
              h-[260px]
              cursor-pointer
              object-contain
              transition-all
              duration-500
              md:h-[320px]
            "
          />

        
<svg
  className="
    absolute
    h-[340px]
    w-[340px]
    -rotate-90
  "
  viewBox="0 0 500 500"
>
  <motion.circle
    cx="250"
    cy="250"
    r="160"
    stroke="#ef4444"
    strokeWidth="2.5"
    fill="transparent"
    strokeLinecap="round"

    strokeDasharray="1005"
    strokeDashoffset="1005"

    animate={{
      strokeDashoffset: [1005, 0],
    }}

    transition={{
      duration: 5,
      repeat: Infinity,
      repeatDelay: 0.2,
      ease: 'linear',
    }}
  />
</svg>
        </div>
      </div>

      {/* MOVING PRODUCTS */}
      <div className="relative mt-20 overflow-hidden">

        {/* LEFT FADE */}
        <div
          className="
            absolute
            left-0
            top-0
            z-20
            h-full
            w-24

            bg-gradient-to-r

            from-[#f8fbff]
            dark:from-[#10203d]

            to-transparent
          "
        />

        {/* RIGHT FADE */}
        <div
          className="
            absolute
            right-0
            top-0
            z-20
            h-full
            w-24

            bg-gradient-to-l

            from-[#f3f7ff]
            dark:from-[#10203d]

            to-transparent
          "
        />

        {/* TRACK */}
        <motion.div
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max gap-7"
        >

          {[
            '/products/abdomen.png',
            '/products/ankle.png',
            '/products/arm.png',
            '/products/back.png',
           
            '/products/calf.png',
            '/products/collar.png',
            '/products/elbow.png',
            '/products/finger.png',
            '/products/knee.png',
            '/products/leg.png',
            '/products/neck.png',
            '/products/orth.png',
           
            '/products/ribs.png',
            '/products/shoulder.png',
            '/products/thigh.png',
            '/products/wrist.png',

            // duplicate
            '/products/abdomen.png',
            '/products/ankle.png',
            '/products/arm.png',
            '/products/back.png',
           
            '/products/calf.png',
            '/products/collar.png',
            '/products/elbow.png',
            '/products/finger.png',
            '/products/knee.png',
            '/products/leg.png',
            '/products/neck.png',
            '/products/orth.png',
           
            '/products/ribs.png',
            '/products/shoulder.png',
            '/products/thigh.png',
            '/products/wrist.png',
          ].map((image, index) => (

            <motion.div
              key={index}
              whileHover={{
                y: -10,
                scale: 1.06,
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                group
                relative
                flex
                h-[150px]
                w-[150px]
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full

                border
                border-black/5
                dark:border-white/10

                bg-black/[0.03]
                dark:bg-white/5

                backdrop-blur-xl

                shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                dark:shadow-[0_15px_50px_rgba(0,0,0,0.25)]
              "
            >

              {/* HOVER GLOW */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-red-500/0
                  blur-2xl
                  transition-all
                  duration-500
                  group-hover:bg-red-500/20
                "
              />

              {/* FLOATING ANIMATION */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3 + (index % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="h-full w-full"
              >

                {/* IMAGE */}
                <img
                  src={image}
                  alt=""
                  className="
                    h-full
                    w-full
                    rounded-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-110
                    group-hover:rotate-2
                  "
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM */}
      <div
        className="
          mt-20
          flex
          flex-col
          items-center
          justify-between
          gap-8

          border-t
          border-black/10
          dark:border-white/10

          pt-8
          md:flex-row
        "
      >

        {/* LOGO TEXT */}
        <div>
          <h3
            className="
              text-4xl
              font-black
              tracking-wide

              text-[#0f172a]
              dark:text-white
            "
          >
            MGRM
          </h3>

          <p
            className="
              text-lg
              font-semibold
              tracking-[8px]
              text-red-500
            "
          >
            MEDICARE
          </p>
        </div>

        {/* DESCRIPTION */}
        <div
          className="
            max-w-xl
            text-center
            text-sm
            leading-7

            text-[#4b5563]
            dark:text-white/60

            md:text-right
          "
        >
          MGRM products are designed to support recovery
          before surgery and accelerate rehabilitation
          after surgery.
        </div>
      </div>
    </div>
  </div>
</section>
{/* ========================= PREMIUM MGRM SECTION ========================= */}
<section className="relative max-w-[1450px] mx-auto px-6 py-28 overflow-hidden">


  {/* BACKGROUND */}
  <div className="absolute inset-0 rounded-[60px] overflow-hidden">

    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover scale-110 opacity-[0.88]"
      src="/videos/medical-bg.mp4"
    />

    {/* cinematic overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/82 via-white/38 to-cyan-50/10 dark:from-slate-950/92 dark:via-slate-950/75 dark:to-slate-900/40 transition-colors duration-500" />

    {/* light effect */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_38%)]" />

    {/* edge blur */}
    <div className="absolute inset-0 backdrop-blur-[1px]" />
  </div>

  {/* FLOATING BLURS */}
  <div className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full bg-cyan-300/10 blur-[120px]" />
  <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-blue-300/10 blur-[120px]" />

  {/* CONTENT */}
  <div className="relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

    {/* LEFT SIDE */}
    <div className="max-w-3xl">

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >

        {/* TOP BADGE */}
        <div className="inline-flex items-center gap-3 rounded-full border border-white/70 dark:border-white/10 bg-white/65 dark:bg-slate-900/70 backdrop-blur-2xl px-6 py-3 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)] transition-colors duration-300">

          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />

          <span className="text-[11px] tracking-[0.35em] font-black text-cyan-700 dark:text-cyan-300">
            GLOBAL MEDICAL BRAND
          </span>
        </div>

        {/* TITLE */}

        <h2 className="mt-6 text-[58px] md:text-6xl font-black leading-tight text-slate-900 dark:text-white transition-colors duration-300">
          BANDAGE TO
          <br />
          SPLINTAGE™
        </h2>

        {/* SUBTITLE */}
        <h3 className="mt-5 text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
          Physical Rehabilitation Splints & Aids
        </h3>

        {/* DESC */}
        <p className="mt-8 text-lg leading-9 text-slate-600 dark:text-gray-300 max-w-2xl transition-colors duration-300">
          MGRM products are scientifically engineered to stabilize,
          support and accelerate recovery during injuries and
          rehabilitation. Trusted by hospitals, physiotherapists,
          athletes and healthcare providers globally.
        </p>

        {/* BUTTONS */}
        <div className="mt-12 flex flex-wrap gap-5">

          <Link
            to="/shop"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-9 py-4 text-white font-black shadow-[0_20px_50px_rgba(34,211,238,0.35)] hover:scale-[1.04] transition duration-300"
          >
            <span className="relative z-10">
              Discover Products
            </span>

            <span className="absolute inset-0 bg-white/20 scale-x-0 origin-left group-hover:scale-x-100 transition duration-500" />
          </Link>

          <Link
            to="/support"
            className="rounded-full bg-white/78 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-white/10 px-9 py-4 text-slate-700 dark:text-gray-200 font-black shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:bg-cyan-500 hover:text-white hover:scale-[1.04] transition duration-300"
          >
            Partner Program
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-5 mt-16">

        {[
          ["248+", "Products"],
          ["40+", "Countries"],
          ["25+", "Years"],
        ].map(([num, text], i) => (

          <motion.div
            key={text}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-[30px] bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-white/10 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-7 hover:-translate-y-2 hover:bg-white/85 dark:hover:bg-slate-800/90 transition-all duration-500"
          >

            <h3 className="text-[58px] font-black text-slate-900 dark:text-white">
              {num}
            </h3>

            <p className="mt-2 text-slate-500 dark:text-gray-300 font-semibold">
              {text}
            </p>

          </motion.div>
        ))}
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="relative h-[680px] flex items-center justify-start -ml-16">

      {/* MAIN IMAGE CARD */}
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="relative w-[500px] rounded-[42px] overflow-hidden border border-white/70 dark:border-white/10 bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl shadow-[0_35px_100px_rgba(15,23,42,0.14)] dark:shadow-[0_35px_100px_rgba(0,0,0,0.45)] transition-colors duration-300"
      >

        <img
          src="/banners/bandage.png"
          className="w-full h-[650px] object-cover"
        />

        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-slate-950/95 transition-colors duration-500" />

        {/* content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">

          <span className="text-cyan-600 dark:text-cyan-400 text-sm tracking-[0.3em] font-black">
            PREMIUM ORTHOPEDIC SUPPORT
          </span>

          <h3 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
            Expect The Best
          </h3>

          <p className="mt-4 text-slate-600 dark:text-gray-300 leading-7">
            Internationally certified recovery and rehabilitation
            products designed for premium support and comfort.
          </p>
        </div>
      </motion.div>

      {/* FLOATING CARD */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -left-24 top-20 w-72 rounded-[34px] bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl border border-white dark:border-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)] p-7 transition-colors duration-300"
      >

        <p className="text-xs font-black tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
          GLOBAL PRESENCE
        </p>

        <h4 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
          40+
        </h4>

        <p className="text-lg font-bold text-slate-700 dark:text-gray-200 mt-1">
          Countries
        </p>

        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-gray-300">
          Expanding partnerships with healthcare providers,
          distributors and hospitals worldwide.
        </p>
      </motion.div>

      {/* FLOATING CARD 2 */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute right-8 bottom-16 w-80 rounded-[34px] bg-white/82 dark:bg-slate-900/85 backdrop-blur-2xl border border-white dark:border-white/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)] p-7 transition-colors duration-300"
      >

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/60 dark:to-blue-900/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-2xl font-black">
            ✓
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-900 dark:text-zinc-100">
              WHO-GMP
            </h4>

            <p className="text-sm text-slate-500">
              Certified Manufacturing
            </p>
          </div>
        </div>

        <div className="mt-6 h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
          <div className="w-[92%] h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
        </div>
      </motion.div>
    </div>
  </div>

  {/* MOVING TAGS */}
  <div className="relative mt-24 overflow-hidden">

    <div className="flex gap-6 w-max marquee-premium">

      {[
        "WELCOME TO MGRM",
        "GLOBAL PRESENCE",
        "EXPECT THE BEST",
        "PARTNER PROGRAM",
        "ORTHOPEDIC SUPPORT",
        "MEDICAL GRADE",
        "REHABILITATION PRODUCTS",
        "HEALTHCARE SOLUTIONS",
        "INTERNATIONAL QUALITY",
      ]
        .concat([
          "WELCOME TO MGRM",
          "GLOBAL PRESENCE",
          "EXPECT THE BEST",
          "PARTNER PROGRAM",
          "ORTHOPEDIC SUPPORT",
          "MEDICAL GRADE",
          "REHABILITATION PRODUCTS",
          "HEALTHCARE SOLUTIONS",
          "INTERNATIONAL QUALITY",
        ])
        .map((item, i) => (

          <div
            key={i}
            className="rounded-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-white/10 px-8 py-4 text-slate-700 dark:text-gray-200 font-black tracking-wide whitespace-nowrap shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:bg-cyan-500 hover:text-white transition duration-300"
          >
            {item}
          </div>
        ))}
    </div>
  </div>
</section>


        {/* BEST SELLERS */}
  
        <section className="relative max-w-[1500px] mx-auto mt-24 px-6 pt-28 pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-zinc-950 rounded-[48px] transition-colors duration-300" />

          <div className="relative flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">TOP CATEGORIES</p>
              <h2 className="text-[58px] font-black mt-2 text-slate-900 dark:text-white">Best Sellers</h2>
              <p className="text-gray-500 dark:text-zinc-400 mt-3">
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
                  <div className="relative w-48 h-48 mx-auto rounded-full bg-white dark:bg-slate-900 shadow-[0_25px_70px_rgba(15,23,42,0.12)] overflow-hidden border border-white group-hover:-translate-y-2 transition duration-500">
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

                  <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-gray-500 dark:text-zinc-400 mt-1">{cat.count} items</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LOCATE PAIN AREA */}
        <section className="relative max-w-[1500px] mx-auto px-6 py-28">
          <div className="text-center mb-12">
            <p className="text-cyan-600 font-black tracking-widest">BODY-BASED SEARCH</p>
            <h2 className="text-[58px] font-black mt-2 text-slate-900 dark:text-white">Locate Your Pain Area</h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-3 text-lg">
              Get the right support where you need it
            </p>
          </div>

          <div className="relative rounded-[42px] overflow-hidden shadow-[0_35px_100px_rgba(15,23,42,0.18)]">
            <img
              src="/products/pain.png"
              onError={(e) => {
                e.currentTarget.src = "/products/body-blue.png";
              }}
              className="w-full h-[760px] object-contain bg-white dark:bg-slate-900"
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

                  <span className="absolute left-14 top-1 whitespace-nowrap bg-white dark:bg-slate-900 text-gray-900 dark:text-zinc-100 rounded-full px-4 py-2 font-bold text-sm opacity-0 group-hover:opacity-100 transition shadow-lg">
                    {cat.name}
                  </span>
                </button>
              ))}

            <div className="absolute left-8 bottom-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 max-w-sm shadow-xl">
              <p className="text-cyan-600 font-black text-sm">SMART GUIDE</p>
              <h3 className="text-3xl font-black mt-1 text-slate-900 dark:text-white">Find support faster</h3>
              <p className="text-gray-500 dark:text-zinc-400 mt-2">
                Tap any pain point and jump directly to matching products.
              </p>
            </div>
          </div>
        </section>

        {/* SHOP BY ACTIVITY */}
        <section className="max-w-[1500px] mx-auto px-6 py-28">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">LIFESTYLE SUPPORT</p>
              <h2 className="text-[58px] font-black mt-2 text-slate-900 dark:text-white">Shop By Activity</h2>
            </div>

            <Link
              to="/shop-by-activity"
              className="hidden md:block bg-white dark:bg-slate-900 shadow-lg rounded-full px-6 py-3 font-black text-cyan-600 hover:bg-cyan-600 hover:text-white transition"
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

                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-full px-8 py-3 font-black shadow-xl group-hover:bg-fuchsia-600 group-hover:text-white transition">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="relative max-w-[1500px] mx-auto px-6 py-28 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-[48px] border border-slate-100/80 dark:border-white/10 transition-colors duration-300" />

          <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-10 px-2 sm:px-4">
            <div>
              <p className="text-cyan-600 dark:text-cyan-400 font-black tracking-widest text-sm">FEATURED PRODUCTS</p>
              <h2 className="text-4xl sm:text-[58px] font-black mt-2 text-slate-900 dark:text-white">Recommended Supports</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-xl">
                Handpicked supports for comfort, stability and recovery.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevProducts}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-lg grid place-items-center hover:scale-110 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextProducts}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-lg grid place-items-center hover:scale-110 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all duration-300"
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

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-7 px-2 sm:px-4 pb-2">
            {products.slice(productStart, productStart + 4).map((p) => (
              
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>

        {/* BLOGS */}
        <section className="max-w-7xl mx-auto px-5 py-28">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">LEARN & RECOVER</p>
              <h2 className="text-[58px] font-black mt-2 text-slate-900 dark:text-white">Health Blogs & Guides</h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevBlogs}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-lg grid place-items-center hover:scale-110 transition"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextBlogs}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-lg grid place-items-center hover:scale-110 transition"
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
           
               {blogPosts.slice(blogStart, blogStart + 4).map((blog, index) => (
              <motion.article
                key={`${blog.title}-${index}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group bg-white dark:bg-slate-900 rounded-[34px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 hover:bg-cyan-50 dark:hover:bg-slate-800 transition duration-500"
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
                  <p className="text-gray-500 dark:text-zinc-400 mt-3 line-clamp-2">
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

        {/* ================= PRINT ADS ================= */}
<section className="relative max-w-[1500px] mx-auto px-6 mt-24 mb-10 overflow-hidden">


{/* HEADING */}
<div className="text-center mb-14">

  <h2 className="mt-4 text-[64px] leading-[0.9] font-black text-slate-900 dark:text-white">
    MGRM
    <br />
    <span className="bg-gradient-to-r bg-gradient-to-r from-[#374151] via-[#f43f5e] to-[#fb923c] bg-clip-text text-transparent">
      Medicare
    </span>
  </h2>

  <p className="mt-5 text-slate-500 dark:text-zinc-400 text-lg">
    Advanced respiratory & pain relief solutions designed for everyday comfort.
  </p>

</div>

{/* GRID */}
<div className="grid md:grid-cols-2 gap-10 max-w-[1100px] mx-auto">

  {/* CARD 1 */}
  <div className="group relative rounded-[42px] overflow-hidden bg-white dark:bg-slate-900 border border-white/70 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500">

    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

    <img
      src="/ads/abc.png"
      alt="Nebulizer Ad"
      
      className="w-full h-[520px] object-contain p-6 group-hover:scale-[1.03] transition duration-700"
    />

<div className="absolute top-5 right-5 text-right bg-black/40 backdrop-blur-lg px-4 py-3 rounded-[22px] border border-white/10 animate-[float_5s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

  <h3 className="text-[28px] leading-[1] tracking-[-0.03em] font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
    Breathe Easier
    <br />

    <span className="text-cyan-300">
      NOW
    </span>
  </h3>

</div>
  </div>

  {/* CARD 2 */}
  <div className="group relative rounded-[42px] overflow-hidden bg-white dark:bg-slate-900 border border-white/70 dark:border-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500">

    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-lime-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

    <img
      src="/ads/def.png"
      alt="Pain Relief Spray"
      
      className="w-full h-[520px] object-contain p-6 group-hover:scale-[1.03] transition duration-700"
    />

<div className="absolute top-5 left-5 bg-black/35 backdrop-blur-lg px-4 py-3 rounded-[22px] border border-white/10 animate-[float_6s_ease-in-out_infinite] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">

  <h3 className="text-[28px] leading-[1] tracking-[-0.03em] font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
    Pain Relief
    <br />

    <span className="text-lime-300">
      Naturally
    </span>
  </h3>

</div>
  </div>

</div>
</section>
      </div>
    </main>
  );
}