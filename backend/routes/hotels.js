const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hotels route' });
});

module.exports = router;
