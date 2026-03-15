const taskRegistry = require("../../scheduler/tasks");

module.exports = (req, res) => {
  const tasks = Object.keys(taskRegistry._tasks || taskRegistry);
  res.json({ tasks });
};
