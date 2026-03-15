// Hidden fragments scattered across the system.

module.exports = {
  fragments: [
    { id: "c1", text: "the first key lies in reflection" },
    { id: "c2", text: "seek the silent panel" },
    { id: "c3", text: "logs remember what users forget" },
    { id: "c4", text: "the path inward is recursive" }
  ],

  get(id) {
    return this.fragments.find(f => f.id === id) || null;
  },

  all() {
    return this.fragments;
  }
};
