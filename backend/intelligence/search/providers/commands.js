const fs = require("fs");
const path = require("path");

module.exports = {
  id: "commands",
  label: "Commands",

  async search(queryVec, queryText, ranker) {
    const file = path.join(process.cwd(), "frontend/js/core/commands.json");
    if (!fs.existsSync(file)) return [];

    const cmds = JSON.parse(fs.readFileSync(file, "utf8"));

    return cmds.map(cmd => ({
      id: "cmd:" + cmd.id,
      title: cmd.title,
      subtitle: cmd.description || "",
      category: "Command",
      score: ranker.score(queryVec, queryText, {
        text: cmd.title + " " + (cmd.description || ""),
        vector: []
      }),
      action: cmd.id,
      payload: cmd.payload || {}
    }));
  }
};
