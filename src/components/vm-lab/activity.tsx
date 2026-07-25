import { useVMStore } from "@/lib/vm-store";
import { Button } from "@/components/ui/button";

export function ActivityView() {
  const { state, reset } = useVMStore();
  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Activity</h1>
          <p className="text-sm text-muted-foreground">Every simulated VM action, stored locally in your browser.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { if (confirm("Reset all VM Lab data?")) reset(); }}>Reset lab</Button>
      </header>
      {state.activity.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No activity yet.</div>
      ) : (
        <ol className="divide-y divide-border rounded-lg border border-border bg-card">
          {state.activity.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-4 p-3 text-sm">
              <div className="min-w-0">
                <div className="truncate">{e.description}</div>
                {e.vmName && <div className="truncate text-xs text-muted-foreground">{e.vmName}</div>}
              </div>
              <time className="shrink-0 font-mono text-[10px] text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</time>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}