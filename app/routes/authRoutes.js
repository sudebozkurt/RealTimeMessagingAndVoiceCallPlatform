const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const uploadMiddleware = require('../../middlewares/uploadMiddleware');

// Auth işlemleri
router.post('/register', uploadMiddleware, authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
