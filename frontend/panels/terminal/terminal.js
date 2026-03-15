import { emit, on } from "../../js/core/events.js";

let termId = "term-1";

export function init() {
  const input = document.querySelector("#terminal-input");
  const clearBtn = document.querySelector("#terminal-clear");

  on("terminal:data", msg => append(msg.chunk));
  on("terminal:output", data => append(data));

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        emit("ws:send", { type:"terminal:input", id:termId, data:input.value+"\n" });
        input.value = "";
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const out = document.querySelector("#terminal-output");
      if (out) out.textContent = "";
    });
  }

  emit("ws:send", { type:"terminal:start", id:termId, cols:120, rows:30 });
}

function append(text) {
  const out = document.querySelector("#terminal-output");
  if (!out) return;
  out.textContent += text;
  out.scrollTop = out.scrollHeight;
}
