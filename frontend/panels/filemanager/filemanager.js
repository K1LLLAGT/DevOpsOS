import { emit, on } from "../../js/core/events.js";

let currentPath = "/";

export function init() {
  document.querySelector("#fm-path").textContent = currentPath;

  document.querySelector("#fm-refresh").onclick = () => list();
  document.querySelector("#fm-up").onclick = () => {
    if (currentPath !== "/") {
      const parts = currentPath.split("/").filter(Boolean);
      parts.pop();
      currentPath = "/" + parts.join("/");
      if (currentPath === "/") currentPath = "/";
      document.querySelector("#fm-path").textContent = currentPath;
      list();
    }
  };

  on("file:list", msg => {
    if (msg.path !== currentPath) return;
    render(msg.list);
  });

  on("file:read", msg => {
    alert("File content:\n\n" + msg.content);
  });

  list();
}

function list() {
  emit("ws:send", { type:"file:list", path:currentPath });
}

function render(items) {
  const list = document.querySelector("#filemanager-list");
  list.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "fm-item " + (item.type === "dir" ? "fm-dir" : "fm-file");
    div.textContent = item.name;

    div.onclick = () => {
      if (item.type === "dir") {
        currentPath = currentPath === "/" ? "/" + item.name : currentPath + "/" + item.name;
        document.querySelector("#fm-path").textContent = currentPath;
        list();
      } else {
        emit("ws:send", { type:"file:read", path:currentPath + "/" + item.name });
      }
    };

    list.appendChild(div);
  });
}
