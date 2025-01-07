const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');

// 2FA kodu gönderme
router.post('/send-2fa-code', twoFactorController.send2FACode);

// 2FA kodunu doğrulama
router.post('/verify-2fa-code', twoFactorController.verify2FACode);

module.exports = router;
