import pty from 'node-pty';

export function createPty(shell = '/bin/bash', cols = 80, rows = 24) {
  const term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols,
    rows,
    cwd: process.env.HOME,
    env: process.env
  });

  return term;
}
