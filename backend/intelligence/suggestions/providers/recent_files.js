const tracker = require("../context/context_tracker");

module.exports = {
  id: "recent_files",

  async suggestions(query) {
    const events = tracker.recent(200);
    const files = events.filter(e => e.type === "open_file");

    const unique = new Map();
    files.forEach(f => {
      if (!unique.has(f.path)) {
        unique.set(f.path, {
          id: "file:" + f.path,
          title: "Open file: " + f.path,
          subtitle: "Recently opened",
          category: "Suggestion",
          type: "open_file",
          action: "open_file",
          payload: { path: f.path }
        });
      }
    });

    return [...unique.values()];
  }
};
