import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { bodyCategories } from "../data/siteData";
import { useProductStats } from "../context/ProductStatsContext";
import {
  HeroHeading,
  FadeUpText,
} from "../components/typography/TypographyMotion";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";

export default function ShopByBody({ embedded = false, onCategorySelect }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const { categoriesWithCounts, bodyTotal, formatProductCount } = useProductStats();

  const trustItems = [
    t("shopByBody.trustMedical"),
    t("shopByBody.trustPainArea"),
    t("shopByBody.trustSizeGuide"),
    t("shopByBody.trustDelivery"),
  ];

  const benefitItems = [
    t("shopByBody.painRelief"),
    t("shopByBody.stability"),
    t("shopByBody.comfort"),
  ];

  const filtered = useMemo(() => {
    return categoriesWithCounts.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categoriesWithCounts]);

  const goCategory = (cat) => {
    if (onCategorySelect) {
      onCategorySelect(cat);
      return;
    }
    navigate(`/shop?category=${encodeURIComponent(cat.query || cat.name)}`);
  };

  return (
    <main className={`bg-[#f8fafc] overflow-hidden ${embedded ? "min-h-0" : "min-h-screen"}`}>
      {!embedded && <FloatingMedicalBg />}
      <div className="relative z-10">
        <section className={`relative ${embedded ? "pt-6 pb-10" : "pt-20 pb-16"}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900" />
          <div className="absolute -top-24 right-10 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-5 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center text-white">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-black"
              >
                <Sparkles size={16} /> {t("shopByBody.title")}
              </motion.div>

              <BrandPillBadgeRow tone="on-dark" className="mt-2" />

              <HeroHeading
                text={t("shopByBody.heroHeading")}
                className="typo-hero-title mt-4 text-white"
              />

              <FadeUpText
                animateOnMount
                delay={0.35}
                className="text-white/70 typo-body-lg mt-4 sm:mt-6 max-w-2xl"
              >
                {t("shopByBody.heroCopy")}
              </FadeUpText>

              <div className="relative mt-8 max-w-xl">
                <Search className="absolute left-5 top-4 text-slate-400" size={20} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("shopByBody.searchPlaceholder")}
                  className="w-full rounded-2xl bg-card text-fg py-4 pl-14 pr-4 outline-none shadow-2xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl">
                {[
                  [formatProductCount(bodyTotal), t("shopByBody.certifiedProducts")],
                  [String(bodyCategories.length), t("shopByBody.bodyCategories")],
                  ["24/7", t("shopByBody.supportHelp")],
                ].map(([num, label]) => (
                  <div key={label} className="bg-white/10 border border-white/15 rounded-3xl p-5 backdrop-blur">
                    <p className="text-xl sm:text-3xl font-black">{num}</p>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-10 bg-cyan-300/20 blur-3xl rounded-full" />
              <img
                src="/products/image.png"
                onError={(e) => (e.currentTarget.src = "/products/bo.png")}
                className="relative h-[560px] mx-auto object-contain drop-shadow-2xl"
                alt={t("shopByBody.title")}
              />
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 -mt-8 relative z-10">
          <div className="bg-card rounded-[32px] shadow-[0_30px_90px_rgba(15,23,42,0.12)] border border-slate-100 border-edge grid md:grid-cols-4 overflow-hidden">
            {trustItems.map((text) => (
              <div key={text} className="p-6 flex items-center gap-3 border-b md:border-b-0 md:border-r last:border-r-0 border-slate-100 border-edge">
                <ShieldCheck className="text-cyan-600" />
                <p className="font-black text-slate-800">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-end mb-10">
            <div>
              <p className="text-cyan-600 font-black tracking-widest">{t("shopByBody.bodyCategoriesTitle")}</p>
              <h2 className="typo-section-title mt-2">
                {t("shopByBody.choosePain")}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="btn-primary px-6 py-4 rounded-full font-black shadow-xl hover:scale-105 transition"
            >
              {t("shopByBody.viewAllProducts")}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {filtered.map((cat, index) => (
              <motion.article
                key={cat.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group relative h-[330px] rounded-[34px] overflow-hidden bg-card shadow-[0_25px_80px_rgba(15,23,42,0.10)] hover:-translate-y-2 transition duration-500"
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `linear-gradient(135deg, ${cat.color}, transparent)` }}
                />
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-2xl opacity-30" style={{ background: cat.color }} />

                <div className="relative z-10 p-7 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <span className="text-6xl font-light text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveCat(cat)}
                      className="bg-white/80 backdrop-blur rounded-full px-4 py-2 text-xs font-black shadow hover:scale-105 transition"
                    >
                      {t("common.quickView")}
                    </button>
                  </div>

                  <div className="mt-auto">
                    <img
                      src={cat.image}
                      onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                      className="absolute right-3 bottom-10 w-44 h-44 object-cover rounded-[30px] group-hover:scale-110 transition duration-700"
                      alt={cat.name}
                    />

                    <div className="relative max-w-[55%]">
                      <h3 className="typo-section-subtitle text-fg">
                        {cat.name}
                      </h3>
                      <p className="text-slate-500 mt-2">{t("common.productsCount", { count: cat.count })}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => goCategory(cat)}
                      className="relative mt-6 inline-flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-full font-black hover:bg-cyan-600 transition"
                    >
                      {t("common.shopNow")} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {!filtered.length && (
            <div className="bg-card rounded-3xl p-10 text-center shadow mt-8">
              <h3 className="text-2xl font-black">{t("shopByBody.noBodyPart")}</h3>
              <p className="text-fg-muted mt-2">{t("shopByBody.tryAnother")}</p>
            </div>
          )}
        </section>

        <section className="max-w-7xl mx-auto px-5 pb-20">
          <div className="relative rounded-[42px] overflow-hidden p-10 md:p-14 bg-slate-950 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
            <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="text-cyan-300 font-black tracking-widest">{t("shopByBody.needHelp")}</p>
                <h2 className="typo-section-title mt-2">
                  {t("shopByBody.notSure")}
                </h2>
                <p className="text-white/60 mt-4 max-w-2xl">
                  {t("shopByBody.helpCopy")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" className="bg-card text-slate-950 px-6 py-4 rounded-full font-black">
                  {t("support.sizeGuide")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/support")}
                  className="btn-primary px-6 py-4 rounded-full font-black"
                >
                  {t("nav.contactSupport")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {activeCat && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur z-[100] flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-card rounded-[36px] max-w-3xl w-full overflow-hidden shadow-2xl"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative min-h-[360px]" style={{ background: `${activeCat.color}22` }}>
                  <img
                    src={activeCat.image}
                    onError={(e) => (e.currentTarget.src = "/products/knee.png")}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={activeCat.name}
                  />
                </div>

                <div className="p-8">
                  <button
                    type="button"
                    onClick={() => setActiveCat(null)}
                    className="float-right w-10 h-10 rounded-full bg-slate-100 bg-surface-hover grid place-items-center"
                    aria-label={t("common.close")}
                  >
                    <X size={18} />
                  </button>

                  <p className="text-cyan-600 font-black tracking-widest">{t("shopByBody.bodyPart")}</p>
                  <h3 className="typo-section-title mt-2">{activeCat.name}</h3>
                  <p className="text-fg-muted mt-4">
                    {t("shopByBody.exploreCount", { count: activeCat.count })}
                  </p>

                  <div className="grid gap-3 mt-6">
                    {benefitItems.map((x) => (
                      <div key={x} className="flex items-center gap-3 bg-slate-50 bg-card rounded-2xl p-4">
                        <ChevronRight className="text-cyan-600" />
                        <span className="font-bold">{x}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => goCategory(activeCat)}
                    className="btn-primary w-full py-4 rounded-2xl font-black mt-7"
                  >
                    {t("common.viewProducts")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
