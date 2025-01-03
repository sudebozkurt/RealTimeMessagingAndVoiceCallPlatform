const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.TEXT, // Mesajın şifreli hali uzun olabileceği için TEXT kullanıldı
        allowNull: false, // Şifreli mesaj her zaman gerekli
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false, // Tip zorunlu
        validate: {
            isIn: [['text', 'image', 'video']], // Mesaj türlerini sınırlayabilirsiniz
        },
    },
    receiverID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false, // Receiver her zaman olmalı
    },
    senderID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false, // Sender her zaman olmalı
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Varsayılan olarak şu anki zaman
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'sent', // Varsayılan durum "sent"
    },
}, {
    tableName: 'Messages',
    timestamps: true,      // Otomatik zaman damgaları
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    paranoid: true,         // Silinmiş mesajlar için "deleted_at" alanı
    deletedAt: 'deleted_at',
});

module.exports = Message;
