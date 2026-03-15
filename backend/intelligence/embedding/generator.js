// Local embedding generator.
// Deterministic: same input → same vector.
// Uses token hashing + sinusoidal transforms.

const crypto = require("crypto");
const tokenizer = require("../tokenizer/tokenizer");

const DIM = 64;

function hashToken(token) {
  const h = crypto.createHash("sha256").update(token).digest();
  const out = new Array(DIM);
  for (let i = 0; i < DIM; i++) {
    out[i] = (h[i] / 255) * 2 - 1;
  }
  return out;
}

function normalize(vec) {
  const mag = Math.sqrt(vec.reduce((s, x) => s + x * x, 0));
  return vec.map(v => v / (mag || 1));
}

module.exports = {
  DIM,

  embed(text) {
    const tokens = tokenizer.tokenize(text);
    if (!tokens.length) return new Array(DIM).fill(0);

    const accum = new Array(DIM).fill(0);

    tokens.forEach((t, idx) => {
      const hv = hashToken(t);
      for (let i = 0; i < DIM; i++) {
        accum[i] += hv[i] * Math.sin((idx + 1) * 0.37);
      }
    });

    return normalize(accum);
  }
};
