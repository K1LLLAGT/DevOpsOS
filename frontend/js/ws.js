class DevOpsOSBackend {
  constructor(url = "ws://localhost:8765") {
    this.url = url;
    this.ws = null;
    this.handlers = {};
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[WS] Connected to backend");
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const handler = this.handlers[msg.type];
      if (handler) handler(msg.payload || msg);
    };

    this.ws.onclose = () => {
      console.log("[WS] Disconnected");
      setTimeout(() => this.connect(), 1000);
    };
  }

  on(type, callback) {
    this.handlers[type] = callback;
  }

  send(type, payload = {}) {
    this.ws.send(JSON.stringify({ type, payload }));
  }
}

window.backend = new DevOpsOSBackend();
window.backend.connect();
