import * as terminal from './handlers/terminal.js';
import * as editor from './handlers/editor.js';
import * as system from './handlers/system.js';
import * as process from './handlers/process.js';
import * as plugins from './handlers/plugins.js';
import * as ssh from './handlers/ssh.js';
import * as tor from './handlers/tor.js';

export function route(ws, msg) {
    const type = msg.type;

    // Terminal
    if (type === "terminal:input") return terminal.handleInput(ws, msg);

    // Editor
    if (type === "editor:open") return editor.openFile(ws, msg);
    if (type === "editor:save") return editor.saveFile(ws, msg);

    // System Monitor
    if (type === "system:stats") return system.sendStats(ws);

    // Process Manager
    if (type === "process:list") return process.list(ws);
    if (type === "process:kill") return process.kill(ws, msg);

    // Plugins
    if (type === "plugins:list") return plugins.list(ws);
    if (type === "plugins:install") return plugins.install(ws, msg);
    if (type === "plugins:remove") return plugins.remove(ws, msg);

    // SSH
    if (type === "ssh:connect") return ssh.connect(ws, msg);
    if (type === "ssh:input") return ssh.input(ws, msg);
    if (type === "ssh:disconnect") return ssh.disconnect(ws);

    // Tor
    if (type === "tor:start") return tor.start(ws);
    if (type === "tor:stop") return tor.stop(ws);
    if (type === "tor:newid") return tor.newIdentity(ws);
    if (type === "tor:status") return tor.status(ws);

    // Unknown
    ws.send(JSON.stringify({ type: "error", error: "Unknown message type: " + type }));
}
