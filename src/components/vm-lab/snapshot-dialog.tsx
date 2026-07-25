import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVMStore } from "@/lib/vm-store";
import { toast } from "sonner";

export function SnapshotDialog({
  vmId,
  open,
  onOpenChange,
}: {
  vmId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { createSnapshot } = useVMStore();
  const [name, setName] = useState("New Snapshot");
  const [desc, setDesc] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create snapshot</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="snap-name">Name</Label>
            <Input id="snap-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="snap-desc">Description</Label>
            <Textarea id="snap-desc" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              createSnapshot(vmId, name.trim() || "Snapshot", desc.trim());
              toast.success("Snapshot created");
              onOpenChange(false);
            }}
          >
            Save snapshot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}