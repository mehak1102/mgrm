import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import enExtra from "./locales/extra-en.json";
import hiExtra from "./locales/extra-hi.json";
import { deepMergeLocale } from "./mergeLocales";

const enMerged = deepMergeLocale(en, enExtra);

const STORAGE_KEY = "mgrm-lang";

let hindiLoadPromise = null;

function loadHindiBundle() {
  if (i18n.hasResourceBundle("hi", "translation")) {
    return Promise.resolve();
  }
  if (!hindiLoadPromise) {
    hindiLoadPromise = import("./locales/hi.json").then((mod) => {
      const hiMerged = deepMergeLocale(mod.default || mod, hiExtra);
      i18n.addResourceBundle("hi", "translation", hiMerged, true, true);
    });
  }
  return hindiLoadPromise;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enMerged },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
    },
    react: {
      useSuspense: false,
    },
  });

if (i18n.language?.startsWith("hi")) {
  loadHindiBundle();
}

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng?.startsWith("hi") ? "hi" : "en";
  if (lng?.startsWith("hi")) {
    loadHindiBundle();
  }
});

document.documentElement.lang = i18n.language?.startsWith("hi") ? "hi" : "en";

export { STORAGE_KEY, loadHindiBundle };
export default i18n;
