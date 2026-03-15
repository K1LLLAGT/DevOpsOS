#!/usr/bin/env bash
set -euo pipefail

# Self-locating DevOpsOS root (assumes this script is inside DevOpsOS/tools or DevOpsOS/)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -d "$SCRIPT_DIR/DevOpsOS" ]]; then
  ROOT="$(cd "$SCRIPT_DIR/DevOpsOS" && pwd)"
elif [[ -f "$SCRIPT_DIR/app/src/main/AndroidManifest.xml" && -d "$SCRIPT_DIR/frontend" ]]; then
  ROOT="$SCRIPT_DIR"
elif [[ -d "$SCRIPT_DIR/../frontend" ]]; then
  ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
else
  ROOT="$SCRIPT_DIR"
fi

DXM_ROOT="$ROOT/extensions/dxm"

write() {
  local file="$1"
  shift
  mkdir -p "$(dirname "$file")"
  printf "%s\n" "$@" > "$file"
  echo "[OK] $file"
}

echo ">>> Installing DevOpsOS Extension Manager (DXM v2)"
echo "DevOpsOS root: $ROOT"
echo "DXM root:      $DXM_ROOT"

mkdir -p "$DXM_ROOT/modules" "$DXM_ROOT/lib"

# ---------------------------------------------------------
# VERSION & CHANGELOG
# ---------------------------------------------------------

write "$DXM_ROOT/VERSION" "1.0.0"

write "$DXM_ROOT/CHANGELOG" \
"DevOpsOS Extension Manager (DXM)
================================

v1.0.0
 - Initial DXM v2 modular extension manager
 - Modules: onboarding, signing, marketplace, branding
 - Features: dry-run, backup, verify, uninstall, changelog, deps check
"

# ---------------------------------------------------------
# LIB: utils.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/utils.sh" \
'#!/usr/bin/env bash

dxm_log() {
  echo "[DXM] $*"
}

dxm_err() {
  echo "[DXM:ERROR] $*" >&2
}

dxm_die() {
  dxm_err "$@"
  exit 1
}

dxm_require_dir() {
  local d="$1"
  [[ -d "$d" ]] || dxm_die "Required directory missing: $d"
}

dxm_require_cmd() {
  local c="$1"
  command -v "$c" >/dev/null 2>&1 || dxm_die "Required command not found: $c"
}
'

chmod +x "$DXM_ROOT/lib/utils.sh"

# ---------------------------------------------------------
# LIB: deps.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/deps.sh" \
'#!/usr/bin/env bash

. "$(dirname "$0")/utils.sh"

dxm_check_deps() {
  dxm_require_dir "$ROOT/frontend"
  dxm_require_dir "$ROOT/tools"
  dxm_require_cmd node
}
'

chmod +x "$DXM_ROOT/lib/deps.sh"

# ---------------------------------------------------------
# LIB: dryrun.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/dryrun.sh" \
'#!/usr/bin/env bash

DXM_DRY_RUN="${DXM_DRY_RUN:-0}"

dxm_mkdir() {
  local d="$1"
  if [[ "$DXM_DRY_RUN" == "1" ]]; then
    echo "[DRY RUN] mkdir -p $d"
  else
    mkdir -p "$d"
  fi
}

dxm_write_file() {
  local f="$1"
  shift
  if [[ "$DXM_DRY_RUN" == "1" ]]; then
    echo "[DRY RUN] write $f"
  else
    mkdir -p "$(dirname "$f")"
    printf "%s\n" "$@" > "$f"
    echo "[OK] $f"
  fi
}
'

chmod +x "$DXM_ROOT/lib/dryrun.sh"

# ---------------------------------------------------------
# LIB: backup.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/backup.sh" \
'#!/usr/bin/env bash

. "$(dirname "$0")/utils.sh"

dxm_backup_root() {
  local ts
  ts="$(date +%Y%m%d_%H%M%S)"
  local backup_dir="$ROOT/extensions/dxm-backups/dxm-$ts"
  mkdir -p "$backup_dir"
  echo "$backup_dir"
}

