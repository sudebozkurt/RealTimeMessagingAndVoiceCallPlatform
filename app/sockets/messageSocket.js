const User = require('../models/User');
const Message = require('../models/Messages');
const BroadcastMessage = require('../models/BroadcastMessage');
const broadcastmessageController = require('../controllers/broadcastmessageController');

// Kullanıcıların socket bağlantılarını takip etmek için bir nesne
const userSockets = {};
const activeChats = {};
const handleMessagingSockets = (io) => {
    io.on('connection', (socket) => {
        socket.on('register-user', async (userId) => {
            userSockets[userId] = socket.id;
        
            // Kullanıcının almadığı mesajları `delivered` olarak işaretle
            const undeliveredMessages = await Message.findAll({
                where: {
                    receiverID: userId,
                    status: 'sent',
                },
            });
        
            for (const message of undeliveredMessages) {
                message.status = 'delivered';
                await message.save();
        
                // Gönderen kullanıcının socket ID'sini al
                const senderSocketId = userSockets[message.senderID];
                if (senderSocketId) {
                    io.to(senderSocketId).emit('message-delivered', { messageId: message.id });
                }
            }
        
            console.log(`Kullanıcı ${userId}, socket ID ${socket.id} ile kayıt oldu.`);
        });        

        // Kullanıcının aktif sohbetini kaydet
        socket.on('active-chat', async ({ userId, contactId }) => {
            activeChats[userId] = contactId;
        
            const unreadMessages = await Message.findAll({
                where: {
                    receiverID: userId,
                    senderID: contactId,
                    status: 'delivered',
                },
            });
        
            for (const message of unreadMessages) {
                message.status = 'read';
                await message.save();
        
                // Gönderen kullanıcıya mesajın okunduğunu bildir
                const senderSocketId = userSockets[message.senderID];
                if (senderSocketId) {
                    io.to(senderSocketId).emit('message-read', { messageId: message.id });
                }
            }
        
            console.log(`Kullanıcı ${userId}, ${contactId} ile aktif sohbette.`);
        });
        
    
        // Kullanıcı bağlantıyı keserse aktif sohbeti kaldır
        socket.on('disconnect', () => {
            for (const userId in activeChats) {
                if (activeChats[userId] === socket.id) {
                    delete activeChats[userId];
                    console.log(`Kullanıcı ${userId} aktif sohbetten kaldırıldı.`);
                    break;
                }
            }
        });

        // Mesaj gönder
        socket.on('send-message', async (data) => {
            try {
                const { senderID, receiverID, message, type } = data;

                // Mesajı veritabanına kaydet
                const newMessage = await Message.create({
                    senderID,
                    receiverID,
                    message,
                    type,
                    status: 'sent',
                });

                const receiverSocketId = userSockets[receiverID];
                const isReceiverActive = activeChats[receiverID] === senderID;

                if (receiverSocketId) {
                    if (isReceiverActive) {
                        // Eğer alıcı aktifse mesajı anında gönder
                        io.to(receiverSocketId).emit('receive-message', {
                            ID: newMessage.id,
                            senderID: newMessage.senderID,
                            receiverID: newMessage.receiverID,
                            message: newMessage.message,
                            status: 'delivered',
                            date: newMessage.createdAt,
                        });
                        newMessage.status = 'delivered';
                    } else {
                        // Eğer alıcı aktif değilse sadece bildirim gönder
                        io.to(receiverSocketId).emit('new-message-notification', {
                            senderID,
                            message,
                        });
                    }
                }

                await newMessage.save(); // Mesaj durumunu kaydet
            } catch (error) {
                console.error('Mesaj gönderim hatası:', error);
            }
        });
      
        

        // Broadcast mesajlar
        socket.on('broadcastMessage', async (data) => {
            try {
                const { senderID, content } = data;
                const newMessage = await BroadcastMessage.create({
                    senderID,
                    message: content,
                    type: 'broadcast',
                });
                io.emit('receiveBroadcast', newMessage);
                console.log('Broadcast mesaj gönderildi:', newMessage);
            } catch (error) {
                console.error('Broadcast mesaj gönderim hatası:', error);
            }
        });        
        

        // Mesaj okundu
        socket.on('message-delivered', async (data) => {
            const { messageId } = data;
            try {
                const message = await Message.findByPk(messageId);
                if (message) {
                    message.status = 'delivered';
                    await message.save();
        
                    // Gönderen kullanıcıya "delivered" eventi gönder
                    const senderSocketId = userSockets[message.senderID];
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('message-delivered', { messageId: message.id });
                    }
                }
            } catch (error) {
                console.error('Delivered durum güncelleme hatası:', error);
            }
        });        
        
        socket.on('message-read', async ({ messageId }) => {
            const message = await Message.findByPk(messageId);
            if (message) {
                message.status = 'read';
                await message.save();
                io.to(userSockets[message.senderID]).emit('message-read', { messageId });
            }
        });         
    });
};

module.exports = handleMessagingSockets;
