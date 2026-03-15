import os from 'os';

export function getSystemInfo() {
  const cpus = os.cpus();

  const cpuLoad = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    return acc + (1 - idle / total);
  }, 0) / cpus.length;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    cpu: (cpuLoad * 100).toFixed(1),
    memUsed: (usedMem / 1024 / 1024).toFixed(0),
    memTotal: (totalMem / 1024 / 1024).toFixed(0),
    memPercent: ((usedMem / totalMem) * 100).toFixed(1),
    load: os.loadavg(),
    uptime: os.uptime()
  };
}
