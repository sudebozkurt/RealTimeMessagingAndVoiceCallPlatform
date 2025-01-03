const Message = require('../models/Messages');
//const UserKey = require('../models/UserKey');
const { Op } = require('sequelize');

/**
 * Mesaj gönderme işlemi
 */
const sendMessage = async (req, res) => {
    try {
        const { senderID, receiverID, message, type } = req.body;

        // Gelen veriyi kontrol edin
        console.log('Request Body:', req.body);

        // Şifreli mesajı kaydet
        const newMessage = await Message.create({
            senderID,
            receiverID,
            message,
            type,
        });

        console.log('Mesaj başarıyla gönderildi:', newMessage);

        res.status(201).json({ message: 'Mesaj gönderildi.', data: newMessage });
    } catch (error) {
        console.error('Mesaj gönderim hatası:', error.message || error);
        res.status(500).json({ message: 'Mesaj gönderilemedi.' });
    }
};


/**
 * İki kullanıcı arasındaki tüm mesajları getir
 */
const getMessages = async (req, res) => {
    try {
        const { senderID, receiverID } = req.params;

        // Sender ve receiver arasındaki mesajları al
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderID, receiverID },
                    { senderID: receiverID, receiverID: senderID }
                ],
            },
            order: [['created_at', 'ASC']],
        });
    } catch (error) {
        console.error('Mesaj alma hatası:', error.message || error);
        res.status(500).json({ message: 'Mesajlar alınamadı.' });
    }
};




/**
 * Kullanıcının son mesajlarını getir
 */
const getLastMessages = async (userId) => {
    try {
        const lastMessages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderID: userId },
                    { receiverID: userId },
                ],
            },
            order: [['created_at', 'DESC']], // Son mesaja göre sıralama
        });

        const conversations = {};
        lastMessages.forEach((msg) => {
            const conversationKey =
                msg.senderID === parseInt(userId)
                    ? msg.receiverID
                    : msg.senderID;
        });

        return Object.values(conversations);
    } catch (error) {
        console.error('Son mesajlar alınırken hata oluştu:', error);
        throw new Error('Son mesajlar alınamadı');
    }
};

module.exports = { sendMessage, getMessages, getLastMessages };
