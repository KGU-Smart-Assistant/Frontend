// [목업/테스트용 데이터]
// 백엔드 API 연동 전에 화면 UI를 구성하고 테스트하기 위해 만든 가상의 대화 데이터 및 응답 생성기입니다.

// 초기 인사말 데이터
export const initialMessages = [
  {
    id: 1,
    sender: "bot",
    reply: "안녕하세요! 경기대학교 챗봇입니다. 🏫\n수원캠퍼스·서울캠퍼스의 학사일정, 교환학생(SEP), 등록금 납부, 강의실 안내 등 궁금한 점을 물어보세요!\n\n💡 아래 버튼을 눌러 빠르게 질문할 수도 있어요.",
    intent: "일반"
  }
];

// 사용자의 질문(또는 버튼 클릭)에 따라 적절한 목업 응답을 반환하는 함수
export const getMockResponse = (query) => {
  if (query.includes("학사일정")) {
    return {
      reply: "2026학년도 주요 학사일정을 안내해 드리겠습니다.\n\n[1학기]\n- 수강신청: 2월 중순\n- 개강: 3월 첫째 주\n- 중간고사: 4월 셋째 주\n- 기말고사: 6월 셋째 주\n\n자세한 사항은 학교 홈페이지 공지사항을 참고해주세요!",
      intent: "일반"
    };
  } else if (query.includes("교환학생")) {
    return {
      reply: "교환학생(SEP) 프로그램에 대해 안내해 드립니다. 국제교류처 홈페이지에서 이번 학기 모집 공고 및 지원 자격을 확인하실 수 있습니다.",
      intent: "일반"
    };
  } else if (query.includes("등록금") || query.includes("장학")) {
    return {
      reply: "등록금 납부 및 장학금 관련 안내입니다. 정규 등록 기간은 2월 초 ~ 2월 말이며, 장학금 신청은 한국장학재단 및 종합정보시스템을 통해 진행됩니다.",
      intent: "일반"
    };
  } else if (query.includes("지도") || query.includes("위치") || query.includes("어디야")) {
    return {
      reply: "요청하신 장소의 위치를 안내해 드릴게요.",
      intent: "지도"
    };
  } else if (query.includes("전화번호") || query.includes("번호")) {
    return {
      reply: "부서 전화번호를 안내해 드립니다. (대표전화: 031-249-9114)",
      intent: "전화"
    };
  } else if (query.includes("학식") || query.includes("메뉴")) {
    return {
      reply: "오늘의 감성코어 학식 메뉴는 돈까스와 제육덮밥입니다.",
      intent: "학식"
    };
  } else {
    return {
      reply: "죄송합니다. 아직 해당 질문에 대해서는 학습 중입니다. 다른 질문을 입력해 주세요!",
      intent: "일반"
    };
  }
};
