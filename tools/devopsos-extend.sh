#!/usr/bin/env bash
set -euo pipefail

# Resolve the real DevOpsOS root no matter where the script is run from
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

write() {
  local file="$1"
  shift
  mkdir -p "$(dirname "$file")"
  printf "%s\n" "$@" > "$file"
  echo "[OK] $file"
}

echo ">>> Extending DevOpsOS at: $ROOT"

VERSION="1.0.0"
echo "DevOpsOS Extension Pack v$VERSION"

# Rollback support
if [[ "${1:-}" == "--rollback" ]]; then
  echo ">>> Rolling back DevOpsOS extension pack..."

  rm -rf "$ROOT/frontend/panels/onboarding"
  rm -rf "$ROOT/tools/devopsos-sign.js"
  rm -rf "$ROOT/marketplace"
  rm -rf "$ROOT/assets/branding"

  echo "Rollback complete."
  exit 0
fi
# ---------------------------------------------------------
# ONBOARDING WIZARD PANEL
# ---------------------------------------------------------

write "$ROOT/frontend/panels/onboarding/onboarding.html" \
'<div id="onboarding-panel">
  <div class="ob-card">
    <h1>Welcome to DevOpsOS</h1>
    <p>A modular DevOps environment for Android.</p>

    <div class="ob-step" data-step="1">
      <h2>Step 1 — Panels</h2>
      <p>Select which panels you want enabled:</p>
      <div class="ob-grid">
        <label><input type="checkbox" data-panel="terminal" checked> Terminal</label>
        <label><input type="checkbox" data-panel="editor" checked> Editor</label>
        <label><input type="checkbox" data-panel="system" checked> System Monitor</label>
        <label><input type="checkbox" data-panel="process" checked> Process Manager</label>
        <label><input type="checkbox" data-panel="filemanager" checked> File Manager</label>
        <label><input type="checkbox" data-panel="plugins" checked> Plugins</label>
        <label><input type="checkbox" data-panel="ssh"> SSH</label>
        <label><input type="checkbox" data-panel="tor"> Tor</label>
      </div>
      <button class="ob-next">Next</button>
    </div>

    <div class="ob-step" data-step="2" style="display:none;">
      <h2>Step 2 — Theme</h2>
      <p>Choose your theme:</p>
      <select id="ob-theme">
        <option value="hacker">Hacker (Green on Black)</option>
        <option value="dark" selected>Dark</option>
        <option value="light">Light</option>
        <option value="neon">Neon</option>
      </select>
      <button class="ob-prev">Back</button>
      <button class="ob-next">Next</button>
    </div>

    <div class="ob-step" data-step="3" style="display:none;">
      <h2>Step 3 — Backend</h2>
      <label><input type="checkbox" id="ob-autostart" checked> Auto-start backend on app launch</label><br>
      <label>Port: <input type="number" id="ob-port" value="8080"></label><br>
      <label>
        Security Mode:
        <select id="ob-security">
          <option value="local" selected>Local only</option>
          <option value="lan">LAN</option>
        </select>
      </label>
      <button class="ob-prev">Back</button>
      <button class="ob-next">Next</button>
    </div>

    <div class="ob-step" data-step="4" style="display:none;">
      <h2>Ready</h2>
      <p>Your DevOpsOS environment is configured. Click Finish to start.</p>
      <button class="ob-prev">Back</button>
      <button id="ob-finish">Finish</button>
    </div>
  </div>
</div>'

