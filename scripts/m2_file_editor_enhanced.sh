#!/bin/bash
set -e

# -----------------------------------------
# Milestone 2 — Step D
# File Editor Enhancements
# -----------------------------------------

# mkdir
cat > backend/fs/mkdir.js << 'JS'
const fs = require("fs");

function makeDir(path) {
  fs.mkdirSync(path, { recursive: true });
  return true;
}

module.exports = { makeDir };
JS

# delete (file or directory)
cat > backend/fs/delete.js << 'JS'
const fs = require("fs");

function deletePath(path) {
  if (!fs.existsSync(path)) return false;

  const stat = fs.lstatSync(path);

  if (stat.isDirectory()) {
    fs.rmSync(path, { recursive: true, force: true });
  } else {
    fs.unlinkSync(path);
  }

  return true;
}

module.exports = { deletePath };
JS

# rename
cat > backend/fs/rename.js << 'JS'
const fs = require("fs");

function renamePath(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
  return true;
}

module.exports = { renamePath };
JS

# atomic write
cat > backend/fs/write_atomic.js << 'JS'
const fs = require("fs");
const path = require("path");

function writeFileAtomic(target, content) {
  const dir = path.dirname(target);
  const tmp = path.join(dir, ".tmp_write_" + Date.now());

  fs.writeFileSync(tmp, content, "utf8");
  fs.renameSync(tmp, target);

  return true;
}

module.exports = { writeFileAtomic };
JS

# Patch server.js with new WebSocket routes
sed -i '/default:/i \
      case "fs_mkdir": {\n\
        const { makeDir } = require("./fs/mkdir");\n\
        const ok = makeDir(payload?.path);\n\
        ws.send(JSON.stringify({ type: "fs_mkdir_result", payload: { path: payload?.path, ok } }));\n\
        break;\n\
      }\n\
\n\
      case "fs_delete": {\n\
        const { deletePath } = require("./fs/delete");\n\
        const ok = deletePath(payload?.path);\n\
        ws.send(JSON.stringify({ type: "fs_delete_result", payload: { path: payload?.path, ok } }));\n\
        break;\n\
      }\n\
\n\
      case "fs_rename": {\n\
        const { renamePath } = require("./fs/rename");\n\
        const ok = renamePath(payload?.oldPath, payload?.newPath);\n\
        ws.send(JSON.stringify({ type: "fs_rename_result", payload: { oldPath: payload?.oldPath, newPath: payload?.newPath, ok } }));\n\
        break;\n\
      }\n\
\n\
      case "fs_write_atomic": {\n\
        const { writeFileAtomic } = require("./fs/write_atomic");\n\
        const ok = writeFileAtomic(payload?.path, payload?.content ?? "");\n\
        ws.send(JSON.stringify({ type: "fs_write_atomic_result", payload: { path: payload?.path, ok } }));\n\
        break;\n\
      }\n\
' backend/server.js

echo "Milestone 2 Step D: File Editor Enhancements installed."
