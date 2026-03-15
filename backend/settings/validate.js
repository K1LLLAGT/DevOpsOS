module.exports = function validateSettings(schema, settings) {
  const result = {};

  for (const key in schema) {
    const def = schema[key];
    const value = settings[key];

    // Default
    if (value === undefined) {
      result[key] = def.default;
      continue;
    }

    // Type check
    if (def.type === "string" && typeof value !== "string") {
      result[key] = def.default;
      continue;
    }

    if (def.type === "number" && typeof value !== "number") {
      result[key] = def.default;
      continue;
    }

    if (def.type === "boolean" && typeof value !== "boolean") {
      result[key] = def.default;
      continue;
    }

    // Enum check
    if (def.enum && !def.enum.includes(value)) {
      result[key] = def.default;
      continue;
    }

    result[key] = value;
  }

  return result;
};
if (def.secure && typeof result[key] === "string") {
  // Store normally, but mask when exposed
  result[key] = result[key];
}
