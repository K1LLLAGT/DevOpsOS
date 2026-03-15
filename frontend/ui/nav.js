/* ui/nav.js */

export function initNav() {
    const items = document.querySelectorAll("[data-panel]");

    items.forEach(item => {
        item.addEventListener("click", () => {
            const panel = item.getAttribute("data-panel");

            // Update active state
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Load panel
            import("../js/core/panels.js").then(mod => {
                mod.loadPanel(panel);
            });
        });
    });
}

// --- Marketplace Panel ---
NAV_ITEMS.push({
    id: "marketplace",
    label: "Marketplace",
    icon: "storefront",   // or any icon you prefer
    panel: "marketplace"
});
