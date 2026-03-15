const installPlugin = require("../../plugins/install");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const { entry } = req.body;

  const keyPath = path.join(__dirname, "../../registry/public.pem");
  const publicKey = fs.existsSync(keyPath)
    ? fs.readFileSync(keyPath, "utf8")
    : null;

  const result = await installPlugin(entry, publicKey);
  res.json(result);
};
