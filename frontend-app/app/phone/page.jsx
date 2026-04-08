"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Building2, MapPin, PhoneCall, Search, X } from "lucide-react";

import { campusTabs, phoneDirectory } from "@/data/phoneDirectory";

const ALL_CATEGORY = "전체";

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "");

const createTelHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

const categoryToneMap = {
  대표번호: {
    badge: "border-[#f4cfb3] bg-[#fff1e5] text-[#d47d48]",
    icon: "bg-[#dce9ff] text-[#6c97d4]",
  },
  행정: {
    badge: "border-[#cfe0ff] bg-[#edf4ff] text-[#5c80ba]",
    icon: "bg-[#dce9ff] text-[#6c97d4]",
  },
  학사: {
    badge: "border-[#cde6d8] bg-[#eef7f1] text-[#4d8b72]",
    icon: "bg-[#dcefe7] text-[#4d8b72]",
  },
  입학: {
    badge: "border-[#f4d8b7] bg-[#fff7ec] text-[#c28743]",
    icon: "bg-[#fff1da] text-[#c28743]",
  },
  학생지원: {
    badge: "border-[#d8d5f4] bg-[#f5f3ff] text-[#7067b5]",
    icon: "bg-[#ece8ff] text-[#7067b5]",
  },
  시설관리: {
    badge: "border-[#d3e5da] bg-[#edf7f1] text-[#4a8a70]",
    icon: "bg-[#dcefe7] text-[#4a8a70]",
  },
};

const defaultTone = {
  badge: "border-[#d9dee6] bg-[#f4f7fa] text-[#64748b]",
  icon: "bg-[#e7eef6] text-[#64748b]",
};

