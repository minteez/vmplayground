import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useVMStore } from "@/lib/vm-store";
import { toast } from "sonner";

export function CloneDialog({
  vmId,
  sourceName,
  open,
  onOpenChange,
}: {
  vmId: string;
  sourceName: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { cloneVM } = useVMStore();
  const [name, setName] = useState(`${sourceName} (Clone)`);
  const [copySnaps, setCopySnaps] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const submit = async () => {
    setProgress("Preparing virtual disk…");
    await sleep(350);
    setProgress("Copying simulated configuration…");
    await sleep(350);
    setProgress("Creating cloned machine…");
    await sleep(350);
    cloneVM(vmId, name.trim() || `${sourceName} (Clone)`, copySnaps);
    setProgress(null);
    toast.success(`Cloned as "${name}"`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone virtual machine</DialogTitle>
        </DialogHeader>
        {progress ? (
          <div className="py-8 text-center font-mono text-sm text-muted-foreground">{progress}</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clone-name">New VM name</Label>
              <Input id="clone-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <label className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
              <span>
                <div className="font-medium">Copy snapshots</div>
                <div className="text-xs text-muted-foreground">Include snapshot history.</div>
              </span>
              <Switch checked={copySnaps} onCheckedChange={setCopySnaps} />
            </label>
          </div>
        )}
        {!progress && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={submit}>Clone</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}