let channel = "stable";
let latest = {
  stable: "1.0.0",
  beta: "1.1.0-beta",
  dev: "1.2.0-dev"
};
let current = "1.0.0";

module.exports = {
  get() {
    return { channel, latest: latest[channel], current };
  },
  setChannel(c) {
    if (["stable", "beta", "dev"].includes(c)) channel = c;
  }
};
