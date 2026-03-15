import fs from 'fs';

export function openFile(ws, msg) {
    try {
        const content = fs.readFileSync(msg.path, 'utf8');
        ws.send(JSON.stringify({ type: "editor:content", content }));
    } catch (e) {
        ws.send(JSON.stringify({ type: "editor:error", error: e.message }));
    }
}

export function saveFile(ws, msg) {
    try {
        fs.writeFileSync(msg.path, msg.content, 'utf8');
        ws.send(JSON.stringify({ type: "editor:saved" }));
    } catch (e) {
        ws.send(JSON.stringify({ type: "editor:error", error: e.message }));
    }
}
