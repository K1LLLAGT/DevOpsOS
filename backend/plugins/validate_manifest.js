const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "manifest_schema.json"), "utf8")
);

const ajv = new Ajv({ allErrors: true });

module.exports = function validateManifest(manifest) {
  const validate = ajv.compile(schema);
  const valid = validate(manifest);

  if (!valid) {
    throw new Error("Manifest validation failed: " + JSON.stringify(validate.errors));
  }

  return true;
};
const { log } = require("./log");
log("manifest_valid", { name: manifest.name, version: manifest.version });
log("manifest_invalid", { errors: validate.errors });
