"use client";

import { createContext, useContext, useState } from "react";
import krMain from "@/localisation_kr/mainpage.json";
import enMain from "@/localisation_en/mainpage.json";
import zhMain from "@/localisation_zh/mainpage.json";
import jaMain from "@/localisation_ja/mainpage.json";
import krPhone from "@/localisation_kr/phone.json";
import enPhone from "@/localisation_en/phone.json";
import zhPhone from "@/localisation_zh/phone.json";
import jaPhone from "@/localisation_ja/phone.json";

const dictionaries = {
  kr: { ...krMain, ...krPhone },
  en: { ...enMain, ...enPhone },
  zh: { ...zhMain, ...zhPhone },
  ja: { ...jaMain, ...jaPhone }
};

const LanguageContext = createContext();
const defaultLanguage = "kr";

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const lang = new URLSearchParams(window.location.search).get("lang");
  return dictionaries[lang] ? lang : defaultLanguage;
};

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(getInitialLanguage); // 기본 언어: 한국어(kr)

  // 다국어 번역을 위한 t 함수
  const t = (keyPath, language = currentLang) => {
    const keys = keyPath.split(".");
    let current = dictionaries[language] ?? dictionaries[currentLang];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return keyPath; // 키에 해당하는 값이 없으면 키를 그대로 반환
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
