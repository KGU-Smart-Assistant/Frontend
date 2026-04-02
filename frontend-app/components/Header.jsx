export default function Header() {
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

      <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700">
        언어
      </button>
    </header>
  );
}