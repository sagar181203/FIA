export function calcTax(p: {
  salary:number; businessIncome:number; capitalGains:number;
  inv80c:number; ins80d:number; otherDed:number; regime:"new"|"old";
}) {
  const gross = p.salary + p.businessIncome;
  let stdDed=0, ded=0, taxable=0;
  if (p.regime==="old") {
    stdDed = Math.min(50000, p.salary);
    ded = stdDed + Math.min(p.inv80c,150000) + Math.min(p.ins80d,25000) + p.otherDed;
    taxable = Math.max(0, gross-ded) + p.capitalGains;
  } else {
    stdDed = Math.min(75000, p.salary);
    taxable = Math.max(0, gross-stdDed) + p.capitalGains;
    ded = stdDed;
  }
  let tax=0;
  if (p.regime==="old") {
    if (taxable>1000000)      tax=112500+(taxable-1000000)*0.3;
    else if (taxable>500000)  tax=12500+(taxable-500000)*0.2;
    else if (taxable>250000)  tax=(taxable-250000)*0.05;
    if (taxable<=500000) tax=0;
  } else {
    if (taxable>1500000)      tax=140000+(taxable-1500000)*0.3;
    else if (taxable>1200000) tax=80000+(taxable-1200000)*0.2;
    else if (taxable>1000000) tax=50000+(taxable-1000000)*0.15;
    else if (taxable>700000)  tax=20000+(taxable-700000)*0.1;
    else if (taxable>300000)  tax=(taxable-300000)*0.05;
    if (taxable<=700000) tax=0;
  }
  const cess=tax*0.04;
  return { gross, stdDed, ded, taxable, tax, cess, total:tax+cess, rate:gross>0?(tax+cess)/gross*100:0 };
}

export const fmt = (n:number) => "₹"+Math.round(n||0).toLocaleString("en-IN");
export const num = (v:string|number) => parseFloat(String(v))||0;
