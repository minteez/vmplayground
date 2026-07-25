import { useEffect, useMemo, useRef, useState } from "react";
import { useVMStore } from "@/lib/vm-store";
import { OS_PROFILES, type OSProfile } from "@/lib/os-profiles";
import type { View } from "./shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Stage = "bios" | "bootloader" | "os";

export function BootSequence({ vmId, setView }: { vmId: string; setView: (v: View) => void }) {
  const { state, setVMStatus, updateVM, log } = useVMStore();
  const vm = state.vms.find((v) => v.id === vmId);
  const [stage, setStage] = useState<Stage>("bios");
  const [biosLines, setBiosLines] = useState<string[]>([]);
  const [osProgress, setOsProgress] = useState(0);
  const cancelledRef = useRef(false);

  const profile = vm ? OS_PROFILES[vm.os] : null;

  const biosMessages = useMemo(() => [
    "VM Lab Virtual BIOS v1.2",
    "Initialising virtual processor…",
    `Detected ${vm?.config.cpu ?? 0} vCPU cores`,
    "Checking simulated memory…",
    `Memory OK: ${vm?.config.ram ?? 0} GB`,
    "Detecting virtual storage…",
    `Virtual disk: ${vm?.config.storage ?? 0} GB (${vm?.config.diskType?.toUpperCase() ?? "SSD"})`,
    "Initialising display adapter…",
    "Virtual device detection complete.",
  ], [vm]);

  useEffect(() => {
    if (!vm) return;
    cancelledRef.current = false;
    setVMStatus(vm.id, "starting");
    log({ vmId: vm.id, vmName: vm.name, type: "vm.start", description: "Booted" });
    let i = 0;
    const interval = setInterval(() => {
      if (cancelledRef.current) return;
      i++;
      setBiosLines(biosMessages.slice(0, i));
      if (i >= biosMessages.length) {
        clearInterval(interval);
        setTimeout(() => !cancelledRef.current && setStage("bootloader"), 400);
      }
    }, 180);
    return () => { cancelledRef.current = true; clearInterval(interval); };
     
  }, [vm?.id]);

  useEffect(() => {
    if (stage !== "os" || !vm) return;
    const t = setInterval(() => {
      setOsProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => {
            updateVM(vm.id, { hasBooted: true });
            setVMStatus(vm.id, "running");
            setView({ kind: "desktop", id: vm.id });
          }, 400);
          return 100;
        }
        return p + (vm.hasBooted ? 10 : 4);
      });
    }, 90);
    return () => clearInterval(t);
     
  }, [stage, vm?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && vm?.hasBooted) skip();
      if (e.key === "Enter" && stage === "bootloader") setStage("os");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!vm || !profile) return null;

  const skip = () => {
    updateVM(vm.id, { hasBooted: true });
    setVMStatus(vm.id, "running");
    setView({ kind: "desktop", id: vm.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[10px] uppercase tracking-widest text-white/50">
        <span>VM Lab Console · {vm.name}</span>
        <div className="flex gap-2">
          {vm.hasBooted && (
            <Button size="sm" variant="ghost" className="h-6 text-white/70 hover:text-white" onClick={skip}>Skip (ESC)</Button>
          )}
          <Button size="sm" variant="ghost" className="h-6 text-white/70 hover:text-white" onClick={() => { setVMStatus(vm.id, "off"); setView({ kind: "vm", id: vm.id }); }}>Abort</Button>
        </div>
      </div>

      {stage === "bios" && (
        <pre className="flex-1 overflow-hidden p-6 font-mono text-[13px] leading-6 text-emerald-300">
{biosLines.join("\n")}
          <span className="animate-pulse">▍</span>
        </pre>
      )}

      {stage === "bootloader" && (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-lg border border-white/20 p-6 font-mono text-sm">
            <div className="mb-4 text-center text-xs uppercase tracking-widest text-white/60">VM LAB BOOT MANAGER</div>
            <div className="mb-4 border-t border-b border-white/10 py-3">
              <div className="mb-2 text-white/60">Select operating system:</div>
              <div className="rounded bg-white/10 px-3 py-2">▸ {profile.name} {profile.version}</div>
            </div>
            <div className="text-xs text-white/50">Press ENTER to continue</div>
            <Button className="mt-4 w-full" onClick={() => setStage("os")}>Continue</Button>
          </div>
        </div>
      )}

      {stage === "os" && <OSBoot profile={profile} progress={osProgress} />}
    </div>
  );
}

function OSBoot({ profile, progress }: { profile: OSProfile; progress: number }) {
  const shownMessages = profile.bootMessages.slice(0, Math.ceil((progress / 100) * profile.bootMessages.length));

  if (profile.bootStyle === "text") {
    return (
      <pre className="flex-1 overflow-hidden bg-black p-6 font-mono text-[13px] leading-6 text-emerald-400">
{shownMessages.join("\n")}
        <span className="animate-pulse">▍</span>
      </pre>
    );
  }

  if (profile.bootStyle === "terminal") {
    return (
      <pre className="flex-1 overflow-hidden p-6 font-mono text-[12px] leading-6 text-orange-200/90" style={{ background: profile.wallpaper }}>
{shownMessages.join("\n")}
        <span className="animate-pulse">_</span>
      </pre>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden" style={{ background: profile.wallpaper }}>
      <div className={cn(
        "grid size-24 place-items-center rounded-2xl font-mono text-5xl text-white/90 shadow-2xl",
        profile.bootStyle === "glass" && "border border-white/20 bg-white/10 backdrop-blur-xl",
        profile.bootStyle === "modern" && "bg-white/10 backdrop-blur",
        profile.bootStyle === "retro" && "bg-white/20",
      )}>
        {profile.logo}
      </div>
      <div className="mt-6 text-lg font-medium text-white">{profile.name}</div>
      <div className="mt-6 h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-white/80 transition-[width]" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-3 h-4 text-xs text-white/60">
        {shownMessages[shownMessages.length - 1] ?? " "}
      </div>
      <div className="absolute bottom-4 text-[10px] uppercase tracking-widest text-white/40">Press ESC to view details</div>
    </div>
  );
}