write "$ROOT/frontend/panels/onboarding/onboarding.css" \
'#onboarding-panel{display:flex;align-items:center;justify-content:center;height:100%;background:#050608;color:#f5f5f5;font-family:sans-serif;}
.ob-card{background:#11141a;border-radius:10px;padding:24px;max-width:640px;width:100%;box-shadow:0 0 20px rgba(0,0,0,0.6);}
.ob-card h1{margin-top:0;margin-bottom:8px;}
.ob-card h2{margin-top:16px;}
.ob-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0;}
.ob-step button{margin-top:12px;margin-right:8px;padding:8px 14px;border:none;border-radius:4px;cursor:pointer;}
.ob-next{background:#4fc3f7;color:#000;}
.ob-prev{background:#333;color:#fff;}
#ob-finish{background:#00e676;color:#000;}'

write "$ROOT/frontend/panels/onboarding/onboarding.js" \
'import {emit} from "../../js/core/events.js";

export function init(){
  const steps=[...document.querySelectorAll(".ob-step")];
  let idx=0;

  const show=()=>steps.forEach((s,i)=>s.style.display=i===idx?"block":"none");
  show();

  document.querySelectorAll(".ob-next").forEach(b=>{
    b.onclick=()=>{idx=Math.min(idx+1,steps.length-1);show();};
  });
  document.querySelectorAll(".ob-prev").forEach(b=>{
    b.onclick=()=>{idx=Math.max(idx-1,0);show();};
  });

  document.querySelector("#ob-finish").onclick=()=>{
    const panels=[];
    document.querySelectorAll("input[type=checkbox][data-panel]").forEach(cb=>{
      if(cb.checked) panels.push(cb.dataset.panel);
    });
    const theme=document.querySelector("#ob-theme").value;
    const autostart=document.querySelector("#ob-autostart").checked;
    const port=Number(document.querySelector("#ob-port").value)||8080;
    const security=document.querySelector("#ob-security").value;

    const cfg={panels,theme,backend:{autostart,port,security}};
    localStorage.setItem("devopsos.config",JSON.stringify(cfg));
    emit("onboarding:complete",cfg);
  };
}

export function unload(){}'

# ---------------------------------------------------------
# PLUGIN SIGNING IMPLEMENTATION (NODE TOOL)
# ---------------------------------------------------------

write "$ROOT/tools/devopsos-sign.js" \
'#!/usr/bin/env node
const fs=require("fs");
const crypto=require("crypto");
const path=require("path");

const ROOT=process.env.DEVOPSOS_ROOT || path.join(process.env.HOME,"DevOpsOS");
const cmd=process.argv[2];
const target=process.argv[3];

const KEYDIR=path.join(ROOT,".keys");
const PRIV=path.join(KEYDIR,"devopsos-private.pem");
const PUB=path.join(KEYDIR,"devopsos-public.pem");

function ensureKeys(){
  if(!fs.existsSync(KEYDIR)) fs.mkdirSync(KEYDIR,{recursive:true});
  if(!fs.existsSync(PRIV) || !fs.existsSync(PUB)){
    const {generateKeyPairSync}=require("crypto");
    const {privateKey,publicKey}=generateKeyPairSync("rsa",{modulusLength:2048});
    fs.writeFileSync(PRIV,privateKey.export({type:"pkcs1",format:"pem"}));
    fs.writeFileSync(PUB,publicKey.export({type:"pkcs1",format:"pem"}));
    console.log("Generated new DevOpsOS signing keypair.");
  }
}

function hashDir(dir){
  const files=[];
  function walk(d){
    for(const e of fs.readdirSync(d)){
      const full=path.join(d,e);
      const rel=path.relative(dir,full);
      if(rel.startsWith("signature")) continue;
      const st=fs.statSync(full);
      if(st.isDirectory()) walk(full);
      else files.push(rel);
    }
  }
  walk(dir);
  files.sort();
  const h=crypto.createHash("sha256");
  for(const f of files){
    h.update(f);
    h.update(fs.readFileSync(path.join(dir,f)));
  }
  return h.digest("hex");
}

function signPlugin(pdir){
  ensureKeys();
  const priv=fs.readFileSync(PRIV);
  const hash=hashDir(pdir);
  const sig=crypto.sign("sha256",Buffer.from(hash,"utf8"),priv).toString("base64");
  const out={
    hash,
    signature:sig,
    algorithm:"rsa-sha256",
    created:new Date().toISOString()
  };
  fs.writeFileSync(path.join(pdir,"signature.json"),JSON.stringify(out,null,2));
  console.log("Signed plugin:",pdir);
}

function verifyPlugin(pdir){
  if(!fs.existsSync(PUB)) return console.error("No public key found.");
  const pub=fs.readFileSync(PUB);
  const sigPath=path.join(pdir,"signature.json");
  if(!fs.existsSync(sigPath)) return console.error("No signature.json in",pdir);
  const data=JSON.parse(fs.readFileSync(sigPath,"utf8"));
  const hash=hashDir(pdir);
  if(hash!==data.hash) return console.error("Hash mismatch for",pdir);
  const ok=crypto.verify("sha256",Buffer.from(hash,"utf8"),pub,Buffer.from(data.signature,"base64"));
  console.log(ok?"OK: signature valid":"FAIL: invalid signature");
}

switch(cmd){
  case "keygen":
    ensureKeys();
    console.log("Keys ready in",KEYDIR);
    break;
  case "sign":
    if(!target) throw new Error("Usage: devopsos-sign.js sign plugins/<name>");
    signPlugin(path.resolve(target));
    break;
  case "verify":
    if(!target) throw new Error("Usage: devopsos-sign.js verify plugins/<name>");
    verifyPlugin(path.resolve(target));
    break;
  default:
    console.log("DevOpsOS Plugin Signing");
    console.log("Usage:");
    console.log("  devopsos-sign.js keygen");
    console.log("  devopsos-sign.js sign plugins/<name>");
    console.log("  devopsos-sign.js verify plugins/<name>");
}'

chmod +x "$ROOT/tools/devopsos-sign.js"

# ---------------------------------------------------------
# MARKETPLACE JSON SCHEMA
# ---------------------------------------------------------

write "$ROOT/marketplace/schema/plugins.schema.json" \
'{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DevOpsOS Plugin Marketplace",
  "type": "object",
  "properties": {
    "plugins": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "version", "description", "trust", "source"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "version": { "type": "string", "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$" },
          "description": { "type": "string" },
          "trust": { "type": "string", "enum": ["trusted", "verified", "community", "sandboxed"] },
          "source": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } },
          "homepage": { "type": "string" },
          "signature": { "type": "string" }
        }
      }
    }
  },
  "required": ["plugins"]
}'

