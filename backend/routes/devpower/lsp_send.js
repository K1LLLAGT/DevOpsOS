const manager = require("../../devpower/lsp/manager");

module.exports = (req, res) => {
  const { lang, msg } = req.body;
  manager.send(lang, msg);
  res.json({ ok: true });
};
