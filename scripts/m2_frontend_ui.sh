#!/bin/bash
set -e

# -----------------------------------------
# Milestone 2 — Step I
# Full HTML Dashboard UI
# -----------------------------------------

mkdir -p frontend

cat > frontend/index.html << 'HTML'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>DevOpsOS Dashboard</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #111;
      color: #eee;
      font-family: monospace;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    #sidebar {
      width: 200px;
      background: #1a1a1a;
      padding: 10px;
      overflow-y: auto;
      border-right: 1px solid #333;
    }
    #sidebar div {
      padding: 8px;
      cursor: pointer;
      border-bottom: 1px solid #333;
    }
    #sidebar div:hover {
      background: #333;
    }
    #content {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
    textarea, input {
      width: 100%;
      background: #000;
      color: #0f0;
      border: 1px solid #333;
      padding: 5px;
      font-family: monospace;
    }
    pre {
      background: #000;
      padding: 10px;
      border: 1px solid #333;
      overflow-x: auto;
    }
  </style>
</head>

<body>
  <div id="sidebar">
    <div onclick="showPanel('terminal')">Terminal</div>
    <div onclick="showPanel('files')">Files</div>
    <div onclick="showPanel('system')">System</div>
    <div onclick="showPanel('processes')">Processes</div>
    <div onclick="showPanel('plugins')">Plugins</div>
    <div onclick="showPanel('ssh')">SSH</div>
    <div onclick="showPanel('tor')">Tor</div>
  </div>

  <div id="content">

    <!-- Terminal Panel -->
    <div id="panel_terminal" class="panel">
      <h2>Terminal</h2>
      <textarea id="terminal_output" rows="20" readonly></textarea>
      <input id="terminal_input" placeholder="Enter command..." onkeydown="if(event.key==='Enter') terminalSend()" />
    </div>

    <!-- Files Panel -->
    <div id="panel_files" class="panel" style="display:none;">
      <h2>Files</h2>
      <input id="file_path" placeholder="Path..." />
      <button onclick="listDir(document.getElementById('file_path').value)">List</button>
      <div id="file_list"></div>
      <h3>Editor</h3>
      <textarea id="file_editor" rows="15"></textarea>
    </div>

    <!-- System Panel -->
    <div id="panel_system" class="panel" style="display:none;">
      <h2>System Monitor</h2>
      <button onclick="refreshCPU()">Refresh CPU</button>
      <pre id="cpu_load"></pre>
    </div>

    <!-- Processes Panel -->
    <div id="panel_processes" class="panel" style="display:none;">
      <h2>Processes</h2>
      <button onclick="refreshProcesses()">Refresh</button>
      <div id="process_list"></div>
    </div>

    <!-- Plugins Panel -->
    <div id="panel_plugins" class="panel" style="display:none;">
      <h2>Plugins</h2>
      <button onclick="loadPlugins()">Load Plugins</button>
      <div id="plugin_list"></div>
      <h3>Output</h3>
      <pre id="plugin_output"></pre>
    </div>

    <!-- SSH Panel -->
    <div id="panel_ssh" class="panel" style="display:none;">
      <h2>SSH</h2>
      <input id="ssh_host" placeholder="Host" />
      <input id="ssh_user" placeholder="User" />
      <input id="ssh_pass" placeholder="Password" type="password" />
      <button onclick="sshConnect()">Connect</button>
      <h3>Command</h3>
      <input id="ssh_cmd" placeholder="Command..." />
      <button onclick="sshExec()">Run</button>
      <textarea id="ssh_output" rows="10" readonly></textarea>
    </div>

    <!-- Tor Panel -->
    <div id="panel_tor" class="panel" style="display:none;">
      <h2>Tor</h2>
      <button onclick="torStatus()">Status</button>
      <pre id="tor_status"></pre>
      <button onclick="torNewCircuit()">New Circuit</button>
      <button onclick="torBridges()">Fetch Bridges</button>
      <pre id="tor_bridges"></pre>
    </div>

  </div>

  <script src="js/ws.js"></script>
  <script src="js/terminal.js"></script>
  <script src="js/files.js"></script>
  <script src="js/system.js"></script>
  <script src="js/processes.js"></script>
  <script src="js/plugins.js"></script>
  <script src="js/ssh.js"></script>
  <script src="js/tor.js"></script>

  <script>
    function showPanel(name) {
      document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
      document.getElementById('panel_' + name).style.display = 'block';
    }
  </script>

</body>
</html>
HTML

echo "Milestone 2 Step I: Frontend UI installed."
