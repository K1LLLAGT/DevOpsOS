let channel = "stable";
let latestVersion = "0.0.1";
let currentVersion = "0.0.1";

module.exports = {
  getState() {
    return { channel, latestVersion, currentVersion };
  },
  setChannel(c) {
    channel = c;
  }
};