write "$ROOT/marketplace/plugins.json" \
'{
  "plugins": [
    {
      "id": "example-plugin",
      "name": "Example Plugin",
      "version": "1.0.0",
      "description": "Sample plugin entry for DevOpsOS marketplace.",
      "trust": "community",
      "source": "https://github.com/yourname/devopsos-plugins",
      "tags": ["example"],
      "homepage": "https://yourname.github.io/DevOpsOS",
      "signature": ""
    }
  ]
}'

# ---------------------------------------------------------
# BRANDING ASSET FOLDER STRUCTURE
# ---------------------------------------------------------

mkdir -p "$ROOT/assets/branding/icons"
mkdir -p "$ROOT/assets/branding/logo"
mkdir -p "$ROOT/assets/branding/splash"
mkdir -p "$ROOT/assets/branding/badges"

write "$ROOT/assets/branding/README.md" \
'# DevOpsOS Branding

- logo/: primary and monochrome logos
- icons/: app icons and favicons
- splash/: splash screen artwork
- badges/: trust and marketplace badges
'

# ---------------------------------------------------------
# TRUST BADGE ICONS (SVG PLACEHOLDERS)
# ---------------------------------------------------------

write "$ROOT/assets/branding/badges/trusted.svg" \
'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="32">
  <rect width="96" height="32" rx="4" fill="#00e676"/>
  <text x="48" y="21" font-size="14" text-anchor="middle" fill="#000">TRUSTED</text>
</svg>'

write "$ROOT/assets/branding/badges/verified.svg" \
'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="32">
  <rect width="96" height="32" rx="4" fill="#4fc3f7"/>
  <text x="48" y="21" font-size="14" text-anchor="middle" fill="#000">VERIFIED</text>
</svg>'

write "$ROOT/assets/branding/badges/community.svg" \
'<svg xmlns="http://www.w3.org/2000/svg" width="112" height="32">
  <rect width="112" height="32" rx="4" fill="#ffeb3b"/>
  <text x="56" y="21" font-size="14" text-anchor="middle" fill="#000">COMMUNITY</text>
</svg>'

write "$ROOT/assets/branding/badges/sandboxed.svg" \
'<svg xmlns="http://www.w3.org/2000/svg" width="112" height="32">
  <rect width="112" height="32" rx="4" fill="#ff5252"/>
  <text x="56" y="21" font-size="14" text-anchor="middle" fill="#000">SANDBOXED</text>
</svg>'

# ---------------------------------------------------------
# MARKETPLACE WEBSITE TEMPLATE (STATIC)
# ---------------------------------------------------------

write "$ROOT/marketplace/site/index.html" \
'<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DevOpsOS Plugin Marketplace</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>DevOpsOS Plugin Marketplace</h1>
    <p>Discover, install, and manage plugins for DevOpsOS.</p>
  </header>
  <main>
    <div id="plugin-list"></div>
  </main>
  <footer>
    <p>DevOpsOS &mdash; THE ROOT IS WITHIN</p>
  </footer>
  <script src="app.js"></script>
</body>
</html>'

write "$ROOT/marketplace/site/style.css" \
'body{margin:0;font-family:sans-serif;background:#050608;color:#f5f5f5;}
header{padding:20px;background:#11141a;border-bottom:1px solid #222;}
main{padding:20px;}
.plugin-card{background:#11141a;border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid #222;}
.plugin-card h2{margin:0 0 4px 0;}
.plugin-meta{font-size:12px;color:#aaa;margin-bottom:8px;}
.badge{display:inline-block;margin-right:6px;vertical-align:middle;}
.badge img{height:20px;}'

write "$ROOT/marketplace/site/app.js" \
'async function load(){
  const res=await fetch("../plugins.json");
  const data=await res.json();
  const list=document.getElementById("plugin-list");
  list.innerHTML="";
  data.plugins.forEach(p=>{
    const div=document.createElement("div");
    div.className="plugin-card";
    const badgeSrc={
      trusted:"../../assets/branding/badges/trusted.svg",
      verified:"../../assets/branding/badges/verified.svg",
      community:"../../assets/branding/badges/community.svg",
      sandboxed:"../../assets/branding/badges/sandboxed.svg"
    }[p.trust] || "";
    div.innerHTML=`
      <h2>${p.name}</h2>
      <div class="plugin-meta">
        <span>${p.id}</span> &mdash;
        <span>v${p.version}</span>
      </div>
      <p>${p.description}</p>
      <div>
        <span class="badge">${badgeSrc ? `<img src="${badgeSrc}" alt="${p.trust}">` : ""}</span>
        <span>${p.trust.toUpperCase()}</span>
      </div>
    `;
    list.appendChild(div);
  });
}
load();'

echo ">>> DevOpsOS extensions applied."
