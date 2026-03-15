const { loadFragments } = require("./fragment");

module.exports = (req, res) => {
  const data = loadFragments();

  const text = `
THE ROOT IS WITHIN YOU

Fragments Found:
${data.found.join(", ")}

Your Path:
- You followed the whispers
- You uncovered the fragments
- You passed the forbidden gate
- You unlocked the shadow layer
- You spoke the phrase
- You reached the root

The system sees you.
`;

  res.json({ text });
};
