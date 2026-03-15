#!/usr/bin/env bash
set -e

ROOT="$HOME/DevOpsOS"
cd "$ROOT"

echo "[DevOpsOS] Cleanup + consolidation"

KEEP=(
  "install.sh"
  "devopsos-install.sh"
  "devopsos_launcher.sh"
  "bootstrap-ubuntu.sh"
  "start-backend.sh"
)

mkdir -p scripts/legacy

echo "[+] Keeping:"
printf '  - %s\n' "${KEEP[@]}"

# Collect candidates safely
CANDIDATES=$(ls devopsos_frontend_*.sh install-*.sh devopsos_*_install.sh 2>/dev/null || true)

for f in $CANDIDATES; do
  # Skip if already moved
  if [[ "$f" == scripts/legacy-* ]]; then
    continue
  fi

  # Skip if in KEEP list
  skip=false
  for k in "${KEEP[@]}"; do
    if [ "$f" = "$k" ]; then
      skip=true
      break
    fi
  done
  if [ "$skip" = true ]; then
    continue
  fi

  # Only move if file still exists
  if [ -f "$f" ]; then
    echo "[!] Found legacy installer: $f"
    mv "$f" "scripts/legacy-$f"
    echo "    Moved to scripts/legacy-$f"
  fi
done

echo "[✓] Cleanup complete."
