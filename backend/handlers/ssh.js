export function connect(ws, msg) {
    ws.send(JSON.stringify({ type: "ssh:connected" }));
}

export function input(ws, msg) {
    ws.send(JSON.stringify({ type: "ssh:output", data: "SSH not implemented yet" }));
}

export function disconnect(ws) {
    ws.send(JSON.stringify({ type: "ssh:disconnected" }));
}
