export function fuzzyMatch(items, query, getter) {
  if (!query) return items;

  const q = query.toLowerCase();

  return items
    .map(item => {
      const text = getter(item).toLowerCase();
      const score = scoreMatch(text, q);
      return { item, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item);
}

function scoreMatch(text, query) {
  let score = 0;
  let ti = 0;

  for (let qi = 0; qi < query.length; qi++) {
    const qc = query[qi];
    let found = false;

    while (ti < text.length) {
      if (text[ti] === qc) {
        score += 10; // base match
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
function boundaryBoost(text, query) {
  let boost = 0;

  // Word boundary boost
  for (let i = 0; i < text.length; i++) {
    if (i === 0 || text[i - 1] === " ") {
      if (query.includes(text[i])) boost += 15;
    }
  }

  // Acronym boost
  const acronym = text
    .split(/[\s\-]/)
    .map(w => w[0])
    .join("");

  if (acronym.startsWith(query)) boost += 40;

  return boost;
}

function scoreMatch(text, query) {
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

  return score;
}
import { getRecency } from "./command_recency.js";

function applyBoosts(item, score) {
  // Category boost
  if (item.category === "System") score += 20;
  if (item.category === "Navigation") score += 10;

  // Plugin boost
  if (item.plugin) score += 5;

  // Recency boost
  const recent = getRecency(item.id);
  if (recent) score += Math.min(50, (Date.now() - recent) / -2000);

  return score;
}

export function fuzzyMatch(items, query, getter) {
  if (!query) return items;

  const q = query.toLowerCase();

  return items
    .map(item => {
      const text = getter(item).toLowerCase();
      let score = scoreMatch(text, q);
      if (score > 0) score = applyBoosts(item, score);
      return { item, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item);
}
