"use client";

import { Suspense, useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  PhoneCall,
  Search,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useLanguage } from "@/contexts/LanguageContext";
import { campusTabs, phoneDirectory } from "@/data/phoneDirectory";

const ALL_CATEGORY = "all";

const PAGE_COPY = {
  kr: {
    eyebrow: "Campus Contacts",
    title: "전화번호 안내",
    description:
      "캠퍼스별 주요 부서 연락처를 빠르게 찾고 바로 전화 연결할 수 있습니다.",
    languageLabel: "언어",
    allCategory: "전체",
    categoryStat: "카테고리",
    contactsStat: "연락처",
    searchPlaceholder: "부서명 또는 전화번호를 검색하세요",
    clearSearchAria: "검색어 지우기",
    callAction: "전화걸기",
    noResultsTitle: "검색 결과가 없습니다",
    noResultsDescription:
      "부서명, 전화번호, 카테고리 기준으로 다시 검색해보세요.",
  },
  en: {
    eyebrow: "Campus Contacts",
    title: "Phone Directory",
    description:
      "Find key department phone numbers by campus and place a call right away.",
    languageLabel: "Language",
    allCategory: "All",
    categoryStat: "Categories",
    contactsStat: "Contacts",
    searchPlaceholder: "Search by department or phone number",
    clearSearchAria: "Clear search",
    callAction: "Call",
    noResultsTitle: "No results found",
    noResultsDescription:
      "Try searching again by department, phone number, or category.",
  },
  zh: {
    eyebrow: "Campus Contacts",
    title: "电话号码指南",
    description:
      "按校区快速查找主要部门联系电话，并可立即拨打。",
    languageLabel: "语言",
    allCategory: "全部",
    categoryStat: "分类",
    contactsStat: "联系方式",
    searchPlaceholder: "按部门名称或电话号码搜索",
    clearSearchAria: "清除搜索词",
    callAction: "拨打电话",
    noResultsTitle: "没有搜索结果",
    noResultsDescription:
      "请按部门名称、电话号码或分类重新搜索。",
  },
  ja: {
    eyebrow: "Campus Contacts",
    title: "電話番号案内",
    description:
      "キャンパスごとの主要部署連絡先をすばやく探し、すぐに電話をかけられます。",
    languageLabel: "言語",
    allCategory: "すべて",
    categoryStat: "カテゴリ",
    contactsStat: "連絡先",
    searchPlaceholder: "部署名または電話番号で検索",
    clearSearchAria: "検索語を削除",
    callAction: "電話する",
    noResultsTitle: "検索結果がありません",
    noResultsDescription:
      "部署名、電話番号、カテゴリでもう一度検索してください。",
  },
};

const CAMPUS_COPY = {
  수원캠퍼스: {
    label: {
      kr: "수원캠퍼스",
      en: "Suwon Campus",
      zh: "水原校区",
      ja: "スウォンキャンパス",
    },
    address: {
      kr: "경기도 수원시 영통구 광교산로 154-42",
      en: "154-42 Gwanggyosan-ro, Yeongtong-gu, Suwon-si, Gyeonggi-do",
      zh: "京畿道水原市灵通区光教山路154-42",
      ja: "京畿道水原市霊通区光教山路154-42",
    },
    description: {
      kr: "대표번호부터 행정, 학생지원까지 자주 찾는 연락처를 정리했습니다.",
      en: "Browse frequently used contacts from the main line to student support.",
      zh: "整理了从总机到行政、学生支援等常用联系电话。",
      ja: "代表番号から行政、学生支援まで、よく使う連絡先をまとめました。",
    },
  },
  서울캠퍼스: {
    label: {
      kr: "서울캠퍼스",
      en: "Seoul Campus",
      zh: "首尔校区",
      ja: "ソウルキャンパス",
    },
    address: {
      kr: "서울특별시 종로구 대학로 57",
      en: "57 Daehak-ro, Jongno-gu, Seoul",
      zh: "首尔特别市钟路区大学路57",
      ja: "ソウル特別市鍾路区大学路57",
    },
    description: {
      kr: "교학, 입학, 학생지원, 시설 관련 부서를 한눈에 볼 수 있습니다.",
      en: "See academic, admissions, student support, and facilities contacts at a glance.",
      zh: "可一目了然地查看教务、招生、学生支援与设施相关部门。",
      ja: "教務、入学、学生支援、施設関連の部署をひと目で確認できます。",
    },
  },
};

