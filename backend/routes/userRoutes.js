const express = require('express');
const router = express.Router();

// Basic user routes for future authentication
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile endpoint - to be implemented' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'User login endpoint - to be implemented' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'User registration endpoint - to be implemented' });
});

module.exports = router;