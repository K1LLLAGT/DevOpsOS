#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$ROOT_DIR/config"
CONFIG_FILE="$CONFIG_DIR/features.json"
INSTALLER="$ROOT_DIR/devopsos-install.sh"

mkdir -p "$CONFIG_DIR"

default_config='{
  "editor": {
    "monaco": false,
    "codemirror": true,
    "lsp": false,
    "autosave": false
  },
  "ui": {
    "commandPalette": true,
    "notifications": true,
    "globalSearch": true,
    "themeEngine": true,
    "keybindingEngine": true,
    "dashboardLayout": true
  },
  "network": {
    "sshPanel": true,
    "torPanel": true
  },
  "system": {
    "logsPanel": true,
    "crashReporter": true,
    "telemetryLocal": true,
    "backgroundServices": true
  },
  "plugins": {
    "pluginManager": true,
    "sandboxing": true,
    "workspaceSync": true
  },
  "updates": {
    "updateChannels": true,
    "autoRepair": true,
    "migrations": true
  }
}'

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "$default_config" > "$CONFIG_FILE"
fi

require_jq() {
  if ! command -v jq >/dev/null 2>&1; then
    echo "jq is required but not installed. Install jq and re-run."
    exit 1
  fi
}

require_jq

get_bool() {
  local path="$1"
  jq -r "$path" "$CONFIG_FILE"
}

set_all_in_group() {
  local group="$1"
  local value="$2"
  local keys
  keys=$(jq -r ".$group | keys[]" "$CONFIG_FILE")
  local jq_expr=".$group"
  for k in $keys; do
    jq_expr="$jq_expr.$k = $value | .$group"
  done
  jq ".$group = ($jq_expr)" "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
}

set_single() {
  local group="$1"
  local key="$2"
  local value="$3"
  jq ".$group.$key = $value" "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
}

feature_menu_single() {
  local group="$1"
  local key="$2"
  local label="$3"

  local current
  current=$(get_bool ".$group.$key")

  echo
  echo "$label (current: $current)"
  echo "1) Enable"
  echo "2) Disable"
  echo "3) Keep current"
  read -rp "> " choice

  case "$choice" in
    1) set_single "$group" "$key" true ;;
    2) set_single "$group" "$key" false ;;
    3|"") : ;;
    *) echo "Invalid choice, keeping current." ;;
  esac
}

group_menu() {
  local group="$1"
  local label="$2"
  shift 2
  local summary
  summary=$(jq -r ".$group | to_entries | map(\"\(.key): \(.value)\") | join(\", \")" "$CONFIG_FILE")

  echo
  echo "=== $label ==="
  echo "($summary)"
  echo "1) Enable all"
  echo "2) Disable all"
  echo "3) Keep current"
  echo "4) Customize individually"
  read -rp "> " choice

  case "$choice" in
    1) set_all_in_group "$group" true ;;
    2) set_all_in_group "$group" false ;;
    3|"") : ;;
    4)
      while [[ $# -gt 0 ]]; do
        local key="$1"; local flabel="$2"
        feature_menu_single "$group" "$key" "$flabel"
        shift 2
      done
      ;;
    *) echo "Invalid choice, keeping current." ;;
  esac
}

main_menu() {
  while true; do
    echo
    echo "=== DevOpsOS Feature Configuration ==="
    echo "1) Editor Features"
    echo "2) UI Features"
    echo "3) Network Features"
    echo "4) System Features"
    echo "5) Plugin System"
    echo "6) Update System"
    echo "7) Apply Changes and Install"
    echo "8) Exit without changes"
    read -rp "> " choice

    case "$choice" in
      1)
        group_menu "editor" "Editor Features" \
          "monaco" "Monaco Editor" \
          "codemirror" "CodeMirror Editor" \
          "lsp" "LSP Support" \
          "autosave" "Autosave"
        ;;
      2)
        group_menu "ui" "UI Features" \
          "commandPalette" "Command Palette" \
          "notifications" "Notifications" \
          "globalSearch" "Global Search" \
          "themeEngine" "Theme Engine" \
          "keybindingEngine" "Keybinding Engine" \
          "dashboardLayout" "Dashboard Layout"
        ;;
      3)
        group_menu "network" "Network Features" \
          "sshPanel" "SSH Panel" \
          "torPanel" "Tor Panel"
        ;;
      4)
        group_menu "system" "System Features" \
          "logsPanel" "Logs Panel" \
          "crashReporter" "Crash Reporter" \
          "telemetryLocal" "Local Telemetry" \
          "backgroundServices" "Background Services"
        ;;
      5)
        group_menu "plugins" "Plugin System" \
          "pluginManager" "Plugin Manager" \
          "sandboxing" "Plugin Sandboxing" \
          "workspaceSync" "Workspace Sync"
        ;;
      6)
        group_menu "updates" "Update System" \
          "updateChannels" "Update Channels" \
          "autoRepair" "Auto-Repair Engine" \
          "migrations" "Migrations"
        ;;
      7)
        echo
        echo "Final config:"
        cat "$CONFIG_FILE"
        echo
        if [[ -x "$INSTALLER" ]]; then
          echo "Running installer: $INSTALLER"
          "$INSTALLER"
        else
          echo "Installer not found or not executable: $INSTALLER"
          echo "Make sure devopsos-install.sh exists and is executable."
        fi
        exit 0
        ;;
      8)
        echo "Exiting without running installer."
        exit 0
        ;;
      *)
        echo "Invalid choice."
        ;;
    esac
  done
}

main_menu
