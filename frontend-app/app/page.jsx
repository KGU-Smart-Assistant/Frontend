"use client";

import { useState, useRef, useEffect } from "react";
import { initialMessages, getMockResponse } from "@/data/mockChatData";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Calendar, Plane, CreditCard } from "lucide-react";

export default function Home() {
  // [프론트엔드 테스트용 State] 대화 목록을 관리합니다.
  const [messages, setMessages] = useState(initialMessages);
  const scrollRef = useRef(null);
  const nextMessageIdRef = useRef(initialMessages.length);

  // 렌더 중 Date.now를 호출하지 않도록, 이벤트마다 순차 ID를 발급합니다.
  const getNextMessageId = () => {
    nextMessageIdRef.current += 1;
    return nextMessageIdRef.current;
  };

  // 메시지가 추가될 때마다 자동으로 맨 아래로 스크롤합니다.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 새로운 메시지를 전송하는 함수
  const handleSendMessage = (text) => {
    // 1. 사용자 메시지 목록에 추가
    const newUserMessage = {
      id: getNextMessageId(),
      sender: "user",
      reply: text,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);

    // 2. 가상의 봇 응답 스케줄링 (자연스러운 딜레이를 위해 0.6초 뒤 전송)
    setTimeout(() => {
      const botResponse = getMockResponse(text);
      const newBotMessage = {
        id: getNextMessageId(),
        sender: "bot",
        reply: botResponse.reply,
        intent: botResponse.intent,
      };
      setMessages((prev) => [...prev, newBotMessage]);
    }, 600); // 0.6초 대기
  };

  // 자주 묻는 질문(Quick Actions) 데이터
  const quickActions = [
    { label: "학사일정", icon: <Calendar size={14} />, query: "학사일정에 대해 알려주세요." },
    { label: "교환학생", icon: <Plane size={14} />, query: "교환학생에 대해서 알려주세요." },
    { label: "등록금/장학", icon: <CreditCard size={14} />, query: "등록금 납부 관련해서 알려주세요." },
  ];

  // h-[calc(100vh-136px)] matches viewport height minus Header(56px) and BottomNav(80px padding area approx)
  return (
    <div className="flex h-[calc(100vh-136px)] flex-col bg-[#C6C9D4]">
      
      {/* 채팅 메시지가 출력되는 스크롤 영역 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide flex flex-col"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      {/* 하단 영역 (Quick Actions + Chat Input) */}
      <div className="relative w-full bg-[#003876] border-t border-[#003876] flex flex-col pt-2 shrink-0">
        {/* 자주 묻는 질문 (Quick Actions) 버튼 그룹 */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide items-center">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(action.query)}
              className="flex items-center gap-1.5 whitespace-nowrap bg-white text-[#003876] py-1.5 px-3 rounded-full text-xs font-medium border border-transparent hover:bg-[#003876] hover:text-white hover:border-white active:bg-[#003876] active:text-white active:border-white transition-colors"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* 텍스트 입력창 */}
        <ChatInput onSendMessage={handleSendMessage} />

        {/* 하단 padding-bottom에 의한 빈 공간을 덮어주기 위한 가상 요소 */}
        <div className="absolute top-full left-0 right-0 h-[100px] bg-[#003876]" />
      </div>
    </div>
  );
}
