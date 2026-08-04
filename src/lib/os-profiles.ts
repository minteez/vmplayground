import type { OSId } from "./vm-types";

export interface OSProfile {
  id: OSId;
  name: string;
  version: string;
  era: string;
  interfaceType: string;
  recommendedRam: number;
  recommendedStorage: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  tagline: string;
  accent: string; // oklch
  wallpaper: string; // css gradient
  bootStyle: "modern" | "text" | "terminal" | "glass" | "retro";
  bootMessages: string[];
  logo: string; // emoji-ish glyph
}

export const OS_PROFILES: Record<OSId, OSProfile> = {
  mintos: {
    id: "mintos",
    name: "MintOS",
    version: "4.2 Verdant",
    era: "Contemporary",
    interfaceType: "Modern minimal desktop",
    recommendedRam: 4,
    recommendedStorage: 40,
    difficulty: "Beginner",
    tagline: "A calm, modern experimental OS.",
    description:
      "A fictional lightweight modern operating system with a clean, minimalistic desktop and thoughtful defaults.",
    accent: "oklch(0.78 0.16 165)",
    wallpaper:
      "radial-gradient(1200px 800px at 20% 20%, oklch(0.4 0.09 175) 0%, transparent 60%), linear-gradient(140deg, oklch(0.22 0.03 200), oklch(0.16 0.02 220))",
    bootStyle: "modern",
    bootMessages: [
      "MintOS kernel loading…",
      "Mounting virtual filesystem…",
      "Starting display server…",
      "Loading desktop shell…",
    ],
    logo: "◆",
  },
  aurora: {
    id: "aurora",
    name: "Aurora Linux",
    version: "12 LTS",
    era: "Contemporary",
    interfaceType: "Developer-focused modular desktop",
    recommendedRam: 4,
    recommendedStorage: 32,
    difficulty: "Advanced",
    tagline: "For tinkerers, developers, and terminals.",
    description:
      "A fictional Linux-inspired system focused on customisation, modular panels, and terminal-first workflows.",
    accent: "oklch(0.78 0.16 45)",
    wallpaper:
      "linear-gradient(160deg, oklch(0.2 0.03 30), oklch(0.15 0.02 20))",
    bootStyle: "terminal",
    bootMessages: [
      "[  OK  ] Loaded kernel modules",
      "[  OK  ] Started udev-like device manager",
      "[  OK  ] Mounted /home",
      "[  OK  ] Reached target Graphical Interface",
    ],
    logo: "λ",
  },
  retrodos: {
    id: "retrodos",
    name: "RetroDOS",
    version: "6.22",
    era: "1990s",
    interfaceType: "Command-line",
    recommendedRam: 1,
    recommendedStorage: 2,
    difficulty: "Intermediate",
    tagline: "Pure text. Pure focus.",
    description:
      "A fictional DOS-inspired command-line operating system with a monochrome terminal aesthetic.",
    accent: "oklch(0.85 0.18 130)",
    wallpaper: "#000",
    bootStyle: "text",
    bootMessages: [
      "RetroDOS Version 6.22",
      "Copyright VM Lab Simulated Systems",
      "HIMEM is testing extended memory... done.",
      "C:\\>",
    ],
    logo: ">_",
  },
  nova: {
    id: "nova",
    name: "Nova Windows",
    version: "11X",
    era: "Contemporary",
    interfaceType: "Modern graphical desktop",
    recommendedRam: 8,
    recommendedStorage: 64,
    difficulty: "Beginner",
    tagline: "Familiar. Refined. Original.",
    description:
      "A fictional modern graphical operating system inspired by contemporary desktop environments.",
    accent: "oklch(0.72 0.15 240)",
    wallpaper:
      "radial-gradient(1000px 700px at 70% 30%, oklch(0.4 0.15 250) 0%, transparent 55%), linear-gradient(180deg, oklch(0.2 0.04 250), oklch(0.14 0.03 260))",
    bootStyle: "modern",
    bootMessages: [
      "Preparing Nova Windows…",
      "Loading personal settings…",
      "Starting services…",
      "Almost ready…",
    ],
    logo: "❖",
  },
  classic: {
    id: "classic",
    name: "Classic Desktop",
    version: "3.11",
    era: "1990s",
    interfaceType: "Retro graphical desktop",
    recommendedRam: 1,
    recommendedStorage: 4,
    difficulty: "Beginner",
    tagline: "A retro-inspired graphical desktop.",
    description:
      "A fictional operating system inspired by older graphical desktop systems, with simple tiled windows.",
    accent: "oklch(0.75 0.15 90)",
    wallpaper: "oklch(0.35 0.04 200)",
    bootStyle: "retro",
    bootMessages: [
      "Loading Classic Desktop…",
      "Reading system.ini…",
      "Loading program groups…",
    ],
    logo: "▣",
  },
};

export const OS_LIST = Object.values(OS_PROFILES);