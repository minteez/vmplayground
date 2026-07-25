import { useEffect, useState, type ComponentType } from "react";
import { ArrowLeft, Camera, Copy, Pause, Play, Power, PowerOff, RefreshCw, ZapOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { View } from "./shell";
import { useVMStore } from "@/lib/vm-store";
import { OS_PROFILES } from "@/lib/os-profiles";
import { StatusPill } from "./status-pill";
import { SnapshotDialog } from "./snapshot-dialog";
import { cn } from "@/lib/utils";

export function VMDetails({ vmId, setView }: { vmId: string; setView: (v: View) => void }) {
  const { state, updateVM, updateConfig, setVMStatus, deleteVM, deleteSnapshot, restoreSnapshot, log } = useVMStore();
  const vm = state.vms.find((v) => v.id === vmId);
  const [snapOpen, setSnapOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 30, disk: 22, net: 0.4 });

  useEffect(() => {
    if (vm?.status !== "running") return;
    const t = setInterval(() => {
      setMetrics((m) => ({
        cpu: clamp(m.cpu + rand(-6, 6), 4, 80),
        ram: clamp(m.ram + rand(-3, 3), 15, 90),
        disk: clamp(m.disk + rand(-1, 2), 5, 95),
        net: Math.max(0, m.net + rand(-0.4, 0.6)),
      }));
    }, 1200);
    return () => clearInterval(t);
  }, [vm?.status]);

  if (!vm) {
    return (
      <div className="text-center text-muted-foreground">
        VM not found. <button onClick={() => setView({ kind: "dashboard" })} className="text-primary underline">Back</button>
      </div>
    );
  }

  const profile = OS_PROFILES[vm.os];

  const powerAction = (action: "start" | "pause" | "resume" | "restart" | "shutdown" | "force") => {
    if (action === "start") { setView({ kind: "boot", id: vm.id }); return; }
    if (action === "pause") { setVMStatus(vm.id, "paused"); log({ vmId: vm.id, vmName: vm.name, type: "vm.pause", description: "Paused" }); toast("VM paused"); }
    if (action === "resume") { setVMStatus(vm.id, "running"); log({ vmId: vm.id, vmName: vm.name, type: "vm.resume", description: "Resumed" }); toast("VM resumed"); }
    if (action === "restart") { setView({ kind: "boot", id: vm.id }); }
    if (action === "shutdown") {
      setVMStatus(vm.id, "shutting-down");
      log({ vmId: vm.id, vmName: vm.name, type: "vm.shutdown", description: "Shutdown" });
      toast("Shutting down…");
      setTimeout(() => setVMStatus(vm.id, "off"), 1400);
    }
    if (action === "force") { setVMStatus(vm.id, "off"); log({ vmId: vm.id, vmName: vm.name, type: "vm.force", description: "Force off" }); toast("Forced power off"); }
  };

  const isRunning = vm.status === "running" || vm.status === "paused";

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => setView({ kind: "dashboard" })}>
          <ArrowLeft className="size-3" /> VM Manager
        </button>

        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-lg font-mono text-2xl text-white" style={{ background: profile.wallpaper }} aria-hidden>{profile.logo}</div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold sm:text-2xl">{vm.name}</h1>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{profile.name} {profile.version}</span>
                  <span>·</span>
                  <StatusPill status={vm.status} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <PowerBtn icon={Play} label="Start" onClick={() => powerAction("start")} disabled={vm.status === "running"} tooltip="Boot the VM" />
            {vm.status === "paused" ? (
              <PowerBtn icon={Play} label="Resume" onClick={() => powerAction("resume")} tooltip="Resume from pause" />
            ) : (
              <PowerBtn icon={Pause} label="Pause" onClick={() => powerAction("pause")} disabled={vm.status !== "running"} tooltip="Pause simulated execution" />
            )}
            <PowerBtn icon={RefreshCw} label="Restart" onClick={() => powerAction("restart")} disabled={!isRunning} tooltip="Reboot the VM" />
            <PowerBtn icon={PowerOff} label="Shut Down" onClick={() => powerAction("shutdown")} disabled={!isRunning} tooltip="Graceful shutdown" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-destructive" disabled={!isRunning}>
                  <ZapOff className="size-3.5" /> Force Off
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Force power off?</AlertDialogTitle>
                  <AlertDialogDescription>Unsaved simulated state may be lost.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => powerAction("force")}>Force Off</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/40">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard label="CPU Usage" value={`${metrics.cpu.toFixed(0)}%`} pct={metrics.cpu} live={vm.status === "running"} />
              <MetricCard label="Memory" value={`${((vm.config.ram * metrics.ram) / 100).toFixed(1)} GB / ${vm.config.ram} GB`} pct={metrics.ram} live={vm.status === "running"} />
              <MetricCard label="Storage" value={`${((vm.config.storage * metrics.disk) / 100).toFixed(1)} GB / ${vm.config.storage} GB`} pct={metrics.disk} live={vm.status === "running"} />
              <MetricCard label="Network" value={`${metrics.net.toFixed(2)} MB/s`} pct={Math.min(100, metrics.net * 30)} live={vm.status === "running"} />
            </div>
            <Card>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                <HwRow label="CPU" value={`${vm.config.cpu} vCPU`} />
                <HwRow label="RAM" value={`${vm.config.ram} GB`} />
                <HwRow label="Storage" value={`${vm.config.storage} GB · ${vm.config.diskType.toUpperCase()}`} />
                <HwRow label="Graphics" value={`${vm.config.vram} MB`} />
                <HwRow label="Network" value={vm.config.network ? "Enabled" : "Disabled"} />
                <HwRow label="Audio" value={vm.config.sound ? "Enabled" : "Disabled"} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="console" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Open the simulated console to interact with this VM's desktop.</p>
                <Button className="mt-4" onClick={() => setView({ kind: vm.hasBooted && vm.status === "running" ? "desktop" : "boot", id: vm.id })}>
                  <Power className="size-4" /> Open Console
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hardware" className="mt-6 space-y-4">
            <Card>
              <CardContent className="space-y-5 p-6">
                <SliderConfig label="RAM" value={vm.config.ram} min={1} max={32} unit="GB" onChange={(v) => updateConfig(vm.id, { ram: v })} />
                <SliderConfig label="vCPU" value={vm.config.cpu} min={1} max={16} unit="cores" onChange={(v) => updateConfig(vm.id, { cpu: v })} />
                <SliderConfig label="Graphics memory" value={vm.config.vram} min={32} max={1024} step={32} unit="MB" onChange={(v) => updateConfig(vm.id, { vram: v })} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <ToggleConfig label="Network" checked={vm.config.network} onChange={(v) => updateConfig(vm.id, { network: v })} />
                  <ToggleConfig label="Sound" checked={vm.config.sound} onChange={(v) => updateConfig(vm.id, { sound: v })} />
                  <ToggleConfig label="USB" checked={vm.config.usb} onChange={(v) => updateConfig(vm.id, { usb: v })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="mt-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <SliderConfig label="Virtual disk size" value={vm.config.storage} min={2} max={512} step={2} unit="GB" onChange={(v) => updateConfig(vm.id, { storage: v })} />
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Simulated files</div>
                  <div className="text-sm">{vm.files.filter((f) => f.type === "file").length} files across {vm.files.filter((f) => f.type === "folder").length} folders</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snapshots" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Snapshots</h3>
              <Button size="sm" onClick={() => setSnapOpen(true)}><Camera className="size-3.5" /> Create Snapshot</Button>
            </div>
            {vm.snapshots.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">This machine has no snapshots yet.</CardContent></Card>
            ) : (
              <ol className="space-y-2">
                {vm.snapshots.map((s, i) => (
                  <li key={s.id}>
                    <Card>
                      <CardContent className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
                        <div className="grid size-8 place-items-center rounded-full bg-primary/15 font-mono text-xs text-primary">{i + 1}</div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{s.name}</div>
                          <div className="mt-0.5 truncate text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()} {s.description && `· ${s.description}`}</div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <RestoreSnap onConfirm={() => { restoreSnapshot(vm.id, s.id); toast.success("Snapshot restored"); }} />
                          <Button size="sm" variant="outline" onClick={() => { deleteSnapshot(vm.id, s.id); toast("Snapshot deleted"); }} aria-label="Delete snapshot">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ol>
            )}
            <SnapshotDialog vmId={vm.id} open={snapOpen} onOpenChange={setSnapOpen} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-4">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>VM name</Label>
                  <Input value={vm.name} onChange={(e) => updateVM(vm.id, { name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={3} value={vm.description} onChange={(e) => updateVM(vm.id, { description: e.target.value })} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-destructive/40">
              <CardContent className="flex items-center justify-between gap-3 p-6">
                <div>
                  <div className="text-sm font-medium">Delete VM</div>
                  <p className="text-xs text-muted-foreground">Permanently removes this simulated VM and all its data.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive"><Trash2 className="size-4" /> Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{vm.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { deleteVM(vm.id); setView({ kind: "dashboard" }); }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

function PowerBtn({ icon: Icon, label, onClick, disabled, tooltip }: { icon: ComponentType<{ className?: string }>; label: string; onClick: () => void; disabled?: boolean; tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm" variant="outline" onClick={onClick} disabled={disabled}>
          <Icon className="size-3.5" /> {label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function MetricCard({ label, value, pct, live }: { label: string; value: string; pct: number; live: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          {live && <span className="text-[10px] text-primary">● LIVE</span>}
        </div>
        <div className="mt-2 font-mono text-xl">{value}</div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full transition-all", live ? "bg-primary" : "bg-muted-foreground/40")} style={{ width: `${pct}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}

function HwRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm">{value}</div>
    </div>
  );
}

function SliderConfig({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
        <span className="font-mono text-sm">{value} {unit}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function ToggleConfig({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function RestoreSnap({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline"><Copy className="size-3.5" /> Restore</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore this snapshot?</AlertDialogTitle>
          <AlertDialogDescription>The current simulated files and desktop will be replaced by this snapshot's state.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Restore</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, n)); }
function rand(lo: number, hi: number) { return lo + Math.random() * (hi - lo); }