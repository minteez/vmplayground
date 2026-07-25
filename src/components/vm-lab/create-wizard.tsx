import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { OS_LIST, OS_PROFILES } from "@/lib/os-profiles";
import type { OSId, VMConfig } from "@/lib/vm-types";
import { useVMStore } from "@/lib/vm-store";
import type { View } from "./shell";
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Basics", "Operating System", "Virtual Hardware", "Virtual Disk", "Summary"];

export function CreateWizard({ setView }: { setView: (v: View) => void }) {
  const { createVM } = useVMStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [os, setOs] = useState<OSId>("mintos");
  const [config, setConfig] = useState<VMConfig>({
    ram: 4, cpu: 2, storage: 40, vram: 128,
    network: true, sound: true, usb: true, diskType: "ssd",
  });

  const profile = OS_PROFILES[os];
  const health = useMemo(() => evalHealth(config, profile), [config, profile]);
  const canNext = step !== 0 || name.trim().length > 0;

  const submit = () => {
    const vm = createVM({ name: name.trim(), description: description.trim(), os, config });
    toast.success(`Created "${vm.name}"`);
    setView({ kind: "vm", id: vm.id });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" onClick={() => setView({ kind: "dashboard" })}>
        <ArrowLeft className="size-3" /> Back to VM Manager
      </button>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">New Virtual Machine</div>
        <h1 className="mt-1 text-2xl font-semibold">Create VM</h1>
      </div>

      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full border font-mono text-[10px]",
                i < step && "bg-primary text-primary-foreground border-primary",
                i === step && "border-primary text-primary",
                i > step && "border-border text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            <span className={cn(i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 text-border">/</span>}
          </li>
        ))}
      </ol>

      <Card>
        <CardContent className="space-y-6 p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vm-name">Virtual machine name</Label>
                <Input id="vm-name" placeholder="e.g. MintOS Lab" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vm-desc">Description (optional)</Label>
                <Textarea id="vm-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will you use this VM for?" />
              </div>
            </div>
          )}

          {step === 1 && (
            <RadioGroup value={os} onValueChange={(v) => setOs(v as OSId)} className="grid gap-3 sm:grid-cols-2">
              {OS_LIST.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors",
                    os === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="font-mono text-xl" aria-hidden>{p.logo}</span>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">{p.version} · {p.era}</div>
                      </div>
                    </div>
                    <RadioGroupItem value={p.id} className="shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">{p.difficulty}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5">{p.recommendedRam}GB RAM</span>
                    <span className="rounded bg-muted px-1.5 py-0.5">{p.recommendedStorage}GB Disk</span>
                  </div>
                </label>
              ))}
            </RadioGroup>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <SliderRow label="RAM" value={config.ram} min={1} max={32} step={1} unit="GB" onChange={(v) => setConfig({ ...config, ram: v })} />
              <SliderRow label="Virtual CPU cores" value={config.cpu} min={1} max={16} step={1} unit="cores" onChange={(v) => setConfig({ ...config, cpu: v })} />
              <SliderRow label="Graphics memory" value={config.vram} min={32} max={1024} step={32} unit="MB" onChange={(v) => setConfig({ ...config, vram: v })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Toggle label="Network adapter" checked={config.network} onChange={(v) => setConfig({ ...config, network: v })} />
                <Toggle label="Sound device" checked={config.sound} onChange={(v) => setConfig({ ...config, sound: v })} />
                <Toggle label="USB controller" checked={config.usb} onChange={(v) => setConfig({ ...config, usb: v })} />
              </div>
              <div className={cn("rounded-md border p-4 text-sm", health.tone)}>
                <div className="font-medium">{health.label}</div>
                <p className="mt-1 text-xs text-muted-foreground">{health.message}</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <SliderRow label="Virtual disk size" value={config.storage} min={2} max={512} step={2} unit="GB" onChange={(v) => setConfig({ ...config, storage: v })} />
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Disk type</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["ssd", "hdd", "dynamic", "fixed"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setConfig({ ...config, diskType: t })}
                      className={cn(
                        "rounded-md border p-3 text-left text-sm transition-colors",
                        config.diskType === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                      )}
                    >
                      <div className="font-medium capitalize">Virtual {t === "ssd" ? "SSD" : t === "hdd" ? "HDD" : `${t} disk`}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{DISK_HINTS[t]}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Allocation</Label>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (config.storage / 512) * 100)}%` }} />
                </div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">{config.storage} GB / 512 GB simulated pool</div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <SummaryRow label="Name" value={name || "(unnamed)"} />
              <SummaryRow label="Operating System" value={`${profile.name} ${profile.version}`} />
              <SummaryRow label="RAM" value={`${config.ram} GB`} />
              <SummaryRow label="vCPU" value={`${config.cpu} cores`} />
              <SummaryRow label="Storage" value={`${config.storage} GB · Virtual ${config.diskType.toUpperCase()}`} />
              <SummaryRow label="Graphics" value={`${config.vram} MB`} />
              <SummaryRow
                label="Devices"
                value={[config.network && "Network", config.sound && "Audio", config.usb && "USB"].filter(Boolean).join(" · ") || "None"}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => (step === 0 ? setView({ kind: "dashboard" }) : setStep((s) => s - 1))}>
          <ChevronLeft className="size-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={!name.trim()}>Create Virtual Machine</Button>
        )}
      </div>
    </div>
  );
}

const DISK_HINTS: Record<string, string> = {
  ssd: "Fast simulated flash storage.",
  hdd: "Simulated spinning disk with larger capacity.",
  dynamic: "Grows as data is written (simulated).",
  fixed: "Pre-allocated for consistent performance (simulated).",
};

function SliderRow({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,140px)_1fr] items-baseline gap-3 border-b border-border/60 pb-2 text-sm last:border-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono">{value}</div>
    </div>
  );
}

function evalHealth(c: VMConfig, p: { recommendedRam: number; recommendedStorage: number }) {
  const ramRatio = c.ram / p.recommendedRam;
  if (ramRatio < 0.5) return { label: "Underpowered", tone: "border-destructive/40 bg-destructive/5", message: "Simulated OS may boot slowly or feel sluggish in this simulation." };
  if (ramRatio < 1) return { label: "Balanced", tone: "border-amber-500/40 bg-amber-500/5", message: "Should provide a workable simulated experience." };
  if (ramRatio <= 2) return { label: "Recommended", tone: "border-primary/40 bg-primary/5", message: "A comfortable configuration for this simulated OS." };
  return { label: "Overconfigured", tone: "border-blue-500/40 bg-blue-500/5", message: "More than this simulated OS typically needs — that's fine, just wasteful in a real setup." };
}