const loaded = new Set(["light"]);

export async function loadThemeStyles(themeId) {
  if (!themeId || themeId === "light" || loaded.has(themeId)) return;
  loaded.add(themeId);
  if (themeId === "dark") {
    await import("./dark-bundle.css");
  } else if (themeId === "blue") {
    await import("./blue-bundle.css");
  }
}