dxm_backup_paths() {
  local backup_dir="$1"
  shift
  for p in "$@"; do
    if [[ -e "$ROOT/$p" ]]; then
      mkdir -p "$(dirname "$backup_dir/$p")"
      cp -a "$ROOT/$p" "$backup_dir/$p"
      echo "[BACKUP] $p -> $backup_dir/$p"
    fi
  done
}
'

chmod +x "$DXM_ROOT/lib/backup.sh"

# ---------------------------------------------------------
# LIB: verify.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/verify.sh" \
'#!/usr/bin/env bash

dxm_verify_path() {
  local p="$1"
  if [[ -e "$ROOT/$p" ]]; then
    echo "[OK] $p"
  else
    echo "[MISS] $p"
  fi
}
'

chmod +x "$DXM_ROOT/lib/verify.sh"

# ---------------------------------------------------------
# LIB: uninstall.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/uninstall.sh" \
'#!/usr/bin/env bash

dxm_remove_paths() {
  for p in "$@"; do
    if [[ -e "$ROOT/$p" ]]; then
      rm -rf "$ROOT/$p"
      echo "[REMOVED] $p"
    else
      echo "[SKIP] $p (not present)"
    fi
  done
}
'

chmod +x "$DXM_ROOT/lib/uninstall.sh"

# ---------------------------------------------------------
# LIB: changelog.sh
# ---------------------------------------------------------

write "$DXM_ROOT/lib/changelog.sh" \
'#!/usr/bin/env bash

dxm_show_changelog() {
  cat "$DXM_ROOT/CHANGELOG"
}
'

chmod +x "$DXM_ROOT/lib/changelog.sh"

# ---------------------------------------------------------
# MODULE CORE: shared helpers
# ---------------------------------------------------------

write "$DXM_ROOT/modules/core.sh" \
'#!/usr/bin/env bash

. "$DXM_ROOT/lib/dryrun.sh"

mod_write() {
  local f="$1"
  shift
  dxm_write_file "$ROOT/$f" "$@"
}

mod_mkdir() {
  local d="$1"
  dxm_mkdir "$ROOT/$d"
}
'

chmod +x "$DXM_ROOT/modules/core.sh"

# ---------------------------------------------------------
# MODULE: onboarding.sh
# ---------------------------------------------------------

write "$DXM_ROOT/modules/onboarding.sh" \
'#!/usr/bin/env bash

. "$DXM_ROOT/modules/core.sh"

