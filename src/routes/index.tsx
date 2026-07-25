import { createFileRoute } from "@tanstack/react-router";
import { VMLabApp } from "@/components/vm-lab/app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mint's VM Playground" },
      { name: "description", content: "A browser-based virtual machine playground with six fictional operating systems, simulated boot, desktop, and apps." },
      { property: "og:title", content: "Mint's VM Playground" },
      { property: "og:description", content: "A browser-based virtual machine playground with six fictional operating systems, simulated boot, desktop, and apps." },
    ],
  }),
  component: Index,
});

function Index() {
  return <VMLabApp />;
}
