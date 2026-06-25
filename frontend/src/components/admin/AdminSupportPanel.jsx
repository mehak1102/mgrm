import { useEffect, useState } from "react";
import API from "../../api";
import { getStoredToken } from "../../utils/authStorage";

const STATUS_STYLE = {
  Pending: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  Approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Rejected: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

function exportCsv(endpoint, filename) {
  const token = getStoredToken();
  fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
}

function FeedbackTab() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set("search", search);
      if (readFilter) params.set("read", readFilter);
      const res = await API.get(`/store-feedback?${params}`);
      setItems(res.data.feedback || []);
      setPages(res.data.pages || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, readFilter]);

  const toggleRead = async (id, isRead) => {
    await API.patch(`/store-feedback/${id}/read`, { isRead });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this feedback?")) return;
    await API.delete(`/store-feedback/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          placeholder="Search feedback..."
          className="theme-panel rounded-2xl px-4 py-3 flex-1 min-w-[200px]"
        />
        <select
          value={readFilter}
          onChange={(e) => { setReadFilter(e.target.value); setPage(1); }}
          className="theme-panel rounded-2xl px-4 py-3"
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
        <button type="button" onClick={() => { setPage(1); load(); }} className="btn-primary px-5 py-3 rounded-2xl font-bold">
          Search
        </button>
        <button type="button" onClick={() => exportCsv("/store-feedback/export/csv", "store-feedback.csv")} className="btn-soft px-5 py-3 rounded-2xl font-bold">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="h-40 card rounded-2xl animate-pulse" />
      ) : items.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center text-fg-muted">No feedback found.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className={`card rounded-2xl p-5 ${!item.isRead ? "ring-2 ring-cyan-500/30" : ""}`}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-black text-fg">{item.name}</p>
                  <p className="text-sm text-fg-muted">{item.email} • {item.phone || "No phone"}</p>
                  {item.subject && <p className="text-sm font-bold text-cyan-600 mt-1">{item.subject}</p>}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${item.isRead ? "bg-slate-100 dark:bg-slate-800 text-slate-600" : "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700"}`}>
                  {item.isRead ? "Read" : "Unread"}
                </span>
              </div>
              <p className="text-sm text-fg-muted mt-3 line-clamp-2">{item.message}</p>
              <p className="text-xs text-fg-muted mt-2">{new Date(item.createdAt).toLocaleString()}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={() => setSelected(item)} className="btn-soft px-4 py-2 rounded-xl text-sm font-bold">
                  View Details
                </button>
                <button type="button" onClick={() => toggleRead(item._id, !item.isRead)} className="btn-primary px-4 py-2 rounded-xl text-sm font-bold">
                  Mark {item.isRead ? "Unread" : "Read"}
                </button>
                <button type="button" onClick={() => remove(item._id)} className="text-red-500 font-bold text-sm ml-auto">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40">Prev</button>
          <span className="px-4 py-2 text-fg-muted">Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40">Next</button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div className="card rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-fg mb-4">Feedback Details</h3>
            <p className="font-bold text-fg">{selected.name}</p>
            <p className="text-sm text-fg-muted">{selected.email} • {selected.phone}</p>
            {selected.subject && <p className="mt-2 font-bold text-cyan-600">{selected.subject}</p>}
            <p className="mt-4 text-fg-muted whitespace-pre-wrap">{selected.message}</p>
            <button type="button" onClick={() => setSelected(null)} className="btn-primary mt-6 px-6 py-3 rounded-2xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClaimsTab() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await API.get(`/warranty-claims?${params}`);
      setItems(res.data.claims || []);
      setPages(res.data.pages || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, statusFilter]);

  const updateStatus = async (id, status) => {
    await API.patch(`/warranty-claims/${id}/status`, { status });
    load();
    if (selected?._id === id) setSelected((s) => ({ ...s, status }));
  };

  const remove = async (id) => {
    if (!confirm("Delete this claim?")) return;
    await API.delete(`/warranty-claims/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          placeholder="Search claims..."
          className="theme-panel rounded-2xl px-4 py-3 flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="theme-panel rounded-2xl px-4 py-3"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="button" onClick={() => { setPage(1); load(); }} className="btn-primary px-5 py-3 rounded-2xl font-bold">
          Search
        </button>
        <button type="button" onClick={() => exportCsv("/warranty-claims/export/csv", "warranty-claims.csv")} className="btn-soft px-5 py-3 rounded-2xl font-bold">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="h-40 card rounded-2xl animate-pulse" />
      ) : items.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center text-fg-muted">No warranty claims found.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="card rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-black text-fg">Order #{item.orderId}</p>
                  <p className="text-sm text-fg-muted">{item.product} • {item.issue}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${STATUS_STYLE[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-fg-muted mt-3 line-clamp-2">{item.description}</p>
              <p className="text-xs text-fg-muted mt-2">{new Date(item.createdAt).toLocaleString()}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={() => setSelected(item)} className="btn-soft px-4 py-2 rounded-xl text-sm font-bold">
                  View Details
                </button>
                {item.status === "Pending" && (
                  <>
                    <button type="button" onClick={() => updateStatus(item._id, "Approved")} className="btn-primary px-4 py-2 rounded-xl text-sm font-bold">
                      Approve
                    </button>
                    <button type="button" onClick={() => updateStatus(item._id, "Rejected")} className="text-red-500 font-bold text-sm px-4 py-2">
                      Reject
                    </button>
                  </>
                )}
                <button type="button" onClick={() => remove(item._id)} className="text-red-500 font-bold text-sm ml-auto">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40">Prev</button>
          <span className="px-4 py-2 text-fg-muted">Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40">Next</button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div className="card rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-fg mb-4">Warranty Claim</h3>
            <p className="font-bold text-fg">Order: {selected.orderId}</p>
            <p className="text-sm text-fg-muted mt-1">Product: {selected.product}</p>
            <p className="text-sm text-fg-muted">Issue: {selected.issue}</p>
            <p className="mt-4 text-fg-muted whitespace-pre-wrap">{selected.description}</p>
            {selected.imageUrl && (
              <img src={selected.imageUrl} alt="Claim" className="mt-4 rounded-2xl max-h-48 object-cover" />
            )}
            <div className="flex gap-2 mt-6">
              {["Pending", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus(selected._id, s)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${selected.status === s ? "btn-primary" : "btn-soft"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setSelected(null)} className="btn-soft mt-4 px-6 py-3 rounded-2xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSupportPanel() {
  const [subTab, setSubTab] = useState("feedback");

  return (
    <div className="space-y-6">
      <div className="card rounded-[32px] p-6">
        <h2 className="text-2xl font-black text-fg mb-2">Support Management</h2>
        <p className="text-sm text-fg-muted mb-4">
          Manage store locator feedback and warranty claims from customers.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubTab("feedback")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold ${subTab === "feedback" ? "btn-primary" : "btn-soft"}`}
          >
            Store Feedback
          </button>
          <button
            type="button"
            onClick={() => setSubTab("claims")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold ${subTab === "claims" ? "btn-primary" : "btn-soft"}`}
          >
            Warranty Claims
          </button>
        </div>
      </div>

      {subTab === "feedback" ? <FeedbackTab /> : <ClaimsTab />}
    </div>
  );
}
