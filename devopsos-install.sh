#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$ROOT_DIR/config/features.json"

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

log() {
  echo "[DevOpsOS Install] $*"
}

install_editor_monaco() {
  log "Installing Monaco Editor... (stub)"
  # TODO: add real Monaco integration here
}

install_editor_codemirror() {
  log "Ensuring CodeMirror editor is installed... (stub)"
  # TODO: ensure CM6 assets + editor wiring
}

install_editor_lsp() {
  log "Installing LSP support... (stub)"
  # TODO: wire language servers, backend routes, etc.
}

install_editor_autosave() {
  log "Enabling autosave... (stub)"
  # TODO: add autosave timers in editor
}

install_ui_command_palette() {
  log "Installing Command Palette... (stub)"
  # TODO: add palette UI + keybindings
}

install_ui_notifications() {
  log "Installing Notifications / Toast system... (stub)"
  # TODO: add notification bus + UI
}

install_ui_global_search() {
  log "Installing Global Search... (stub)"
  # TODO: add search index + UI
}

install_ui_theme_engine() {
  log "Installing Theme Engine... (stub)"
  # TODO: theme config + CSS hooks
}

install_ui_keybinding_engine() {
  log "Installing Keybinding Engine... (stub)"
  # TODO: central keymap manager
}

install_ui_dashboard_layout() {
  log "Installing Dashboard Layout Engine... (stub)"
  # TODO: layout persistence + drag/drop
}

install_network_ssh_panel() {
  log "Installing SSH Panel... (stub)"
  # TODO: panel + backend SSH proxy
}

install_network_tor_panel() {
  log "Installing Tor Panel... (stub)"
  # TODO: panel + Tor control wiring
}

install_system_logs_panel() {
  log "Installing Logs Panel... (stub)"
  # TODO: log viewer panel + backend endpoints
}

install_system_crash_reporter() {
  log "Installing Crash Reporter... (stub)"
  # TODO: bugreport/tombstone parsing UI
}

install_system_telemetry_local() {
  log "Installing Local Telemetry... (stub)"
  # TODO: local metrics collection
}

install_system_background_services() {
  log "Installing Background Services Manager... (stub)"
  # TODO: supervisor for background tasks
}

install_plugins_manager() {
  log "Installing Plugin Manager... (stub)"
  # TODO: plugin registry + UI
}

install_plugins_sandboxing() {
  log "Installing Plugin Sandboxing... (stub)"
  # TODO: sandbox execution model
}

install_plugins_workspace_sync() {
  log "Installing Workspace Sync... (stub)"
  # TODO: sync engine hooks
}

install_updates_channels() {
  log "Installing Update Channels... (stub)"
  # TODO: stable/beta/dev channel config
}

install_updates_auto_repair() {
  log "Installing Auto-Repair Engine... (stub)"
  # TODO: self-healing routines
}

install_updates_migrations() {
  log "Installing Migrations system... (stub)"
  # TODO: versioned migrations runner
}

main() {
  if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "Config file not found: $CONFIG_FILE"
    echo "Run ./update-features.sh first."
    exit 1
  fi

  log "Using config: $CONFIG_FILE"

  # Editor
  [[ "$(get_bool '.editor.monaco')" == "true" ]] && install_editor_monaco || log "Monaco Editor disabled."
  [[ "$(get_bool '.editor.codemirror')" == "true" ]] && install_editor_codemirror || log "CodeMirror disabled."
  [[ "$(get_bool '.editor.lsp')" == "true" ]] && install_editor_lsp || log "LSP disabled."
  [[ "$(get_bool '.editor.autosave')" == "true" ]] && install_editor_autosave || log "Autosave disabled."

  # UI
  [[ "$(get_bool '.ui.commandPalette')" == "true" ]] && install_ui_command_palette || log "Command Palette disabled."
  [[ "$(get_bool '.ui.notifications')" == "true" ]] && install_ui_notifications || log "Notifications disabled."
  [[ "$(get_bool '.ui.globalSearch')" == "true" ]] && install_ui_global_search || log "Global Search disabled."
  [[ "$(get_bool '.ui.themeEngine')" == "true" ]] && install_ui_theme_engine || log "Theme Engine disabled."
  [[ "$(get_bool '.ui.keybindingEngine')" == "true" ]] && install_ui_keybinding_engine || log "Keybinding Engine disabled."
  [[ "$(get_bool '.ui.dashboardLayout')" == "true" ]] && install_ui_dashboard_layout || log "Dashboard Layout disabled."

  # Network
  [[ "$(get_bool '.network.sshPanel')" == "true" ]] && install_network_ssh_panel || log "SSH Panel disabled."
  [[ "$(get_bool '.network.torPanel')" == "true" ]] && install_network_tor_panel || log "Tor Panel disabled."

  # System
  [[ "$(get_bool '.system.logsPanel')" == "true" ]] && install_system_logs_panel || log "Logs Panel disabled."
  [[ "$(get_bool '.system.crashReporter')" == "true" ]] && install_system_crash_reporter || log "Crash Reporter disabled."
  [[ "$(get_bool '.system.telemetryLocal')" == "true" ]] && install_system_telemetry_local || log "Local Telemetry disabled."
  [[ "$(get_bool '.system.backgroundServices')" == "true" ]] && install_system_background_services || log "Background Services disabled."

  # Plugins
  [[ "$(get_bool '.plugins.pluginManager')" == "true" ]] && install_plugins_manager || log "Plugin Manager disabled."
  [[ "$(get_bool '.plugins.sandboxing')" == "true" ]] && install_plugins_sandboxing || log "Sandboxing disabled."
  [[ "$(get_bool '.plugins.workspaceSync')" == "true" ]] && install_plugins_workspace_sync || log "Workspace Sync disabled."

  # Updates
  [[ "$(get_bool '.updates.updateChannels')" == "true" ]] && install_updates_channels || log "Update Channels disabled."
  [[ "$(get_bool '.updates.autoRepair')" == "true" ]] && install_updates_auto_repair || log "Auto-Repair disabled."
  [[ "$(get_bool '.updates.migrations')" == "true" ]] && install_updates_migrations || log "Migrations disabled."

  log "Install pass complete."
}

main
