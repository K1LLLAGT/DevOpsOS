module.exports = {
  correlate(events) {
    const insights = [];

    // Example: frequent Git usage → suggest Git panel pinning
    const gitOps = events.filter(e => e.type === "git_op").length;
    if (gitOps > 5) {
      insights.push({
        id: "insight:git_usage",
        title: "You use Git frequently",
        subtitle: "Consider pinning the Git panel for faster access",
        category: "Insight",
        action: "open_panel",
        payload: { id: "git" },
        score: 0.9
      });
    }

    // Example: frequent file opens in same directory
    const dirs = {};
    events.forEach(e => {
      if (e.type === "open_file") {
        const d = e.path.split("/").slice(0, -1).join("/");
        dirs[d] = (dirs[d] || 0) + 1;
      }
    });

    Object.keys(dirs).forEach(d => {
      if (dirs[d] > 3) {
        insights.push({
          id: "insight:dir_focus:" + d,
          title: "Focused work detected",
          subtitle: "You’ve been working heavily in: " + d,
          category: "Insight",
          action: "open_file",
          payload: { path: d },
          score: 0.8
        });
      }
    });

    return insights;
  }
};
