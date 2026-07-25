import { useEffect, useRef, useState } from "react";
import type { VM } from "@/lib/vm-types";
import { OS_PROFILES } from "@/lib/os-profiles";

export function TerminalApp({ vm }: { vm: VM }) {
  const profile = OS_PROFILES[vm.os];
  const prompt = `${vm.name.toLowerCase().replace(/\s+/g, "-")}$ `;
  const [history, setHistory] = useState<{ cmd: string; out: string }[]>([
    { cmd: "", out: `${profile.name} ${profile.version} — VM Lab simulated terminal\nType "help" for available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [commands, setCommands] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) { setHistory((h) => [...h, { cmd: "", out: "" }]); return; }
    let out = "";
    const [name, ...args] = cmd.split(/\s+/);
    switch (name) {
      case "help":
        out = "Available commands: help, clear, about, sysinfo, neofetch, apps, date, uptime, storage, memory, cpu, echo, history";
        break;
      case "clear": setHistory([]); return;
      case "about": out = `${profile.name} ${profile.version}\n${profile.description}\nThis is a VM Lab simulation.`; break;
      case "sysinfo":
      case "neofetch":
        out = [
          `${profile.logo} ${profile.name} ${profile.version}`,
          `Host: VM Lab Simulated Machine`,
          `Kernel: virtual-${vm.config.cpu}c-${vm.config.ram}g`,
          `CPU: ${vm.config.cpu} vCPU · Memory: ${vm.config.ram} GB · Disk: ${vm.config.storage} GB`,
          `Interface: ${profile.interfaceType}`,
        ].join("\n");
        break;
      case "apps": out = "files, terminal, editor, calc, settings, monitor"; break;
      case "date": out = new Date().toString(); break;
      case "uptime": out = `Simulated uptime: ${Math.floor(Math.random() * 60 + 1)} minutes`; break;
      case "storage": out = `Virtual disk: ${vm.config.storage} GB (${vm.config.diskType.toUpperCase()})`; break;
      case "memory": out = `RAM: ${vm.config.ram} GB simulated`; break;
      case "cpu": out = `${vm.config.cpu} virtual cores`; break;
      case "echo": out = args.join(" "); break;
      case "history": out = commands.map((c, i) => `${i + 1}  ${c}`).join("\n") || "(empty)"; break;
      default: out = `Command not recognised in VM Lab simulation.`;
    }
    setHistory((h) => [...h, { cmd, out }]);
    setCommands((c) => [...c, cmd]);
    setCursor(-1);
  };

  return (
    <div className="flex h-full flex-col bg-black text-emerald-300" ref={boxRef} onClick={() => (document.getElementById(`term-input-${vm.id}`) as HTMLInputElement)?.focus()}>
      <div className="flex-1 overflow-auto p-3 font-mono text-[12px] leading-5">
        {history.map((h, i) => (
          <div key={i}>
            {h.cmd !== "" && <div><span className="text-emerald-500">{prompt}</span>{h.cmd}</div>}
            {h.out && <pre className="whitespace-pre-wrap text-emerald-200/80">{h.out}</pre>}
          </div>
        ))}
        <form
          onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
          className="mt-1 flex items-center"
        >
          <span className="text-emerald-500">{prompt}</span>
          <input
            id={`term-input-${vm.id}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && commands.length) {
                const c = Math.min(commands.length - 1, cursor + 1);
                setCursor(c);
                setInput(commands[commands.length - 1 - c]);
              } else if (e.key === "ArrowDown") {
                const c = Math.max(-1, cursor - 1);
                setCursor(c);
                setInput(c === -1 ? "" : commands[commands.length - 1 - c]);
              }
            }}
            className="flex-1 border-0 bg-transparent font-mono text-[12px] text-emerald-200 outline-none"
            autoFocus
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
}