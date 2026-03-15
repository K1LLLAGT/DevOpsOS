module.exports = {
  fuzzyScore(text, query) {
    text = text.toLowerCase();
    query = query.toLowerCase();

    let score = 0;
    let ti = 0;

    for (let qi = 0; qi < query.length; qi++) {
      const qc = query[qi];
      let found = false;

      while (ti < text.length) {
        if (text[ti] === qc) {
          score += 10;
          found = true;
          ti++;
          break;
        }
        ti++;
      }

      if (!found) return 0;
    }

    score += boundaryBoost(text, query);
    score += acronymBoost(text, query);

    return score;
  }
};

function boundaryBoost(text, query) {
  let boost = 0;

  for (let i = 0; i < text.length; i++) {
    if (i === 0 || text[i - 1] === " ") {
      if (query.includes(text[i])) boost += 15;
    }
  }

  return boost;
}

function acronymBoost(text, query) {
  const acronym = text
    .split(/[\s\-]/)
    .map(w => w[0])
    .join("");

  return acronym.startsWith(query) ? 40 : 0;
}
