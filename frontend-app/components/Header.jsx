"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("한국어");

  const languages = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本語" },
  ];

  const selectLang = (label) => {
    setCurrentLang(label);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between px-4 bg-[#003876] text-white border-b">

      {/* 왼쪽 제목 */}
      <div className="font-bold text-sm">
        KGU Smart Assistant
      </div>

      {/* 오른쪽 언어 버튼 */}
      <div className="relative">
        <button 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-1.5 rounded-lg border border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
        >
          <Globe size={14} />
          <span className="font-medium">{currentLang}</span>
        </button>

        {isLangOpen && (
          <>
            {/* 바깥 클릭 닫기 */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsLangOpen(false)} 
            />

            {/* 드롭다운 */}
            <div className="absolute right-0 top-full mt-2 w-28 rounded-xl border border-gray-100 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-1">
              <ul className="flex flex-col text-[13px] text-gray-700">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => selectLang(lang.label)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                        currentLang === lang.label 
                          ? "font-semibold text-[#003876] bg-blue-50/30" 
                          : "font-medium"
                      }`}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

    </header>
  );
}