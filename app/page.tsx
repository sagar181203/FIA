"use client";
import { useStore } from "@/lib/store";
import { calcTax, fmt, num } from "@/lib/tax";

export default function Dashboard() {
  const { profile: p, updateProfile: upd } = useStore();
  const tx = p.salary ? calcTax({ salary:num(p.salary), businessIncome:num(p.businessIncome), capitalGains:num(p.capitalGains), inv80c:num(p.inv80c), ins80d:num(p.ins80d), otherDed:num(p.otherDed), regime:p.regime }) : null;
  const mSavings = Math.max(0, num(p.monthlyIncome) - num(p.monthlyExpenses));

  const inp = "w-full bg-s2 border border-border rounded-xl px-3.5 py-2.5 text-text font-mono text-sm outline-none focus:border-accent transition-colors placeholder:text-muted";
  const lbl = "block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5";

  return (
    <div className="p-4 max-w-2xl mx-auto pb-10">
      {/* Profile Card */}
      <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-base">👤</div>
          <span className="font-bold text-[15px]">Your Financial Profile</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lbl}>Name</label><input className={inp} placeholder="Rahul Sharma" value={p.name} onChange={e=>upd({name:e.target.value})}/></div>
          <div><label className={lbl}>Age</label><input className={inp} type="number" placeholder="32" value={p.age} onChange={e=>upd({age:e.target.value})}/></div>
          <div><label className={lbl}>Annual Salary (₹)</label>
            <input className={inp} type="number" placeholder="800000" value={p.salary}
              onChange={e=>upd({salary:e.target.value, monthlyIncome:e.target.value?(num(e.target.value)/12).toFixed(0):""})}/>
          </div>
          <div><label className={lbl}>Monthly Expenses (₹)</label><input className={inp} type="number" placeholder="35000" value={p.monthlyExpenses} onChange={e=>upd({monthlyExpenses:e.target.value})}/></div>
          <div><label className={lbl}>Outstanding Loans (₹)</label><input className={inp} type="number" placeholder="500000" value={p.loans} onChange={e=>upd({loans:e.target.value})}/></div>
          <div><label className={lbl}>Risk Appetite</label>
            <select className={inp} value={p.riskAppetite} onChange={e=>upd({riskAppetite:e.target.value as any})}>
              <option value="low">🛡️ Low</option>
              <option value="medium">⚖️ Medium</option>
              <option value="high">🚀 High</option>
            </select>
          </div>
        </div>
      </div>

      {p.salary ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label:"Annual Income",    value:fmt(num(p.salary)),  sub:`Monthly: ${fmt(num(p.salary)/12)}`, color:"#00e5b8" },
              { label:"Est. Tax Payable", value:tx?fmt(tx.total):"—", sub:`${p.regime.toUpperCase()} Regime`,  color:"#f04060" },
              { label:"Monthly Savings",  value:fmt(mSavings),        sub:"After expenses",                    color:"#00c98d" },
            ].map(s=>(
              <div key={s.label} className="bg-s2 border border-border rounded-xl p-3.5">
                <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2">{s.label}</div>
                <div className="text-lg font-extrabold font-mono" style={{color:s.color}}>{s.value}</div>
                <div className="text-[11px] text-muted mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-3.5 text-sm leading-relaxed">
            💡 <strong>FIA Tip:</strong> Head to the Budget tab to see your personalised plan for rent, food, health & travel with year-end projections!
          </div>
        </>
      ) : (
        <div className="bg-amber/5 border border-amber/20 rounded-xl p-3.5 text-sm text-amber">
          👆 Fill in your financial profile above to unlock your FIA dashboard.
        </div>
      )}
      <p className="text-center text-[11px] text-muted mt-6">⚠️ AI-generated guidance only. Consult a certified CA for official filing.</p>
    </div>
  );
}
