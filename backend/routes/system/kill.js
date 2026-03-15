module.exports = (req, res) => {
  const { pid, signal } = req.body;

  if (!pid) return res.status(400).json({ ok: false, error: "Missing PID" });

  try {
    process.kill(pid, signal || "SIGTERM");
    res.json({ ok: true, killed: pid, signal: signal || "SIGTERM" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Kill failed" });
  }
};
