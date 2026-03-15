const listeners = {};

module.exports = {
  emit(type, payload) {
    (listeners[type] || []).forEach(fn => fn(payload));
  },

  on(type, fn) {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(fn);
  }
};
