import type { VM } from "@/lib/vm-types";
import type { ReactNode } from "react";
import { useVMStore } from "@/lib/vm-store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { OS_PROFILES } from "@/lib/os-profiles";

const WALLPAPERS = [
  "radial-gradient(1200px 800px at 20% 20%, oklch(0.4 0.09 175) 0%, transparent 60%), linear-gradient(140deg, oklch(0.22 0.03 200), oklch(0.16 0.02 220))",
  "linear-gradient(135deg, oklch(0.3 0.09 20), oklch(0.15 0.03 40))",
  "linear-gradient(160deg, oklch(0.28 0.09 260), oklch(0.14 0.03 280))",
  "radial-gradient(800px 600px at 80% 20%, oklch(0.4 0.12 140) 0%, transparent 60%), oklch(0.16 0.03 160)",
];

const ACCENTS = ["oklch(0.78 0.16 165)", "oklch(0.72 0.15 240)", "oklch(0.78 0.14 30)", "oklch(0.78 0.14 300)"];

export function OSSettingsApp({ vm }: { vm: VM }) {
  const { updateDesktop } = useVMStore();
  const profile = OS_PROFILES[vm.os];

  return (
    <div className="h-full overflow-auto bg-neutral-900 p-6 text-neutral-100">
      <h2 className="mb-4 text-lg font-semibold">Settings</h2>

      <Section title="Personalisation">
        <Label className="mb-2 block text-xs text-white/70">Wallpaper</Label>
        <div className="grid grid-cols-4 gap-2">
          {WALLPAPERS.map((w, i) => (
            <button key={i} onClick={() => updateDesktop(vm.id, { wallpaperIndex: i })} className={cn("aspect-video rounded border-2", vm.desktop.wallpaperIndex === i ? "border-white" : "border-transparent")} style={{ background: w }} aria-label={`Wallpaper ${i + 1}`} />
          ))}
        </div>
        <Label className="mb-2 mt-4 block text-xs text-white/70">Accent colour</Label>
        <div className="flex gap-2">
          {ACCENTS.map((a) => (
            <button key={a} onClick={() => updateDesktop(vm.id, { accent: a })} className={cn("size-8 rounded-full border-2", vm.desktop.accent === a ? "border-white" : "border-transparent")} style={{ background: a }} aria-label="Accent" />
          ))}
        </div>
      </Section>

      <Section title="Display">
        <Row label="Interface density">
          <select value={vm.desktop.density} onChange={(e) => updateDesktop(vm.id, { density: e.target.value as "compact" | "normal" | "comfortable" })} className="rounded bg-white/10 px-2 py-1 text-sm">
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </Row>
        <Row label="24-hour clock"><Switch checked={vm.desktop.clock24h} onCheckedChange={(v) => updateDesktop(vm.id, { clock24h: v })} /></Row>
      </Section>

      <Section title="System information">
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <Info label="OS" value={`${profile.name} ${profile.version}`} />
          <Info label="Era" value={profile.era} />
          <Info label="RAM" value={`${vm.config.ram} GB`} />
          <Info label="CPU" value={`${vm.config.cpu} vCPU`} />
          <Info label="Storage" value={`${vm.config.storage} GB`} />
          <Info label="Graphics" value={`${vm.config.vram} MB`} />
        </dl>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="mb-3 text-xs uppercase tracking-widest text-white/60">{title}</div>
      {children}
    </section>
  );
}
function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-center justify-between py-1 text-sm"><span>{label}</span>{children}</div>;
}
function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div><div className="font-mono">{value}</div></div>;
}