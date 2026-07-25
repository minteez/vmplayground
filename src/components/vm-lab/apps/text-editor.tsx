import { useEffect, useMemo, useState } from "react";
import type { VM, VMFile } from "@/lib/vm-types";
import { useVMStore } from "@/lib/vm-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, FilePlus } from "lucide-react";

export function TextEditorApp({ vm, initialFileId }: { vm: VM; initialFileId?: string }) {
  const { setFiles } = useVMStore();
  const files = vm.files.filter((f) => f.type === "file");
  const [fileId, setFileId] = useState<string | null>(initialFileId ?? files[0]?.id ?? null);
  const current = vm.files.find((f) => f.id === fileId);
  const [content, setContent] = useState(current?.content ?? "");
  const [name, setName] = useState(current?.name ?? "untitled.txt");

  useEffect(() => {
    if (current) { setContent(current.content ?? ""); setName(current.name); }
     
  }, [current?.id]);

  const words = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content]);

  const save = () => {
    if (!current) {
      const nf: VMFile = { id: `f${Date.now()}`, name, type: "file", parentId: "docs", content, createdAt: Date.now() };
      setFiles(vm.id, [...vm.files, nf]);
      setFileId(nf.id);
    } else {
      setFiles(vm.id, vm.files.map((f) => (f.id === current.id ? { ...f, name, content } : f)));
    }
  };
  const newDoc = () => { setFileId(null); setContent(""); setName("untitled.txt"); };

  return (
    <div className="flex h-full flex-col bg-neutral-900 text-neutral-100">
      <div className="flex items-center gap-2 border-b border-white/10 p-2">
        <Button size="sm" variant="ghost" onClick={newDoc} aria-label="New"><FilePlus className="size-3.5" /></Button>
        <select className="rounded bg-white/5 px-2 py-1 text-xs" value={fileId ?? ""} onChange={(e) => setFileId(e.target.value || null)} aria-label="Open file">
          <option value="">— New —</option>
          {files.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-7 flex-1 text-xs" aria-label="File name" />
        <Button size="sm" onClick={save}><Save className="size-3.5" /> Save</Button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none bg-neutral-950 p-4 font-mono text-sm text-emerald-100 outline-none"
        placeholder="Start typing…"
        aria-label="Editor"
      />
      <div className="border-t border-white/10 px-3 py-1 font-mono text-[10px] text-white/50">
        {content.length} chars · {words} words
      </div>
    </div>
  );
}