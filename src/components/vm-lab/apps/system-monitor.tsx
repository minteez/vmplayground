import { useEffect, useState } from "react";
import type { VM } from "@/lib/vm-types";
import { Button } from "@/components/ui/button";

export function SystemMonitorApp({ vm, runningApps, onClose }: { vm: VM; runningApps: string[]; onClose: (title: string) => void }) {
  const [cpu, setCpu] = useState(18);
  const [mem, setMem] = useState(34);
  const [net, setNet] = useState(0.4);

  useEffect(() => {
    const t = setInterval(() => {
      setCpu((c) => Math.max(4, Math.min(85, c + (Math.random() - 0.5) * 12)));
      setMem((m) => Math.max(15, Math.min(90, m + (Math.random() - 0.5) * 6)));
      setNet((n) => Math.max(0, n + (Math.random() - 0.4) * 0.5));
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-full overflow-auto bg-neutral-900 p-4 text-neutral-100">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="CPU" value={`${cpu.toFixed(0)}%`} pct={cpu} />
        <Metric label="Memory" value={`${((vm.config.ram * mem) / 100).toFixed(1)} / ${vm.config.ram} GB`} pct={mem} />
        <Metric label="Network" value={`${net.toFixed(2)} MB/s`} pct={Math.min(100, net * 30)} />
      </div>
      <div className="mt-4 rounded-lg border border-white/10">
        <div className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-white/60">Running applications</div>
        <ul className="divide-y divide-white/5">
          {runningApps.length === 0 && <li className="p-3 text-xs text-white/50">No open applications.</li>}
          {runningApps.map((a) => (
            <li key={a} className="flex items-center justify-between p-2 text-sm">
              <span>{a}</span>
              <Button size="sm" variant="ghost" onClick={() => onClose(a)}>End task</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function Metric({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-white/60">{label}</div>
      <div className="mt-1 font-mono text-lg">{value}</div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}