const tasks = require("../../scheduler/tasks");

module.exports = {
  id: "tasks",
  title: "Tasks",

  search(query) {
    return Object.keys(tasks.list()).map(id => ({
      id: "task:" + id,
      title: id,
      subtitle: "Background Task",
      category: "Tasks",
      action: "task.run",
      payload: { task: id }
    }));
  }
};
