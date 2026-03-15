export function handleInput(ws, msg) {
    // TODO: connect to PTY
    ws.send(JSON.stringify({ type: "terminal:output", data: "PTY not implemented yet" }));
}
