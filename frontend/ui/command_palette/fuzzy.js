export function fuzzyScore(query, text) {
  if (!query) return 1;

  query = query.toLowerCase();
  text = text.toLowerCase();

  // Exact match boost
  if (text === query) return 100;

  // Prefix match boost
  if (text.startsWith(query)) return 50;

  // Subsequence match
  let qi = 0;
  let score = 0;

  for (let ti = 0; ti < text.length; ti++) {
    if (text[ti] === query[qi]) {
      score += 5;
      qi++;
      if (qi === query.length) break;
    }
  }

  // If not all chars matched, penalize
  if (qi < query.length) score -= 10;

  // Length penalty
  score -= Math.abs(text.length - query.length);

  return score;
}
export function acronymScore(query, text) {
  if (!query) return 0;

  const words = text.split(/\s+/);
  const acronym = words.map(w => w[0]).join("").toLowerCase();

  if (acronym.startsWith(query.toLowerCase())) return 40;
  return 0;
}