mod_onboarding_install() {
  mod_write "frontend/panels/onboarding/onboarding.html" \
"<div id=\"onboarding-panel\">
  <div class=\"ob-card\">
    <h1>Welcome to DevOpsOS</h1>
    <p>A modular DevOps environment for Android.</p>

    <div class=\"ob-step\" data-step=\"1\">
      <h2>Step 1 — Panels</h2>
      <p>Select which panels you want enabled:</p>
      <div class=\"ob-grid\">
        <label><input type=\"checkbox\" data-panel=\"terminal\" checked> Terminal</label>
        <label><input type=\"checkbox\" data-panel=\"editor\" checked> Editor</label>
        <label><input type=\"checkbox\" data-panel=\"system\" checked> System Monitor</label>
        <label><input type=\"checkbox\" data-panel=\"process\" checked> Process Manager</label>
        <label><input type=\"checkbox\" data-panel=\"filemanager\" checked> File Manager</label>
        <label><input type=\"checkbox\" data-panel=\"plugins\" checked> Plugins</label>
        <label><input type=\"checkbox\" data-panel=\"ssh\"> SSH</label>
        <label><input type=\"checkbox\" data-panel=\"tor\"> Tor</label>
      </div>
      <button class=\"ob-next\">Next</button>
    </div>

    <div class=\"ob-step\" data-step=\"2\" style=\"display:none;\">
      <h2>Step 2 — Theme</h2>
      <p>Choose your theme:</p>
      <select id=\"ob-theme\">
        <option value=\"hacker\">Hacker (Green on Black)</option>
        <option value=\"dark\" selected>Dark</option>
        <option value=\"light\">Light</option>
        <option value=\"neon\">Neon</option>
      </select>
      <button class=\"ob-prev\">Back</button>
      <button class=\"ob-next\">Next</button>
    </div>

    <div class=\"ob-step\" data-step=\"3\" style=\"display:none;\">
      <h2>Step 3 — Backend</h2>
      <label><input type=\"checkbox\" id=\"ob-autostart\" checked> Auto-start backend on app launch</label><br>
      <label>Port: <input type=\"number\" id=\"ob-port\" value=\"8080\"></label><br>
      <label>
        Security Mode:
        <select id=\"ob-security\">
          <option value=\"local\" selected>Local only</option>
          <option value=\"lan\">LAN</option>
        </select>
      </label>
      <button class=\"ob-prev\">Back</button>
      <button class=\"ob-next\">Next</button>
    </div>

    <div class=\"ob-step\" data-step=\"4\" style=\"display:none;\">
      <h2>Ready</h2>
      <p>Your DevOpsOS environment is configured. Click Finish to start.</p>
      <button class=\"ob-prev\">Back</button>
      <button id=\"ob-finish\">Finish</button>
    </div>
  </div>
</div>"

  mod_write "frontend/panels/onboarding/onboarding.css" \
"#onboarding-panel{display:flex;align-items:center;justify-content:center;height:100%;background:#050608;color:#f5f5f5;font-family:sans-serif;}
.ob-card{background:#11141a;border-radius:10px;padding:24px;max-width:640px;width:100%;box-shadow:0 0 20px rgba(0,0,0,0.6);}
.ob-card h1{margin-top:0;margin-bottom:8px;}
.ob-card h2{margin-top:16px;}
.ob-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0;}
.ob-step button{margin-top:12px;margin-right:8px;padding:8px 14px;border:none;border-radius:4px;cursor:pointer;}
.ob-next{background:#4fc3f7;color:#000;}
.ob-prev{background:#333;color:#fff;}
#ob-finish{background:#00e676;color:#000;}"

  mod_write "frontend/panels/onboarding/onboarding.js" \
"import {emit} from \"../../js/core/events.js\";

export function init(){
  const steps=[...document.querySelectorAll(\".ob-step\")];
  let idx=0;

  const show=()=>steps.forEach((s,i)=>s.style.display=i===idx?\"block\":\"none\");
  show();

  document.querySelectorAll(\".ob-next\").forEach(b=>{
    b.onclick=()=>{idx=Math.min(idx+1,steps.length-1);show();};
  });
  document.querySelectorAll(\".ob-prev\").forEach(b=>{
    b.onclick=()=>{idx=Math.max(idx-1,0);show();};
  });

  document.querySelector(\"#ob-finish\").onclick=()=>{
    const panels=[];
    document.querySelectorAll(\"input[type=checkbox][data-panel]\").forEach(cb=>{
      if(cb.checked) panels.push(cb.dataset.panel);
    });
    const theme=document.querySelector(\"#ob-theme\").value;
    const autostart=document.querySelector(\"#ob-autostart\").checked;
    const port=Number(document.querySelector(\"#ob-port\").value)||8080;
    const security=document.querySelector(\"#ob-security\").value;

    const cfg={panels,theme,backend:{autostart,port,security}};
    localStorage.setItem(\"devopsos.config\",JSON.stringify(cfg));
    emit(\"onboarding:complete\",cfg);
  };
}

export function unload(){}"
}

mod_onboarding_remove() {
  rm -rf "$ROOT/frontend/panels/onboarding"
  echo "[REMOVED] frontend/panels/onboarding"
}

mod_onboarding_verify() {
  [[ -f "$ROOT/frontend/panels/onboarding/onboarding.html" ]] && echo "[OK] onboarding html" || echo "[MISS] onboarding html"
}
'

chmod +x "$DXM_ROOT/modules/onboarding.sh"

# ---------------------------------------------------------
# MODULE: signing.sh
# ---------------------------------------------------------

write "$DXM_ROOT/modules/signing.sh" \
'#!/usr/bin/env bash

. "$DXM_ROOT/modules/core.sh"

mod_signing_install() {
  mod_write "tools/devopsos-sign.js" \
"#!/usr/bin/env node
const fs=require(\"fs\");
const crypto=require(\"crypto\");
const path=require(\"path\");

const ROOT=process.env.DEVOPSOS_ROOT || path.join(process.env.HOME,\"DevOpsOS\");
const cmd=process.argv[2];
const target=process.argv[3];

const KEYDIR=path.join(ROOT,\".keys\");
const PRIV=path.join(KEYDIR,\"devopsos-private.pem\");
const PUB=path.join(KEYDIR,\"devopsos-public.pem\");

function ensureKeys(){
  if(!fs.existsSync(KEYDIR)) fs.mkdirSync(KEYDIR,{recursive:true});
  if(!fs.existsSync(PRIV) || !fs.existsSync(PUB)){
    const {generateKeyPairSync}=require(\"crypto\");
    const {privateKey,publicKey}=generateKeyPairSync(\"rsa\",{modulusLength:2048});
    fs.writeFileSync(PRIV,privateKey.export({type:\"pkcs1\",format:\"pem\"}));
    fs.writeFileSync(PUB,publicKey.export({type:\"pkcs1\",format:\"pem\"}));
    console.log(\"Generated new DevOpsOS signing keypair.\");
  }
}

function hashDir(dir){
  const files=[];
  function walk(d){
    for(const e of fs.readdirSync(d)){
      const full=path.join(d,e);
      const rel=path.relative(dir,full);
      if(rel.startsWith(\"signature\")) continue;
      const st=fs.statSync(full);
      if(st.isDirectory()) walk(full);
      else files.push(rel);
    }
  }
  walk(dir);
  files.sort();
  const h=crypto.createHash(\"sha256\");
  for(const f of files){
    h.update(f);
    h.update(fs.readFileSync(path.join(dir,f)));
  }
  return h.digest(\"hex\");
}

function signPlugin(pdir){
  ensureKeys();
  const priv=fs.readFileSync(PRIV);
  const hash=hashDir(pdir);
  const sig=crypto.sign(\"sha256\",Buffer.from(hash,\"utf8\"),priv).toString(\"base64\");
  const out={
    hash,
    signature:sig,
    algorithm:\"rsa-sha256\",
    created:new Date().toISOString()
  };
  fs.writeFileSync(path.join(pdir,\"signature.json\"),JSON.stringify(out,null,2));
  console.log(\"Signed plugin:\",pdir);
}

function verifyPlugin(pdir){
  if(!fs.existsSync(PUB)) return console.error(\"No public key found.\");
  const pub=fs.readFileSync(PUB);
  const sigPath=path.join(pdir,\"signature.json\");
  if(!fs.existsSync(sigPath)) return console.error(\"No signature.json in\",pdir);
  const data=JSON.parse(fs.readFileSync(sigPath,\"utf8\"));
  const hash=hashDir(pdir);
  if(hash!==data.hash) return console.error(\"Hash mismatch for\",pdir);
  const ok=crypto.verify(\"sha256\",Buffer.from(hash,\"utf8\"),pub,Buffer.from(data.signature,\"base64\"));
  console.log(ok?\"OK: signature valid\":\"FAIL: invalid signature\");
}

switch(cmd){
  case \"keygen\":
    ensureKeys();
    console.log(\"Keys ready in\",KEYDIR);
    break;
  case \"sign\":
    if(!target) throw new Error(\"Usage: devopsos-sign.js sign plugins/<name>\");
    signPlugin(path.resolve(target));
    break;
  case \"verify\":
    if(!target) throw new Error(\"Usage: devopsos-sign.js verify plugins/<name>\");
    verifyPlugin(path.resolve(target));
    break;
  default:
    console.log(\"DevOpsOS Plugin Signing\");
    console.log(\"Usage:\");
    console.log(\"  devopsos-sign.js keygen\");
    console.log(\"  devopsos-sign.js sign plugins/<name>\");
    console.log(\"  devopsos-sign.js verify plugins/<name>\");
}"
}

mod_signing_remove() {
  rm -f "$ROOT/tools/devopsos-sign.js"
  echo "[REMOVED] tools/devopsos-sign.js"
}

mod_signing_verify() {
  [[ -f "$ROOT/tools/devopsos-sign.js" ]] && echo "[OK] devopsos-sign.js" || echo "[MISS] devopsos-sign.js"
}
'

chmod +x "$DXM_ROOT/modules/signing.sh"

# ---------------------------------------------------------
# MODULE: marketplace.sh
# ---------------------------------------------------------

write "$DXM_ROOT/modules/marketplace.sh" \
'#!/usr/bin/env bash

. "$DXM_ROOT/modules/core.sh"

mod_marketplace_install() {
  mod_write "marketplace/schema/plugins.schema.json" \
"{
  \"$schema\": \"http://json-schema.org/draft-07/schema#\",
  \"title\": \"DevOpsOS Plugin Marketplace\",
  \"type\": \"object\",
  \"properties\": {
    \"plugins\": {
      \"type\": \"array\",
      \"items\": {
        \"type\": \"object\",
        \"required\": [\"id\", \"name\", \"version\", \"description\", \"trust\", \"source\"],
        \"properties\": {
          \"id\": { \"type\": \"string\" },
          \"name\": { \"type\": \"string\" },
          \"version\": { \"type\": \"string\", \"pattern\": \"^[0-9]+\\\\.[0-9]+\\\\.[0-9]+$\" },
          \"description\": { \"type\": \"string\" },
          \"trust\": { \"type\": \"string\", \"enum\": [\"trusted\", \"verified\", \"community\", \"sandboxed\"] },
          \"source\": { \"type\": \"string\" },
          \"tags\": { \"type\": \"array\", \"items\": { \"type\": \"string\" } },
          \"homepage\": { \"type\": \"string\" },
          \"signature\": { \"type\": \"string\" }
        }
      }
    }
  },
  \"required\": [\"plugins\"]
}"

  mod_write "marketplace/plugins.json" \
"{
  \"plugins\": [
    {
      \"id\": \"example-plugin\",
      \"name\": \"Example Plugin\",
      \"version\": \"1.0.0\",
      \"description\": \"Sample plugin entry for DevOpsOS marketplace.\",
      \"trust\": \"community\",
      \"source\": \"https://github.com/yourname/devopsos-plugins\",
      \"tags\": [\"example\"],
      \"homepage\": \"https://yourname.github.io/DevOpsOS\",
      \"signature\": \"\"
    }
  ]
}"

  mod_write "marketplace/site/index.html" \
"<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\">
  <title>DevOpsOS Plugin Marketplace</title>
  <link rel=\"stylesheet\" href=\"style.css\">
</head>
<body>
  <header>
    <h1>DevOpsOS Plugin Marketplace</h1>
    <p>Discover, install, and manage plugins for DevOpsOS.</p>
  </header>
  <main>
    <div id=\"plugin-list\"></div>
  </main>
  <footer>
    <p>DevOpsOS &mdash; THE ROOT IS WITHIN</p>
  </footer>
  <script src=\"app.js\"></script>
</body>
</html>"

  mod_write "marketplace/site/style.css" \
"body{margin:0;font-family:sans-serif;background:#050608;color:#f5f5f5;}
header{padding:20px;background:#11141a;border-bottom:1px solid #222;}
main{padding:20px;}
.plugin-card{background:#11141a;border-radius:8px;padding:16px;margin-bottom:12px;border:1px solid #222;}
.plugin-card h2{margin:0 0 4px 0;}
.plugin-meta{font-size:12px;color:#aaa;margin-bottom:8px;}
.badge{display:inline-block;margin-right:6px;vertical-align:middle;}
.badge img{height:20px;}"

  mod_write "marketplace/site/app.js" \
"async function load(){
  const res=await fetch(\"../plugins.json\");
  const data=await res.json();
  const list=document.getElementById(\"plugin-list\");
  list.innerHTML=\"\";
  data.plugins.forEach(p=>{
    const div=document.createElement(\"div\");
    div.className=\"plugin-card\";
    const badgeSrc={
      trusted:\"../../assets/branding/badges/trusted.svg\",
      verified:\"../../assets/branding/badges/verified.svg\",
      community:\"../../assets/branding/badges/community.svg\",
      sandboxed:\"../../assets/branding/badges/sandboxed.svg\"
    }[p.trust] || \"\";
    div.innerHTML=`
      <h2>${p.name}</h2>
      <div class=\"plugin-meta\">
        <span>${p.id}</span> &mdash;
        <span>v${p.version}</span>
      </div>
      <p>${p.description}</p>
      <div>
        <span class=\"badge\">${badgeSrc ? `<img src=\"${badgeSrc}\" alt=\"${p.trust}\">` : \"\"}</span>
        <span>${p.trust.toUpperCase()}</span>
      </div>
    `;
    list.appendChild(div);
  });
}
load();"
}

mod_marketplace_remove() {
  rm -rf "$ROOT/marketplace"
  echo "[REMOVED] marketplace"
}

mod_marketplace_verify() {
  [[ -f "$ROOT/marketplace/plugins.json" ]] && echo "[OK] marketplace plugins.json" || echo "[MISS] marketplace plugins.json"
}
'

chmod +x "$DXM_ROOT/modules/marketplace.sh"

# ---------------------------------------------------------
# MODULE: branding.sh
# ---------------------------------------------------------

write "$DXM_ROOT/modules/branding.sh" \
'#!/usr/bin/env bash

. "$DXM_ROOT/modules/core.sh"

mod_branding_install() {
  mod_mkdir "assets/branding/icons"
  mod_mkdir "assets/branding/logo"
  mod_mkdir "assets/branding/splash"
  mod_mkdir "assets/branding/badges"

  mod_write "assets/branding/README.md" \
"# DevOpsOS Branding

- logo/: primary and monochrome logos
- icons/: app icons and favicons
- splash/: splash screen artwork
- badges/: trust and marketplace badges
"

  mod_write "assets/branding/badges/trusted.svg" \
"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"96\" height=\"32\">
  <rect width=\"96\" height=\"32\" rx=\"4\" fill=\"#00e676\"/>
  <text x=\"48\" y=\"21\" font-size=\"14\" text-anchor=\"middle\" fill=\"#000\">TRUSTED</text>
</svg>"

  mod_write "assets/branding/badges/verified.svg" \
"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"96\" height=\"32\">
  <rect width=\"96\" height=\"32\" rx=\"4\" fill=\"#4fc3f7\"/>
  <text x=\"48\" y=\"21\" font-size=\"14\" text-anchor=\"middle\" fill=\"#000\">VERIFIED</text>
</svg>"

  mod_write "assets/branding/badges/community.svg" \
"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"112\" height=\"32\">
  <rect width=\"112\" height=\"32\" rx=\"4\" fill=\"#ffeb3b\"/>
  <text x=\"56\" y=\"21\" font-size=\"14\" text-anchor=\"middle\" fill=\"#000\">COMMUNITY</text>
</svg>"

  mod_write "assets/branding/badges/sandboxed.svg" \
"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"112\" height=\"32\">
  <rect width=\"112\" height=\"32\" rx=\"4\" fill=\"#ff5252\"/>
  <text x=\"56\" y=\"21\" font-size=\"14\" text-anchor=\"middle\" fill=\"#000\">SANDBOXED</text>
</svg>"
}

mod_branding_remove() {
  rm -rf "$ROOT/assets/branding"
  echo "[REMOVED] assets/branding"
}

mod_branding_verify() {
  [[ -f "$ROOT/assets/branding/badges/trusted.svg" ]] && echo "[OK] branding badges" || echo "[MISS] branding badges"
}
'

chmod +x "$DXM_ROOT/modules/branding.sh"

# ---------------------------------------------------------
# DISPATCHER: dxm.sh
# ---------------------------------------------------------

write "$DXM_ROOT/dxm.sh" \
'#!/usr/bin/env bash
set -euo pipefail

DXM_ROOT="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DXM_ROOT/../.." && pwd)"

. "$DXM_ROOT/lib/utils.sh"
. "$DXM_ROOT/lib/deps.sh"
. "$DXM_ROOT/lib/dryrun.sh"
. "$DXM_ROOT/lib/backup.sh"
. "$DXM_ROOT/lib/verify.sh"
. "$DXM_ROOT/lib/uninstall.sh"
. "$DXM_ROOT/lib/changelog.sh"

. "$DXM_ROOT/modules/onboarding.sh"
. "$DXM_ROOT/modules/signing.sh"
. "$DXM_ROOT/modules/marketplace.sh"
. "$DXM_ROOT/modules/branding.sh"

VERSION="$(cat "$DXM_ROOT/VERSION")"

usage() {
  cat <<EOF
DevOpsOS Extension Manager (DXM) v$VERSION

Usage:
  devopsos extend <module> [options]

Modules:
  onboarding      Install onboarding wizard
  signing         Install plugin signing tool
  marketplace     Install marketplace schema + site
  branding        Install branding assets
  all             Install all modules

Options:
  --dry-run       Do not write, just show actions
  --backup        Backup affected paths before changes
  --verify        Verify installed modules
  --remove        Uninstall module(s)
  --changelog     Show DXM changelog
  --deps          Check dependencies

Examples:
  devopsos extend onboarding
  devopsos extend marketplace --dry-run
  devopsos extend all --backup
  devopsos extend --changelog
EOF
}

main() {
  local module="${1:-}"
  shift || true

  local do_dry=0
  local do_backup=0
  local do_verify=0
  local do_remove=0
  local show_changelog=0
  local check_deps=0

  while [[ "${1:-}" == --* ]]; do
    case "$1" in
      --dry-run)   do_dry=1 ;;
      --backup)    do_backup=1 ;;
      --verify)    do_verify=1 ;;
      --remove)    do_remove=1 ;;
      --changelog) show_changelog=1 ;;
      --deps)      check_deps=1 ;;
      *) dxm_die "Unknown option: $1" ;;
    esac
    shift || true
  done

  if [[ "$show_changelog" == "1" ]]; then
    dxm_show_changelog
    exit 0
  fi

  if [[ "$check_deps" == "1" ]]; then
    dxm_check_deps
    echo "[OK] Dependencies satisfied."
    exit 0
  fi

  if [[ -z "$module" ]]; then
    usage
    exit 1
  fi

  DXM_DRY_RUN="$do_dry"

  local backup_dir=""
  if [[ "$do_backup" == "1" && "$do_remove" == "0" ]]; then
    backup_dir="$(dxm_backup_root)"
  fi

  case "$module" in
    onboarding|signing|marketplace|branding|all)
      ;;
    *)
      dxm_die "Unknown module: $module"
      ;;
  esac

  if [[ "$do_backup" == "1" && "$do_remove" == "0" ]]; then
    case "$module" in
      onboarding)
        dxm_backup_paths "$backup_dir" "frontend/panels/onboarding"
        ;;
      signing)
        dxm_backup_paths "$backup_dir" "tools/devopsos-sign.js"
        ;;
      marketplace)
        dxm_backup_paths "$backup_dir" "marketplace"
        ;;
      branding)
        dxm_backup_paths "$backup_dir" "assets/branding"
        ;;
      all)
        dxm_backup_paths "$backup_dir" \
          "frontend/panels/onboarding" \
          "tools/devopsos-sign.js" \
          "marketplace" \
          "assets/branding"
        ;;
    esac
  fi

  if [[ "$do_remove" == "1" ]]; then
    case "$module" in
      onboarding) mod_onboarding_remove ;;
      signing)    mod_signing_remove ;;
      marketplace)mod_marketplace_remove ;;
      branding)   mod_branding_remove ;;
      all)
        mod_onboarding_remove || true
        mod_signing_remove || true
        mod_marketplace_remove || true
        mod_branding_remove || true
        ;;
    esac
    exit 0
  fi

  case "$module" in
    onboarding)  mod_onboarding_install ;;
    signing)     mod_signing_install ;;
    marketplace) mod_marketplace_install ;;
    branding)    mod_branding_install ;;
    all)
      mod_onboarding_install
      mod_signing_install
      mod_marketplace_install
      mod_branding_install
      ;;
  esac

  if [[ "$do_verify" == "1" ]]; then
    echo "--- Verification ---"
    case "$module" in
      onboarding)  mod_onboarding_verify ;;
      signing)     mod_signing_verify ;;
      marketplace) mod_marketplace_verify ;;
      branding)    mod_branding_verify ;;
      all)
        mod_onboarding_verify
        mod_signing_verify
        mod_marketplace_verify
        mod_branding_verify
        ;;
    esac
  fi
}

main "$@"
'

chmod +x "$DXM_ROOT/dxm.sh"

echo ">>> DXM v2 installed at: $DXM_ROOT"
echo "To wire into CLI, add to your devopsos command:"
echo "  extend) \"$DXM_ROOT/dxm.sh\" \"${@:2}\" ;;"
