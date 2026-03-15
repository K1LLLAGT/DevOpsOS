// settings.js
const fs = require("fs");
const path = require("path");

const SETTINGS = path.join(process.env.HOME, ".devopsos/settings.json");

module.exports = function SettingsService(ctx) {
  if (!fs.existsSync(SETTINGS)) {
    fs.writeFileSync(SETTINGS, JSON.stringify({ theme: "dark" }, null, 2));
  }

  function load() {
    return JSON.parse(fs.readFileSync(SETTINGS, "utf8"));
  }

  function save(obj) {
    fs.writeFileSync(SETTINGS, JSON.stringify(obj, null, 2));
  }

  return {
    get() {
      ctx.send({
        type: "settings:data",
        settings: load()
      });
    },

    set(key, value) {
      const s = load();
      s[key] = value;
      save(s);
      this.get();
    }
  };
};
