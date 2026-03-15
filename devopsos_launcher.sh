#!/data/data/com.termux/files/usr/bin/bash
# ---------------------------------------------------------------------------
# Termux → proot-distro Ubuntu Launcher
# Clean, stable, Android‑16‑compatible
# ---------------------------------------------------------------------------

set -e

DISTRO="ubuntu"
UBUNTU_HOME="/data/data/com.termux/files/home/.proot-distro/$DISTRO"
SESSION_NAME="ubuntu"

# ---------------------------------------------------------------------------
# 1. Ensure proot-distro is installed
# ---------------------------------------------------------------------------
if ! command -v proot-distro >/dev/null 2>&1; then
    echo "[!] proot-distro not installed. Installing..."
    pkg install -y proot-distro
fi

# ---------------------------------------------------------------------------
# 2. Ensure Ubuntu is installed
# ---------------------------------------------------------------------------
if ! proot-distro list | grep -q "$DISTRO"; then
    echo "[+] Installing Ubuntu..."
    proot-distro install $DISTRO
fi

# ---------------------------------------------------------------------------
# 3. Environment variables for GUI + DevOpsOS
# ---------------------------------------------------------------------------
export PROOT_NO_SECCOMP=1
export DISPLAY=:0
export WAYLAND_DISPLAY=wayland-0
export PULSE_SERVER=127.0.0.1

# ---------------------------------------------------------------------------
# 4. Bind mounts (Termux home → Ubuntu)
# ---------------------------------------------------------------------------
BIND_ARGS=(
    "--bind /data/data/com.termux/files/home:/home/termux"
    "--bind /sdcard:/sdcard"
    "--bind /storage:/storage"
)

# ---------------------------------------------------------------------------
# 5. Optional: DevOpsOS backend auto‑mount
# ---------------------------------------------------------------------------
if [ -d "$HOME/DevOpsOS" ]; then
    BIND_ARGS+=("--bind $HOME/DevOpsOS:/home/termux/DevOpsOS")
fi

# ---------------------------------------------------------------------------
# 6. Optional: X11/Wayland support (if installed)
# ---------------------------------------------------------------------------
if [ -d "$PREFIX/tmp/.X11-unix" ]; then
    BIND_ARGS+=("--bind $PREFIX/tmp/.X11-unix:/tmp/.X11-unix")
fi

# ---------------------------------------------------------------------------
# 7. Launch Ubuntu
# ---------------------------------------------------------------------------
echo "[+] Launching Ubuntu…"

proot-distro login $DISTRO \
    --user root \
    --shared-tmp \
    --termux-home \
    ${BIND_ARGS[@]} \
    -- "$@"
