"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmt } from "@/lib/tax";
import type { Tx } from "@/lib/store";

const INC_CATS = ["salary","freelance","business","rental","interest","other"];
const EXP_CATS = ["rent","food","transport","health","emi","entertainment","utilities","insurance","education","other"];

// Defined outside component to avoid remount on every render
function EntryList({ list, color, onDelete }: { list: Tx[]; color: string; onDelete: (id: number) => void }) {
  if (list.length === 0) {
    return <p className="text-muted text-[13px] py-2">No entries yet.</p>;
  }
  return (
    <div className="flex flex-col gap-2">
      {list.map(e => (
        <div key={e.id} className="flex justify-between items-center bg-s2 rounded-xl px-3.5 py-2.5">
          <div>
            <div className="font-semibold text-[13px]">{e.note || e.category}</div>
            <div className="text-[10px] text-muted capitalize">{e.category} · {e.date}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] font-semibold" style={{ color }}>
              {e.type === "income" ? "+" : "−"}{fmt(e.amount)}
            </span>
            <button
              onClick={() => onDelete(e.id)}
              className="text-[11px] bg-danger/10 text-danger border border-danger/25 px-2 py-1 rounded-lg font-bold active:scale-95 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrackerPage() {
  const { transactions, addTx, deleteTx } = useStore();
  const [type, setType]   = useState<"income" | "expense">("income");
  const [cat, setCat]     = useState("salary");
  const [amt, setAmt]     = useState("");
  const [note, setNote]   = useState("");

  const incomes  = transactions.filter(t => t.type === "income");
  const expenses = transactions.filter(t => t.type === "expense");
  const totI = incomes.reduce((s, t) => s + t.amount, 0);
  const totE = expenses.reduce((s, t) => s + t.amount, 0);
  const net  = totI - totE;

  const inp = "bg-s2 border border-border rounded-xl px-3 py-2.5 text-text font-mono text-sm outline-none focus:border-accent transition-colors placeholder:text-muted";

  function handleAdd() {
    if (!amt) return;
    addTx({
      id: Date.now(),
      type,
      category: cat,
      amount: parseFloat(amt),
      note,
      date: new Date().toLocaleDateString("en-IN"),
    });
    setAmt("");
    setNote("");
  }

  function handleTypeChange(v: "income" | "expense") {
    setType(v);
    setCat(v === "income" ? "salary" : "rent");
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-10">

      {/* Add Transaction */}
      <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-base">📝</div>
          <span className="font-bold text-[15px]">Add Transaction</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select className={inp} value={type} onChange={e => handleTypeChange(e.target.value as any)}>
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
          </select>
          <select className={inp} value={cat} onChange={e => setCat(e.target.value)}>
            {(type === "income" ? INC_CATS : EXP_CATS).map(c => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
          <input
            className={inp}
            type="number"
            placeholder="Amount ₹"
            value={amt}
            onChange={e => setAmt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <input
            className={inp}
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full py-2.5 rounded-xl font-bold text-bg text-sm mt-1 active:scale-[.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#00e5b8,#00b894)" }}
        >
          + Add
        </button>
      </div>

      {/* Summary strip */}
      {(incomes.length > 0 || expenses.length > 0) && (
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-s2 border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">Total Income</div>
            <div className="text-[17px] font-extrabold font-mono text-success">+{fmt(totI)}</div>
          </div>
          <div className="bg-s2 border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">Total Expenses</div>
            <div className="text-[17px] font-extrabold font-mono text-danger">−{fmt(totE)}</div>
          </div>
          <div className="bg-s2 border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">Net Balance</div>
            <div className="text-[17px] font-extrabold font-mono" style={{ color: net >= 0 ? "#00c98d" : "#f04060" }}>
              {net >= 0 ? "+" : "−"}{fmt(Math.abs(net))}
            </div>
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="flex flex-col gap-4">
        <div className="bg-s1 border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">💰</div>
            <span className="font-bold text-[15px]">Income</span>
            <span className="text-[11px] text-muted ml-1">({incomes.length})</span>
            <span className="ml-auto font-mono text-[13px] text-success">+{fmt(totI)}</span>
          </div>
          <EntryList list={incomes} color="#00c98d" onDelete={deleteTx} />
        </div>

        <div className="bg-s1 border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">💸</div>
            <span className="font-bold text-[15px]">Expenses</span>
            <span className="text-[11px] text-muted ml-1">({expenses.length})</span>
            <span className="ml-auto font-mono text-[13px] text-danger">−{fmt(totE)}</span>
          </div>
          <EntryList list={expenses} color="#f04060" onDelete={deleteTx} />
        </div>
      </div>
    </div>
  );
}
