#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[DevOpsOS] Unified installer"
echo "Root: $ROOT"

cd "$ROOT"

# 1. Node deps (host side)
if command -v pnpm >/dev/null 2>&1; then
  echo "[+] Using pnpm"
  pnpm install
else
  echo "[+] Using npm"
  npm install
fi

# 2. Ensure scripts dir
mkdir -p scripts

# 3. Ensure Ubuntu bootstrap exists
if [ ! -f "$ROOT/bootstrap-ubuntu.sh" ]; then
  echo "[!] bootstrap-ubuntu.sh missing. Skipping Ubuntu bootstrap wiring."
else
  echo "[+] Ubuntu bootstrap present."
fi

echo "[✓] DevOpsOS install complete."
echo "Next steps:"
echo "  - On Termux:  ./devopsos_launcher.sh   (or devopsos)"
echo "  - Inside Ubuntu:  bash ~/DevOpsOS/start-backend.sh"
