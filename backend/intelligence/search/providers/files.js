const store = require("../../vector_store/store");

module.exports = {
  id: "files",
  label: "Files",

  async search(queryVec, queryText, ranker) {
    const items = store.all();

    return items.map(item => ({
      id: item.id,
      title: item.id.replace("file:", ""),
      subtitle: item.text.slice(0, 120),
      category: "File",
      score: ranker.score(queryVec, queryText, item),
      action: "open_file",
      payload: { path: item.id.replace("file:", "") }
    }));
  }
};
