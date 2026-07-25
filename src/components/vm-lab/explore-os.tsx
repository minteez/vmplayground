import { OS_LIST } from "@/lib/os-profiles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { View } from "./shell";

export function ExploreOS({ setView }: { setView: (v: View) => void }) {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Explore Operating Systems</h1>
        <p className="text-sm text-muted-foreground">Six fictional systems ready to boot inside VM Lab. All simulated — nothing installs on your machine.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OS_LIST.map((os) => (
          <article key={os.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid h-32 place-items-center text-4xl" style={{ background: os.wallpaper, color: os.accent }}>
              <span className="font-mono">{os.logo}</span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold">{os.name}</h2>
                <Badge variant="secondary">{os.version}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{os.tagline}</p>
              <p className="mt-2 text-xs">{os.description}</p>
              <dl className="mt-3 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                <div>Era: <span className="text-foreground">{os.era}</span></div>
                <div>UI: <span className="text-foreground">{os.interfaceType}</span></div>
                <div>RAM: <span className="text-foreground">{os.recommendedRam} GB</span></div>
                <div>Disk: <span className="text-foreground">{os.recommendedStorage} GB</span></div>
              </dl>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline">{os.difficulty}</Badge>
                <Button size="sm" onClick={() => setView({ kind: "wizard" })}>Create VM</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}