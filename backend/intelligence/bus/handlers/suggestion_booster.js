// Boosts suggestion scores when user repeats actions.

const tracker = require("../../suggestions/context/context_tracker");

module.exports = function register(bus) {
  bus.on("open_panel", payload => {
    tracker.log({ type: "panel_focus", panel: payload.id });
  });

  bus.on("open_file", payload => {
    tracker.log({ type: "file_focus", path: payload.path });
  });
};
