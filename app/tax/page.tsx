"use client";
import { useStore } from "@/lib/store";
import { calcTax, fmt, num } from "@/lib/tax";

export default function TaxPage() {
  const { profile: p, updateProfile: upd } = useStore();
  const tx = p.salary ? calcTax({ salary:num(p.salary), businessIncome:num(p.businessIncome), capitalGains:num(p.capitalGains), inv80c:num(p.inv80c), ins80d:num(p.ins80d), otherDed:num(p.otherDed), regime:p.regime }) : null;
  const inp = "w-full bg-s2 border border-border rounded-xl px-3.5 py-2.5 text-text font-mono text-sm outline-none focus:border-accent transition-colors placeholder:text-muted";
  const lbl = "block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5";

  const TaxRow = ({ label, value, color, bold }: any) => (
    <div className={`flex justify-between items-center py-2.5 border-b border-border last:border-0 ${bold?"pt-3.5":""}`}>
      <span className={`text-[13.5px] ${bold?"font-extrabold text-accent":""}`}>{label}</span>
      <span className={`text-[13.5px] font-semibold ${bold?"font-extrabold text-accent":""}`} style={color?{color}:{}}>{value}</span>
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto pb-10">
      <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-base">🧾</div>
          <span className="font-bold text-[15px]">Tax Calculator (FY 2024-25)</span>
        </div>

        {/* Regime */}
        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Tax Regime</div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(["new","old"] as const).map(r=>(
            <button key={r} onClick={()=>upd({regime:r})}
              className={`p-3 rounded-xl border-[1.5px] text-left transition-all ${p.regime===r?"border-accent bg-accent/8 text-accent":"border-border bg-s2 text-muted"}`}>
              <div className="font-bold text-[13px]">{r==="new"?"✨ New Regime":"📋 Old Regime"}</div>
              <div className="text-[10px] mt-0.5 opacity-70">{r==="new"?"Default (no deductions)":"With 80C/80D deductions"}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div><label className={lbl}>Annual Salary / CTC (₹)</label>
            <input className={inp} type="number" placeholder="800000" value={p.salary}
              onChange={e=>upd({salary:e.target.value, monthlyIncome:e.target.value?(num(e.target.value)/12).toFixed(0):""})}/>
          </div>
          <div><label className={lbl}>Business / Freelance Income (₹)</label><input className={inp} type="number" placeholder="0" value={p.businessIncome} onChange={e=>upd({businessIncome:e.target.value})}/></div>
          <div><label className={lbl}>Capital Gains (₹)</label><input className={inp} type="number" placeholder="0" value={p.capitalGains} onChange={e=>upd({capitalGains:e.target.value})}/></div>
        </div>

        {p.regime==="old" && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 gap-3">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Deductions</div>
            <div><label className={lbl}>80C Investments (max ₹1,50,000)</label><input className={inp} type="number" placeholder="150000" value={p.inv80c} onChange={e=>upd({inv80c:e.target.value})}/></div>
            <div><label className={lbl}>80D Health Insurance (₹)</label><input className={inp} type="number" placeholder="25000" value={p.ins80d} onChange={e=>upd({ins80d:e.target.value})}/></div>
            <div><label className={lbl}>Other Deductions (HRA, NPS etc.)</label><input className={inp} type="number" placeholder="0" value={p.otherDed} onChange={e=>upd({otherDed:e.target.value})}/></div>
          </div>
        )}
      </div>

      {tx ? (
        <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-base">📋</div>
            <span className="font-bold text-[15px]">Tax Breakdown</span>
          </div>
          <TaxRow label="Gross Total Income" value={fmt(tx.gross)} color="#00e5b8"/>
          <TaxRow label="Standard Deduction" value={`− ${fmt(tx.stdDed)}`} color="#00c98d"/>
          {p.regime==="old" && <TaxRow label="Other Deductions (80C/80D)" value={`− ${fmt(tx.ded-tx.stdDed)}`} color="#00c98d"/>}
          {num(p.capitalGains)>0 && <TaxRow label="Capital Gains Added" value={`+ ${fmt(num(p.capitalGains))}`} color="#f5a623"/>}
          <TaxRow label="Net Taxable Income" value={fmt(tx.taxable)}/>
          <TaxRow label="Income Tax (slab)" value={fmt(tx.tax)} color="#f04060"/>
          <TaxRow label="Health & Education Cess (4%)" value={fmt(tx.cess)} color="#f04060"/>
          <TaxRow label="Total Tax Payable" value={fmt(tx.total)} bold/>
          <TaxRow label="Effective Tax Rate" value={`${tx.rate.toFixed(2)}%`} color="#5b5ef4"/>
          {p.regime==="new" && num(p.inv80c)>0 && (
            <div className="mt-4 bg-amber/5 border border-amber/20 rounded-xl p-3 text-[13px] text-amber leading-relaxed">
              💡 You have 80C investments — try Old Regime to see if deductions save you more tax!
            </div>
          )}
        </div>
      ) : (
        <div className="bg-amber/5 border border-amber/20 rounded-xl p-3.5 text-[13px] text-amber">
          Enter your salary above to see your full tax breakdown.
        </div>
      )}
    </div>
  );
}
