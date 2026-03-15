const panels = require("../../frontend/panels/list.json");

module.exports = {
  id: "panels",
  title: "Panels",

  search(query) {
    return panels.map(p => ({
      id: "panel:" + p.id,
      title: p.name,
      subtitle: "Panel",
      category: "Panels",
      action: "ui.openPanel." + p.id,
      payload: {}
    }));
  }
};
