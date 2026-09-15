import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import es from "./locales/es.json";

const applyHtmlLang = (lng: string): void => {
  document.documentElement.lang = lng.startsWith("es") ? "es" : "en";
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => applyHtmlLang(i18n.language))
  .catch(() => {
    // Init failed — leave <html lang> at its static default (en).
  });

i18n.on("languageChanged", applyHtmlLang);

export default i18n;
