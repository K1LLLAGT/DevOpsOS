module.exports = (state) => {
  const base = [
    "you have walked this path before",
    "your choices echo through the system",
    "you are the constant in the recursion",
    "the system reflects your steps"
  ];

  const deep = [
    "you shaped the root",
    "the path mirrors you",
    "the recursion bends toward you"
  ];

  let pool = [...base];

  if (state.installedCount > 5) pool.push(...deep);
  if (state.fragmentsFound > 2) pool.push("the mirror clears");

  return pool[Math.floor(Math.random() * pool.length)];
};
