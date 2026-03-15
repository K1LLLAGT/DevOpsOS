const getPrefs = require("./prefs/get_prefs");
const updatePrefs = require("./prefs/update_prefs");
const resetPrefs = require("./prefs/reset_prefs");

router.get("/prefs", getPrefs);
router.post("/prefs/update", updatePrefs);
router.post("/prefs/reset", resetPrefs);
const cpu = require("./system/cpu");
const memory = require("./system/memory");
const storage = require("./system/storage");
const network = require("./system/network");
const processes = require("./system/processes");
const killProc = require("./system/kill");

router.get("/system/cpu", cpu);
router.get("/system/memory", memory);
router.get("/system/storage", storage);
router.get("/system/network", network);
router.get("/system/processes", processes);
router.post("/system/kill", killProc);
const health = require("./system/health");
router.get("/system/health", health);
const pluginLogs = require("./plugins/logs");
router.get("/plugins/logs", pluginLogs);
const marketplaceList = require("./marketplace/list");
router.get("/marketplace/list", marketplaceList);
const marketplaceInstall = require("./marketplace/install");
const marketplaceUninstall = require("./marketplace/uninstall");

router.post("/marketplace/install", marketplaceInstall);
router.post("/marketplace/uninstall", marketplaceUninstall);
const marketplaceUpdates = require("./marketplace/updates");
const marketplaceUpdateOne = require("./marketplace/update_one");
const marketplaceUpdateAll = require("./marketplace/update_all");

router.get("/marketplace/updates", marketplaceUpdates);
router.post("/marketplace/update", marketplaceUpdateOne);
router.post("/marketplace/update_all", marketplaceUpdateAll);
const actionList = require("./actions/list");
router.get("/actions/list", actionList);
const actionExecute = require("./actions/execute");
router.post("/actions/execute", actionExecute);
const emitEvent = require("./events/emit");
router.post("/events/emit", emitEvent);
const emitEvent = require("./events/emit");
router.post("/events/emit", emitEvent);
router.get("/automation/list", require("./automation/list"));
router.post("/automation/add", require("./automation/add"));
router.post("/automation/delete", require("./automation/delete"));
router.get("/devtools/events", require("./devtools/events"));
router.get("/devtools/plugins", require("./devtools/plugins"));
router.get("/devtools/plugin_logs", require("./devtools/plugin_logs"));
router.get("/devtools/rules", require("./devtools/rules"));
router.get("/devtools/rule_logs", require("./devtools/rule_logs"));
router.get("/devtools/tasks", require("./devtools/tasks"));
router.get("/devtools/task_logs", require("./devtools/task_logs"));
router.get("/settings/get_schema", require("./settings/get_schema"));
router.get("/notifications/list", require("./notifications/list"));
router.post("/notifications/push", require("./notifications/push"));
router.get("/commands/list", require("./commands/list"));
router.post("/commands/run", require("./commands/run"));
router.post("/search/query", require("./search/query"));
router.get("/settings/get", require("./settings/get"));
router.post("/settings/set", require("./settings/set"));
router.get("/profiles/get", require("./profiles/get"));
router.post("/profiles/set_active", require("./profiles/set_active"));
router.get("/update/get", require("./update/get"));
router.post("/update/channel", require("./update/channel"));
router.get("/installer/status", require("./installer/status"));
router.post("/installer/complete", require("./installer/complete"));

// DeepOS Routes
router.get("/deepos/themes", require("./deepos/themes"));
router.get("/deepos/update/get", require("./deepos/update_get"));
router.post("/deepos/update/channel", require("./deepos/update_set_channel"));
router.get("/deepos/profiles/get", require("./deepos/profiles_get"));
router.post("/deepos/profiles/set", require("./deepos/profiles_set"));
router.get("/deepos/first_run/get", require("./deepos/first_run_get"));
router.post("/deepos/first_run/complete", require("./deepos/first_run_complete"));
router.get("/deepos/timeline/get", require("./deepos/timeline_get"));

// DevPower Routes
router.post("/devpower/lsp/send", require("./devpower/lsp_send"));
router.get("/devpower/lsp/listen", require("./devpower/lsp_listen"));

router.get("/devpower/git/status", require("./devpower/git_status"));
router.get("/devpower/git/diff", require("./devpower/git_diff"));
router.post("/devpower/git/commit", require("./devpower/git_commit"));
router.post("/devpower/git/push", require("./devpower/git_push"));

router.get("/devpower/containers/list", require("./devpower/containers_list"));
router.get("/devpower/containers/logs", require("./devpower/containers_logs"));

router.post("/devpower/remote_build/run", require("./devpower/remote_build_run"));

router.get("/devpower/indexer/get", require("./devpower/indexer_get"));

// Intelligence C1
router.post("/intelligence/embed", require("./intelligence/embed"));
router.post("/intelligence/search", require("./intelligence/search"));

// Intelligence C2
router.post("/intelligence/semantic_search", require("./intelligence/semantic_search"));

// Intelligence C3
router.post("/intelligence/suggestions", require("./intelligence/suggestions"));

// Intelligence C4
router.get("/intelligence/insights", require("./intelligence/insights"));

// Intelligence C5
router.post("/intelligence/bus/emit", require("./intelligence/bus_emit"));

// Commercial Routes
router.get("/commercial/license/get", require("./commercial/license_get"));
router.post("/commercial/license/set", require("./commercial/license_set"));

router.get("/commercial/marketplace/list", require("./commercial/marketplace_list"));
router.post("/commercial/purchase", require("./commercial/purchase"));

router.get("/commercial/crashlog/list", require("./commercial/crashlog_list"));

router.get("/commercial/branding/get", require("./commercial/branding_get"));
router.post("/commercial/branding/set", require("./commercial/branding_set"));

// ARG Layer
router.post("/arg/whisper", require("./arg/whisper"));
router.get("/arg/anomaly", require("./arg/anomaly"));
router.get("/arg/clues", require("./arg/clues"));
router.post("/arg/unlock/submit", require("./arg/unlock_submit"));
router.get("/arg/unlock/state", require("./arg/unlock_state"));

// Verification
router.get("/verify/run", require("./verify/run_checks"));
