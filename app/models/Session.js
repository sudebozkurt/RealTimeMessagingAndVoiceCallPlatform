const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig'); // Doğru yolu kullanın

const Session = sequelize.define('Session', {
  UUID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Sessions', // Tablo adını açıkça belirtin
  timestamps: false, // Eğer Sequelize'ın default timestamp'lerini kullanmıyorsanız
});

module.exports = Session;
