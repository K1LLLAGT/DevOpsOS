function sshConnect() {
  const host = document.getElementById("ssh_host").value;
  const user = document.getElementById("ssh_user").value;
  const pass = document.getElementById("ssh_pass").value;

  backend.send("ssh_connect", {
    host,
    username: user,
    password: pass
  });
}

function sshExec() {
  const cmd = document.getElementById("ssh_cmd").value;
  backend.send("ssh_exec", { command: cmd });
}

window.backend.on("ssh_exec_result", ({ stdout, stderr }) => {
  document.getElementById("ssh_output").value =
    stdout + (stderr ? "\nERR:\n" + stderr : "");
});
