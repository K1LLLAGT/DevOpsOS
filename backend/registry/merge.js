module.exports = function mergeRegistries(local, remote) {
  const map = new Map();

  // Add local entries
  for (const p of local.plugins) {
    map.set(p.name, p);
  }

  // Add/override with remote entries
  for (const p of remote.plugins) {
    map.set(p.name, p);
  }

  return {
    plugins: [...map.values()]
  };
};
