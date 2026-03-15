#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# DevOpsOS Backend Autostart Script (Ubuntu inside Termux)
# ---------------------------------------------------------------------------

set -e

DEVOPS_DIR="$HOME/DevOpsOS"
LOG_DIR="$DEVOPS_DIR/logs"
BACKEND="$DEVOPS_DIR/backend/server.js"

# ---------------------------------------------------------------------------
# 1. Verify DevOpsOS exists
# ---------------------------------------------------------------------------
if [ ! -d "$DEVOPS_DIR" ]; then
    echo "[!] DevOpsOS directory not found at $DEVOPS_DIR"
    echo "    Make sure Termux bind-mount is active."
    exit 1
fi

# ---------------------------------------------------------------------------
# 2. Ensure logs directory exists
# ---------------------------------------------------------------------------
mkdir -p "$LOG_DIR"

# ---------------------------------------------------------------------------
# 3. Ensure Node.js is installed
# ---------------------------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
    echo "[+] Installing Node.js..."
    apt update
    apt install -y nodejs npm
fi

# ---------------------------------------------------------------------------
# 4. Install dependencies if needed
# ---------------------------------------------------------------------------
if [ ! -d "$DEVOPS_DIR/node_modules" ]; then
    echo "[+] Installing DevOpsOS dependencies..."
    cd "$DEVOPS_DIR"
    npm install --silent
fi

# ---------------------------------------------------------------------------
# 5. Start backend (non-blocking)
# ---------------------------------------------------------------------------
echo "[+] Starting DevOpsOS backend..."
cd "$DEVOPS_DIR"

nohup node "$BACKEND" \
    > "$LOG_DIR/backend.out.log" \
    2> "$LOG_DIR/backend.err.log" &

echo "[✓] Backend started."
echo "    Logs: $LOG_DIR"
echo "    PID: $!"
