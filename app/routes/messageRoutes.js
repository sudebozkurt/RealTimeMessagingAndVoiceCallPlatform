const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // Sequelize operator'ü
const { sendMessage, getMessages, getLastMessages, updateMessageStatus } = require('../controllers/messageController');
const authenticateUser = require('../../middlewares/authMiddleware'); // Middleware'ı import et
const Message = require('../models/Messages'); // Message modelini import et

// Mesaj gönderme endpoint'i, authenticateUser middleware'i ile korunuyor
router.post('/send', authenticateUser, sendMessage);

// Mesaj geçmişini getiren endpoint
router.get('/history/:senderID/:receiverID', authenticateUser, async (req, res) => {
    const { senderID, receiverID } = req.params;

    // senderID ve receiverID geçerli mi kontrol et
    if (!senderID || !receiverID) {
        return res.status(400).json({ error: 'Sender ID ve Receiver ID gereklidir.' });
    }

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderID, receiverID },
                    { senderID: receiverID, receiverID: senderID },
                ],
            },
            order: [['created_at', 'ASC']], // Tarih sırasına göre sıralama
        });

        // Eğer mesaj bulunamazsa boş bir dizi döndür
        if (messages.length === 0) {
            return res.json([]); // Boş dizi döndürüyoruz
        }

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch message history' });
    }
});

// Son mesajlar endpoint'i
router.get('/last-messages/:userId', authenticateUser, async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID gereklidir.' });
    }

    try {
        const lastMessages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderID: userId },
                    { receiverID: userId }
                ]
            },
            order: [['created_at', 'DESC']], // Son mesaja göre sıralama
        });

        const conversations = {};
        lastMessages.forEach((msg) => {
            const conversationKey =
                msg.senderID === parseInt(userId)
                    ? msg.receiverID
                    : msg.senderID;

            if (!conversations[conversationKey]) {
                conversations[conversationKey] = msg;
            }
        });

        res.status(200).json(Object.values(conversations));
    } catch (error) {
        console.error('Error fetching last messages:', error);
        res.status(500).json({ error: 'Failed to fetch last messages' });
    }
});

router.post('/update-status', authenticateUser, updateMessageStatus);



module.exports = router;
