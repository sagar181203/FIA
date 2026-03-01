# FIA – Finance Intelligent Assistant
---

## 📁 Project Stack
- **Next.js 14** (App Router) — web framework
- **Tailwind CSS** — styling
- **Zustand** — state (auto-persisted to localStorage)
- **Capacitor 6** — wraps the web app into native Android APK + iOS IPA
- **next-pwa** — makes the website installable as a PWA

---

## ⚡Setup

```bash
cd FIA-complete
npm install
npm run dev          # → http://localhost:3000
```

> **Add your API key** — open `app/chat/page.tsx`, the fetch call goes to Anthropic's API directly from the browser. For production, proxy this through a Next.js API route.

---


## 🗂️ Project Structure

```
FIA-complete/
├── app/
│   ├── layout.tsx          ← Header + bottom nav
│   ├── globals.css
│   ├── page.tsx            ← Dashboard
│   ├── tax/page.tsx        ← Tax Calculator
│   ├── budget/page.tsx     ← Budget Planner
│   ├── tracker/page.tsx    ← Transactions
│   ├── chat/page.tsx       ← FIA AI Chat
│   └── api/chat/route.ts   ← API proxy (add this!)
├── lib/
│   ├── store.ts            ← Zustand state (auto-saved)
│   └── tax.ts              ← Tax engine
├── public/
│   └── manifest.json       ← PWA manifest
├── capacitor.config.ts     ← Native app config
├── next.config.js          ← Next.js + PWA config
└── tailwind.config.js
```