const CATEGORY_COPY = {
  대표번호: {
    kr: "대표번호",
    en: "Main Line",
    zh: "总机",
    ja: "代表番号",
  },
  행정: {
    kr: "행정",
    en: "Administration",
    zh: "行政",
    ja: "行政",
  },
  학사: {
    kr: "학사",
    en: "Academics",
    zh: "教务",
    ja: "学事",
  },
  입학: {
    kr: "입학",
    en: "Admissions",
    zh: "招生",
    ja: "入学",
  },
  학생지원: {
    kr: "학생지원",
    en: "Student Support",
    zh: "学生支援",
    ja: "学生支援",
  },
  시설관리: {
    kr: "시설관리",
    en: "Facilities",
    zh: "设施管理",
    ja: "施設管理",
  },
};

const DEPARTMENT_COPY = {
  "suwon-main-switchboard": {
    name: { kr: "대표번호", en: "Main Operator", zh: "总机", ja: "代表番号" },
    description: {
      kr: "캠퍼스 대표 연결 및 기본 안내",
      en: "General campus operator and basic guidance.",
      zh: "校区总机转接及基本咨询。",
      ja: "キャンパス代表番号への接続と基本案内。",
    },
  },
  "suwon-info-center": {
    name: { kr: "종합안내센터", en: "Information Center", zh: "综合问询中心", ja: "総合案内センター" },
    description: {
      kr: "방문 안내, 위치 문의, 대표 민원 접수",
      en: "Visitor guidance, directions, and general inquiries.",
      zh: "提供访客引导、位置咨询和一般咨询受理。",
      ja: "来訪案内、場所の問い合わせ、代表窓口対応。",
    },
  },
  "suwon-general-affairs": {
    name: { kr: "총무팀", en: "General Affairs Team", zh: "总务组", ja: "総務チーム" },
    description: {
      kr: "총무, 문서, 교내 행정 지원",
      en: "General affairs, documents, and campus administration support.",
      zh: "负责总务、文书和校内行政支援。",
      ja: "総務、文書、学内行政支援。",
    },
  },
  "suwon-finance": {
    name: { kr: "재무회계팀", en: "Finance and Accounting Team", zh: "财务会计组", ja: "財務会計チーム" },
    description: {
      kr: "등록금, 회계, 예산 관련 문의",
      en: "Tuition, accounting, and budget-related inquiries.",
      zh: "注册费、会计和预算相关咨询。",
      ja: "授業料、会計、予算に関する問い合わせ。",
    },
  },
  "suwon-academic-affairs": {
    name: { kr: "교무처", en: "Office of Academic Affairs", zh: "教务处", ja: "教務処" },
    description: {
      kr: "수업 운영, 학사 일정, 수강 관련 문의",
      en: "Course operations, academic calendar, and registration inquiries.",
      zh: "课程运营、学事日程和选课相关咨询。",
      ja: "授業運営、学事日程、履修登録に関する問い合わせ。",
    },
  },
  "suwon-academic-support": {
    name: { kr: "학사지원팀", en: "Academic Support Team", zh: "学事支援组", ja: "学事支援チーム" },
    description: {
      kr: "휴학, 복학, 성적, 졸업 업무 안내",
      en: "Leave of absence, return, grades, and graduation support.",
      zh: "休学、复学、成绩和毕业手续咨询。",
      ja: "休学、復学、成績、卒業手続きの案内。",
    },
  },
  "suwon-admissions-office": {
    name: { kr: "입학처", en: "Admissions Office", zh: "招生处", ja: "入学処" },
    description: {
      kr: "신입학, 편입학, 전형 일정 안내",
      en: "Freshman, transfer, and admissions schedule guidance.",
      zh: "新生入学、插班入学和招生日程咨询。",
      ja: "新入学、編入学、選考日程の案内。",
    },
  },
  "suwon-admissions-center": {
    name: { kr: "입학상담센터", en: "Admissions Help Center", zh: "招生咨询中心", ja: "入学相談センター" },
    description: {
      kr: "전형별 상담 및 제출서류 문의",
      en: "Application consultations and document submission inquiries.",
      zh: "各类招生咨询和提交材料相关咨询。",
      ja: "選考別相談および提出書類に関する問い合わせ。",
    },
  },
  "suwon-student-support": {
    name: { kr: "학생지원팀", en: "Student Support Team", zh: "学生支援组", ja: "学生支援チーム" },
    description: {
      kr: "학생 민원, 증명서, 학교생활 전반 문의",
      en: "Student services, certificates, and campus life support.",
      zh: "学生咨询、证明书和校园生活相关咨询。",
      ja: "学生相談、証明書、学生生活全般の問い合わせ。",
    },
  },
  "suwon-scholarship": {
    name: { kr: "장학복지팀", en: "Scholarship and Welfare Team", zh: "奖学福利组", ja: "奨学福祉チーム" },
    description: {
      kr: "장학금, 복지, 학생 복지제도 안내",
      en: "Scholarships, welfare, and student benefits guidance.",
      zh: "奖学金、福利和学生福利制度咨询。",
      ja: "奨学金、福祉、学生福祉制度の案内。",
    },
  },
  "suwon-facility-management": {
    name: { kr: "시설관리팀", en: "Facilities Management Team", zh: "设施管理组", ja: "施設管理チーム" },
    description: {
      kr: "강의실, 건물, 시설 유지보수 문의",
      en: "Classroom, building, and facility maintenance inquiries.",
      zh: "教室、建筑和设施维护咨询。",
      ja: "講義室、建物、施設の維持補修に関する問い合わせ。",
    },
  },
  "suwon-facility-center": {
    name: { kr: "시설민원센터", en: "Facility Service Center", zh: "设施服务中心", ja: "施設相談センター" },
    description: {
      kr: "냉난방, 조명, 설비 민원 접수",
      en: "Heating, cooling, lighting, and equipment service requests.",
      zh: "制冷供暖、照明和设备问题受理。",
      ja: "冷暖房、照明、設備に関する相談受付。",
    },
  },
  "seoul-main-switchboard": {
    name: { kr: "대표번호", en: "Main Operator", zh: "总机", ja: "代表番号" },
    description: {
      kr: "서울캠퍼스 대표 연결 및 기본 안내",
      en: "Seoul campus operator and basic guidance.",
      zh: "首尔校区总机转接及基本咨询。",
      ja: "ソウルキャンパス代表番号への接続と基本案内。",
    },
  },
  "seoul-info-desk": {
    name: { kr: "캠퍼스안내데스크", en: "Campus Information Desk", zh: "校区问询台", ja: "キャンパス案内デスク" },
    description: {
      kr: "방문객 안내 및 주요 부서 연결",
      en: "Visitor guidance and routing to major departments.",
      zh: "访客引导及主要部门转接。",
      ja: "来訪者案内および主要部署への取次。",
    },
  },
  "seoul-admin-support": {
    name: { kr: "행정지원실", en: "Administrative Support Office", zh: "行政支援室", ja: "行政支援室" },
    description: {
      kr: "일반 행정, 문서, 교내 지원 업무",
      en: "General administration, documents, and campus support services.",
      zh: "一般行政、文书和校内支援业务。",
      ja: "一般行政、文書、学内支援業務。",
    },
  },
  "seoul-human-resources": {
    name: { kr: "인사총무팀", en: "HR and General Affairs Team", zh: "人事总务组", ja: "人事総務チーム" },
    description: {
      kr: "인사, 총무, 교직원 행정 문의",
      en: "Human resources, general affairs, and staff administration inquiries.",
      zh: "人事、总务和教职员行政咨询。",
      ja: "人事、総務、教職員行政に関する問い合わせ。",
    },
  },
  "seoul-academic-support": {
    name: { kr: "교학지원팀", en: "Academic Support Team", zh: "教务支援组", ja: "教学支援チーム" },
    description: {
      kr: "학사 운영, 수업, 학적 관련 문의",
      en: "Academic operations, classes, and student record inquiries.",
      zh: "学事运营、课程和学籍相关咨询。",
      ja: "学事運営、授業、学籍に関する問い合わせ。",
    },
  },
  "seoul-curriculum": {
    name: { kr: "교육과정지원실", en: "Curriculum Support Office", zh: "课程支援室", ja: "教育課程支援室" },
    description: {
      kr: "교육과정, 이수 체계, 졸업 요건 안내",
      en: "Curriculum, degree path, and graduation requirement guidance.",
      zh: "课程、修读体系和毕业要求咨询。",
      ja: "教育課程、履修体系、卒業要件の案内。",
    },
  },
  "seoul-admissions-office": {
    name: { kr: "입학관리팀", en: "Admissions Management Team", zh: "招生管理组", ja: "入学管理チーム" },
    description: {
      kr: "입학 전형, 원서접수, 일정 문의",
      en: "Admissions process, applications, and schedule inquiries.",
      zh: "招生选拔、报名和日程咨询。",
      ja: "入学選考、願書受付、日程に関する問い合わせ。",
    },
  },
  "seoul-transfer-center": {
    name: { kr: "편입학상담실", en: "Transfer Admissions Desk", zh: "插班入学咨询室", ja: "編入学相談室" },
    description: {
      kr: "편입학, 학사편입, 서류 안내",
      en: "Transfer admissions and required documents guidance.",
      zh: "插班入学、学士插班和材料咨询。",
      ja: "編入学、学士編入、書類の案内。",
    },
  },
  "seoul-student-service": {
    name: { kr: "학생서비스센터", en: "Student Service Center", zh: "学生服务中心", ja: "学生サービスセンター" },
    description: {
      kr: "학생 민원, 휴복학, 제증명 문의",
      en: "Student services, leave of absence, and certificate inquiries.",
      zh: "学生咨询、休复学和证明书相关咨询。",
      ja: "学生相談、休復学、各種証明に関する問い合わせ。",
    },
  },
  "seoul-scholarship-center": {
    name: { kr: "장학지원센터", en: "Scholarship Support Center", zh: "奖学支援中心", ja: "奨学支援センター" },
    description: {
      kr: "장학 선발, 국가장학, 생활지원 상담",
      en: "Scholarship selection, national scholarships, and support counseling.",
      zh: "奖学选拔、国家奖学和生活支援咨询。",
      ja: "奨学選抜、国家奨学、生活支援の相談。",
    },
  },
  "seoul-facility-support": {
    name: { kr: "시설지원팀", en: "Facilities Support Team", zh: "设施支援组", ja: "施設支援チーム" },
    description: {
      kr: "건물, 공간, 강의실 시설 유지보수",
      en: "Building, space, and classroom maintenance support.",
      zh: "建筑、空间和教室设施维护。",
      ja: "建物、スペース、講義室施設の維持補修。",
    },
  },
  "seoul-control-room": {
    name: { kr: "통합관제실", en: "Integrated Control Room", zh: "综合管制室", ja: "統合管制室" },
    description: {
      kr: "보안, 출입, 긴급 시설 상황 접수",
      en: "Security, access control, and emergency facility support.",
      zh: "安保、出入和紧急设施情况受理。",
      ja: "警備、出入り、緊急施設状況の受付。",
    },
  },
};

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

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "");

const createTelHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

const getLocalizedText = (value, language) => {
  if (value && typeof value === "object") {
    return value[language] ?? value.en ?? value.kr ?? Object.values(value)[0] ?? "";
  }

  return value ?? "";
};

const getSearchValues = (value) => {
  if (!value) {
    return [];
  }

  if (typeof value === "object") {
    return Object.values(value).filter(Boolean);
  }

  return [value];
};

const matchesKeyword = (keyword, values) =>
  values
    .flatMap((value) => getSearchValues(value))
    .some((value) => normalizeText(value).includes(keyword));

const formatDepartmentCount = (count, language) =>
  language === "kr"
    ? `${count}개 부서`
    : language === "zh"
      ? `${count} 个部门`
      : language === "ja"
        ? `${count} 部署`
        : `${count} departments`;

function PhoneDirectoryContent() {
  const { currentLang } = useLanguage();
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get("lang");
  const requestedCampus = searchParams.get("campus");
  const requestedCategory = searchParams.get("category");
  const requestedKeyword = searchParams.get("q") ?? "";
  const activeCampus = campusTabs.some((item) => item.campus === requestedCampus)
    ? requestedCampus
    : campusTabs[0]?.campus ?? "";
  const [keyword, setKeyword] = useState(requestedKeyword);
  const deferredKeyword = useDeferredValue(keyword);

  const activeLanguage = PAGE_COPY[requestedLanguage]
    ? requestedLanguage
    : PAGE_COPY[currentLang]
      ? currentLang
      : "kr";
  const copy = PAGE_COPY[activeLanguage];
  const currentCampusInfo =
    campusTabs.find((item) => item.campus === activeCampus) ?? campusTabs[0];
  const localizedCampusInfo = CAMPUS_COPY[currentCampusInfo.campus] ?? {};

  const campusSections = useMemo(
    () => phoneDirectory.filter((section) => section.campus === activeCampus),
    [activeCampus],
  );

  const activeCategory =
    requestedCategory &&
    campusSections.some((section) => section.category === requestedCategory)
      ? requestedCategory
      : ALL_CATEGORY;

  useEffect(() => {
    setKeyword(requestedKeyword);
  }, [requestedKeyword]);

  const availableCategories = useMemo(
    () => [
      { id: ALL_CATEGORY, label: copy.allCategory },
      ...campusSections.map((section) => ({
        id: section.category,
        label: getLocalizedText(CATEGORY_COPY[section.category], activeLanguage),
      })),
    ],
    [activeLanguage, campusSections, copy.allCategory],
  );

  const createPhoneHref = ({
    campus = activeCampus,
    category = activeCategory,
    q = keyword,
  } = {}) => {
    const params = new URLSearchParams();

    if (campus) {
      params.set("campus", campus);
    }

    params.set("lang", activeLanguage);

    if (category && category !== ALL_CATEGORY) {
      params.set("category", category);
    }

    if (q.trim()) {
      params.set("q", q.trim());
    }

    return `/phone?${params.toString()}`;
  };

  const filteredSections = useMemo(() => {
    const normalizedKeyword = normalizeText(deferredKeyword);

    return campusSections
      .filter(
        (section) =>
          activeCategory === ALL_CATEGORY || section.category === activeCategory,
      )
      .map((section) => {
        const localizedCategory = getLocalizedText(
          CATEGORY_COPY[section.category],
          activeLanguage,
        );

        const sectionMatched =
          normalizedKeyword.length > 0 &&
          matchesKeyword(normalizedKeyword, [
            section.category,
            CATEGORY_COPY[section.category],
            currentCampusInfo.campus,
            localizedCampusInfo.label,
            localizedCampusInfo.address,
            localizedCampusInfo.description,
          ]);

        const departments = section.departments
          .filter((department) => {
            if (!normalizedKeyword || sectionMatched) {
              return true;
            }

            return matchesKeyword(normalizedKeyword, [
              department.name,
              department.phone,
              department.description,
              DEPARTMENT_COPY[department.id]?.name,
              DEPARTMENT_COPY[department.id]?.description,
              section.category,
              CATEGORY_COPY[section.category],
            ]);
          })
          .map((department) => ({
            ...department,
            localizedName: getLocalizedText(
              DEPARTMENT_COPY[department.id]?.name ?? department.name,
              activeLanguage,
            ),
            localizedDescription: getLocalizedText(
              DEPARTMENT_COPY[department.id]?.description ?? department.description,
              activeLanguage,
            ),
          }));

        return {
          ...section,
          localizedCategory,
          departments,
        };
      })
      .filter((section) => section.departments.length > 0);
  }, [
    activeCategory,
    activeLanguage,
    campusSections,
    currentCampusInfo.campus,
    deferredKeyword,
    localizedCampusInfo.address,
    localizedCampusInfo.description,
    localizedCampusInfo.label,
  ]);

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
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#F36F21]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-normal text-[#27324b]">
            {copy.title}
          </h1>
          <p className="mt-2 break-keep text-sm leading-6 text-[#677489]">
            {copy.description}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-[#aeb9ce] p-1.5">
          {campusTabs.map((tab) => {
            const isActive = tab.campus === activeCampus;

            return (
              <a
                key={tab.id}
                href={createPhoneHref({
                  campus: tab.campus,
                  category: ALL_CATEGORY,
                })}
                role="button"
                aria-pressed={isActive}
                className={`${BUTTON_BASE_CLASS} px-4 py-3 text-sm ${
                  isActive ? BUTTON_ACTIVE_CLASS : BUTTON_IDLE_CLASS
                }`}
              >
                {getLocalizedText(CAMPUS_COPY[tab.campus]?.label ?? tab.label, activeLanguage)}
              </a>
            );
          })}
        </div>

        {currentCampusInfo ? (
          <div className="mt-4 rounded-[22px] border border-[#c2cedf] bg-[#eef3fb] p-4">
            <div className="flex items-start gap-2 text-sm text-[#526076]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F36F21]" />
              <p className="font-semibold leading-5">
                {getLocalizedText(localizedCampusInfo.address ?? currentCampusInfo.address, activeLanguage)}
              </p>
            </div>

            <p className="mt-3 break-keep text-xs leading-5 text-[#8c96a7]">
              {getLocalizedText(
                localizedCampusInfo.description ?? currentCampusInfo.description,
                activeLanguage,
              )}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[18px] border border-[#ffb400]/35 bg-[#FFDBAE] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a6400]">
                  {copy.categoryStat}
                </p>
                <p className="mt-1 text-lg font-extrabold text-[#6f5200]">
                  {campusSections.length}
                </p>
              </div>
              <div className="rounded-[18px] border border-[#00AB39]/30 bg-[#B7DCBC] px-3 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0c6d2d]">
                  {copy.contactsStat}
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

        <form action="/phone" method="get" className="relative mt-5">
          <input type="hidden" name="campus" value={activeCampus} />
          <input type="hidden" name="lang" value={activeLanguage} />
          {activeCategory !== ALL_CATEGORY ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4f6486]" />
          <input
            name="q"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-12 w-full rounded-[20px] border border-[#d5dce7] bg-white pl-11 pr-11 text-sm text-[#27324b] outline-none transition placeholder:text-[#99a3b2] focus:border-[#003876] focus:ring-4 focus:ring-[#c7d8ee]"
          />
          {keyword ? (
            <a
              href={createPhoneHref({ q: "" })}
              role="button"
              aria-label={copy.clearSearchAria}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${ICON_BUTTON_CLASS}`}
            >
              <X className="h-4 w-4" />
            </a>
          ) : null}
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {availableCategories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <a
                key={category.id}
                href={createPhoneHref({ category: category.id })}
                role="button"
                aria-pressed={isActive}
                className={`${BUTTON_BASE_CLASS} shrink-0 px-4 py-2 text-xs ${
                  isActive ? BUTTON_ACTIVE_CLASS : BUTTON_IDLE_CLASS
                }`}
              >
                {category.label}
              </a>
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
                    {section.localizedCategory}
                  </div>
                  <p className="text-xs font-bold text-[#7e8997]">
                    {formatDepartmentCount(section.departments.length, activeLanguage)}
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
                          {department.localizedName}
                        </h2>
                        <p className="mt-1 text-sm font-bold text-[#536076]">
                          {department.phone}
                        </p>
                        <p className="mt-1 break-keep text-xs leading-5 text-[#6d7789]">
                          {department.localizedDescription}
                        </p>
                      </div>

                      <a
                        href={createTelHref(department.phone)}
                        className={`${BUTTON_BASE_CLASS} ${PHONE_BUTTON_CLASS} ${BUTTON_IDLE_CLASS} visited:text-[#003876] active:border-[#003876] active:bg-[#003876] active:text-white`}
                        aria-label={`${department.localizedName} ${copy.callAction} ${department.phone}`}
                      >
                        <PhoneCall className="h-4 w-4" />
                        {copy.callAction}
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
              {copy.noResultsTitle}
            </h2>
            <p className="mt-2 break-keep text-sm leading-6 text-[#6d7789]">
              {copy.noResultsDescription}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function PhonePage() {
  return (
    <Suspense fallback={null}>
      <PhoneDirectoryContent />
    </Suspense>
  );
}
