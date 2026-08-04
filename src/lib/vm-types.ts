export type VMStatus = "off" | "running" | "paused" | "starting" | "shutting-down" | "suspended";

export type OSId = "mintos" | "aurora" | "retrodos" | "nova" | "classic";

export interface VMFile {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  content?: string;
  createdAt: number;
}

export interface Snapshot {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  files: VMFile[];
  desktop: DesktopState;
}

export interface DesktopState {
  wallpaperIndex: number;
  accent: string;
  clock24h: boolean;
  density: "compact" | "normal" | "comfortable";
}

export interface VMConfig {
  ram: number; // GB
  cpu: number;
  storage: number; // GB
  vram: number; // MB
  network: boolean;
  sound: boolean;
  usb: boolean;
  diskType: "ssd" | "hdd" | "dynamic" | "fixed";
}

export interface VM {
  id: string;
  name: string;
  description: string;
  os: OSId;
  config: VMConfig;
  status: VMStatus;
  createdAt: number;
  lastUsed: number;
  files: VMFile[];
  desktop: DesktopState;
  snapshots: Snapshot[];
  hasBooted: boolean;
}

export interface ActivityEvent {
  id: string;
  vmId?: string;
  vmName?: string;
  type: string;
  description: string;
  timestamp: number;
}

export interface AppState {
  vms: VM[];
  activity: ActivityEvent[];
  onboarded: boolean;
}