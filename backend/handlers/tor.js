export function start(ws) {
    ws.send(JSON.stringify({ type: "tor:started" }));
}

export function stop(ws) {
    ws.send(JSON.stringify({ type: "tor:stopped" }));
}

export function newIdentity(ws) {
    ws.send(JSON.stringify({ type: "tor:newid" }));
}

export function status(ws) {
    ws.send(JSON.stringify({
        type: "tor:status",
        running: false,
        circuit: "--"
    }));
}
