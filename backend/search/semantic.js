const synonyms = {
  error: ["fail", "exception", "crash"],
  task: ["job", "run", "execute"],
  automation: ["rule", "trigger", "workflow"],
  file: ["path", "document", "source"],
  log: ["output", "trace", "debug"]
};

module.exports = {
  semanticScore(text, query) {
    text = text.toLowerCase();
    query = query.toLowerCase();

    let score = 0;

    // direct keyword match
    if (text.includes(query)) score += 30;

    // synonym match
    for (const key in synonyms) {
      if (query === key || synonyms[key].includes(query)) {
        if (text.includes(key)) score += 25;
      }
    }

    return score;
  }
};
