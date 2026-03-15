import os from 'os';

export function sendStats(ws) {
    ws.send(JSON.stringify({
        type: "system:stats",
        cpu: 0, // TODO: real CPU
        mem: Math.round((1 - os.freemem() / os.totalmem()) * 100),
        load: os.loadavg().join(' '),
        uptime: os.uptime()
    }));
}
