module.exports = {
  rank(results, query) {
    if (!query) return results;

    const q = query.toLowerCase();

    return results
      .map(r => {
        const text = (r.title + " " + (r.subtitle || "")).toLowerCase();
        r.score = score(text, q) + (r.boost || 0);
        return r;
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }
};

function score(text, query) {
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

  return score;
}
