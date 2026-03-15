module.exports = {
  id: "smart_actions",

  async suggestions(query) {
    const q = query.toLowerCase();

    const actions = [];

    if (q.includes("git")) {
      actions.push({
        id: "smart:git",
        title: "Open Git Panel",
        subtitle: "You seem to be working with Git",
        category: "Smart Action",
        type: "open_panel",
        action: "open_panel",
        payload: { id: "git" }
      });
    }

    if (q.includes("build")) {
      actions.push({
        id: "smart:build",
        title: "Run Remote Build",
        subtitle: "Trigger a remote build pipeline",
        category: "Smart Action",
        type: "remote_build",
        action: "open_panel",
        payload: { id: "remote_build" }
      });
    }

    return actions;
  }
};
