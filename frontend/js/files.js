window.backend.on("fs_list_result", ({ path, entries }) => {
  const out = document.getElementById("file_list");
  out.innerHTML = entries
    .map(e => \`<div>\${e.type === "dir" ? "📁" : "📄"} \${e.name}</div>\`)
    .join("");
});

function listDir(path) {
  backend.send("fs_list", { path });
}

function readFile(path) {
  backend.send("fs_read", { path });
}

window.backend.on("fs_read_result", ({ path, content }) => {
  document.getElementById("file_editor").value = content;
});
