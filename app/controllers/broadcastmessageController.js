const BroadcastMessage = require('../models/BroadcastMessage');

// Broadcast mesaj gönderme
exports.sendBroadcastMessage = async (io, message) => {
    try {
        const newMessage = await BroadcastMessage.create({
            senderID: message.senderID,
            message: message.content,
            type: 'broadcast',
        });

        io.emit('receiveBroadcast', newMessage); // Mesajı tüm istemcilere gönder
        console.log('Broadcast mesaj veritabanına kaydedildi:', newMessage);
    } catch (error) {
        console.error('Mesaj gönderim hatası:', error);
    }
};

// Geçmiş broadcast mesajlarını al
exports.getBroadcastMessages = async (req, res) => {
    try {
        const messages = await BroadcastMessage.findAll({
            order: [['date', 'ASC']],
        });

        if (!res.headersSent) {
            return res.status(200).json(messages); // Tek yanıt gönder
        }
    } catch (error) {
        console.error('Mesajları alırken hata oluştu:', error);
        if (!res.headersSent) {
            res.status(500).send('Mesajları alırken hata oluştu.');
        }
    }
};


