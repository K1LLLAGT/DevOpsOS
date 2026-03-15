export const listeners = {};
export function on(t,f){(listeners[t]??=[]).push(f);}
export function emit(t,p){(listeners[t]||[]).forEach(fn=>fn(p));}

// Intelligence Bus integration
window.addEventListener("frontend-command", e => {
  const { id, payload } = e.detail;
  emitBusEvent("run_command", { cmd: id, ...payload });
});

window.addEventListener("panel-opened", e => {
  emitBusEvent("open_panel", { id: e.detail.id });
});

window.addEventListener("file-opened", e => {
  emitBusEvent("open_file", { path: e.detail.path });
});
