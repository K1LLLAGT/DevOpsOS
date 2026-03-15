const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ROOT = process.env.DEVOPSOS_ROOT || path.join(process.env.HOME, "DevOpsOS");
const sourcesPath = path.join(ROOT, "backend/marketplace/sources.json");
const mergedPath = path.join(ROOT, "backend/marketplace/merged.json");

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

async function loadCatalog(source) {
  try {
    if (source.type === "local") {
      const p = path.join(ROOT, source.path);
      return JSON.parse(fs.readFileSync(p, "utf8"));
    }

    if (source.type === "github" || source.type === "http") {
      const raw = await fetchURL(source.url);
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[ERROR] Failed to load catalog:", source.id, err);
    return { plugins: [] };
  }
}

(async () => {
  const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8")).sources;

  let merged = {};

  for (const src of sources) {
    const catalog = await loadCatalog(src);

    for (const plugin of catalog.plugins || []) {
      const existing = merged[plugin.id];

      if (!existing) {
        merged[plugin.id] = plugin;
      } else {
        // pick highest version
        if (plugin.version > existing.version) {
          merged[plugin.id] = plugin;
        }
      }
    }
  }

  const final = { plugins: Object.values(merged) };
  fs.writeFileSync(mergedPath, JSON.stringify(final, null, 2));

  console.log("[MERGE] Catalogs merged:", final.plugins.length, "plugins");
})();
