const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');
const User = require('./User'); // User modelini dahil edin

const BroadcastMessage = sequelize.define('BroadcastMessage', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    senderID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING, 
        defaultValue: 'broadcast', 
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'BroadcastMessages',
    timestamps: true,
});

// User ile ilişkilendirme
BroadcastMessage.belongsTo(User, { foreignKey: 'senderID', as: 'sender' });

module.exports = BroadcastMessage;
