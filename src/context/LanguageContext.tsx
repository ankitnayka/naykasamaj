"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../locales/en.json";
import gu from "../locales/gu.json";

type Language = "en" | "gu";

interface Translations {
  common: Record<string, string>;
  nav: Record<string, string>;
  home: Record<string, any>;
  footer: Record<string, string>;
  appDownload: Record<string, string>;
  bhavan: Record<string, string>;
}

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("gu");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage for saved language
    const savedLang = localStorage.getItem("nayka-lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "gu")) {
      setLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("nayka-lang", lang);
  };

  const toggleLanguage = () => {
    handleSetLanguage(language === "en" ? "gu" : "en");
  };

  const translations = (language === "en" ? en : gu) as unknown as Translations;

  // Render dummy on server to avoid hydration mismatch if needed
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "gu", setLanguage: handleSetLanguage, t: gu as unknown as Translations, toggleLanguage }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
