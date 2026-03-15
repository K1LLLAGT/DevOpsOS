import os
import shutil

ROOT = "frontend"

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

print("[1/6] Removing old frontend...")
shutil.rmtree(f"{ROOT}/js/core", ignore_errors=True)
shutil.rmtree(f"{ROOT}/panels", ignore_errors=True)
shutil.rmtree(f"{ROOT}/ui", ignore_errors=True)

print("[2/6] Recreating directories...")
dirs = [
    f"{ROOT}/js/core",
    f"{ROOT}/ui",
    f"{ROOT}/panels/terminal",
    f"{ROOT}/panels/editor",
    f"{ROOT}/panels/system",
    f"{ROOT}/panels/process",
    f"{ROOT}/panels/filemanager",
    f"{ROOT}/panels/plugins",
    f"{ROOT}/panels/ssh",
    f"{ROOT}/panels/tor",
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

print("[3/6] Writing index.html...")
write(f"{ROOT}/index.html", "[...]")

print("[4/6] Writing core JS...")
write(f"{ROOT}/js/core/ws.js", "[...]")
write(f"{ROOT}/js/core/events.js", "[...]")
write(f"{ROOT}/js/core/panels.js", "[...]")
write(f"{ROOT}/js/core/health.js", "[...]")
write(f"{ROOT}/js/core/ui.js", "[...]")
write(f"{ROOT}/js/core/oracle.js", "[...]")
write(f"{ROOT}/js/core/oracle.css", "[...]")

print("[5/6] Writing UI...")
write(f"{ROOT}/ui/nav.js", "[...]")
write(f"{ROOT}/ui/nav.css", "[...]")

print("[6/6] Writing panels...")
panels = ["terminal","editor","system","process","filemanager","plugins","ssh","tor"]

for p in panels:
    write(f"{ROOT}/panels/{p}/{p}.html", "[...]")
    write(f"{ROOT}/panels/{p}/{p}.js", "[...]")
    write(f"{ROOT}/panels/{p}/{p}.css", "[...]")

print("Milestone-6 frontend installed successfully.")
