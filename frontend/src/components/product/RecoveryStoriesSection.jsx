import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeartPulse } from "lucide-react";
import API from "../../api";
import { RecoveryStoryCard } from "./BeforeAfterSlider";

export default function RecoveryStoriesSection({ productId }) {
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let ignore = false;
    setLoading(true);
    API.get(`/recovery-stories/product/${productId}`)
      .then((res) => {
        if (!ignore) setStories(res.data.stories || []);
      })
      .catch(() => {
        if (!ignore) setStories([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-edge bg-card p-5">
        <div className="h-6 w-48 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!stories.length) return null;

  return (
    <section className="rounded-2xl border border-edge bg-card p-5 md:p-6">
      <div className="flex items-center gap-2 mb-1">
        <HeartPulse size={18} className="text-brand" />
        <p className="text-xs font-black uppercase tracking-widest text-brand">{t("global.recoveryStories")}</p>
      </div>
      <h2 className="text-xl md:text-2xl font-black text-fg">{t("global.beforeAfter")}</h2>
      <p className="text-sm text-fg-muted mt-1 mb-5">
        {t("global.recoveryCopyDrag")}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story, index) => (
          <RecoveryStoryCard key={story._id} story={story} index={index} />
        ))}
      </div>
    </section>
  );
}
