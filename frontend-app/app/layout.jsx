import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "KGU Assistant",
  description: "Campus assistant app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-100">
        <div className="mx-auto flex min-h-screen w-full max-w-[360px] flex-col bg-white shadow-sm">
          <Header />
          <main className="flex-1 px-4 pt-4 pb-20">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}