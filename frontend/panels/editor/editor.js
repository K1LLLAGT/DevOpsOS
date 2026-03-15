import { on, emit } from "../../js/core/events.js";

let currentPath = null;

export function init() {
  on("file:read", msg => {
    currentPath = msg.path;
    document.querySelector("#editor-content").value = msg.content || "";
    document.querySelector("#editor-path").textContent = msg.path;
  });

  const textarea = document.querySelector("#editor-content");
  textarea.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      emit("ws:send", { type:"file:write", path:currentPath, content:textarea.value });
    }
  });
}
