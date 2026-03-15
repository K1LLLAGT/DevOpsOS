const tracker = require("../context/context_tracker");

module.exports = {
  id: "recent_panels",

  async suggestions(query) {
    const events = tracker.recent(200);
    const panels = events.filter(e => e.type === "open_panel");

    const unique = new Map();
    panels.forEach(p => {
      if (!unique.has(p.panel)) {
        unique.set(p.panel, {
          id: "panel:" + p.panel,
          title: "Open panel: " + p.panel,
          subtitle: "Recently used",
          category: "Suggestion",
          type: "open_panel",
          action: "open_panel",
          payload: { id: p.panel }
        });
      }
    });

    return [...unique.values()];
  }
};
