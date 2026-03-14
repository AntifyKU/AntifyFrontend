import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

export function useAppTranslation() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const preferredLanguage = user?.preferences?.language ?? "english";

  useEffect(() => {
    const langCode = preferredLanguage === "thai" ? "th" : "en";
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode);
    }
  }, [preferredLanguage, i18n]);

  return { t, i18n };
}
