import { useState, type ReactNode } from "react";
import { LayoutDashboard, Server, Package, Activity as ActivityIcon, Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type View =
  | { kind: "dashboard" }
  | { kind: "vm"; id: string; tab?: string }
  | { kind: "explore" }
  | { kind: "activity" }
  | { kind: "wizard" }
  | { kind: "boot"; id: string }
  | { kind: "desktop"; id: string };

interface ShellProps {
  view: View;
  setView: (v: View) => void;
  children: ReactNode;
}

const NAV = [
  { kind: "dashboard", label: "VM Manager", icon: LayoutDashboard },
  { kind: "explore", label: "Explore OS", icon: Package },
  { kind: "activity", label: "Activity", icon: ActivityIcon },
] as const;

export function Shell({ view, setView, children }: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isImmersive = view.kind === "boot" || view.kind === "desktop";

  if (isImmersive) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
        <Brand />
        <button
          aria-label="Toggle navigation"
          className="rounded-md border border-border p-2"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      <div className="flex">
        <aside
          className={cn(
            "w-64 shrink-0 border-r border-border bg-sidebar",
            "md:sticky md:top-0 md:h-screen",
            mobileOpen ? "block" : "hidden md:block",
          )}
        >
          <div className="hidden md:block">
            <Brand />
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = view.kind === n.kind;
              return (
                <button
                  key={n.kind}
                  onClick={() => {
                    setView({ kind: n.kind } as View);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {n.label}
                </button>
              );
            })}
            <div className="mt-4 border-t border-sidebar-border pt-4">
              <Button
                onClick={() => {
                  setView({ kind: "wizard" });
                  setMobileOpen(false);
                }}
                className="w-full"
              >
                <Sparkles className="size-4" /> Create VM
              </Button>
            </div>
          </nav>
          <div className="hidden px-4 py-3 text-xs text-muted-foreground md:block">
            <div className="flex items-center gap-2">
              <Server className="size-3" /> VM Lab · Simulation
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground font-mono font-bold">
        VM
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">VM Lab</div>
        <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
          Virtual Machine Laboratory
        </div>
      </div>
    </div>
  );
}