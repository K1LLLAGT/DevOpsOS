import { exec } from 'child_process';

export function getProcessList(callback) {
  exec("ps -eo pid,ppid,cmd,%cpu,%mem --sort=-%cpu", (err, stdout) => {
    if (err) {
      callback([]);
      return;
    }

    const lines = stdout.trim().split("\n").slice(1);

    const processes = lines.map(line => {
      const parts = line.trim().split(/\s+/, 5);
      return {
        pid: parts[0],
        ppid: parts[1],
        cmd: parts[2],
        cpu: parts[3],
        mem: parts[4]
      };
    });

    callback(processes);
  });
}
