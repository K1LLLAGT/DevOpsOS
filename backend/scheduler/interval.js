const dispatch = require("../events/dispatch");

module.exports = function startIntervalScheduler() {
  const intervals = [];

  return {
    register(id, ms, payload = {}) {
      intervals.push(setInterval(() => {
        dispatch("schedule.trigger", { id, payload });
      }, ms));
    }
  };
};
