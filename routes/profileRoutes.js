const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
