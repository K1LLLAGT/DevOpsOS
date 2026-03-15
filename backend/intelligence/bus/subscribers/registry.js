const contextLogger = require("../handlers/context_logger");
const insightStream = require("../handlers/insight_stream");
const indexerTrigger = require("../handlers/indexer_trigger");
const suggestionBooster = require("../handlers/suggestion_booster");

module.exports = {
  registerAll(bus) {
    contextLogger(bus);
    insightStream(bus);
    indexerTrigger(bus);
    suggestionBooster(bus);
  }
};
