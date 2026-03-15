// frontend/js/core/arg-terminal.js
import { showToast } from '../ui/ui.js';

export function registerARGTerminalCommands(terminal) {
  terminal.registerCommand('whisper', async (args, term) => {
    term.println('The system speaks only to those who listen.');
  });

  terminal.registerCommand('unlock', async (args, term) => {
    const phrase = args.join(' ');
    if (!phrase) return term.println('Usage: unlock <phrase>');

    try {
      const res = await fetch('/api/dev/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase }),
      });
      const data = await res.json();
      if (!data.ok) return term.println(data.error || 'The system remains silent.');

      term.println(data.message);
      showToast('Developer mode unlocked.', 'success');
      window.dispatchEvent(new CustomEvent('devmode:unlocked', { detail: { devMode: true } }));
    } catch {
      term.println('The system cannot be reached.');
    }
  });
}
