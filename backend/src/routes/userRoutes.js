const express = require('express');
const router = express.Router();

// Minimal placeholder routes for portfolio/demo
router.get('/ping', (req, res) => {
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  res.json({ user: null, message: 'Auth not implemented in demo.' });
});

module.exports = router;

