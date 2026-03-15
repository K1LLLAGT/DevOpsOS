const tokenizer = require("../../tokenizer/tokenizer");

module.exports = {
  keywordScore(query, text) {
    const q = new Set(tokenizer.tokenize(query));
    const t = new Set(tokenizer.tokenize(text));

    let matches = 0;
    q.forEach(tok => { if (t.has(tok)) matches++; });

    return matches / (q.size || 1);
  }
};
