// ===============================
// DevOpsOS Message Schema v6.0.0
// ===============================

export type TerminalData = {
  type: "terminal:data";
  id: string;
  chunk: string;
};

export type TerminalOutput = {
  type: "terminal:output";
  data: string;
};

export type TerminalStart = {
  type: "terminal:start";
  id: string;
  cols: number;
  rows: number;
};

export type TerminalInput = {
  type: "terminal:input";
  id: string;
  data: string;
};

export type TerminalResize = {
  type: "terminal:resize";
  id: string;
  cols: number;
  rows: number;
};

export type TerminalKill = {
  type: "terminal:kill";
  id: string;
};

// -------------------------------
// System
// -------------------------------
export type SystemStats = {
  type: "system:stats";
  cpu: string;
  ram: string;
  ram_detail?: string;
  load: string;
  uptime: string;
};

// -------------------------------
// Process Manager
// -------------------------------
export type ProcessList = {
  type: "process:list";
  list: {
    pid: number;
    ppid: number;
    cmd: string;
    cpu: string;
    mem: string;
  }[];
};

export type ProcessRefresh = {
  type: "process:refresh";
};

export type ProcessKill = {
  type: "process:kill";
  pid: number;
};

// -------------------------------
// File Manager
// -------------------------------
export type FileListRequest = {
  type: "file:list";
  path: string;
};

export type FileListResponse = {
  type: "file:list";
  path: string;
  list: { name: string; type: "file" | "dir" }[];
};

export type FileReadRequest = {
  type: "file:read";
  path: string;
};

export type FileReadResponse = {
  type: "file:read";
  path: string;
  content: string;
};

export type FileDelete = {
  type: "file:delete";
  path: string;
};

export type FileDeleteOK = {
  type: "file:delete:ok";
  path: string;
};

export type FileMkdir = {
  type: "file:mkdir";
  path: string;
};

export type FileMkdirOK = {
  type: "file:mkdir:ok";
  path: string;
};

// -------------------------------
// Plugins
// -------------------------------
export type PluginsRefresh = {
  type: "plugins:refresh";
};

export type PluginsInstall = {
  type: "plugins:install";
  id: string;
};

export type PluginsRemove = {
  type: "plugins:remove";
  id: string;
};

export type PluginsList = {
  type: "plugins:list";
  plugins: {
    id: string;
    name: string;
    description?: string;
    version: string;
    trust?: string;
    sandbox?: string;
  }[];
};

// -------------------------------
// SSH
// -------------------------------
export type SSHConnect = {
  type: "ssh:connect";
  host: string;
  user: string;
  port: number;
};

export type SSHDisconnect = {
  type: "ssh:disconnect";
};

export type SSHInput = {
  type: "ssh:input";
  data: string;
};

export type SSHStatus = {
  type: "ssh:status";
  status: string;
};

export type SSHOutput = {
  type: "ssh:output";
  data: string;
};

export type SSHConnected = {
  type: "ssh:connected";
};

export type SSHClosed = {
  type: "ssh:closed";
};

// -------------------------------
// Tor
// -------------------------------
export type TorStart = { type: "tor:start" };
export type TorStop = { type: "tor:stop" };
export type TorNewId = { type: "tor:newid" };

export type TorStatus = {
  type: "tor:status";
  status: string;
};

export type TorCircuit = {
  type: "tor:circuit";
  text: string;
};

// -------------------------------
// Error
// -------------------------------
export type ErrorMessage = {
  type: "error";
  code: string;
  message: string;
};

// -------------------------------
// Union Types
// -------------------------------
export type BackendToFrontend =
  | TerminalData
  | TerminalOutput
  | SystemStats
  | ProcessList
  | FileListResponse
  | FileReadResponse
  | FileDeleteOK
  | FileMkdirOK
  | PluginsList
  | SSHStatus
  | SSHOutput
  | SSHConnected
  | SSHClosed
  | TorStatus
  | TorCircuit
  | ErrorMessage;

export type FrontendToBackend =
  | TerminalStart
  | TerminalInput
  | TerminalResize
  | TerminalKill
  | ProcessRefresh
  | ProcessKill
  | FileListRequest
  | FileReadRequest
  | FileDelete
  | FileMkdir
  | PluginsRefresh
  | PluginsInstall
  | PluginsRemove
  | SSHConnect
  | SSHDisconnect
  | SSHInput
  | TorStart
  | TorStop
  | TorNewId;
