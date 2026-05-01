"use client";

import { createContext, useContext, useState } from "react";
import kr from "@/localisation_kr/mainpage.json";
import en from "@/localisation_en/mainpage.json";
import zh from "@/localisation_zh/mainpage.json";
import ja from "@/localisation_ja/mainpage.json";
import map_kr from "@/localisation_kr/mappage.json";
import map_en from "@/localisation_en/mappage.json";
import map_ja from "@/localisation_ja/mappage.json";
import map_zh from "@/localisation_zh/mappage.json";

const dictionaries = {
  kr: { ...kr, ...map_kr },
  en: { ...en, ...map_en },
  zh: { ...zh, ...map_zh },
  ja: { ...ja, ...map_ja }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState("kr"); // 기본 언어: 한국어(kr)

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
