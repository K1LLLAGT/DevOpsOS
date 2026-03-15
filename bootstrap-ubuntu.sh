#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# DevOpsOS Ubuntu Environment Bootstrap
# For proot-distro Ubuntu inside Termux
# ---------------------------------------------------------------------------

set -e

echo "[DevOpsOS] Ubuntu bootstrap starting..."

DEVOPS_ROOT="/home/termux/DevOpsOS"
LOG_DIR="$DEVOPS_ROOT/logs"

# ---------------------------------------------------------------------------
# 1. Verify DevOpsOS bind mount
# ---------------------------------------------------------------------------
if [ ! -d "$DEVOPS_ROOT" ]; then
    echo "[!] DevOpsOS directory not found at $DEVOPS_ROOT"
    echo "    This means your Termux → Ubuntu bind mount is broken."
    exit 1
fi

echo "[+] DevOpsOS root detected."

# ---------------------------------------------------------------------------
# 2. Update Ubuntu packages
# ---------------------------------------------------------------------------
echo "[+] Updating Ubuntu packages..."
apt update -y
apt upgrade -y

# ---------------------------------------------------------------------------
# 3. Install core dependencies
# ---------------------------------------------------------------------------
echo "[+] Installing core packages..."
apt install -y \
    nodejs \
    npm \
    git \
    python3 \
    python3-pip \
    build-essential \
    curl \
    wget \
    nano \
    openssh-client

# ---------------------------------------------------------------------------
# 4. Ensure logs directory exists
# ---------------------------------------------------------------------------
mkdir -p "$LOG_DIR"

# ---------------------------------------------------------------------------
# 5. Install DevOpsOS backend dependencies
# ---------------------------------------------------------------------------
echo "[+] Installing DevOpsOS backend dependencies..."

cd "$DEVOPS_ROOT"

if [ ! -d node_modules ]; then
    echo "[+] Running npm install..."
    npm install --silent
else
    echo "[+] node_modules already present — skipping install."
fi

# ---------------------------------------------------------------------------
# 6. Create backend start script if missing
# ---------------------------------------------------------------------------
START_SCRIPT="$DEVOPS_ROOT/start-backend.sh"

if [ ! -f "$START_SCRIPT" ]; then
    echo "[+] Creating start-backend.sh..."
    cat << 'EOS' > "$START_SCRIPT"
#!/usr/bin/env bash
set -e

DEVOPS_ROOT="/home/termux/DevOpsOS"
LOG_DIR="$DEVOPS_ROOT/logs"
BACKEND="$DEVOPS_ROOT/backend/server.js"

mkdir -p "$LOG_DIR"

echo "[DevOpsOS] Starting backend..."

nohup node "$BACKEND" \
    > "$LOG_DIR/backend.out.log" \
    2> "$LOG_DIR/backend.err.log" &

echo "[✓] Backend started (PID: $!)"
EOS

    chmod +x "$START_SCRIPT"
else
    echo "[+] start-backend.sh already exists."
fi

# ---------------------------------------------------------------------------
# 7. Optional: Install PM2-like supervisor (pure bash)
# ---------------------------------------------------------------------------
SUPERVISOR="/usr/local/bin/devopsos-supervisor"

echo "[+] Installing lightweight supervisor..."
cat << 'EOS' > "$SUPERVISOR"
#!/usr/bin/env bash
# Simple backend supervisor for DevOpsOS

DEVOPS_ROOT="/home/termux/DevOpsOS"
BACKEND="$DEVOPS_ROOT/backend/server.js"
LOG_DIR="$DEVOPS_ROOT/logs"

mkdir -p "$LOG_DIR"

while true; do
    if ! pgrep -f "$BACKEND" >/dev/null; then
        echo "[Supervisor] Backend not running — starting..."
        nohup node "$BACKEND" \
            >> "$LOG_DIR/backend.out.log" \
            2>> "$LOG_DIR/backend.err.log" &
        echo "[Supervisor] Started PID $!"
    fi
    sleep 5
done
EOS

chmod +x "$SUPERVISOR"

# ---------------------------------------------------------------------------
# 8. Final message
# ---------------------------------------------------------------------------
echo "[✓] Ubuntu bootstrap complete."
echo "You can now run:"
echo "  bash ~/DevOpsOS/start-backend.sh"
echo "Or start the supervisor:"
echo "  devopsos-supervisor &"
