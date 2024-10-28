const express = require('express');
const router = express.Router();
const { getCallHistory } = require('../controllers/callController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Kimlik doğrulama middleware'i

router.get('/history', authenticateToken, getCallHistory);

module.exports = router;