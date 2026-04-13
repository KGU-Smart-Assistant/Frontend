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
const BUTTON_BASE_CLASS =
  "rounded-full border font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003876] focus-visible:ring-offset-2";
const BUTTON_ACTIVE_CLASS =
  "border-[#003876] bg-[#003876] text-white shadow-[0_12px_24px_rgba(0,56,118,0.18)]";
const BUTTON_IDLE_CLASS =
  "border-[#d7dfeb] bg-white text-[#003876] hover:border-[#95a8c7]";
const PHONE_BUTTON_CLASS =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-xs";
const ICON_BUTTON_CLASS =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d7dfeb] bg-white text-[#607290] transition hover:border-[#95a8c7] active:border-[#003876] active:bg-[#003876] active:text-white";

const categoryToneMap = {
  대표번호: {
    badge: "border-[#F36F21] bg-[#F9C1B0] text-[#9b4a1f]",
    icon: "bg-[#F9C1B0] text-[#F36F21]",
  },
  행정: {
    badge: "border-[#003876] bg-[#C6C9D4] text-[#003876]",
    icon: "bg-[#C6C9D4] text-[#003876]",
  },
  학사: {
    badge: "border-[#ffb400] bg-[#FFDBAE] text-[#8a6400]",
    icon: "bg-[#FFDBAE] text-[#b57d00]",
  },
  입학: {
    badge: "border-[#F36F21] bg-[#F9C1B0] text-[#9b4a1f]",
    icon: "bg-[#F9C1B0] text-[#F36F21]",
  },
  학생지원: {
    badge: "border-[#00AB39] bg-[#B7DCBC] text-[#0c6d2d]",
    icon: "bg-[#B7DCBC] text-[#00AB39]",
  },
  시설관리: {
    badge: "border-[#003876] bg-[#C6C9D4] text-[#003876]",
    icon: "bg-[#C6C9D4] text-[#003876]",
  },
};

const defaultTone = {
  badge: "border-[#003876] bg-[#C6C9D4] text-[#003876]",
  icon: "bg-[#C6C9D4] text-[#003876]",
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
    <main className="min-h-[calc(100dvh-136px)] bg-[#C6C9D4] px-4 py-5 text-[#27324b]">
      <section className="rounded-[28px] border border-[#d8dce6] bg-[#f9fbff] p-4 shadow-[0_18px_40px_rgba(42,53,80,0.08)]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#F36F21]">
            Campus Contacts
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-[-0.05em] text-[#27324b]">
            전화번호 안내
          </h1>
          <p className="mt-2 break-keep text-sm leading-6 text-[#677489]">
            캠퍼스별 주요 부서 연락처를 빠르게 찾고 바로 전화 연결할 수 있습니다.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-[#aeb9ce] p-1.5">
          {campusTabs.map((tab) => {
            const isActive = tab.campus === activeCampus;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCampus(tab.campus)}
                aria-pressed={isActive}
                className={`${BUTTON_BASE_CLASS} px-4 py-3 text-sm ${
                  isActive
                    ? BUTTON_ACTIVE_CLASS
                    : BUTTON_IDLE_CLASS
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {currentCampusInfo ? (
          <div className="mt-4 rounded-[22px] border border-[#c2cedf] bg-[#eef3fb] p-4">
            <div className="flex items-start gap-2 text-sm text-[#526076]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F36F21]" />
              <p className="font-semibold leading-5">{currentCampusInfo.address}</p>
            </div>

            <p className="mt-3 break-keep text-xs leading-5 text-[#8c96a7]">
              {currentCampusInfo.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[18px] border border-[#ffb400]/35 bg-[#FFDBAE] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a6400]">
                  Category
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#6f5200]">
                  {campusSections.length}개
                </p>
              </div>
              <div className="rounded-[18px] border border-[#00AB39]/30 bg-[#B7DCBC] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0c6d2d]">
                  Contacts
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#0c6d2d]">
                  {visibleCount}
                  <span className="ml-1 text-xs font-bold text-[#476954]">
                    / {campusContactCount}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4f6486]" />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="부서명 또는 전화번호를 검색하세요"
            className="h-12 w-full rounded-[20px] border border-[#d5dce7] bg-white pl-11 pr-11 text-sm text-[#27324b] outline-none transition placeholder:text-[#99a3b2] focus:border-[#003876] focus:ring-4 focus:ring-[#c7d8ee]"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="검색어 지우기"
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${ICON_BUTTON_CLASS}`}
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
                className={`${BUTTON_BASE_CLASS} shrink-0 px-4 py-2 text-xs ${
                  isActive
                    ? BUTTON_ACTIVE_CLASS
                    : BUTTON_IDLE_CLASS
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
                className="space-y-3 rounded-[28px] border border-[#b5c2d8] bg-[#b5c0d4] p-4"
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
                      className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-[24px] border border-[#dce2eb] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(50,58,74,0.05)]"
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
                        className={`${BUTTON_BASE_CLASS} ${PHONE_BUTTON_CLASS} ${BUTTON_IDLE_CLASS} visited:text-[#003876] active:border-[#003876] active:bg-[#003876] active:text-white`}
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
          <div className="rounded-[28px] border border-dashed border-[#d0d6e3] bg-white/90 px-6 py-10 text-center shadow-[0_12px_28px_rgba(50,58,74,0.05)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C6C9D4] text-[#003876]">
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
