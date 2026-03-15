import { exec } from 'child_process';

export function list(ws) {
    exec("ps -eo pid,pcpu,pmem,cmd --sort=-pcpu", (err, stdout) => {
        if (err) return;

        const lines = stdout.trim().split("\n").slice(1);
        const processes = lines.map(line => {
            const parts = line.trim().split(/\s+/, 4);
            return {
                pid: parts[0],
                cpu: parts[1],
                mem: parts[2],
                cmd: parts[3]
            };
        });

        ws.send(JSON.stringify({ type: "process:list", processes }));
    });
}

export function kill(ws, msg) {
    exec(`kill -9 ${msg.pid}`, () => {
        ws.send(JSON.stringify({ type: "process:killed", pid: msg.pid }));
    });
}
