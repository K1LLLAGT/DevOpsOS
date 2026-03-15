export function list(ws) {
    ws.send(JSON.stringify({
        type: "plugins:list",
        plugins: [] // TODO: real plugin registry
    }));
}

export function install(ws, msg) {
    ws.send(JSON.stringify({ type: "plugins:installed", name: msg.name }));
}

export function remove(ws, msg) {
    ws.send(JSON.stringify({ type: "plugins:removed", name: msg.name }));
}
