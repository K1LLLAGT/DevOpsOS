import { createPty } from './pty.js';

class PtyManager {
  constructor() {
    this.sessions = new Map();
  }

  start(id, cols, rows) {
    const term = createPty('/bin/bash', cols, rows);
    this.sessions.set(id, term);
    return term;
  }

  input(id, data) {
    const term = this.sessions.get(id);
    if (term) term.write(data);
  }

  resize(id, cols, rows) {
    const term = this.sessions.get(id);
    if (term) term.resize(cols, rows);
  }

  kill(id) {
    const term = this.sessions.get(id);
    if (term) {
      term.kill();
      this.sessions.delete(id);
    }
  }
}

export const ptyManager = new PtyManager();
