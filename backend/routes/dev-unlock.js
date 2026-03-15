// backend/routes/dev-unlock.js
const express = require('express');
const router = express.Router();
const { isDevMode, tryUnlockDevMode, FINAL_PHRASE } = require('../core/devmode');

router.get('/status', (req, res) => {
  res.json({
    devMode: isDevMode(),
    hint: isDevMode() ? null : 'The system opens to those who see.',
  });
});

router.post('/unlock', (req, res) => {
  const { phrase } = req.body || {};
  if (!phrase) return res.status(400).json({ ok: false, error: 'Missing phrase.' });

  const unlocked = tryUnlockDevMode(phrase);
  if (!unlocked) return res.status(403).json({ ok: false, error: 'The system remains silent.' });

  return res.json({ ok: true, devMode: true, message: 'The inner root awakens.' });
});

module.exports = router;
