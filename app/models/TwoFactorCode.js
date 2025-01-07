const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig'); // Veritabanı bağlantısı dosyanız

const TwoFactorCode = sequelize.define('TwoFactorCode', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'ID',     
        },
        onDelete: 'CASCADE', 
    },
    code: {
        type: DataTypes.STRING(6),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'twofactorcodes', 
    timestamps: false, 
});

module.exports = TwoFactorCode;
