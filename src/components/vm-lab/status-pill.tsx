import type { VMStatus } from "@/lib/vm-types";
import { cn } from "@/lib/utils";

const LABELS: Record<VMStatus, string> = {
  off: "Powered Off",
  running: "Running",
  paused: "Paused",
  starting: "Starting",
  "shutting-down": "Shutting Down",
  suspended: "Suspended",
};

const STYLES: Record<VMStatus, string> = {
  off: "bg-muted text-muted-foreground",
  running: "bg-primary/15 text-primary",
  paused: "bg-amber-500/15 text-amber-400",
  starting: "bg-blue-500/15 text-blue-400",
  "shutting-down": "bg-orange-500/15 text-orange-400",
  suspended: "bg-purple-500/15 text-purple-400",
};

export function StatusPill({ status }: { status: VMStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        STYLES[status],
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status === "running" ? "animate-pulse bg-primary" : "bg-current opacity-70",
        )}
      />
      {LABELS[status]}
    </span>
  );
}