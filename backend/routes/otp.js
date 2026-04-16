// Phone login with OTP has been disabled
const express = require('express');
const router = express.Router();

// Disabled endpoint - returns error
router.post('/send', async (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Phone login feature has been disabled' 
  });
});

// Disabled endpoint - returns error
router.post('/verify', async (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Phone login feature has been disabled' 
  });
});

module.exports = router;