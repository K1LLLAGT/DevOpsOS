const fs = require("fs");
const path = require("path");

module.exports = {
  id: "panels",
  label: "Panels",

  async search(queryVec, queryText, ranker) {
    const file = path.join(process.cwd(), "frontend/js/core/panels.json");
    if (!fs.existsSync(file)) return [];

    const panels = JSON.parse(fs.readFileSync(file, "utf8"));

    return Object.keys(panels).map(id => {
      const p = panels[id];
      return {
        id: "panel:" + id,
        title: p.name,
        subtitle: p.path,
        category: "Panel",
        score: ranker.score(queryVec, queryText, {
          text: p.name + " " + p.path,
          vector: []
        }),
        action: "open_panel",
        payload: { id }
      };
    });
  }
};
