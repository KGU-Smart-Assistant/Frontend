"use client";

import { createContext, useContext, useState } from "react";
import kr from "@/localisation_kr/mainpage.json";
import en from "@/localisation_en/mainpage.json";
import zh from "@/localisation_zh/mainpage.json";
import ja from "@/localisation_ja/mainpage.json";

const dictionaries = {
  kr,
  en,
  zh,
  ja
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
  const t = (keyPath) => {
    const keys = keyPath.split(".");
    let current = dictionaries[currentLang];
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
