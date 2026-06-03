/**
 * Re-attach original dark: Tailwind variants alongside token utilities.
 * Only affects appearance when .dark is on <html> (dark theme only).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "../src");

const REPLACEMENTS = [
  ["bg-card rounded", "bg-card dark:bg-zinc-900 rounded"],
  ["bg-card/95", "bg-card/95 dark:bg-[#111827]/80"],
  ["bg-card/90", "bg-card/90 dark:bg-zinc-900/90"],
  ["bg-card/80", "bg-card/80 dark:bg-zinc-900/80"],
  ["bg-card ", "bg-card dark:bg-zinc-900 "],
  ["text-fg-muted", "text-gray-500 dark:text-zinc-400"],
  ["text-fg ", "text-slate-900 dark:text-zinc-100 "],
  ["border-edge", "border-slate-200 dark:border-white/10"],
  ["hover:bg-surface-hover", "hover:bg-gray-50 dark:hover:bg-zinc-800"],
  ["bg-app-muted", "bg-app-muted dark:bg-[#0b1020]"],
  ["bg-app ", "bg-app dark:bg-zinc-950 "],
  ["bg-app/", "bg-app dark:bg-zinc-950/"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (!["theme", "scripts"].includes(name)) walk(p, files);
    } else if (/\.jsx$/.test(name) && !/Login|Register|Navbar|App|Checkout|Shop/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

let n = 0;
for (const file of walk(SRC)) {
  let c = fs.readFileSync(file, "utf8");
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (c.includes(from) && !c.includes(to)) {
      const next = c.split(from).join(to);
      if (next !== c) {
        c = next;
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(file, c);
    n++;
    console.log(path.relative(SRC, file));
  }
}
console.log(`Restored dark: variants in ${n} files.`);
