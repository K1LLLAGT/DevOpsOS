export const EventBuffer = {
  events: [],
  max: 500,

  push(event) {
    this.events.push(event);
    if (this.events.length > this.max) {
      this.events.shift();
    }
  }
};
