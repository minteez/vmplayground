import { useEffect, useState, type ReactNode, type ComponentType } from "react";
import { useVMStore } from "@/lib/vm-store";
import { OS_PROFILES } from "@/lib/os-profiles";
import type { View } from "./shell";
import type { VM } from "@/lib/vm-types";
import { Power, Folder, TerminalSquare, FileText, Calculator as CalcIcon, Settings as GearIcon, Activity as ActIcon, X, Minus, Square as SquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileManager } from "./apps/file-manager";
import { TerminalApp } from "./apps/terminal";
import { CalculatorApp } from "./apps/calculator";
import { TextEditorApp } from "./apps/text-editor";
import { OSSettingsApp } from "./apps/os-settings";
import { SystemMonitorApp } from "./apps/system-monitor";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AppId = "files" | "terminal" | "editor" | "calc" | "settings" | "monitor";

interface Win {
  id: string;
  app: AppId;
  title: string;
  x: number; y: number; w: number; h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  props?: { fileId?: string };
}

const APPS: Record<AppId, { title: string; icon: ComponentType<{ className?: string }> }> = {
  files: { title: "Files", icon: Folder },
  terminal: { title: "Terminal", icon: TerminalSquare },
  editor: { title: "Text Editor", icon: FileText },
  calc: { title: "Calculator", icon: CalcIcon },
  settings: { title: "Settings", icon: GearIcon },
  monitor: { title: "System Monitor", icon: ActIcon },
};

