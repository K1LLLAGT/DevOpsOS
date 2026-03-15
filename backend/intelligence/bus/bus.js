// The Intelligence Bus is the central nervous system of DevOpsOS intelligence.
// All intelligence modules (C1–C4) publish events here.
// Subscribers listen and react.

const subscribers = {};

module.exports = {
  emit(type, payload) {
    if (subscribers[type]) {
      subscribers[type].forEach(fn => {
        try { fn(payload); } catch (e) { console.error("Bus error:", e); }
      });
    }
  },

  on(type, fn) {
    if (!subscribers[type]) subscribers[type] = [];
    subscribers[type].push(fn);
  }
};
