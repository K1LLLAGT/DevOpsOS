module.exports = {
  evaluate(events) {
    const insights = [];

    // Rule: user opens same panel repeatedly
    const panelCounts = {};
    events.forEach(e => {
      if (e.type === "open_panel") {
        panelCounts[e.panel] = (panelCounts[e.panel] || 0) + 1;
      }
    });

    Object.keys(panelCounts).forEach(panel => {
      if (panelCounts[panel] >= 4) {
        insights.push({
          id: "insight:panel_repeat:" + panel,
          title: "Frequent panel usage",
          subtitle: "You often open the " + panel + " panel",
          category: "Insight",
          action: "open_panel",
          payload: { id: panel },
          score: 0.7
        });
      }
    });

    return insights;
  }
};
