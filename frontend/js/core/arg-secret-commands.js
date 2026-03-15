// frontend/js/core/arg-secret-commands.js
import { openPromptModal, showToast } from '../ui/ui.js';

async function unlockDevModeViaPhrase() {
  const phrase = await openPromptModal('Enter the phrase the system whispers:');
  if (!phrase) return;

  try {
    const res = await fetch('/api/dev/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phrase }),
    });
    const data = await res.json();
    if (!data.ok) return showToast(data.error || 'The system remains silent.', 'error');

    showToast(data.message, 'success');
    window.dispatchEvent(new CustomEvent('devmode:unlocked', { detail: { devMode: true } }));
  } catch {
    showToast('The system cannot be reached.', 'error');
  }
}

export function registerARGSecretCommands(palette) {
  palette.registerCommand({
    id: 'devopsos.secret.unlock',
    title: 'Whisper to the system…',
    hidden: true,
    run: unlockDevModeViaPhrase,
  });
}

// ARG: instant frontend recognition
window.addEventListener('devmode:unlocked', () => {
  console.log("%cTHE ROOT IS WITHIN", "color:#00ffaa;font-weight:bold;font-size:16px;");
});

// ARG: repeat phrase response
window.addEventListener('devmode:unlocked', () => {
  document.addEventListener('devopsos:phrase-entered', (e) => {
    const phrase = (e.detail && e.detail.phrase || '').trim().toUpperCase();
    if (phrase === 'THE ROOT IS WITHIN') {
      console.log('You already know.');
    }
  });
});
