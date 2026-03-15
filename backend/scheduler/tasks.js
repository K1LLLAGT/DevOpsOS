const tasks = {};

module.exports = {
  register(id, fn) {
    tasks[id] = fn;
  },
  get(id) {
    return tasks[id];
  }
};
const dispatch = require("../events/dispatch");

module.exports = {
  register(id, fn) {
    tasks[id] = async (...args) => {
      dispatch("task.start", { id });
      try {
        const result = await fn(...args);
        dispatch("task.success", { id, result });
        return result;
      } catch (err) {
        dispatch("task.error", { id, error: err.toString() });
        throw err;
      }
    };
  },
  get(id) {
    return tasks[id];
  }
};
const notify = require("../notifications/dispatch");

tasks[id] = async (...args) => {
  notify({
    title: "Task Started",
    message: `Task ${id} has started.`,
    level: "info",
    data: { task: id }
  });

  try {
    const result = await fn(...args);

    notify({
      title: "Task Complete",
      message: `Task ${id} completed successfully.`,
      level: "success",
      data: { task: id, result }
    });

    return result;

  } catch (err) {
    notify({
      title: "Task Error",
      message: `Task ${id} failed: ${err.toString()}`,
      level: "error",
      data: { task: id }
    });

    throw err;
  }
};
