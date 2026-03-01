import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Profile {
  name: string; age: string; salary: string; businessIncome: string;
  capitalGains: string; inv80c: string; ins80d: string; otherDed: string;
  regime: "new" | "old"; monthlyIncome: string; monthlyExpenses: string;
  loans: string; riskAppetite: "low" | "medium" | "high";
}

export interface Slider { key: string; label: string; pct: number; color: string; }
export interface Goal   { id: number; name: string; target: number; saved: number; }
export interface Tx     { id: number; type: "income"|"expense"; category: string; amount: number; note: string; date: string; }
export interface Msg    { role: "user"|"ai"; text: string; }

interface State {
  profile: Profile;
  sliders: Slider[];
  goals: Goal[];
  transactions: Tx[];
  messages: Msg[];
  budgetView: "monthly"|"annual";
  updateProfile: (p: Partial<Profile>) => void;
  setSlider: (key: string, pct: number) => void;
  addGoal: (g: Goal) => void;
  deleteGoal: (id: number) => void;
  addTx: (t: Tx) => void;
  deleteTx: (id: number) => void;
  addMsg: (m: Msg) => void;
  setBudgetView: (v: "monthly"|"annual") => void;
}

const DEFAULT_SLIDERS: Slider[] = [
  { key:"housing",   label:"🏠 Rent / Housing",     pct:25, color:"#5b5ef4" },
  { key:"food",      label:"🍱 Food & Groceries",    pct:15, color:"#f5a623" },
  { key:"transport", label:"🚌 Transport / Travel",  pct:8,  color:"#3b82f6" },
  { key:"health",    label:"🏥 Health & Medical",    pct:5,  color:"#00c98d" },
  { key:"savings",   label:"📈 Savings & Invest",    pct:20, color:"#00e5b8" },
  { key:"entertain", label:"🎬 Entertainment",       pct:5,  color:"#ec4899" },
  { key:"insurance", label:"🛡️ Insurance / EMI",    pct:5,  color:"#8b5cf6" },
  { key:"others",    label:"⚡ Utilities & Others",  pct:17, color:"#64748b" },
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      profile: { name:"",age:"",salary:"",businessIncome:"0",capitalGains:"0",inv80c:"0",ins80d:"0",otherDed:"0",regime:"new",monthlyIncome:"",monthlyExpenses:"",loans:"0",riskAppetite:"medium" },
      sliders: DEFAULT_SLIDERS,
      goals: [
        { id:1, name:"Emergency Fund", target:300000, saved:50000 },
        { id:2, name:"Family Vacation", target:80000,  saved:15000 },
      ],
      transactions: [],
      messages: [{ role:"ai", text:"👋 Namaste! I'm **FIA** — your Finance Intelligent Assistant.\n\nI can help with:\n- **Tax calculations** (FY 2024-25)\n- **Budget planning** (monthly & annual)\n- **Savings goals** & projections\n- **Rent, food, health, travel** budgets\n- **SIP & investment** advice\n\nWhat would you like to know?" }],
      budgetView: "monthly",
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setSlider: (key, pct) => set((s) => ({ sliders: s.sliders.map(sl => sl.key===key ? {...sl,pct} : sl) })),
      addGoal: (g) => set((s) => ({ goals: [...s.goals, g] })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter(g => g.id!==id) })),
      addTx: (t) => set((s) => ({ transactions: [t, ...s.transactions] })),
      deleteTx: (id) => set((s) => ({ transactions: s.transactions.filter(t => t.id!==id) })),
      addMsg: (m) => set((s) => ({ messages: [...s.messages, m] })),
      setBudgetView: (v) => set({ budgetView: v }),
    }),
    { name: "fia-store" }
  )
);
