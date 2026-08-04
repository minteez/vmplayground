import { useState } from "react";
import { VMStoreProvider } from "@/lib/vm-store";
import { Shell, type View } from "./shell";
import { Dashboard } from "./dashboard";
import { CreateWizard } from "./create-wizard";
import { VMDetails } from "./vm-details";
import { BootSequence } from "./boot-sequence";
import { Desktop } from "./desktop";
import { ExploreOS } from "./explore-os";
import { ActivityView } from "./activity";
import { AboutView } from "./about";

export function VMLabApp() {
  const [view, setView] = useState<View>({ kind: "dashboard" });
  return (
    <VMStoreProvider>
      <Shell view={view} setView={setView}>
        {view.kind === "dashboard" && <Dashboard setView={setView} />}
        {view.kind === "wizard" && <CreateWizard setView={setView} />}
        {view.kind === "vm" && <VMDetails vmId={view.id} setView={setView} />}
        {view.kind === "boot" && <BootSequence vmId={view.id} setView={setView} />}
        {view.kind === "desktop" && <Desktop vmId={view.id} setView={setView} />}
        {view.kind === "explore" && <ExploreOS setView={setView} />}
        {view.kind === "activity" && <ActivityView />}
        {view.kind === "about" && <AboutView />}
      </Shell>
    </VMStoreProvider>
  );
}