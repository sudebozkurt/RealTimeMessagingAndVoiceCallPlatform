const express = require('express');
const router = express.Router();
const broadcastmessageController = require('../controllers/broadcastmessageController');

// Broadcast mesajları alma
router.get('/', async (req, res) => {
    try {
        const messages = await broadcastmessageController.getBroadcastMessages(req, res);
        // Burada `res.json(messages)` çağrısı olmamalı çünkü bu işlem controller'da yapılmış olabilir.
    } catch (error) {
        console.error('Mesajlar alınırken hata oluştu:', error);
        if (!res.headersSent) {
            res.status(500).send('Mesajlar alınamadı.');
        }
    }
});

module.exports = router;
