export function startEventStream(onEvent) {
  const es = new EventSource("/devtools/events");

  es.onmessage = msg => {
    try {
      const event = JSON.parse(msg.data);
      onEvent(event);
    } catch {}
  };
}
