import { Cpu, HardDrive, Play, PowerOff, Camera, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVMStore } from "@/lib/vm-store";
import { VMCard } from "./vm-card";
import type { View } from "./shell";
import type { ComponentType } from "react";

export function Dashboard({ setView }: { setView: (v: View) => void }) {
  const { state, createDemoVM } = useVMStore();
  const running = state.vms.filter((v) => v.status === "running").length;
  const off = state.vms.filter((v) => v.status === "off").length;
  const totalStorage = state.vms.reduce((n, v) => n + v.config.storage, 0);
  const snapshots = state.vms.reduce((n, v) => n + v.snapshots.length, 0);

  const stats: { label: string; value: string | number; icon: ComponentType<{ className?: string }> }[] = [
    { label: "Total Virtual Machines", value: state.vms.length, icon: Server },
    { label: "Running VMs", value: running, icon: Play },
    { label: "Powered Off VMs", value: off, icon: PowerOff },
    { label: "Simulated Storage", value: `${totalStorage} GB`, icon: HardDrive },
    { label: "Snapshots", value: snapshots, icon: Camera },
    { label: "vCPU Total", value: state.vms.reduce((n, v) => n + v.config.cpu, 0), icon: Cpu },
  ];

  const demo = () => {
    const vm = createDemoVM();
    setView({ kind: "boot", id: vm.id });
  };

  return (
    <div className="space-y-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">VM Manager</div>
          <h1 className="mt-1 truncate text-2xl font-semibold sm:text-3xl">Your virtual laboratory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, configure, and boot simulated virtual machines. Everything runs safely in your browser.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={demo}>
            <Sparkles className="size-4" /> Try Demo VM
          </Button>
          <Button onClick={() => setView({ kind: "wizard" })}>Create VM</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pb-4">
                <div className="font-mono text-3xl font-semibold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Virtual Machines</h2>
          <span className="text-xs text-muted-foreground">{state.vms.length} total</span>
        </div>
        {state.vms.length === 0 ? (
          <EmptyVMs onCreate={() => setView({ kind: "wizard" })} onDemo={demo} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {state.vms.map((vm) => (
              <VMCard key={vm.id} vm={vm} setView={setView} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyVMs({ onCreate, onDemo }: { onCreate: () => void; onDemo: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="grid size-14 place-items-center rounded-lg bg-muted font-mono text-2xl">◇</div>
        <div>
          <div className="text-lg font-semibold">Your virtual laboratory is empty</div>
          <p className="mt-1 text-sm text-muted-foreground">Create a simulated VM to get started.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDemo}><Sparkles className="size-4" /> Try Demo VM</Button>
          <Button onClick={onCreate}>Create Your First VM</Button>
        </div>
      </CardContent>
    </Card>
  );
}