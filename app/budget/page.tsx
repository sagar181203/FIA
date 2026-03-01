"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmt, num } from "@/lib/tax";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function BudgetPage() {
  const { profile:p, updateProfile:upd, sliders, setSlider, goals, addGoal, deleteGoal, budgetView, setBudgetView } = useStore();
  const [gName,setGName] = useState(""); const [gTarget,setGTarget] = useState(""); const [gSaved,setGSaved] = useState("");
  const inp = "w-full bg-s2 border border-border rounded-xl px-3.5 py-2.5 text-text font-mono text-sm outline-none focus:border-accent transition-colors placeholder:text-muted";
  const lbl = "block text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5";

  const mI = num(p.monthlyIncome), mE = num(p.monthlyExpenses);
  const mul = budgetView==="annual" ? 12 : 1;
  const base = mI * mul;
  const savRate = mI>0 ? ((mI-mE)/mI*100).toFixed(1) : "0";
  const totalPct = sliders.reduce((s,sl)=>s+sl.pct,0);
  const savSlider = sliders.find(s=>s.key==="savings");
  const mSav = mI * (savSlider?.pct||20)/100;
  const score = (()=>{ let s=5; if(+savRate>=20)s+=2; else if(+savRate>=10)s+=1; if(mE/mI*100<=60)s+=2; else if(mE/mI*100<=80)s+=1; if(!num(p.loans))s+=1; return Math.min(10,s); })();
  const scoreColor = score>=7?"#00c98d":score>=5?"#f5a623":"#f04060";
  const scoreBadge = score>=7?"✅ Healthy":score>=5?"⚠️ Moderate":"🚨 Needs Attention";

  function handleAddGoal() {
    if (!gName||!gTarget) return;
    addGoal({ id:Date.now(), name:gName, target:num(gTarget), saved:num(gSaved||"0") });
    setGName(""); setGTarget(""); setGSaved("");
  }

  const maxProj = Math.max(mSav*12,1);

  return (
    <div className="p-4 max-w-2xl mx-auto pb-10">

      {/* Header card */}
      <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center text-base">💰</div>
          <span className="font-bold text-[15px]">Smart Budget Planner</span>
          {/* Monthly / Annual Toggle */}
          <div className="ml-auto flex bg-s2 rounded-lg p-0.5 gap-0.5">
            {(["monthly","annual"] as const).map(v=>(
              <button key={v} onClick={()=>setBudgetView(v)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${budgetView===v?"bg-accent text-bg":"text-muted"}`}>
                {v==="monthly"?"📅 Monthly":"📆 Annual"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className={lbl}>Monthly Income (₹)</label><input className={inp} type="number" placeholder="65000" value={p.monthlyIncome} onChange={e=>upd({monthlyIncome:e.target.value})}/></div>
          <div><label className={lbl}>Monthly Expenses (₹)</label><input className={inp} type="number" placeholder="40000" value={p.monthlyExpenses} onChange={e=>upd({monthlyExpenses:e.target.value})}/></div>
        </div>
        {mI>0 && (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-s2 border border-border rounded-xl p-3">
              <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">{budgetView==="annual"?"Annual":"Monthly"} Income</div>
              <div className="text-[17px] font-extrabold font-mono text-accent">{fmt(base)}</div>
              <div className="text-[10px] text-muted mt-1">{budgetView==="monthly"?`Annual: ${fmt(mI*12)}`:`Monthly: ${fmt(mI)}`}</div>
            </div>
            <div className="bg-s2 border border-border rounded-xl p-3">
              <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">Savings Rate</div>
              <div className="text-[17px] font-extrabold font-mono" style={{color:+savRate>=20?"#00c98d":+savRate>=10?"#f5a623":"#f04060"}}>{savRate}%</div>
              <div className="text-[10px] text-muted mt-1">Target: 20%+</div>
            </div>
            <div className="bg-s2 border border-border rounded-xl p-3">
              <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">Health Score</div>
              <div className="text-[17px] font-extrabold font-mono" style={{color:scoreColor}}>{score}/10</div>
              <div className="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full inline-block" style={{color:scoreColor,background:`${scoreColor}20`}}>{scoreBadge}</div>
            </div>
          </div>
        )}
      </div>

      {mI>0 && (<>
        {/* Sliders */}
        <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-base">🎛️</div>
            <span className="font-bold text-[15px]">Customise Allocation</span>
            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${totalPct===100?"bg-accent/15 text-accent":totalPct>100?"bg-danger/15 text-danger":"bg-amber/15 text-amber"}`}>
              {totalPct}% {totalPct===100?"✓":totalPct>100?"▲ Over":"▼ Under"}
            </span>
          </div>
          {sliders.map(s=>{
            const amt = base*s.pct/100;
            const fillPct = (s.pct/60)*100; // pct of max (60)
            const trackStyle = {
              flex: 1,
              background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${fillPct}%, #1e2d45 ${fillPct}%, #1e2d45 100%)`,
              WebkitAppearance: "none" as const,
              height: 7,
              borderRadius: 4,
              outline: "none",
              cursor: "pointer",
            };
            return (
              <div key={s.key} className="mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] min-w-[130px]">{s.label}</span>
                  <input
                    type="range" min={0} max={60} value={s.pct}
                    style={{ ...trackStyle, color: s.color }}
                    onChange={e=>setSlider(s.key,+e.target.value)}
                  />
                  <span className="text-[13px] font-bold font-mono min-w-[34px] text-right" style={{color:s.color}}>{s.pct}%</span>
                  <span className="text-[11px] font-mono text-muted min-w-[72px] text-right">{fmt(amt)}/{budgetView==="annual"?"yr":"mo"}</span>
                </div>
                {s.key==="health"&&amt<5000&&budgetView==="monthly"&&(
                  <div className="pl-[138px] mt-1.5">
                    <span className="text-[10px] font-bold bg-danger/15 text-danger px-2 py-0.5 rounded-full">⚠️ Min ₹5,000/month</span>
                  </div>
                )}
              </div>
            );
          })}
          {totalPct!==100&&(
            <div className={`rounded-xl p-3 text-[13px] leading-relaxed ${totalPct>100?"bg-danger/5 border border-danger/20 text-danger":"bg-amber/5 border border-amber/20 text-amber"}`}>
              {totalPct>100?`⚠️ Total exceeds 100% by ${totalPct-100}%. Reduce some categories.`:`💡 ${100-totalPct}% unallocated (${fmt(base*(100-totalPct)/100)}) — add to savings?`}
            </div>
          )}
        </div>

        {/* Projection Chart */}
        <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-base">📈</div>
            <span className="font-bold text-[15px]">Year-End Savings Projection</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-1.5 h-36 pb-1 min-w-[420px]">
              {MONTHS.map((mo,i)=>{
                const v=mSav*(i+1), h=Math.max(4,(v/maxProj)*130);
                return (
                  <div key={mo} className="flex flex-col items-center flex-1">
                    <span className="text-[8px] text-muted font-mono mb-0.5">{fmt(v).replace("₹","")}</span>
                    <div className="w-full rounded-t-md" style={{height:h,background:`linear-gradient(180deg,rgba(0,229,184,.9),rgba(91,94,244,.9))`,opacity:.6+(i/12)*.4}}/>
                    <span className="text-[9px] text-muted mt-1">{mo}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4 mt-3 text-[12px] text-muted flex-wrap">
            <span>Monthly: <strong className="text-accent">{fmt(mSav)}</strong></span>
            <span>By Dec: <strong className="text-success">{fmt(mSav*12)}</strong></span>
            <span>Emergency Fund: <strong className="text-amber">{fmt(num(p.monthlyExpenses)*6)}</strong></span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[{l:"Monthly Savings",v:fmt(mSav),c:"#00e5b8"},{l:"Annual Savings",v:fmt(mSav*12),c:"#00c98d"},{l:"Emergency Fund",v:fmt(num(p.monthlyExpenses)*6),c:"#f5a623"}].map(s=>(
              <div key={s.l} className="bg-s2 border border-border rounded-xl p-3">
                <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1.5">{s.l}</div>
                <div className="text-[16px] font-extrabold font-mono" style={{color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Tracker */}
        <div className="bg-s1 border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-base">🎯</div>
            <span className="font-bold text-[15px]">Savings Goals</span>
          </div>
          {goals.map((g,i)=>{
            const pct=Math.min(100,(g.saved/g.target)*100), rem=g.target-g.saved;
            const mos=mSav>0?Math.ceil(rem/mSav):"∞";
            return (
              <div key={g.id} className="bg-s2 border border-border rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="font-bold text-[14px]">🎯 {g.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted">{fmt(g.saved)}/{fmt(g.target)}</span>
                    <span className="text-[10px] font-bold bg-indigo/15 text-indigo px-2 py-0.5 rounded-full">{Math.round(pct)}%</span>
                    <button onClick={()=>deleteGoal(g.id)} className="text-[11px] bg-danger/10 text-danger border border-danger/25 px-2 py-1 rounded-lg font-bold">✕</button>
                  </div>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden mt-3 mb-2">
                  <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:"linear-gradient(90deg,#5b5ef4,#00e5b8)"}}/>
                </div>
                <div className="text-[12px] text-muted">Remaining: <span className="text-amber">{fmt(rem)}</span> · Est. <span className="text-accent">{mos} month{mos!==1&&mos!=="∞"?"s":""}</span></div>
              </div>
            );
          })}
          <div className="mt-3">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Add New Goal</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input className={inp+" col-span-2"} placeholder="Goal name (e.g. New Car)" value={gName} onChange={e=>setGName(e.target.value)}/>
              <input className={inp} type="number" placeholder="Target ₹" value={gTarget} onChange={e=>setGTarget(e.target.value)}/>
              <input className={inp} type="number" placeholder="Already saved ₹" value={gSaved} onChange={e=>setGSaved(e.target.value)}/>
            </div>
            <button onClick={handleAddGoal} className="w-full py-2.5 rounded-xl font-bold text-bg text-sm" style={{background:"linear-gradient(135deg,#00e5b8,#00b894)"}}>+ Add Goal</button>
          </div>
        </div>
      </>)}
      {!mI && <div className="bg-amber/5 border border-amber/20 rounded-xl p-3.5 text-[13px] text-amber">Enter your monthly income above to unlock the budget planner.</div>}
    </div>
  );
}
