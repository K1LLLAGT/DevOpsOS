import {emit} from "./events.js";
export function route(m){
  switch(m.type){
    case "system:stats": return emit("system:stats",m);
    case "terminal:data": return emit("terminal:data",m);
    case "terminal:output": return emit("terminal:output",m.data);
    case "plugins:list": return emit("plugins:list",m);
    case "ssh:status": return emit("ssh:status",m.status);
    case "ssh:output": return emit("ssh:output",m.data);
    case "ssh:connected": return emit("ssh:connected");
    case "ssh:closed": return emit("ssh:closed");
    case "tor:status": return emit("tor:status",m.status);
    case "tor:circuit": return emit("tor:circuit",m.text);
    case "file:list": return emit("file:list",m);
    case "file:read": return emit("file:read",m);
    case "error": return emit("error",m);
    default: return emit("ws:unknown",m);
  }
}

// --- Marketplace Route ---
ROUTES["marketplace"] = () => {
    loadPanel("marketplace");
};
