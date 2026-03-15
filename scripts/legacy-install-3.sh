const fs = require("fs");
const path = require("path");

const ROOT = "frontend";

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

console.log("[1/6] Removing old frontend...");
fs.rmSync(`${ROOT}/js/core`, { recursive: true, force: true });
fs.rmSync(`${ROOT}/panels`, { recursive: true, force: true });
fs.rmSync(`${ROOT}/ui`, { recursive: true, force: true });

console.log("[2/6] Recreating directories...");
[
  `${ROOT}/js/core`,
  `${ROOT}/ui`,
  `${ROOT}/panels/terminal`,
  `${ROOT}/panels/editor`,
  `${ROOT}/panels/system`,
  `${ROOT}/panels/process`,
  `${ROOT}/panels/filemanager`,
  `${ROOT}/panels/plugins`,
  `${ROOT}/panels/ssh`,
  `${ROOT}/panels/tor`
].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

console.log("[3/6] Writing index.html...");
write(`${ROOT}/index.html`, `[...]`);

console.log("[4/6] Writing core JS...");
write(`${ROOT}/js/core/ws.js`, `[...]`);
write(`${ROOT}/js/core/events.js`, `[...]`);
write(`${ROOT}/js/core/panels.js`, `[...]`);
write(`${ROOT}/js/core/health.js`, `[...]`);
write(`${ROOT}/js/core/ui.js`, `[...]`);
write(`${ROOT}/js/core/oracle.js`, `[...]`);
write(`${ROOT}/js/core/oracle.css`, `[...]`);

console.log("[5/6] Writing UI...");
write(`${ROOT}/ui/nav.js`, `[...]`);
write(`${ROOT}/ui/nav.css`, `[...]`);

console.log("[6/6] Writing panels...");
const panels = ["terminal","editor","system","process","filemanager","plugins","ssh","tor"];
panels.forEach(p => {
  write(`${ROOT}/panels/${p}/${p}.html`, `[...]`);
  write(`${ROOT}/panels/${p}/${p}.js`, `[...]`);
  write(`${ROOT}/panels/${p}/${p}.css`, `[...]`);
});

console.log("Milestone-6 frontend installed successfully.");