export default function PhonePage() {
  const [activeCampus, setActiveCampus] = useState(campusTabs[0]?.campus ?? "");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);

  const currentCampusInfo =
    campusTabs.find((item) => item.campus === activeCampus) ?? campusTabs[0];

  const campusSections = useMemo(
    () => phoneDirectory.filter((section) => section.campus === activeCampus),
    [activeCampus],
  );

  const availableCategories = useMemo(
    () => [ALL_CATEGORY, ...campusSections.map((section) => section.category)],
    [campusSections],
  );

  useEffect(() => {
    if (!availableCategories.includes(activeCategory)) {
      setActiveCategory(ALL_CATEGORY);
    }
  }, [activeCategory, availableCategories]);

  const filteredSections = useMemo(() => {
    const normalizedKeyword = normalizeText(deferredKeyword);

    return campusSections
      .filter(
        (section) =>
          activeCategory === ALL_CATEGORY || section.category === activeCategory,
      )
      .map((section) => {
        const sectionMatched =
          normalizedKeyword.length > 0 &&
          [section.category, section.campus].some((value) =>
            normalizeText(value).includes(normalizedKeyword),
          );

        const departments = section.departments.filter((department) => {
          if (!normalizedKeyword || sectionMatched) {
            return true;
          }

          return [
            department.name,
            department.phone,
            department.description,
            section.category,
            section.campus,
          ].some((value) => normalizeText(value).includes(normalizedKeyword));
        });

        return {
          ...section,
          departments,
        };
      })
      .filter((section) => section.departments.length > 0);
  }, [activeCategory, campusSections, deferredKeyword]);

  const campusContactCount = campusSections.reduce(
    (total, section) => total + section.departments.length,
    0,
  );

  const visibleCount = filteredSections.reduce(
    (total, section) => total + section.departments.length,
    0,
  );

  return (
    <main className="min-h-[calc(100dvh-136px)] bg-[#f7f2ea] px-4 py-5 text-[#27324b]">
      <section className="rounded-[28px] border border-[#eadfd2] bg-[#fffaf4] p-4 shadow-[0_18px_40px_rgba(42,53,80,0.06)]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#d6814d]">
            Campus Contacts
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-[-0.05em] text-[#27324b]">
            전화번호 안내
          </h1>
          <p className="mt-2 break-keep text-sm leading-6 text-[#677489]">
            캠퍼스별 주요 부서 연락처를 빠르게 찾고 바로 전화 연결할 수 있습니다.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-[#efe8de] p-1.5">
          {campusTabs.map((tab) => {
            const isActive = tab.campus === activeCampus;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCampus(tab.campus)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-3 text-sm font-extrabold transition ${
                  isActive
                    ? "bg-[#f4a15e] text-white shadow-[0_12px_24px_rgba(244,161,94,0.22)]"
                    : "bg-[#f7f1e7] text-[#7a8597]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {currentCampusInfo ? (
          <div className="mt-4 rounded-[22px] border border-[#ece1d3] bg-white/70 p-4">
            <div className="flex items-start gap-2 text-sm text-[#526076]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d6814d]" />
              <p className="font-semibold leading-5">{currentCampusInfo.address}</p>
            </div>

            <p className="mt-3 break-keep text-xs leading-5 text-[#8c96a7]">
              {currentCampusInfo.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[18px] bg-[#f8f2ea] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9a8671]">
                  Category
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#374151]">
                  {campusSections.length}개
                </p>
              </div>
              <div className="rounded-[18px] bg-[#edf6eb] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5d8a75]">
                  Contacts
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#2f6d59]">
                  {visibleCount}
                  <span className="ml-1 text-xs font-bold text-[#6c8178]">
                    / {campusContactCount}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90a0b2]" />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="부서명 또는 전화번호를 검색하세요"
            className="h-12 w-full rounded-[20px] border border-[#e4d9cb] bg-white pl-11 pr-11 text-sm text-[#27324b] outline-none transition placeholder:text-[#99a3b2] focus:border-[#efaa6f] focus:ring-4 focus:ring-[#f7d7bb]"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#8995a7] transition hover:bg-[#f6efe6]"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {availableCategories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                  isActive
                    ? "border-[#efaa6f] bg-[#fef0e4] text-[#c87441]"
                    : "border-[#e7dbcc] bg-white text-[#7b8798]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-5 space-y-5">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => {
            const tone = categoryToneMap[section.category] ?? defaultTone;

            return (
              <section
                key={`${section.campus}-${section.category}`}
                className="space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold ${tone.badge}`}
                  >
                    <Building2 className="h-4 w-4" />
                    {section.category}
                  </div>
                  <p className="text-xs font-bold text-[#7e8997]">
                    {section.departments.length}개 부서
                  </p>
                </div>

                <div className="space-y-3">
                  {section.departments.map((department) => (
                    <article
                      key={department.id}
                      className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-[24px] border border-[#ebe3d8] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(50,58,74,0.05)]"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full ${tone.icon}`}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-[16px] font-extrabold tracking-[-0.02em] text-[#2a3550]">
                          {department.name}
                        </h2>
                        <p className="mt-1 text-sm font-bold text-[#536076]">
                          {department.phone}
                        </p>
                        <p className="mt-1 break-keep text-xs leading-5 text-[#6d7789]">
                          {department.description}
                        </p>
                      </div>

                      <a
                        href={createTelHref(department.phone)}
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#67cfad] px-4 py-2 text-xs font-extrabold whitespace-nowrap text-white transition hover:bg-[#57c09d]"
                        aria-label={`${department.name} 전화걸기 ${department.phone}`}
                      >
                        <PhoneCall className="h-4 w-4" />
                        전화걸기
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#dbd0c3] bg-white/90 px-6 py-10 text-center shadow-[0_12px_28px_rgba(50,58,74,0.05)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5ebe0] text-[#d18256]">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-[#27324b]">
              검색 결과가 없습니다
            </h2>
            <p className="mt-2 break-keep text-sm leading-6 text-[#6d7789]">
              부서명, 전화번호, 카테고리 기준으로 다시 검색해보세요.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
