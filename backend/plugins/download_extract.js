const https = require("https");
const fs = require("fs");
const path = require("path");
const unzip = require("unzipper");

module.exports = function downloadAndExtract(url, targetDir) {
  return new Promise((resolve, reject) => {
    const tmpZip = path.join(targetDir, "plugin.zip");

    const file = fs.createWriteStream(tmpZip);

    https.get(url, res => {
      res.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          fs.createReadStream(tmpZip)
            .pipe(unzip.Extract({ path: targetDir }))
            .on("close", () => {
              fs.unlinkSync(tmpZip);
              resolve();
            })
            .on("error", reject);
        });
      });
    }).on("error", reject);
  });
};
