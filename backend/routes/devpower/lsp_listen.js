const manager = require("../../devpower/lsp/manager");

module.exports = (req, res) => {
  const { lang } = req.query;

  manager.onMessage(lang, msg => {
    res.write(JSON.stringify(msg) + "\n");
  });
};
