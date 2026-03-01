# FIA – Finance Intelligent Assistant
### Deploy to: Website (Vercel) + Android (Play Store) + iPhone (App Store)

---

## 📁 Project Stack
- **Next.js 14** (App Router) — web framework
- **Tailwind CSS** — styling
- **Zustand** — state (auto-persisted to localStorage)
- **Capacitor 6** — wraps the web app into native Android APK + iOS IPA
- **next-pwa** — makes the website installable as a PWA

---

## ⚡ STEP 1 — Setup

```bash
cd FIA-complete
npm install
npm run dev          # → http://localhost:3000
```

> **Add your API key** — open `app/chat/page.tsx`, the fetch call goes to Anthropic's API directly from the browser. For production, proxy this through a Next.js API route (see Step 5).

---

## 🌐 STEP 2 — Deploy Website to Vercel (Free)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Your app is live at `https://fia-xxxx.vercel.app` ✅

### Custom domain (optional)
```bash
vercel domains add fia-app.com
```
Point your domain's DNS to Vercel — done.

### PWA install
Once hosted, users on Chrome/Safari can tap **"Add to Home Screen"** — it installs as a full-screen app with your FIA icon.

---

## 🔑 STEP 3 — Secure the API Key (Required for Production)

The Anthropic API key must NOT be exposed on the frontend. Create a proxy route:

**Create `app/api/chat/route.ts`:**
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
```

**Update `app/chat/page.tsx`** — change the fetch URL:
```ts
// Before:
const res = await fetch("https://api.anthropic.com/v1/messages", { ... });

// After:
const res = await fetch("/api/chat", { ... });  // proxy route
```

**Add to Vercel dashboard → Settings → Environment Variables:**
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxx
```

---

## 🤖 STEP 4 — Build Android APK (Google Play Store)

### Prerequisites
- **Android Studio** installed → https://developer.android.com/studio
- **Java 17+** → `brew install openjdk@17` (Mac) or download from adoptium.net
- **Google Play Developer Account** → $25 one-time fee at play.google.com/console

### Build steps

```bash
# 1. Export Next.js as static files
npm run build        # creates /out folder

# 2. Sync to Capacitor
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

In **Android Studio:**
1. Wait for Gradle sync to finish
2. `Build → Generate Signed Bundle/APK`
3. Choose **Android App Bundle (.aab)** for Play Store
4. Create a new keystore (save the password — you need it forever!)
5. Build → you get `app-release.aab`

### Upload to Play Store
1. Go to play.google.com/console
2. Create app → `FIA – Finance Intelligent Assistant`
3. `Release → Production → Create release`
4. Upload `app-release.aab`
5. Fill in store listing, screenshots, privacy policy
6. Submit for review (usually 1–3 days)

### App ID
Edit `capacitor.config.ts`:
```ts
appId: "com.yourname.fia",   // must be unique globally
```

---

## 🍎 STEP 5 — Build iOS IPA (App Store)

### Prerequisites
- **Mac with Xcode 15+** (mandatory — iOS builds require Mac)
- **Apple Developer Account** → $99/year at developer.apple.com

```bash
# Sync to Capacitor
npx cap sync ios

# Open Xcode
npx cap open ios
```

In **Xcode:**
1. Select your team under `Signing & Capabilities`
2. Change Bundle Identifier to `com.yourname.fia`
3. `Product → Archive`
4. Upload to App Store Connect
5. Fill in metadata on appstoreconnect.apple.com
6. Submit for review (1–7 days)

---

## 📱 STEP 6 — App Icons & Splash Screen

Generate all icon sizes from one 1024×1024 PNG:

```bash
npm install -g @capacitor/assets
npx @capacitor/assets generate --iconBackgroundColor '#060b18' --iconBackgroundColorDark '#060b18' --splashBackgroundColor '#060b18' --splashBackgroundColorDark '#060b18'
```

Place your source files at:
```
resources/
  icon.png          ← 1024×1024 PNG (your FIA logo)
  icon-foreground.png
  splash.png        ← 2732×2732 PNG
```

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

---

## 🚀 Quick Deployment Summary

| Platform | Command | Time | Cost |
|---|---|---|---|
| Website (Vercel) | `vercel --prod` | 2 min | Free |
| Android APK (sideload) | `npx cap build android` | 10 min | Free |
| Google Play Store | Android Studio → upload .aab | 1-3 days review | $25 once |
| Apple App Store | Xcode → archive → upload | 1-7 days review | $99/year |
| PWA (any phone) | Just host on Vercel, share URL | Instant | Free |

---

## 💡 Tips

- **Test on Android first** — faster iteration, free sideloading
- **PWA is fastest to ship** — works on all phones, no app store needed
- **Keep API key secret** — always use the `/api/chat` proxy route in production
- State is saved in `localStorage` (web) / `AsyncStorage` (native) automatically via Zustand

---

## 🛟 Help

- Capacitor docs: https://capacitorjs.com/docs
- Next.js docs: https://nextjs.org/docs
- Vercel deploy: https://vercel.com/docs
- Play Store: https://support.google.com/googleplay/android-developer
