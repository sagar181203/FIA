"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/",        icon: "📊", label: "Home"   },
  { href: "/tax",     icon: "🧾", label: "Tax"    },
  { href: "/budget",  icon: "💰", label: "Budget" },
  { href: "/tracker", icon: "📝", label: "Track"  },
  { href: "/chat",    icon: "🤖", label: "FIA AI" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="flex-shrink-0 flex border-t border-border"
      style={{
        background: "rgba(10,18,34,0.98)",
        paddingBottom: "env(safe-area-inset-bottom)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {TABS.map((t) => {
        const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors select-none"
            style={{ color: active ? "#00e5b8" : "#5a6a84" }}
          >
            <div
              className="rounded-full mb-0.5 transition-all duration-300"
              style={{
                height: 3,
                width: active ? 24 : 0,
                background: active ? "#00e5b8" : "transparent",
              }}
            />
            <span className="text-[21px] leading-none">{t.icon}</span>
            <span className="text-[9px] font-bold tracking-tight">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
