import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export const metadata = {
  title: "KGU Smart Assistant",
  description: "KGU Smart Assistant Frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          paddingBottom: "80px",
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Header />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
