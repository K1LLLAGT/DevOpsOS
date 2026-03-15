const rules = require("../../automation/rules");

module.exports = {
  id: "automations",
  title: "Automations",

  search(query) {
    return rules.list().map(rule => ({
      id: "automation:" + rule.id,
      title: rule.name || rule.id,
      subtitle: "Automation Rule",
      category: "Automations",
      action: "automation.trigger",
      payload: { rule: rule.id }
    }));
  }
};
