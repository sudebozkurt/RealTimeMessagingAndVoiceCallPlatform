const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

// Sequelize ile MySQL veritabanı bağlantısını oluşturuyoruz
const sequelize = new Sequelize('chatApp', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Kullanıcı modelini tanımlıyoruz
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Yalnızca kullanıcı tablosu için timestamp istemiyoruz
});

const app = express();
app.use(bodyParser.json());

// Veritabanı bağlantısını doğruluyoruz
sequelize.authenticate()
    .then(() => console.log('MySQL bağlantısı başarılı'))
    .catch(err => console.log('MySQL bağlantı hatası: ', err));

// Kullanıcı kaydı API'si
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır!" });
    }

    // Kullanıcıyı veritabanında arıyoruz
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta zaten kullanılıyor!" });
    }

    // Şifreyi güvenli hale getiriyoruz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcıyı kaydediyoruz
    try {
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Bir hata oluştu!" });
    }
});

// Sunucuyu başlatıyoruz
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});
