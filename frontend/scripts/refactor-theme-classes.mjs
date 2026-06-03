/**
 * One-off: replace common dark: Tailwind pairs with semantic theme token utilities.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../src");

const REPLACEMENTS = [
  // backgrounds — order matters (longer first)
  ["bg-white/95 dark:bg-slate-950/95", "bg-app/95"],
  ["bg-white/90 dark:bg-slate-950/90", "bg-app/90"],
  ["bg-white/80 dark:bg-slate-900/90", "bg-card/90"],
  ["bg-white/70 dark:bg-slate-900/80", "bg-card/80"],
  ["bg-white dark:bg-slate-950", "bg-app"],
  ["bg-white dark:bg-zinc-950", "bg-app"],
  ["dark:bg-slate-950", "bg-app"],
  ["dark:bg-zinc-950", "bg-app"],
  ["bg-[#f6f7fb] dark:bg-zinc-950", "bg-app-muted"],
  ["bg-[#f7f8fb] dark:bg-zinc-950", "bg-app-muted"],
  ["bg-[#eef7ff] dark:bg-slate-950", "bg-app-muted"],
  ["bg-white dark:bg-zinc-900", "bg-card"],
  ["bg-white dark:bg-slate-900", "bg-card"],
  ["dark:bg-zinc-900", "bg-card"],
  ["dark:bg-slate-900", "bg-card"],
  ["bg-slate-50 dark:bg-slate-900/90", "bg-card/90"],
  ["bg-slate-50 dark:bg-zinc-800", "bg-surface-hover"],
  ["dark:bg-zinc-800", "bg-surface-hover"],
  ["dark:bg-slate-800", "bg-surface-hover"],
  // text
  ["text-slate-950 dark:text-white", "text-fg"],
  ["text-slate-900 dark:text-white", "text-fg"],
  ["text-slate-900 dark:text-zinc-100", "text-fg"],
  ["text-gray-900 dark:text-zinc-100", "text-fg"],
  ["text-slate-800 dark:text-zinc-200", "text-fg"],
  ["text-slate-700 dark:text-zinc-300", "text-fg"],
  ["text-gray-600 dark:text-zinc-300", "text-fg-muted"],
  ["text-gray-600 dark:text-gray-300", "text-fg-muted"],
  ["text-gray-500 dark:text-zinc-400", "text-fg-muted"],
  ["text-gray-400 dark:text-zinc-500", "text-fg-muted/80"],
  ["dark:text-zinc-100", "text-fg"],
  ["dark:text-white", "text-fg"],
  ["dark:text-zinc-400", "text-fg-muted"],
  ["dark:text-zinc-300", "text-fg-muted"],
  ["dark:text-zinc-500", "text-fg-muted/80"],
  ["dark:text-gray-300", "text-fg-muted"],
  ["dark:text-zinc-200", "text-fg"],
  // borders
  ["border-slate-200 dark:border-zinc-700", "border-edge"],
  ["border-slate-100 dark:border-white/10", "border-edge"],
  ["border-gray-100 dark:border-white/10", "border-edge"],
  ["dark:border-white/10", "border-edge"],
  ["dark:border-zinc-700", "border-edge"],
  ["border border-slate-200 dark:border-white/15", "border border-edge"],
  // hovers
  ["hover:bg-gray-100 dark:hover:bg-zinc-800", "hover:bg-surface-hover"],
  ["hover:bg-gray-50 dark:hover:bg-zinc-800", "hover:bg-surface-hover"],
  ["dark:hover:bg-zinc-800", "hover:bg-surface-hover"],
  ["hover:bg-slate-50 dark:hover:bg-zinc-800", "hover:bg-surface-hover"],
  ["hover:bg-cyan-50 dark:hover:bg-zinc-800", "hover:bg-surface-hover"],
  ["dark:hover:bg-slate-800", "hover:bg-surface-hover"],
  // accents
  ["dark:text-cyan-400", "text-brand"],
  ["dark:text-cyan-300", "text-brand"],
  ["text-cyan-600 dark:text-cyan-400", "text-brand"],
  // placeholders
  ["placeholder:text-slate-500 dark:placeholder:text-slate-400", "placeholder:text-fg-muted"],
  ["dark:placeholder:text-slate-400", "placeholder:text-fg-muted"],
  // focus / ring offsets
  ["dark:focus-visible:ring-offset-zinc-900", "focus-visible:ring-offset-[var(--bg-primary)]"],
  ["dark:focus:ring-cyan-400/35", "focus:ring-[var(--accent-primary)]/35"],
  // toaster / misc
  ["!bg-white dark:bg-zinc-900 !text-slate-900 dark:!bg-zinc-800 dark:!text-zinc-100 !border !border-slate-200 dark:!border-zinc-700", "!bg-card !text-fg !border-edge"],
  ["min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-zinc-100", "min-h-screen bg-app text-fg"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name !== "theme" && name !== "scripts") walk(p, files);
    } else if (/\.(jsx|tsx|css)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

let total = 0;
for (const file of walk(SRC)) {
  if (file.includes("ThemeToggle.jsx")) continue;
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
console.log(`Done. ${total} files updated.`);
