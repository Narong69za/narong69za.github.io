const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  res.json({ status: 'AI READY' });
});

module.exports = router;
