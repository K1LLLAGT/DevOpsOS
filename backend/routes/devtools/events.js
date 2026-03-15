const bus = require("../../events/bus");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = event => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  // Send initial handshake
  send({ type: "devtools.connected", time: Date.now() });

  // Subscribe to wildcard event stream
  const handler = event => send(event);
  bus.on("event.*", handler);

  req.on("close", () => {
    bus.off("event.*", handler);
  });
};
