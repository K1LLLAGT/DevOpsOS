// Offline mock payment processor for DevOpsOS Marketplace.
// No real payments — safe, local, deterministic.

module.exports = {
  purchase(pluginId) {
    return {
      ok: true,
      pluginId,
      receipt: "RECEIPT-" + pluginId + "-" + Date.now()
    };
  }
};
