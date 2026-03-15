window.backend.on("terminal_output", (msg) => {
  const term = document.getElementById("terminal_output");
  term.value += msg.data;
  term.scrollTop = term.scrollHeight;
});

function terminalSend() {
  const input = document.getElementById("terminal_input");
  backend.send("terminal_input", { data: input.value + "\n" });
  input.value = "";
}
