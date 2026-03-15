let completed = false;

module.exports = {
  isCompleted() {
    return completed;
  },
  complete() {
    completed = true;
  }
};
