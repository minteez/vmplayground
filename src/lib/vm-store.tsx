import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppState, VM, VMConfig, OSId, Snapshot, VMFile, DesktopState, ActivityEvent, VMStatus } from "./vm-types";
import { OS_PROFILES } from "./os-profiles";

const STORAGE_KEY = "vmlab.state.v1";

const defaultDesktop: DesktopState = {
  wallpaperIndex: 0,
  accent: "oklch(0.78 0.16 165)",
  clock24h: true,
  density: "normal",
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seedFiles(): VMFile[] {
  const now = Date.now();
  const root: VMFile[] = [
    { id: "home", name: "Home", type: "folder", parentId: null, createdAt: now },
    { id: "docs", name: "Documents", type: "folder", parentId: "home", createdAt: now },
    { id: "downloads", name: "Downloads", type: "folder", parentId: "home", createdAt: now },
    { id: "pics", name: "Pictures", type: "folder", parentId: "home", createdAt: now },
    { id: "projects", name: "Projects", type: "folder", parentId: "home", createdAt: now },
    { id: "system", name: "System", type: "folder", parentId: null, createdAt: now },
    { id: "apps", name: "Applications", type: "folder", parentId: "system", createdAt: now },
    {
      id: "readme",
      name: "readme.txt",
      type: "file",
      parentId: "docs",
      content:
        "Welcome to VM Lab!\n\nThis is a simulated file inside a simulated OS.\nNothing here touches your real computer.\n\nTry the Terminal, edit this file, or create your own.",
      createdAt: now,
    },
    {
      id: "notes",
      name: "notes.md",
      type: "file",
      parentId: "docs",
      content: "# Lab Notes\n\n- Boot MintOS\n- Snapshot desktop\n- Experiment with hardware",
      createdAt: now,
    },
  ];
  return root;
}

const initialState: AppState = { vms: [], activity: [], onboarded: false };

function loadState(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AppState;
    const removed = parsed.vms?.filter((v) => v.os === "longhorn") ?? [];
    const vms = parsed.vms?.filter((v) => v.os !== "longhorn") ?? [];
    const activity = parsed.activity ?? [];
    if (removed.length > 0) {
      activity.unshift({
        id: uid(),
        timestamp: Date.now(),
        vmId: removed.map((v) => v.id).join(","),
        vmName: removed.map((v) => v.name).join(", "),
        type: "vm.delete",
        description: `Removed ${removed.length} VM(s) using the retired Longhorn Concept OS profile`,
      });
    }
    return { ...parsed, vms, activity: activity.slice(0, 200) };
  } catch {
    return initialState;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

interface VMStoreValue {
  state: AppState;
  createVM: (data: { name: string; description: string; os: OSId; config: VMConfig }) => VM;
  createDemoVM: () => VM;
  deleteVM: (id: string) => void;
  updateVM: (id: string, patch: Partial<VM>) => void;
  setVMStatus: (id: string, status: VMStatus) => void;
  updateConfig: (id: string, patch: Partial<VMConfig>) => void;
  updateDesktop: (id: string, patch: Partial<DesktopState>) => void;
  setFiles: (id: string, files: VMFile[]) => void;
  cloneVM: (id: string, newName: string, copySnapshots: boolean) => VM;
  createSnapshot: (id: string, name: string, description: string) => void;
  restoreSnapshot: (id: string, snapshotId: string) => void;
  deleteSnapshot: (id: string, snapshotId: string) => void;
  log: (event: Omit<ActivityEvent, "id" | "timestamp">) => void;
  markOnboarded: () => void;
  reset: () => void;
}

const VMStoreContext = createContext<VMStoreValue | null>(null);

export function VMStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const log = useCallback((event: Omit<ActivityEvent, "id" | "timestamp">) => {
    setState((s) => ({
      ...s,
      activity: [
        { id: uid(), timestamp: Date.now(), ...event },
        ...s.activity,
      ].slice(0, 200),
    }));
  }, []);

  const value: VMStoreValue = useMemo(() => ({
    state,
    createVM: ({ name, description, os, config }) => {
      const profile = OS_PROFILES[os];
      const vm: VM = {
        id: uid(),
        name,
        description,
        os,
        config,
        status: "off",
        createdAt: Date.now(),
        lastUsed: Date.now(),
        files: seedFiles(),
        desktop: { ...defaultDesktop, accent: profile.accent },
        snapshots: [],
        hasBooted: false,
      };
      setState((s) => ({ ...s, vms: [vm, ...s.vms] }));
      log({ vmId: vm.id, vmName: vm.name, type: "vm.create", description: `Created VM "${name}"` });
      return vm;
    },
    createDemoVM: () => {
      const vm: VM = {
        id: uid(),
        name: "MintOS Demo",
        description: "Preconfigured demo VM",
        os: "mintos",
        config: { ram: 4, cpu: 2, storage: 40, vram: 128, network: true, sound: true, usb: true, diskType: "ssd" },
        status: "off",
        createdAt: Date.now(),
        lastUsed: Date.now(),
        files: seedFiles(),
        desktop: { ...defaultDesktop, accent: OS_PROFILES.mintos.accent },
        snapshots: [],
        hasBooted: false,
      };
      setState((s) => ({ ...s, vms: [vm, ...s.vms] }));
      log({ vmId: vm.id, vmName: vm.name, type: "vm.create", description: `Created demo VM "${vm.name}"` });
      return vm;
    },
    deleteVM: (id) => {
      const vm = state.vms.find((v) => v.id === id);
      setState((s) => ({ ...s, vms: s.vms.filter((v) => v.id !== id) }));
      if (vm) log({ vmId: id, vmName: vm.name, type: "vm.delete", description: `Deleted VM "${vm.name}"` });
    },
    updateVM: (id, patch) => {
      setState((s) => ({ ...s, vms: s.vms.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
    },
    setVMStatus: (id, status) => {
      setState((s) => ({ ...s, vms: s.vms.map((v) => (v.id === id ? { ...v, status, lastUsed: Date.now() } : v)) }));
    },
    updateConfig: (id, patch) => {
      setState((s) => ({ ...s, vms: s.vms.map((v) => (v.id === id ? { ...v, config: { ...v.config, ...patch } } : v)) }));
    },
    updateDesktop: (id, patch) => {
      setState((s) => ({ ...s, vms: s.vms.map((v) => (v.id === id ? { ...v, desktop: { ...v.desktop, ...patch } } : v)) }));
    },
    setFiles: (id, files) => {
      setState((s) => ({ ...s, vms: s.vms.map((v) => (v.id === id ? { ...v, files } : v)) }));
    },
    cloneVM: (id, newName, copySnapshots) => {
      const source = state.vms.find((v) => v.id === id);
      if (!source) throw new Error("VM not found");
      const vm: VM = {
        ...source,
        id: uid(),
        name: newName,
        status: "off",
        createdAt: Date.now(),
        lastUsed: Date.now(),
        snapshots: copySnapshots ? source.snapshots.map((s) => ({ ...s, id: uid() })) : [],
        hasBooted: false,
      };
      setState((s) => ({ ...s, vms: [vm, ...s.vms] }));
      log({ vmId: vm.id, vmName: vm.name, type: "vm.clone", description: `Cloned "${source.name}" as "${newName}"` });
      return vm;
    },
    createSnapshot: (id, name, description) => {
      setState((s) => ({
        ...s,
        vms: s.vms.map((v) => {
          if (v.id !== id) return v;
          const snap: Snapshot = {
            id: uid(),
            name,
            description,
            createdAt: Date.now(),
            files: v.files,
            desktop: v.desktop,
          };
          return { ...v, snapshots: [...v.snapshots, snap] };
        }),
      }));
      const vm = state.vms.find((v) => v.id === id);
      log({ vmId: id, vmName: vm?.name, type: "snapshot.create", description: `Snapshot "${name}"` });
    },
    restoreSnapshot: (id, snapshotId) => {
      setState((s) => ({
        ...s,
        vms: s.vms.map((v) => {
          if (v.id !== id) return v;
          const snap = v.snapshots.find((sn) => sn.id === snapshotId);
          if (!snap) return v;
          return { ...v, files: snap.files, desktop: snap.desktop };
        }),
      }));
      log({ vmId: id, type: "snapshot.restore", description: `Restored snapshot` });
    },
    deleteSnapshot: (id, snapshotId) => {
      setState((s) => ({
        ...s,
        vms: s.vms.map((v) => (v.id === id ? { ...v, snapshots: v.snapshots.filter((sn) => sn.id !== snapshotId) } : v)),
      }));
    },
    log,
    markOnboarded: () => setState((s) => ({ ...s, onboarded: true })),
    reset: () => setState(initialState),
  }), [state, log]);

  return <VMStoreContext.Provider value={value}>{children}</VMStoreContext.Provider>;
}

export function useVMStore() {
  const ctx = useContext(VMStoreContext);
  if (!ctx) throw new Error("useVMStore must be used within VMStoreProvider");
  return ctx;
}