const core = require("./core/check_core");
const arcA = require("./arcA/check_arcA");
const arcB = require("./arcB/check_arcB");
const arcC = require("./arcC/check_arcC");
const arcD = require("./arcD/check_arcD");

module.exports = {
  runAll() {
    return {
      core: core.run(),
      arcA: arcA.run(),
      arcB: arcB.run(),
      arcC: arcC.run(),
      arcD: arcD.run()
    };
  }
};

const arcE = require("./arcE/check_arcE");
const packaging = require("./packaging/check_packaging");
const security = require("./security/check_security");
const qa = require("./qa/check_qa");
const release = require("./release/check_release");

module.exports.runAll = function() {
  return {
    ...module.exports.runAll(),
    arcE: arcE.run(),
    packaging: packaging.run(),
    security: security.run(),
    qa: qa.run(),
    release: release.run()
  };
};
