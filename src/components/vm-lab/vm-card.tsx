import { Play, Settings, Copy, Camera, Trash2, MoreVertical, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, type ComponentType } from "react";
import { OS_PROFILES } from "@/lib/os-profiles";
import type { VM } from "@/lib/vm-types";
import { useVMStore } from "@/lib/vm-store";
import type { View } from "./shell";
import { CloneDialog } from "./clone-dialog";
import { SnapshotDialog } from "./snapshot-dialog";
import { StatusPill } from "./status-pill";

export function VMCard({ vm, setView }: { vm: VM; setView: (v: View) => void }) {
  const { deleteVM } = useVMStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);
  const profile = OS_PROFILES[vm.os];

  const start = () => setView({ kind: "boot", id: vm.id });

  return (
    <>
      <Card className="group relative overflow-hidden border-border/60 transition-colors hover:border-primary/50">
        <div className="h-16 border-b border-border" style={{ background: profile.wallpaper }} aria-hidden />
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg" aria-hidden>{profile.logo}</span>
                <h3 className="truncate text-base font-semibold">{vm.name}</h3>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {profile.name} {profile.version}
              </p>
            </div>
            <StatusPill status={vm.status} />
          </div>

          <dl className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-3 text-xs">
            <Metric icon={MemoryStick} label="RAM" value={`${vm.config.ram} GB`} />
            <Metric icon={Cpu} label="vCPU" value={String(vm.config.cpu)} />
            <Metric icon={HardDrive} label="Disk" value={`${vm.config.storage} GB`} />
          </dl>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{vm.snapshots.length} snapshot{vm.snapshots.length === 1 ? "" : "s"}</span>
            <span>Used {formatRel(vm.lastUsed)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={start} className="flex-1">
              <Play className="size-3.5" /> {vm.status === "running" ? "Open" : "Start"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setView({ kind: "vm", id: vm.id })} aria-label="Settings">
              <Settings className="size-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" aria-label="More actions">
                  <MoreVertical className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView({ kind: "vm", id: vm.id })}>Open details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSnapOpen(true)}>
                  <Camera className="size-3.5" /> Snapshot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCloneOpen(true)}>
                  <Copy className="size-3.5" /> Clone
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="size-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <CloneDialog vmId={vm.id} open={cloneOpen} onOpenChange={setCloneOpen} sourceName={vm.name} />
      <SnapshotDialog vmId={vm.id} open={snapOpen} onOpenChange={setSnapOpen} />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{vm.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the simulated VM, its snapshots and simulated files from your browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteVM(vm.id)}
            >
              Delete VM
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Metric({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" /> {label}
      </div>
      <div className="mt-0.5 truncate font-mono text-sm">{value}</div>
    </div>
  );
}

function formatRel(ts: number) {
  const d = Date.now() - ts;
  if (d < 60_000) return "just now";
  if (d < 3_600_000) return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  return `${Math.floor(d / 86_400_000)}d ago`;
}