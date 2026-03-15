const storage = require("../../notifications/storage");

module.exports = {
  id: "notifications",
  title: "Notifications",

  search(query) {
    const data = storage.load();

    return data.items.map(n => ({
      id: "notification:" + n.id,
      title: n.title,
      subtitle: n.message,
      category: "Notifications",
      action: "notifications.open",
      payload: { id: n.id }
    }));
  }
};
