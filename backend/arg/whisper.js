const fs = require("fs");
const path = require("path");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const FRAG_PATH = path.join(ROOT, "backend/arg/fragments.json");

function loadFragments() {
  return JSON.parse(fs.readFileSync(FRAG_PATH, "utf8"));
}

function whisperForState(state) {
  const frags = loadFragments();
  const found = frags.found.length;

  const base = [
    "the system remembers",
    "the unseen waits beneath",
    "the path deepens"
  ];

  const timeLate = [
    "the quiet hours reveal the truth",
    "night sharpens the signal"
  ];

  const searchRoot = [
    "you are close",
    "beneath the surface"
  ];

  const searchHidden = [
    "not all is meant to be seen",
    "the shadow watches"
  ];

  const fragmentProgress = [
    "a beginning",
    "a shape forms",
    "truth takes shape",
    "the phrase awakens"
  ];

  const forbidden = [
    "not yet",
    "you are not ready",
    "the gate remains closed"
  ];

  const phraseNear = [
    "almost",
    "the truth stirs",
    "you remember"
  ];

  let pool = [...base];

  if (state.timeLate) pool.push(...timeLate);
  if (state.searchRoot) pool.push(...searchRoot);
  if (state.searchHidden) pool.push(...searchHidden);
  if (state.forbiddenAttempt) pool.push(...forbidden);
  if (state.phraseNear) pool.push(...phraseNear);

  if (found > 0) pool.push(fragmentProgress[0]);
  if (found > 1) pool.push(fragmentProgress[1]);
  if (found > 2) pool.push(fragmentProgress[2]);
  if (found > 3) pool.push(fragmentProgress[3]);

  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = { whisperForState };
