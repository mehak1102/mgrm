import { useEffect, useMemo, useState } from "react";
import API from "../../api";

const emptyJob = {
  title: "",
  department: "",
  location: "",
  experience: "",
  type: "Full-time",
  description: "",
  status: "open",
};

const APP_STATUS = ["new", "review", "shortlisted", "rejected", "offer"];

export default function AdminRecruitmentPanel() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ openPositions: 0, applications: 0, shortlisted: 0 });
  const [form, setForm] = useState(emptyJob);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appFilter, setAppFilter] = useState("all");

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/careers/admin/all");
      setJobs(res.data.jobs || []);
      setStats(res.data.stats || { openPositions: 0, applications: 0, shortlisted: 0 });
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const allApplications = useMemo(() => {
    return jobs.flatMap((job) =>
      (job.applications || []).map((app) => ({
        ...app,
        jobId: job._id,
        jobTitle: job.title,
      }))
    );
  }, [jobs]);

  const filteredApplications = useMemo(() => {
    if (appFilter === "all") return allApplications;
    return allApplications.filter((app) => app.status === appFilter);
  }, [allApplications, appFilter]);

  const submitJob = async (e) => {
    e.preventDefault();
    if (editId) {
      await API.put(`/careers/${editId}`, form);
    } else {
      await API.post("/careers", form);
    }
    setForm(emptyJob);
    setEditId(null);
    loadJobs();
  };

  const editJob = (job) => {
    setEditId(job._id);
    setForm({
      title: job.title || "",
      department: job.department || "",
      location: job.location || "",
      experience: job.experience || "",
      type: job.type || "Full-time",
      description: job.description || "",
      status: job.status || "open",
    });
  };

  const toggleJobStatus = async (job) => {
    const next = job.status === "open" ? "closed" : "open";
    await API.patch(`/careers/${job._id}/status`, { status: next });
    loadJobs();
  };

  const updateApplicationStatus = async (jobId, appId, status) => {
    await API.patch(`/careers/${jobId}/applications/${appId}`, { status });
    loadJobs();
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Open Positions", value: stats.openPositions },
          { label: "Applications", value: stats.applications },
          { label: "Shortlisted", value: stats.shortlisted },
        ].map((item) => (
          <div key={item.label} className="card rounded-2xl p-5">
            <p className="text-sm text-fg-muted font-bold">{item.label}</p>
            <p className="text-3xl font-black text-fg mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="card rounded-[32px] p-6">
        <h2 className="text-2xl font-black text-fg mb-4">
          {editId ? "Edit Position" : "Create Position"}
        </h2>
        <form onSubmit={submitJob} className="grid md:grid-cols-2 gap-4">
          {[
            ["title", "Job Title"],
            ["department", "Department"],
            ["location", "Location"],
            ["experience", "Experience"],
            ["type", "Employment Type"],
          ].map(([key, label]) => (
            <input
              key={key}
              required
              placeholder={label}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="border border-edge rounded-xl px-4 py-3 bg-card text-fg"
            />
          ))}
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-edge rounded-xl px-4 py-3 bg-card text-fg"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <textarea
            required
            placeholder="Role description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="md:col-span-2 border border-edge rounded-xl px-4 py-3 bg-card text-fg min-h-28"
          />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary px-6 py-3 rounded-xl font-black">
              {editId ? "Update Position" : "Create Position"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyJob);
                }}
                className="btn-soft px-6 py-3 rounded-xl font-black"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card rounded-[32px] p-6">
        <h2 className="text-2xl font-black text-fg mb-4">Openings</h2>
        {loading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-surface-hover" />
        ) : jobs.length === 0 ? (
          <p className="text-fg-muted">No positions created yet.</p>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <div key={job._id} className="border border-edge rounded-2xl p-4 flex flex-wrap gap-3 justify-between">
                <div>
                  <p className="font-black text-fg">{job.title}</p>
                  <p className="text-sm text-fg-muted">
                    {job.department} · {job.location} · {job.applications?.length || 0} applicants
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded-full ${
                      job.status === "open"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => editJob(job)} className="btn-soft px-4 py-2 rounded-xl font-bold">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleJobStatus(job)}
                    className="btn-soft px-4 py-2 rounded-xl font-bold"
                  >
                    {job.status === "open" ? "Close" : "Reopen"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card rounded-[32px] p-6">
        <h2 className="text-2xl font-black text-fg mb-4">Applicants</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {["all", ...APP_STATUS].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setAppFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                appFilter === status ? "btn-primary" : "btn-soft"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>

        {filteredApplications.length === 0 ? (
          <p className="text-fg-muted">No applications in this filter.</p>
        ) : (
          <div className="grid gap-3">
            {filteredApplications.map((app) => (
              <div key={app._id} className="border border-edge rounded-2xl p-4">
                <div className="flex flex-wrap gap-3 justify-between">
                  <div>
                    <p className="font-black text-fg">{app.name}</p>
                    <p className="text-sm text-fg-muted">
                      {app.email} · {app.phone}
                    </p>
                    <p className="text-sm text-fg-muted mt-1">
                      Applied for: <strong>{app.jobTitle || app.position}</strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-start">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-soft px-4 py-2 rounded-xl font-bold"
                    >
                      Download Resume
                    </a>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateApplicationStatus(app.jobId, app._id, e.target.value)
                      }
                      className="border border-edge rounded-xl px-3 py-2 bg-card text-fg text-sm"
                    >
                      {APP_STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {app.coverLetter && (
                  <p className="mt-3 text-sm text-fg-muted line-clamp-3">{app.coverLetter}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
