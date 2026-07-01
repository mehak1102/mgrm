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

function SuggestionsTab() {
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
      const res = await API.get(`/suggestions?${params}`);
      setItems(res.data.suggestions || []);
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
    await API.patch(`/suggestions/${id}/read`, { isRead });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this suggestion?")) return;
    await API.delete(`/suggestions/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          placeholder="Search suggestions..."
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
        <button type="button" onClick={() => exportCsv("/suggestions/export/csv", "suggestions.csv")} className="btn-soft px-5 py-3 rounded-2xl font-bold">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="h-40 card rounded-2xl animate-pulse" />
      ) : items.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center text-fg-muted">No suggestions found.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className={`card rounded-2xl p-5 ${!item.isRead ? "ring-2 ring-rose-500/30" : ""}`}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-black text-fg">{item.name}</p>
                  <p className="text-sm text-fg-muted">{item.email || "No email"}</p>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-1">{item.category}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${item.isRead ? "bg-slate-100 dark:bg-slate-800 text-slate-600" : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"}`}>
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
            <h3 className="text-2xl font-black text-fg mb-4">Suggestion Details</h3>
            <p className="font-bold text-fg">{selected.name}</p>
            <p className="text-sm text-fg-muted">{selected.email || "No email provided"}</p>
            <p className="mt-2 font-bold text-rose-600 dark:text-rose-400">{selected.category}</p>
            <p className="mt-4 text-fg-muted whitespace-pre-wrap">{selected.message}</p>
            <p className="text-xs text-fg-muted mt-4">{new Date(selected.createdAt).toLocaleString()}</p>
            <button type="button" onClick={() => setSelected(null)} className="btn-primary mt-6 px-6 py-3 rounded-2xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorCustomizationTab() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await API.get(`/color-customization?${params}`);
      setItems(res.data.requests || []);
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
    await API.patch(`/color-customization/${id}/status`, {
      status,
      adminNotes,
    });
    load();
    if (selected?._id === id) setSelected((s) => ({ ...s, status, adminNotes }));
  };

  const remove = async (id) => {
    if (!confirm("Delete this colour request?")) return;
    await API.delete(`/color-customization/${id}`);
    load();
  };

  const openDetails = (item) => {
    setSelected(item);
    setAdminNotes(item.adminNotes || "");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          placeholder="Search colour requests..."
          className="theme-panel rounded-2xl px-4 py-3 flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="theme-panel rounded-2xl px-4 py-3"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setPage(1);
            load();
          }}
          className="btn-primary px-5 py-3 rounded-2xl font-bold"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() =>
            exportCsv("/color-customization/export/csv", "color-customization-requests.csv")
          }
          className="btn-soft px-5 py-3 rounded-2xl font-bold"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="h-40 card rounded-2xl animate-pulse" />
      ) : items.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center text-fg-muted">
          No colour customization requests yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`card rounded-2xl p-5 ${!item.isRead ? "ring-2 ring-violet-500/30" : ""}`}
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-black text-fg">{item.name}</p>
                  <p className="text-sm text-fg-muted">
                    {item.email || "No email"} • {item.phone || "No phone"}
                  </p>
                  {item.productName ? (
                    <p className="text-sm font-bold text-violet-600 dark:text-violet-300 mt-1">
                      {item.productName}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-8 w-8 rounded-lg border border-edge shadow-sm"
                    style={{ backgroundColor: item.preferredColor }}
                    title={item.preferredColor}
                  />
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${STATUS_STYLE[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-fg-muted mt-3">
                <span className="font-bold text-fg">{item.colorLabel || "Colour"}:</span>{" "}
                {item.preferredColor}
              </p>
              <p className="text-sm text-fg-muted mt-2 line-clamp-2">{item.message}</p>
              <p className="text-xs text-fg-muted mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => openDetails(item)}
                  className="btn-soft px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Review
                </button>
                {item.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(item._id, "Approved")}
                      className="btn-primary px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      Can Customize
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item._id, "Rejected")}
                      className="text-red-500 font-bold text-sm px-4 py-2"
                    >
                      Not Possible
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => remove(item._id)}
                  className="text-red-500 font-bold text-sm ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-fg-muted">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="card rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-black text-fg mb-4">Colour Customization Request</h3>
            <p className="font-bold text-fg">{selected.name}</p>
            <p className="text-sm text-fg-muted mt-1">
              {selected.email || "No email"} • {selected.phone || "No phone"}
            </p>
            <p className="text-sm font-bold text-violet-600 mt-2">
              Product: {selected.productName || "Not specified"}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span
                className="h-12 w-12 rounded-xl border border-edge"
                style={{ backgroundColor: selected.preferredColor }}
              />
              <div>
                <p className="font-bold text-fg">{selected.colorLabel || "Preferred colour"}</p>
                <p className="text-sm font-mono text-fg-muted">{selected.preferredColor}</p>
              </div>
            </div>
            <p className="mt-4 text-fg-muted whitespace-pre-wrap">{selected.message}</p>

            <label className="block mt-5">
              <span className="text-sm font-bold text-fg">Admin notes (optional)</span>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="theme-panel mt-2 w-full rounded-2xl px-4 py-3 min-h-[90px]"
                placeholder="Reason or next steps for the customer..."
              />
            </label>

            <div className="flex flex-wrap gap-2 mt-5">
              {["Pending", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus(selected._id, s)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    selected.status === s ? "btn-primary" : "btn-soft"
                  }`}
                >
                  {s === "Approved" ? "Can Customize" : s === "Rejected" ? "Not Possible" : s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="btn-soft mt-4 px-6 py-3 rounded-2xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SizeCustomizationTab() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await API.get(`/size-customization?${params}`);
      setItems(res.data.requests || []);
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
    await API.patch(`/size-customization/${id}/status`, {
      status,
      adminNotes,
    });
    load();
    if (selected?._id === id) setSelected((s) => ({ ...s, status, adminNotes }));
  };

  const remove = async (id) => {
    if (!confirm("Delete this size request?")) return;
    await API.delete(`/size-customization/${id}`);
    load();
  };

  const openDetails = (item) => {
    setSelected(item);
    setAdminNotes(item.adminNotes || "");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          placeholder="Search size requests..."
          className="theme-panel rounded-2xl px-4 py-3 flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="theme-panel rounded-2xl px-4 py-3"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setPage(1);
            load();
          }}
          className="btn-primary px-5 py-3 rounded-2xl font-bold"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() =>
            exportCsv("/size-customization/export/csv", "size-customization-requests.csv")
          }
          className="btn-soft px-5 py-3 rounded-2xl font-bold"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="h-40 card rounded-2xl animate-pulse" />
      ) : items.length === 0 ? (
        <div className="card rounded-2xl p-8 text-center text-fg-muted">
          No size customization requests yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`card rounded-2xl p-5 ${!item.isRead ? "ring-2 ring-cyan-500/30" : ""}`}
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-black text-fg">{item.name}</p>
                  <p className="text-sm text-fg-muted">
                    {item.email || "No email"} • {item.phone || "No phone"}
                  </p>
                  {item.productName ? (
                    <p className="text-sm font-bold text-cyan-600 dark:text-cyan-300 mt-1">
                      {item.productName}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${STATUS_STYLE[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-fg-muted mt-3">
                <span className="font-bold text-fg">Size:</span> {item.preferredSize}
                {item.bodyPart ? (
                  <>
                    {" "}
                    • <span className="font-bold text-fg">Area:</span> {item.bodyPart}
                  </>
                ) : null}
                {item.measurement ? (
                  <>
                    {" "}
                    • <span className="font-bold text-fg">Measure:</span> {item.measurement}{" "}
                    {item.measurementUnit}
                  </>
                ) : null}
              </p>
              <p className="text-sm text-fg-muted mt-2 line-clamp-2">{item.message}</p>
              <p className="text-xs text-fg-muted mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => openDetails(item)}
                  className="btn-soft px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Review
                </button>
                {item.status === "Pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(item._id, "Approved")}
                      className="btn-primary px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      Can Customize
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item._id, "Rejected")}
                      className="text-red-500 font-bold text-sm px-4 py-2"
                    >
                      Not Possible
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => remove(item._id)}
                  className="text-red-500 font-bold text-sm ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-fg-muted">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-soft px-4 py-2 rounded-xl font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="card rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-black text-fg mb-4">Size Customization Request</h3>
            <p className="font-bold text-fg">{selected.name}</p>
            <p className="text-sm text-fg-muted mt-1">
              {selected.email || "No email"} • {selected.phone || "No phone"}
            </p>
            <p className="text-sm font-bold text-cyan-600 mt-2">
              Product: {selected.productName || "Not specified"}
            </p>
            <div className="mt-4 grid gap-2 text-sm">
              <p>
                <span className="font-bold text-fg">Preferred size:</span> {selected.preferredSize}
              </p>
              {selected.bodyPart ? (
                <p>
                  <span className="font-bold text-fg">Body area:</span> {selected.bodyPart}
                </p>
              ) : null}
              {selected.measurement ? (
                <p>
                  <span className="font-bold text-fg">Measurement:</span> {selected.measurement}{" "}
                  {selected.measurementUnit}
                </p>
              ) : null}
            </div>
            <p className="mt-4 text-fg-muted whitespace-pre-wrap">{selected.message}</p>

            <label className="block mt-5">
              <span className="text-sm font-bold text-fg">Admin notes (optional)</span>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="theme-panel mt-2 w-full rounded-2xl px-4 py-3 min-h-[90px]"
                placeholder="Suggested size, lead time, or reason if not possible..."
              />
            </label>

            <div className="flex flex-wrap gap-2 mt-5">
              {["Pending", "Approved", "Rejected"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus(selected._id, s)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    selected.status === s ? "btn-primary" : "btn-soft"
                  }`}
                >
                  {s === "Approved" ? "Can Customize" : s === "Rejected" ? "Not Possible" : s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="btn-soft mt-4 px-6 py-3 rounded-2xl font-bold"
            >
              Close
            </button>
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
          Manage store feedback, customer suggestions, warranty claims, colour and size customization requests.
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
            onClick={() => setSubTab("suggestions")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold ${subTab === "suggestions" ? "btn-primary" : "btn-soft"}`}
          >
            Suggestions
          </button>
          <button
            type="button"
            onClick={() => setSubTab("color")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold ${subTab === "color" ? "btn-primary" : "btn-soft"}`}
          >
            Colour Requests
          </button>
          <button
            type="button"
            onClick={() => setSubTab("size")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold ${subTab === "size" ? "btn-primary" : "btn-soft"}`}
          >
            Size Requests
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

      {subTab === "feedback" && <FeedbackTab />}
      {subTab === "suggestions" && <SuggestionsTab />}
      {subTab === "color" && <ColorCustomizationTab />}
      {subTab === "size" && <SizeCustomizationTab />}
      {subTab === "claims" && <ClaimsTab />}
    </div>
  );
}
