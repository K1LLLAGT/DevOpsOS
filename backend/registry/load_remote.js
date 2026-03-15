const https = require("https");
const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "registry_schema.json"), "utf8")
);

const ajv = new Ajv({ allErrors: true });

module.exports = function loadRemoteRegistry(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";

      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);

          const validate = ajv.compile(schema);
          if (!validate(json)) {
            return reject("Remote registry validation failed: " + JSON.stringify(validate.errors));
          }

          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
};
