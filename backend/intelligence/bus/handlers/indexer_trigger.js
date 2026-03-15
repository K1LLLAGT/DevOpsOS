const indexer = require("../../indexer/indexer");

module.exports = function register(bus) {
  // Re-index workspace when user opens many files
  let count = 0;

  bus.on("open_file", () => {
    count++;
    if (count >= 10) {
      try {
        indexer.indexWorkspace();
      } catch (e) {
        console.error("Indexer error:", e);
      }
      count = 0;
    }
  });
};
