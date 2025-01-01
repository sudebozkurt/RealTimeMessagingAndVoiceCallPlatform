const express = require('express');
const router = express.Router();
const broadcastmessageController = require('../controllers/broadcastmessageController');

// Broadcast mesajları alma
router.get('/', broadcastmessageController.getBroadcastMessages);

module.exports = router;
