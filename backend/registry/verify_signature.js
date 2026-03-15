const crypto = require("crypto");

module.exports = function verifySignature(plugin, publicKey) {
  try {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(plugin.name + plugin.version);
    verifier.end();

    return verifier.verify(publicKey, plugin.signature, "base64");
  } catch {
    return false;
  }
};
