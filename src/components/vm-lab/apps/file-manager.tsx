import { useMemo, useState } from "react";
import type { VM, VMFile } from "@/lib/vm-types";
import { useVMStore } from "@/lib/vm-store";
import { Folder, FileText, Plus, Trash2, ChevronRight, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FileManager({ vm, openInEditor }: { vm: VM; openInEditor: (id: string) => void }) {
  const { setFiles } = useVMStore();
  const [cwd, setCwd] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    if (q.trim()) return vm.files.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
    return vm.files.filter((f) => f.parentId === cwd);
  }, [vm.files, cwd, q]);

  const parent = cwd ? vm.files.find((f) => f.id === cwd) : null;

  const create = (type: "file" | "folder") => {
    const name = window.prompt(`New ${type} name`, type === "file" ? "untitled.txt" : "New Folder");
    if (!name) return;
    const nf: VMFile = { id: `${type[0]}${Date.now()}`, name, type, parentId: cwd, createdAt: Date.now(), content: type === "file" ? "" : undefined };
    setFiles(vm.id, [...vm.files, nf]);
  };
  const remove = (id: string) => setFiles(vm.id, vm.files.filter((f) => f.id !== id && f.parentId !== id));
  const rename = (f: VMFile) => {
    const name = window.prompt("Rename to", f.name);
    if (!name) return;
    setFiles(vm.id, vm.files.map((x) => (x.id === f.id ? { ...x, name } : x)));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 p-2">
        <Button size="sm" variant="ghost" className="text-white/80 hover:text-white" onClick={() => setCwd(parent?.parentId ?? null)} disabled={!parent && !q} aria-label="Up">
          <ArrowLeft className="size-3.5" />
        </Button>
        <div className="flex flex-1 items-center gap-1 rounded bg-white/5 px-2 py-1 text-xs">
          <span>/</span>{parent && <><span>{parent.name}</span><ChevronRight className="size-3" /></>}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1.5 size-3.5 text-white/50" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="h-7 w-40 pl-7 text-xs" />
        </div>
        <Button size="sm" variant="ghost" className="text-white/80 hover:text-white" onClick={() => create("folder")}><Plus className="size-3.5" /> Folder</Button>
        <Button size="sm" variant="ghost" className="text-white/80 hover:text-white" onClick={() => create("file")}><Plus className="size-3.5" /> File</Button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {items.length === 0 ? (
          <div className="grid h-full place-items-center text-xs text-white/50">No items.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4">
            {items.map((f) => (
              <li key={f.id}>
                <button
                  onDoubleClick={() => (f.type === "folder" ? setCwd(f.id) : openInEditor(f.id))}
                  onClick={() => (f.type === "folder" ? setCwd(f.id) : openInEditor(f.id))}
                  onContextMenu={(e) => { e.preventDefault(); rename(f); }}
                  className="group flex w-full items-center gap-2 rounded p-2 text-left text-xs hover:bg-white/10"
                >
                  {f.type === "folder" ? <Folder className="size-4 text-amber-300" /> : <FileText className="size-4 text-sky-300" />}
                  <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  <span onClick={(e) => { e.stopPropagation(); remove(f.id); }} className="opacity-0 group-hover:opacity-100" aria-label="Delete">
                    <Trash2 className="size-3 text-red-400" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-white/10 p-2 text-[10px] text-white/50">
        {items.length} item{items.length === 1 ? "" : "s"} · simulated filesystem only
      </div>
    </div>
  );
}