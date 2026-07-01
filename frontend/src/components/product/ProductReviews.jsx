import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Camera,
  ImageIcon,
  Loader2,
  MessageSquareQuote,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import StarRating, { StarRatingDisplay } from "./StarRating";
import toast from "react-hot-toast";

const SORT_OPTION_IDS = ["latest", "highest", "lowest"];

function RatingBar({ star, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-8 font-bold text-fg">{star}★</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
        />
      </div>
      <span className="w-8 text-right text-fg-muted">{count}</span>
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    galleryImages: [],
  });
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ rating: 5, comment: "", images: [] });
  const [lightbox, setLightbox] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/reviews/product/${productId}?sort=${sort}`);
      setReviews(res.data.reviews || []);
      setSummary(res.data.summary || summary);
    } catch {
      setError(t("global.couldNotLoadReviews"));
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, sort, t]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (!user) {
      toast.error(t("global.loginToUploadImages"));
      return;
    }

    setUploading(true);
    try {
      const urls = [];
      for (const file of files.slice(0, 6 - form.images.length)) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await API.post("/upload/review", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        urls.push(res.data.url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 6) }));
    } catch {
      toast.error(t("global.imageUploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("global.loginToSubmitReview"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.post("/reviews", {
        productId,
        rating: form.rating,
        comment: form.comment,
        images: form.images,
      });
      setForm({ rating: 5, comment: "", images: [] });
      setSummary(res.data.summary);
      await fetchReviews();
      toast.success(t("global.reviewSubmitted"));
    } catch (err) {
      toast.error(err.response?.data?.msg || t("global.failedSubmitReview"));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm(t("global.deleteReviewConfirm"))) return;
    try {
      const res = await API.delete(`/reviews/${id}`);
      setSummary(res.data.summary);
      await fetchReviews();
      toast.success(t("global.reviewRemoved"));
    } catch {
      toast.error(t("global.couldNotDeleteReview"));
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-edge bg-card p-6 md:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-amber-300/30 via-orange-300/20 to-rose-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-300/20 to-purple-300/20 blur-3xl pointer-events-none" />

      <div className="relative">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">{t("global.customerReviews")}</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-black text-fg">{t("global.whatBuyersSay")}</h2>

        {loading ? (
          <div className="mt-8 grid md:grid-cols-[280px_1fr] gap-8">
            <div className="h-48 rounded-3xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 p-6 text-red-600 dark:text-red-300">
            {error}
            <button onClick={fetchReviews} className="ml-3 underline font-bold">
              {t("common.retry")}
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid lg:grid-cols-[300px_1fr] gap-8">
              <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20 p-6 border border-amber-200/50 dark:border-amber-500/20">
                <p className="text-5xl font-black text-fg">
                  {summary.averageRating ? summary.averageRating.toFixed(1) : "—"}
                </p>
                <StarRatingDisplay value={summary.averageRating} size={22} className="mt-2" />
                <p className="mt-2 text-sm text-fg-muted">
                  {t("global.reviewCount", { count: summary.totalReviews })}
                </p>
                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <RatingBar
                      key={star}
                      star={star}
                      count={summary.breakdown?.[star] || 0}
                      total={summary.totalReviews}
                    />
                  ))}
                </div>
              </div>

              <div>
                {summary.galleryImages?.length > 0 && (
                  <div className="mb-6">
                    <p className="font-black text-fg mb-3 flex items-center gap-2">
                      <ImageIcon size={18} /> {t("global.buyerPhotos")}
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scroll">
                      {summary.galleryImages.map((img, idx) => (
                        <button
                          key={`${img}-${idx}`}
                          type="button"
                          onClick={() => setLightbox(img)}
                          className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-transparent hover:ring-brand transition"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {SORT_OPTION_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSort(id)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                        sort === id
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-slate-100 dark:bg-zinc-800 text-fg-muted hover:text-fg"
                      }`}
                    >
                      {t(`global.${id}`)}
                    </button>
                  ))}
                </div>

                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-edge p-8 text-center">
                    <MessageSquareQuote className="mx-auto text-fg-muted mb-3" />
                    <p className="font-bold text-fg">{t("global.noReviewsYet")}</p>
                    <p className="text-sm text-fg-muted mt-1">{t("global.beFirstReview")}</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[520px] overflow-y-auto custom-scroll pr-1">
                    <AnimatePresence>
                      {reviews.map((review) => (
                        <motion.article
                          key={review._id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border border-edge bg-app/50 p-5"
                        >
                          <div className="flex justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-black text-fg">{review.userName}</p>
                                {review.isVerifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">
                                    <BadgeCheck size={14} /> {t("global.verifiedPurchase")}
                                  </span>
                                )}
                              </div>
                              <StarRatingDisplay value={review.rating} size={14} className="mt-1" />
                              <p className="text-xs text-fg-muted mt-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {(String(user?.id) === String(review.userId) || user?.role === "admin") && (
                              <button
                                type="button"
                                onClick={() => deleteReview(review._id)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl h-fit"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          {review.comment && (
                            <p className="mt-3 text-fg-muted leading-relaxed">{review.comment}</p>
                          )}
                          {review.images?.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {review.images.map((img) => (
                                <button
                                  key={img}
                                  type="button"
                                  onClick={() => setLightbox(img)}
                                  className="w-16 h-16 rounded-xl overflow-hidden"
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            <form
              onSubmit={submitReview}
              className="mt-10 rounded-3xl border border-edge bg-gradient-to-r from-purple-50/80 via-cyan-50/50 to-amber-50/50 dark:from-purple-950/20 dark:via-cyan-950/10 dark:to-amber-950/10 p-6 md:p-8"
            >
              <h3 className="text-xl font-black text-fg">{t("global.writeReview")}</h3>
              {!user ? (
                <p className="mt-3 text-fg-muted">
                  <Link to="/login" className="text-brand font-bold hover:underline">
                    {t("common.login")}
                  </Link>{" "}
                  {t("global.loginToReview")}
                </p>
              ) : (
                <>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-fg mb-2">{t("global.yourRating")}</p>
                    <StarRating
                      value={form.rating}
                      onChange={(r) => setForm((p) => ({ ...p, rating: r }))}
                      size={28}
                    />
                  </div>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                    placeholder={t("global.reviewCommentPlaceholder")}
                    className="theme-panel w-full mt-4 min-h-[120px] rounded-2xl px-4 py-3 text-fg"
                    maxLength={2000}
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 btn-soft px-4 py-2 rounded-xl font-bold cursor-pointer">
                      <Camera size={18} />
                      {uploading ? t("common.uploading") : t("global.addPhotos")}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading || form.images.length >= 6}
                      />
                    </label>
                    {form.images.map((img) => (
                      <img key={img} src={img} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary mt-5 px-8 py-3 rounded-2xl font-black inline-flex items-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                    {t("global.submitReview")}
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <img
              src={lightbox}
              alt=""
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
