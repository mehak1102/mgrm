import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Shield,
  RefreshCw,
  CheckCircle2,
  Headphones,
  Upload,
  CheckCircle,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import FloatingMedicalBg from "../components/FloatingMedicalBg";
import FloatingLabelField from "../components/support/FloatingLabelField";
import PolicyAccordion from "../components/support/PolicyAccordion";
import WarrantyProductCarousel from "../components/support/WarrantyProductCarousel";
import { HeroHeading, FadeUpBlock } from "../components/typography/TypographyMotion";
import { BrandPillBadgeRow } from "../components/brand/BrandPillBadge";
import { PremiumReveal, PremiumStagger, PremiumStaggerItem } from "../components/motion/PremiumMotion";
import { WARRANTY_POLICY_SECTIONS, WARRANTY_COVERAGE_CARDS } from "../data/supportData";
import API from "../api";

const COVERAGE_ICONS = {
  shield: Shield,
  refresh: RefreshCw,
  check: CheckCircle2,
  headphones: Headphones,
};

export default function WarrantyInformation() {
  const reduced = useReducedMotion();
  const [claim, setClaim] = useState({
    orderId: "",
    product: "",
    issue: "",
    description: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await API.post("/upload/warranty", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/warranty-claims", { ...claim, imageUrl });
      setClaimSuccess(true);
      setClaim({ orderId: "", product: "", issue: "", description: "" });
      setImageUrl("");
      toast.success("Warranty claim submitted successfully");
      setTimeout(() => setClaimSuccess(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="support-page relative min-h-screen overflow-hidden">
      <FloatingMedicalBg />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeUpBlock>
              <p className="text-xs font-bold tracking-[0.2em] text-brand mb-2">
                WARRANTY & PROTECTION
              </p>
              <BrandPillBadgeRow className="mb-3" />
            </FadeUpBlock>
            <HeroHeading
              text="Warranty & Product Protection"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-fg leading-tight"
            />
            <FadeUpBlock delay={0.15}>
              <p className="text-lg text-fg-muted mt-5 max-w-lg leading-relaxed">
                Designed to support your recovery with confidence. Our warranty covers
                manufacturing defects and ensures you receive the quality care MGRM is known for.
              </p>
            </FadeUpBlock>
          </div>

          <FadeUpBlock delay={0.2}>
            <div className="relative rounded-[36px] overflow-hidden aspect-[4/3] border border-white/50 dark:border-white/10 shadow-[0_30px_80px_rgba(6,182,212,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-blue-500/20 animate-pulse" />
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
                {["/products/knee.png", "/products/back.png", "/products/neck.png", "/products/shoulder.png"].map(
                  (src, i) => (
                    <motion.div
                      key={src}
                      className="rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/50 backdrop-blur-md h-full"
                      animate={reduced ? undefined : { y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                  )
                )}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-white/90 dark:from-slate-950/90 to-transparent" />
            </div>
          </FadeUpBlock>
        </div>
      </section>

      {/* Coverage Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <PremiumStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WARRANTY_COVERAGE_CARDS.map((card) => {
            const Icon = COVERAGE_ICONS[card.icon] || Shield;
            return (
              <PremiumStaggerItem key={card.title}>
                <div className="h-full card support-glass rounded-[28px] p-6 border border-edge shadow-lg hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(6,182,212,0.12)] transition duration-300">
                  <div
                    className={`warranty-coverage-icon w-12 h-12 rounded-2xl bg-gradient-to-br ${card.iconGradient} shadow-md grid place-items-center mb-4`}
                  >
                    <Icon className={`warranty-coverage-icon-svg ${card.iconColor}`} size={24} />
                  </div>
                  <h3 className="font-black text-lg text-fg">{card.title}</h3>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">{card.description}</p>
                </div>
              </PremiumStaggerItem>
            );
          })}
        </PremiumStagger>
      </section>

      {/* Policy Details */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <PremiumReveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-fg">Policy Details</h2>
            <p className="text-fg-muted mt-3">
              Applicable to products sold in India, Nepal, Sri Lanka, Malaysia, and Singapore.
            </p>
          </div>
          <PolicyAccordion sections={WARRANTY_POLICY_SECTIONS} />
        </PremiumReveal>
      </section>

      {/* Product Carousel */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <PremiumReveal>
          <WarrantyProductCarousel />
        </PremiumReveal>
      </section>

      {/* Warranty Claim Form */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        <PremiumReveal>
          <div className="card support-glass rounded-[36px] p-8 md:p-12 border border-edge backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 grid place-items-center">
                <FileText className="text-brand" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-fg">Warranty Claim</h2>
                <p className="text-sm text-fg-muted">Submit a claim for review by our support team</p>
              </div>
            </div>

            {claimSuccess && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
              >
                <CheckCircle className="text-emerald-600 shrink-0" size={24} />
                <p className="text-emerald-800 dark:text-emerald-300 font-bold">
                  Your warranty claim has been submitted. We&apos;ll review it shortly.
                </p>
              </motion.div>
            )}

            <form onSubmit={submitClaim} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FloatingLabelField
                  id="claim-order"
                  label="Order ID"
                  value={claim.orderId}
                  onChange={(e) => setClaim({ ...claim, orderId: e.target.value })}
                  required
                />
                <FloatingLabelField
                  id="claim-product"
                  label="Product"
                  value={claim.product}
                  onChange={(e) => setClaim({ ...claim, product: e.target.value })}
                  required
                />
              </div>
              <FloatingLabelField
                id="claim-issue"
                label="Issue"
                value={claim.issue}
                onChange={(e) => setClaim({ ...claim, issue: e.target.value })}
                required
              />
              <FloatingLabelField
                id="claim-desc"
                label="Description"
                as="textarea"
                rows={4}
                value={claim.description}
                onChange={(e) => setClaim({ ...claim, description: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-bold text-fg-muted mb-2">
                  Upload Image (optional)
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-[22px] border border-dashed border-slate-300 dark:border-white/20 hover:border-cyan-500 transition">
                    <Upload size={18} />
                    {uploading ? "Uploading..." : "Choose File"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {imageUrl && (
                    <img src={imageUrl} alt="Upload preview" className="h-16 w-16 rounded-xl object-cover" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-4 rounded-[22px] btn-primary font-black disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Warranty Claim"}
              </button>
            </form>
          </div>
        </PremiumReveal>
      </section>
    </main>
  );
}
