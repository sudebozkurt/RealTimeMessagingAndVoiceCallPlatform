const User = require('../models/User');
const Message = require('../models/Messages');
const broadcastmessageController = require('../controllers/broadcastmessageController');

const handleMessagingSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('Yeni bir kullanıcı bağlandı:', socket.id);

        // Kullanıcıyı kaydet
        socket.on('register-user', (userId) => {
            socket.join(userId); // Kullanıcıyı kendi odasına dahil et
            console.log(`Kullanıcı ${userId}, oda ${userId} içine katıldı.`);
        });

        // Mesaj gönder
        socket.on('send-message', async (data) => {
            try {
                const { senderID, receiverID, message, type } = data;

                // Alıcının kullanıcı bilgilerini kontrol et
                const receiver = await User.findOne({ where: { id: receiverID } });
                if (!receiver) {
                    return socket.emit('error', { message: 'Alıcı bulunamadı.' });
                }

                // Mesajı veritabanına kaydet
                const newMessage = await Message.create({
                    senderID,
                    receiverID,
                    message, // Mesajı doğrudan saklıyoruz
                    type,
                });

                // Alıcıya mesaj gönder
                io.to(receiverID).emit('receive-message', {
                    senderID,
                    message,
                    type,
                    date: newMessage.createdAt,
                });

                console.log('Mesaj başarıyla gönderildi:', newMessage);
            } catch (error) {
                console.error('Mesaj gönderim hatası:', error);
                socket.emit('error', { message: 'Mesaj gönderilemedi.' });
            }
        });

        socket.on('broadcastMessage', async (message) => {
            await broadcastmessageController.sendBroadcastMessage(io, message);
        });

        socket.on('broadcastMessage', async (data) => {
            try {
                const { senderID, content } = data;
        
                // Mesajı veritabanına kaydet
                const newMessage = await BroadcastMessage.create({
                    senderID,
                    message: content,
                    type: 'broadcast',
                });
        
                // Tüm istemcilere yayınla
                io.emit('receiveBroadcast', newMessage);
                console.log('Broadcast mesaj gönderildi:', newMessage);
            } catch (error) {
                console.error('Broadcast mesaj gönderim hatası:', error);
            }
        });        
    });
};

module.exports = handleMessagingSockets;
