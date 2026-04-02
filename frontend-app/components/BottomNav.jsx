"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MapPinned, Phone } from "lucide-react";

const menus = [
  { href: "/", label: "홈", icon: House },
  { href: "/map", label: "지도", icon: MapPinned },
  { href: "/phone", label: "전화번호", icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-[360px] -translate-x-1/2 border-t bg-white">
      {menus.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] ${
              isActive
                ? "font-semibold text-green-600"
                : "text-gray-500"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}