export const PANELS = [
  {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    path: "panels/terminal/terminal.html"
  },
  {
    id: "editor",
    title: "Editor",
    icon: "edit",
    path: "panels/editor/editor.html"
  },
  {
    id: "system",
    title: "System Monitor",
    icon: "monitor_heart",
    path: "panels/system/system.html"
  },
  {
    id: "processes",
    title: "Processes",
    icon: "list",
    path: "panels/processes/processes.html"
  },
  {
    id: "marketplace",
    title: "Marketplace",
    icon: "storefront",
    path: "panels/marketplace/marketplace.html"
  }
];
PANELS["settings"] = {
  name: "Settings",
  path: "panels/settings/settings.html",
  script: "panels/settings/settings.js",
  style: "panels/settings/settings.css"
};
function enablePanelResize(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const handle = document.createElement("div");
  handle.className = "resize-handle";
  panel.appendChild(handle);

  let startY = 0;
  let startHeight = 0;

  handle.addEventListener("mousedown", e => {
    startY = e.clientY;
    startHeight = panel.offsetHeight;

    document.onmousemove = e2 => {
      const newHeight = startHeight + (e2.clientY - startY);
      panel.style.height = newHeight + "px";

      PREFS.layout.sizes[panelId] = newHeight;

      fetch("/prefs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout: PREFS.layout })
      });
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  });
}
document.addEventListener("DOMContentLoaded", () => {
  Object.entries(PREFS.layout.sizes).forEach(([panelId, height]) => {
    const panel = document.getElementById(panelId);
    if (panel) panel.style.height = height + "px";
  });
});
PANELS["devtools"] = {
  name: "Developer Tools",
  path: "panels/devtools/devtools.html",
  script: "panels/devtools/devtools.js",
  style: "panels/devtools/devtools.css"
};
PANELS["plugins"] = {
  name: "Plugins",
  path: "panels/plugins/plugins.html",
  script: "panels/plugins/plugins.js",
  style: "panels/plugins/plugins.css"
};
PANELS["marketplace"] = {
  name: "Marketplace",
  path: "panels/marketplace/marketplace.html",
  script: "panels/marketplace/marketplace.js",
  style: "panels/marketplace/marketplace.css"
};
PANELS["devtools"] = {
  name: "DevTools",
  path: "panels/devtools/devtools.html",
  script: "panels/devtools/devtools.js",
  style: "panels/devtools/devtools.css"
};
PANELS["settings"] = {
  name: "Settings",
  path: "panels/settings/settings.html",
  script: "panels/settings/settings.js",
  style: "panels/settings/settings.css"
};
PANELS["notifications"] = {
  name: "Notifications",
  path: "panels/notifications/notifications.html",
  script: "panels/notifications/notifications.js",
  style: "panels/notifications/notifications.css"
};
document.addEventListener("panel.open", e => {
  const { panel, payload } = e.detail;
  loadPanel(panel, payload);
});
PANELS["settings"] = {
  name: "Settings",
  path: "panels/settings/settings.html",
  script: "panels/settings/settings.js",
  style: "panels/settings/settings.css"
};
PANELS["installer"] = {
  name: "Installer",
  path: "panels/installer/installer.html",
  script: "panels/installer/installer.js",
  style: "panels/installer/installer.css"
};
PANELS["timeline"] = {
  name: "Activity Timeline",
  path: "deepos/timeline/timeline.html",
  script: "deepos/timeline/timeline.js",
  style: "deepos/timeline/timeline.css"
};
PANELS["git"] = {
  name: "Git",
  path: "devpower/git/git.html",
  script: "devpower/git/git.js",
  style: "devpower/git/git.css"
};
PANELS["insights"] = {
  name: "Insights",
  path: "panels/insights/insights.html",
  script: "panels/insights/insights.js",
  style: "panels/insights/insights.css"
};
PANELS["license"] = {
  name: "License",
  path: "panels/license/license.html",
  script: "panels/license/license.js",
  style: "panels/license/license.css"
};

PANELS["marketplace"] = {
  name: "Marketplace",
  path: "panels/marketplace/marketplace.html",
  script: "panels/marketplace/marketplace.js",
  style: "panels/marketplace/marketplace.css"
};

PANELS["crashlog"] = {
  name: "Crash Logs",
  path: "panels/crashlog/crashlog.html",
  script: "panels/crashlog/crashlog.js",
  style: "panels/crashlog/crashlog.css"
};
PANELS["clues"] = {
  name: "Clues",
  path: "panels/clues/clues.html",
  script: "panels/clues/clues.js",
  style: "panels/clues/clues.css"
};

PANELS["unlock"] = {
  name: "Unlock",
  path: "panels/unlock/unlock.html",
  script: "panels/unlock/unlock.js",
  style: "panels/unlock/unlock.css"
};
PANELS["verify"] = {
  name: "Verification",
  path: "panels/verify/verify.html",
  script: "panels/verify/verify.js",
  style: "panels/verify/verify.css"
};
