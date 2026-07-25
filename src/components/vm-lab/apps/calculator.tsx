import { useEffect, useState } from "react";

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");

  const press = (v: string) => {
    if (v === "C") { setDisplay("0"); setExpr(""); return; }
    if (v === "⌫") { setExpr((e) => e.slice(0, -1)); setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0")); return; }
    if (v === "=") { compute(); return; }
    setExpr((e) => e + v);
    setDisplay((d) => (d === "0" && /[0-9.]/.test(v) ? v : d + v));
  };

  const compute = () => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/.() ]/g, "");
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${sanitized || "0"})`)();
      const r = String(Number(Number(val).toFixed(10)));
      setDisplay(r); setExpr(r);
    } catch { setDisplay("Error"); setExpr(""); }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (["+", "-", "*", "/", ".", "(", ")"].includes(e.key)) press(e.key);
      else if (e.key === "Enter" || e.key === "=") press("=");
      else if (e.key === "Backspace") press("⌫");
      else if (e.key === "Escape") press("C");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const btns = ["C","⌫","(",")","7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"];

  return (
    <div className="flex h-full flex-col bg-neutral-900 p-3">
      <div className="mb-3 rounded bg-black/50 p-3 text-right">
        <div className="truncate font-mono text-xs text-white/50">{expr || " "}</div>
        <div className="truncate font-mono text-3xl">{display}</div>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {btns.map((b) => (
          <button key={b} onClick={() => press(b)} className="rounded bg-white/5 font-mono text-lg hover:bg-white/15 active:bg-white/25">{b}</button>
        ))}
      </div>
    </div>
  );
}