import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./locales/en.json";
import th from "./locales/th.json";

export const PREFS_STORAGE_KEY = "app_preferences";

export const resources = {
  en: { translation: en },
  th: { translation: th },
} as const;

const initI18n = async () => {
  let lng = "en";
  try {
    const stored = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      lng = parsed.language === "thai" ? "th" : "en";
    }
  } catch {
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    compatibilityJSON: "v4",
  });
};

initI18n();

export default i18n;