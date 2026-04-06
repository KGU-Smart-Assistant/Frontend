export default function PhonePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          Phone
        </p>
        <h1 className="mt-3 text-3xl font-bold">전화번호 페이지</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          공식 프론트엔드 구조에 맞춰 `/phone` 라우트를 추가했습니다.
          추후 학과, 행정실, 주요 부서 전화번호 데이터를 연결해 확장할 수
          있습니다.
        </p>
      </div>
    </main>
  );
}
