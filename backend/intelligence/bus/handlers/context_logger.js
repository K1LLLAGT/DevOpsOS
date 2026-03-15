const tracker = require("../../suggestions/context/context_tracker");

module.exports = function register(bus) {
  bus.on("open_panel", payload => {
    tracker.log({ type: "open_panel", panel: payload.id });
  });

  bus.on("open_file", payload => {
    tracker.log({ type: "open_file", path: payload.path });
  });

  bus.on("git_op", payload => {
    tracker.log({ type: "git_op", op: payload.op });
  });

  bus.on("run_command", payload => {
    tracker.log({ type: "run_command", cmd: payload.cmd });
  });
};
