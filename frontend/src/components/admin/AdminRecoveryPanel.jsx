import { useEffect, useState } from "react";
import API from "../../api";

const STATUS_LABELS = {
  pending: "Pending Review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
};

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  approved: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  published: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

export default function AdminRecoveryPanel() {
  const [stories, setStories] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    setLoading(true);
    try {
      const qs = filter ? `?status=${filter}` : "";
      const res = await API.get(`/recovery-stories${qs}`);
      setStories(res.data.stories || []);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, [filter]);

  const moderate = async (id, updates) => {
    await API.patch(`/recovery-stories/${id}`, updates);
    loadStories();
  };

  return (
    <div className="space-y-6">
      <div className="card rounded-[32px] p-6">
        <h2 className="text-2xl font-black text-fg mb-2">Recovery Story Moderation</h2>
        <p className="text-sm text-fg-muted mb-4">
          <strong>Approve</strong> makes the story visible on the product page.
          <strong> Feature</strong> pins it to the top with a &quot;Featured&quot; badge.
        </p>
        <div className="flex flex-wrap gap-2">
          {["pending", "approved", "published", "rejected", ""].map((s) => (
            <button
              key={s || "all"}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                filter === s ? "btn-primary" : "btn-soft"
              }`}
            >
              {s ? STATUS_LABELS[s] : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-40 card rounded-2xl animate-pulse" />
      ) : stories.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center text-fg-muted">No stories in this queue.</div>
      ) : (
        <div className="grid gap-4">
          {stories.map((story) => (
            <div key={story._id} className="card rounded-2xl p-5">
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  <img src={story.beforeImage} alt="" className="w-20 h-20 rounded-xl object-cover" />
                  <img src={story.afterImage} alt="" className="w-20 h-20 rounded-xl object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-fg">{story.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_STYLE[story.status]}`}>
                      {STATUS_LABELS[story.status]}
                    </span>
                    {story.isFeatured && (
                      <span className="text-xs font-bold text-amber-600">Featured</span>
                    )}
                  </div>
                  <p className="text-sm text-fg-muted mt-1">
                    {story.userId?.name || "User"} • {story.productId?.name || "Product"}
                  </p>
                  {story.recoveryDuration && (
                    <p className="text-xs text-fg-muted mt-1">{story.recoveryDuration}</p>
                  )}
                  <p className="text-sm text-fg-muted mt-2 line-clamp-2">{story.story}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {story.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => moderate(story._id, { status: "published" })}
                      className="btn-primary px-4 py-2 rounded-xl font-bold text-sm"
                    >
                      Approve &amp; Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => moderate(story._id, { status: "rejected" })}
                      className="text-red-500 font-bold text-sm px-4 py-2"
                    >
                      Reject
                    </button>
                  </>
                )}
                {story.status === "approved" && (
                  <button
                    type="button"
                    onClick={() => moderate(story._id, { status: "published" })}
                    className="btn-primary px-4 py-2 rounded-xl font-bold text-sm"
                  >
                    Publish to product page
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => moderate(story._id, { isFeatured: !story.isFeatured })}
                  className="btn-soft px-4 py-2 rounded-xl font-bold text-sm"
                  title="Pin this story to the top of the product page"
                >
                  {story.isFeatured ? "Unfeature" : "Feature (pin to top)"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Delete this story?")) return;
                    await API.delete(`/recovery-stories/${story._id}`);
                    loadStories();
                  }}
                  className="text-red-500 font-bold text-sm ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
