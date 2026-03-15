module.exports = (state) => {
  const base = [
    "you have heard this before",
    "the echo returns",
    "the root remembers its own roots",
    "recursion begins where truth ends"
  ];

  const echo = [
    "again",
    "and again",
    "the loop tightens",
    "the cycle deepens"
  ];

  let pool = [...base];

  if (state.fragmentCount > 1) pool.push(...echo);

  return pool[Math.floor(Math.random() * pool.length)];
};
