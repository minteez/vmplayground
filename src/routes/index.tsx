import { createFileRoute } from "@tanstack/react-router";
import { VMLabApp } from "@/components/vm-lab/app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VM Lab — Virtual Machine Laboratory" },
      { name: "description", content: "A browser-based virtual machine playground with six fictional operating systems, simulated boot, desktop, and apps." },
      { property: "og:title", content: "VM Lab — Virtual Machine Laboratory" },
      { property: "og:description", content: "Create, boot, and explore fictional operating systems in a fully simulated browser lab." },
    ],
  }),
  component: Index,
});

function Index() {
  return <VMLabApp />;
}
