const cron = require("node-cron");
const dispatch = require("../events/dispatch");

module.exports = function startCronScheduler() {
  const jobs = [];

  return {
    register(id, expr, payload = {}) {
      const job = cron.schedule(expr, () => {
        dispatch("schedule.trigger", { id, payload });
      });
      jobs.push(job);
    }
  };
};