export function Desktop({ vmId, setView }: { vmId: string; setView: (v: View) => void }) {
  const { state, setVMStatus, log } = useVMStore();
  const vm = state.vms.find((v) => v.id === vmId);
  const [windows, setWindows] = useState<Win[]>([]);
  const [zTop, setZTop] = useState(10);
  const [startOpen, setStartOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!vm) return null;
  const profile = OS_PROFILES[vm.os];

  const openApp = (app: AppId, props?: { fileId?: string }) => {
    setStartOpen(false);
    setWindows((ws) => {
      const existing = ws.find((w) => w.app === app);
      const z = zTop + 1;
      setZTop(z);
      if (existing) return ws.map((w) => w.id === existing.id ? { ...w, minimized: false, z, props: props ?? w.props } : w);
      log({ vmId: vm.id, vmName: vm.name, type: "app.open", description: `Opened ${APPS[app].title}` });
      return [...ws, {
        id: `${app}-${Date.now()}`, app, title: APPS[app].title,
        x: 80 + ws.length * 24, y: 60 + ws.length * 24,
        w: app === "calc" ? 320 : 640, h: app === "calc" ? 460 : 440,
        z, minimized: false, maximized: false, props,
      }];
    });
  };
  const closeWin = (id: string) => setWindows((ws) => ws.filter((w) => w.id !== id));
  const focusWin = (id: string) => {
    const z = zTop + 1; setZTop(z);
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, z, minimized: false } : w));
  };
  const toggleMax = (id: string) => setWindows((ws) => ws.map((w) => w.id === id ? { ...w, maximized: !w.maximized } : w));
  const toggleMin = (id: string) => setWindows((ws) => ws.map((w) => w.id === id ? { ...w, minimized: !w.minimized } : w));

  const shutdown = () => {
    setVMStatus(vm.id, "shutting-down");
    log({ vmId: vm.id, vmName: vm.name, type: "vm.shutdown", description: "Shutdown from desktop" });
    setTimeout(() => { setVMStatus(vm.id, "off"); setView({ kind: "vm", id: vm.id }); }, 900);
  };
  const restart = () => setView({ kind: "boot", id: vm.id });

  const clockText = now.toLocaleTimeString([], vm.desktop.clock24h ? { hour: "2-digit", minute: "2-digit", hour12: false } : { hour: "numeric", minute: "2-digit" });

  const renderApp = (w: Win): ReactNode => {
    switch (w.app) {
      case "files": return <FileManager vm={vm} openInEditor={(fileId) => openApp("editor", { fileId })} />;
      case "terminal": return <TerminalApp vm={vm} />;
      case "editor": return <TextEditorApp vm={vm} initialFileId={w.props?.fileId} />;
      case "calc": return <CalculatorApp />;
      case "settings": return <OSSettingsApp vm={vm} />;
      case "monitor": return <SystemMonitorApp vm={vm} runningApps={windows.map((w) => w.title)} onClose={(title) => setWindows((ws) => ws.filter((wx) => wx.title !== title))} />;
    }
  };

  if (vm.os === "retrodos") return <RetroDOSDesktop vm={vm} onExit={() => setView({ kind: "vm", id: vm.id })} />;

  return (
    <div className="fixed inset-0 select-none overflow-hidden text-white" style={{ background: profile.wallpaper }}>
      <div className="absolute left-6 top-6 grid gap-4">
        {(["files", "terminal", "editor"] as AppId[]).map((a) => {
          const Icon = APPS[a].icon;
          return (
            <button key={a} onDoubleClick={() => openApp(a)} onClick={() => openApp(a)} className="flex w-20 flex-col items-center gap-1 rounded p-2 text-center text-xs text-white/90 hover:bg-white/10">
              <div className="grid size-10 place-items-center rounded-md bg-white/15 backdrop-blur"><Icon className="size-5" /></div>
              {APPS[a].title}
            </button>
          );
        })}
      </div>

      {windows.filter((w) => !w.minimized).map((w) => (
        <Window key={w.id} win={w} onFocus={() => focusWin(w.id)} onClose={() => closeWin(w.id)} onMin={() => toggleMin(w.id)} onMax={() => toggleMax(w.id)} accent={vm.desktop.accent}>
          {renderApp(w)}
        </Window>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl">
        <button
          onClick={() => setStartOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
          aria-label="Start menu"
        >
          <span className="font-mono" style={{ color: vm.desktop.accent }}>{profile.logo}</span> <span className="text-white">Start</span>
        </button>
        <div className="flex flex-1 items-center gap-1 overflow-x-auto">
          {windows.map((w) => {
            const Icon = APPS[w.app].icon;
            return (
              <button key={w.id} onClick={() => (w.minimized ? focusWin(w.id) : toggleMin(w.id))} className={cn("flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10", !w.minimized && "bg-white/15")}>
                <Icon className="size-3.5" /> <span className="max-w-32 truncate">{w.title}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/80">
          <span className="font-mono">{clockText}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button aria-label="Power" className="rounded p-1 hover:bg-white/10"><Power className="size-4" /></button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Power</AlertDialogTitle>
                <AlertDialogDescription>What would you like to do?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="outline" onClick={restart}>Restart</Button>
                <AlertDialogAction onClick={shutdown}>Shut down</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {startOpen && (
        <div className="absolute bottom-14 left-3 z-40 w-72 rounded-lg border border-white/15 bg-black/70 p-3 backdrop-blur-xl">
          <div className="px-2 pb-2 text-[10px] uppercase tracking-widest text-white/50">Applications</div>
          <div className="grid grid-cols-3 gap-1">
            {(Object.keys(APPS) as AppId[]).map((a) => {
              const Icon = APPS[a].icon;
              return (
                <button key={a} onClick={() => openApp(a)} className="flex flex-col items-center gap-1 rounded p-3 text-center text-[11px] hover:bg-white/10">
                  <Icon className="size-5" />{APPS[a].title}
                </button>
              );
            })}
          </div>
          <div className="mt-2 border-t border-white/10 pt-2">
            <button className="flex w-full items-center gap-2 rounded p-2 text-left text-xs hover:bg-white/10" onClick={() => { setStartOpen(false); setView({ kind: "vm", id: vm.id }); }}>
              ← Back to VM Manager
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Window({ win, onFocus, onClose, onMin, onMax, accent, children }: { win: Win; onFocus: () => void; onClose: () => void; onMin: () => void; onMax: () => void; accent: string; children: ReactNode }) {
  const style: React.CSSProperties = win.maximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 48px)", zIndex: win.z }
    : { top: win.y, left: win.x, width: win.w, height: win.h, zIndex: win.z };
  return (
    <div
      className="absolute flex flex-col overflow-hidden rounded-lg border border-white/15 bg-neutral-900/95 text-neutral-100 shadow-2xl backdrop-blur-xl"
      style={style}
      onMouseDown={onFocus}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-black/30 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: accent }} />
          <span className="truncate">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onMin} aria-label="Minimize" className="rounded p-1 hover:bg-white/10"><Minus className="size-3" /></button>
          <button onClick={onMax} aria-label="Maximize" className="rounded p-1 hover:bg-white/10"><SquareIcon className="size-3" /></button>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-red-500/70"><X className="size-3" /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function RetroDOSDesktop({ vm, onExit }: { vm: VM; onExit: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col bg-black font-mono text-emerald-400">
      <div className="flex items-center justify-between border-b border-emerald-900 px-3 py-1 text-[10px] uppercase text-emerald-600">
        <span>RetroDOS · {vm.name}</span>
        <button className="hover:text-emerald-300" onClick={onExit}>[EXIT]</button>
      </div>
      <div className="flex-1 overflow-hidden p-4">
        <TerminalApp vm={vm} />
      </div>
    </div>
  );
}