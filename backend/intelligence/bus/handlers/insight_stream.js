const stream = require("../../insights/event_stream");

module.exports = function register(bus) {
  const types = ["open_panel", "open_file", "git_op", "run_command"];

  types.forEach(t => {
    bus.on(t, payload => {
      stream.push({ type: t, ...payload });
    });
  });
};
