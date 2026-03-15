// Simple deterministic tokenizer for local embeddings.
// Not AI — rule-based, stable, predictable.

module.exports = {
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }
};
