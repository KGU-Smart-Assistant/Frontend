import { Calendar, Plane, CreditCard } from "lucide-react";

export default function QuickActions({ onActionClick }) {
  // 자주 묻는 질문(Quick Actions) 데이터
  const quickActions = [
    { label: "학사일정", icon: <Calendar size={14} />, query: "학사일정에 대해 알려주세요.", payload: "QA_1" },
    { label: "교환학생", icon: <Plane size={14} />, query: "교환학생에 대해서 알려주세요.", payload: "QA_2" },
    { label: "등록금/장학", icon: <CreditCard size={14} />, query: "등록금 납부 관련해서 알려주세요.", payload: "QA_3" },
  ];

  return (
    <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide items-center">
      {quickActions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onActionClick(action.query, action.payload)}
          className="flex items-center gap-1.5 whitespace-nowrap bg-white text-[#003876] py-1.5 px-3 rounded-full text-xs font-medium border border-transparent hover:bg-[#003876] hover:text-white hover:border-white active:bg-[#003876] active:text-white active:border-white transition-colors"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
}
