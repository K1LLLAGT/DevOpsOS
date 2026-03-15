module.exports = function matchRules(event, rules) {
  const type = event.type;

  return rules.filter(r =>
    r.event === type ||
    r.event === "event.*" ||
    (r.event.endsWith(".*") && type.startsWith(r.event.slice(0, -2)))
  );
};
