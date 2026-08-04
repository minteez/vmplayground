import { Info, Heart, ExternalLink, Cpu, Terminal, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutView() {
  const year = new Date().getFullYear();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">About VM Lab</h1>
        <p className="text-sm text-muted-foreground">What this playground is and how it works.</p>
      </header>

      <div className="grid gap-6">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Info className="size-5" />
            <h2 className="text-base font-semibold">About the website</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            VM Lab is a browser-based Virtual Machine Laboratory and simulated Operating System playground.
            It lets you create, configure, and boot fictional operating systems without installing anything on your real machine.
            Every VM is a sandbox: the boot process, desktop, file manager, terminal, text editor, calculator, settings, and system monitor are all simulated in your browser.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Sparkles className="size-5" />
            <h2 className="text-base font-semibold">How it works</h2>
          </div>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <Cpu className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Create a VM from one of the fictional OS profiles and pick its CPU, RAM, and storage.</span>
            </li>
            <li className="flex items-start gap-2">
              <Terminal className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Boot the VM to watch a simulated POST sequence, then land in a themed desktop environment.</span>
            </li>
            <li className="flex items-start gap-2">
              <Save className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Use snapshots to save a VM state at any time and clone it later.</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>All data is persisted in your browser's local storage — nothing runs on a real server.</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Heart className="size-5" />
            <h2 className="text-base font-semibold">Credits</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            VM Lab is a creative simulation project built for learning and experimentation.
            Copyright © {year}{" "}
            <span className="font-medium text-foreground">Minteez</span>. All rights reserved.
            Developed with <span className="font-medium text-foreground">Lovable</span>.
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <a href="https://minteez.lovable.app" target="_blank" rel="noopener noreferrer">
                About the Developer <ExternalLink className="ml-2 size-3.5" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
