const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "registry_schema.json"), "utf8")
);

const ajv = new Ajv({ allErrors: true });

module.exports = function loadLocalRegistry() {
  const file = path.join(__dirname, "registry.json");

  if (!fs.existsSync(file)) {
    return { plugins: [] };
  }

  const raw = fs.readFileSync(file, "utf8");
  const data = JSON.parse(raw);

  const validate = ajv.compile(schema);
  if (!validate(data)) {
    throw new Error("Local registry validation failed: " + JSON.stringify(validate.errors));
  }

  return data;
};
