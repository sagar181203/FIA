import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "./BottomNav";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"], variable: "--font-jakarta",
  weight: ["400","500","600","700","800"], display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"], variable: "--font-mono",
  weight: ["400","500"], display: "swap",
});

export const metadata: Metadata = {
  title: "FIA – Finance Intelligent Assistant",
  description: "Your personal AI-powered finance & tax assistant for India",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "FIA" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1,
  userScalable: false, viewportFit: "cover", themeColor: "#060b18",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-bg text-text font-sans overflow-hidden h-screen flex flex-col">

        {/* HEADER */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 border-b border-border"
          style={{ paddingTop:"max(12px,env(safe-area-inset-top))", paddingBottom:12,
            background:"rgba(6,11,24,0.97)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#00e5b8,#5b5ef4)", boxShadow:"0 0 18px rgba(0,229,184,0.4)" }}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="url(#gl)" opacity=".15"/>
                <rect x="6" y="20" width="4" height="6" rx="1.5" fill="url(#gl)" opacity=".6"/>
                <rect x="12" y="15" width="4" height="11" rx="1.5" fill="url(#gl)" opacity=".8"/>
                <rect x="18" y="10" width="4" height="16" rx="1.5" fill="url(#gl)"/>
                <path d="M24 8L27 5M27 5H24M27 5V8" stroke="#00e5b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gl" x1="6" y1="26" x2="26" y2="6" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5b5ef4"/><stop offset="1" stopColor="#00e5b8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="text-xl font-black tracking-widest"
                style={{ background:"linear-gradient(90deg,#00e5b8,#5b5ef4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                FIA
              </div>
              <div className="text-[8px] text-muted uppercase tracking-widest">Finance Intelligent Assistant</div>
            </div>
          </div>
          <span className="text-[10px] text-amber bg-amber/10 border border-amber/25 px-3 py-1 rounded-full hidden sm:block">
            ⚠️ Consult a certified CA for official filing
          </span>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling:"touch" }}>
          {children}
        </main>

        {/* BOTTOM NAV */}
        <BottomNav />

      </body>
    </html>
  );
}
