const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig'); // Veritabanı bağlantısını içeren dosya

const LoginRegisterLog = sequelize.define('LoginRegisterLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'ID',
        },
        onDelete: 'SET NULL',
    },
    operation: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ip_address: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    tableName: 'LoginRegisterLogs',
    timestamps: false,
});

module.exports = LoginRegisterLog;
