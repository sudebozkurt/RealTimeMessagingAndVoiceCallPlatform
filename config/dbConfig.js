const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chatapp_db', 'root', 'merve2004', { //Don't forget change password!!!
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('MySQL bağlantısı başarılı'))
    .catch(err => console.log('MySQL bağlantı hatası: ', err));

module.exports = sequelize;
