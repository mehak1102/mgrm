import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../src");

const REPLACEMENTS = [
  ["dark:from-zinc-950", "from-[var(--bg-primary)]"],
  ["dark:via-zinc-950", "via-[var(--bg-primary)]"],
  ["dark:to-zinc-950", "to-[var(--bg-primary)]"],
  ["dark:from-slate-950", "from-[var(--bg-primary)]"],
  ["dark:via-slate-950", "via-[var(--bg-primary)]"],
  ["dark:to-slate-950", "to-[var(--bg-primary)]"],
  ["dark:via-slate-900", "via-[var(--bg-secondary)]"],
  ["dark:to-slate-900", "to-[var(--bg-secondary)]"],
  ["dark:from-slate-900", "from-[var(--bg-secondary)]"],
  ["dark:to-slate-950/95", "to-[var(--bg-primary)]/95"],
  ["dark:text-slate-400", "text-fg-muted"],
  ["dark:text-slate-300", "text-fg-muted"],
  ["dark:text-zinc-50", "text-fg"],
  ["dark:text-gray-200", "text-fg"],
  ["dark:text-slate-700", "text-fg"],
  ["dark:border-slate-700", "border-edge"],
  ["dark:border-zinc-800", "border-edge"],
  ["dark:bg-[#111827]", "bg-card"],
  ["dark:bg-[#0b1020]", "bg-app-muted"],
  ["dark:bg-white/5", "bg-card/50"],
  ["dark:from-cyan-400", "from-[var(--accent-primary)]"],
  ["dark:to-blue-400", "to-[var(--accent-secondary)]"],
  ["dark:from-cyan-900/60", "from-[color-mix(in_srgb,var(--accent-primary)_40%,transparent)]"],
  ["dark:to-blue-900/60", "to-[color-mix(in_srgb,var(--accent-secondary)_40%,transparent)]"],
  ["dark:text-emerald-400", "text-emerald-500"],
  ["dark:hover:border-cyan-500/30", "hover:border-[var(--accent-primary)]/30"],
  ["dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]", "hover:shadow-[0_0_30px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]"],
  ["dark:shadow-[0_18px_45px_rgba(15,23,42,0.10)]", "shadow-[0_18px_45px_rgba(15,23,42,0.10)]"],
  ["dark:shadow-[0_25px_70px_rgba(0,0,0,0.35)]", "shadow-[0_25px_70px_rgba(0,0,0,0.35)]"],
  ["dark:shadow-[0_30px_90px_rgba(0,0,0,0.4)]", "shadow-[0_30px_90px_rgba(0,0,0,0.4)]"],
  ["dark:shadow-[0_30px_90px_rgba(0,0,0,0.45)]", "shadow-[0_30px_90px_rgba(0,0,0,0.45)]"],
  ["dark:shadow-[0_35px_100px_rgba(0,0,0,0.45)]", "shadow-[0_35px_100px_rgba(0,0,0,0.45)]"],
  ["dark:shadow-[0_40px_120px_rgba(0,0,0,0.55)]", "shadow-[0_40px_120px_rgba(0,0,0,0.55)]"],
  ["dark:shadow-[0_15px_40px_rgba(0,0,0,0.35)]", "shadow-[0_15px_40px_rgba(0,0,0,0.35)]"],
  ["dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]", "shadow-[0_20px_50px_rgba(0,0,0,0.35)]"],
  ["dark:shadow-[0_15px_50px_rgba(0,0,0,0.25)]", "shadow-[0_15px_50px_rgba(0,0,0,0.25)]"],
  ["dark:shadow-[0_0_30px_rgba(34,211,238,0.32)]", "shadow-[0_0_30px_color-mix(in_srgb,var(--accent-primary)_32%,transparent)]"],
  ["dark:hover:bg-slate-700", "hover:bg-surface-hover"],
  ["dark:to-slate-950/95", "to-[var(--bg-primary)]/95"],
  ["dark:from-[#0d1b34]", "from-[var(--bg-secondary)]"],
  ["dark:via-[#142544]", "via-[var(--card-bg)]"],
  ["dark:to-[#10203d]", "to-[var(--bg-primary)]"],
  ["dark:from-[#10203d]", "from-[var(--bg-primary)]"],
  ["dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]", "shadow-[0_30px_100px_rgba(0,0,0,0.35)]"],
  ["dark:brightness-110", "brightness-110"],
  ["dark:drop-shadow-[0_0_24px_rgba(34,211,238,0.25)]", "drop-shadow-[0_0_24px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]"],
  ["dark:bg-cyan-500/10", "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]"],
  ["dark:bg-purple-500/10", "bg-purple-500/10"],
  ["dark:opacity-100", "opacity-100"],
  ["dark:via-slate-900/72", "via-[var(--bg-primary)]/72"],
  ["dark:from-zinc-950/88", "from-[var(--bg-primary)]/88"],
  ["dark:via-zinc-950/72", "via-[var(--bg-primary)]/72"],
  ["dark:to-zinc-950/90", "to-[var(--bg-primary)]/90"],
  ["dark:from-slate-950/92", "from-[var(--bg-primary)]/92"],
  ["dark:via-slate-950/75", "via-[var(--bg-primary)]/75"],
  ["dark:to-slate-900/40", "to-[var(--bg-secondary)]/40"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name !== "theme" && name !== "scripts") walk(p, files);
    } else if (/\.(jsx|tsx)$/.test(name) && !name.includes("ThemeToggle")) {
      files.push(p);
    }
  }
  return files;
}

let total = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content);
    total++;
    console.log("updated:", path.relative(SRC, file));
  }
}
console.log(`Pass 2 done. ${total} files updated.`);
