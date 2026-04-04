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
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
          K
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">KGU Assistant</h1>
          <p className="text-[11px] text-gray-500">Campus guide</p>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Globe size={14} className="text-gray-500" />
          <span className="font-medium">Language</span>
        </button>

        {isLangOpen && (
          <>
            {/* Click outside overlay */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsLangOpen(false)} 
            />
            {/* Language dropdown card */}
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