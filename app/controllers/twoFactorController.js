const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const LoginRegisterLog = require('../models/LoginRegisterLog');
const TwoFactorCode = require('../models/TwoFactorCode');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 2FA kodu gönderme
exports.send2FACode = async (req, res) => {
    try {
        const { email } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // 6 haneli rastgele bir kod oluştur
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 2 * 60 * 1000); // 2 dakika geçerli

        // Eski kodları temizle
        await TwoFactorCode.destroy({ where: { userID: user.id } });

        // Yeni kodu kaydet
        await TwoFactorCode.create({
            userID: user.id,
            code,
            expires_at,
        });

        // E-posta gönderimi
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // .env'deki EMAIL_USER
                pass: process.env.EMAIL_PASS, // .env'deki EMAIL_PASS
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '2FA Kodunuz',
            text: `Giriş yapabilmeniz için doğrulama kodunuz: ${code}. Bu kod 2 dakika geçerlidir.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: '2FA kodu gönderildi.' });
    } catch (error) {
        console.error('2FA gönderim hatası:', error);
        res.status(500).json({ message: 'Kod gönderilemedi. Lütfen tekrar deneyiniz.' });
    }
};

// 2FA kodunu doğrulama
exports.verify2FACode = async (req, res) => {
    try {
        const { userId, code } = req.body;

         // Kullanıcıyı bul
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Kullanıcı ve 2FA kodunu kontrol et
        const validCode = await TwoFactorCode.findOne({
            where: {
                userID: userId,
                code,
                expires_at: { [Op.gt]: new Date() }, // Süresi dolmamış olmalı
            },
        });

        if (!validCode) {
            return res.status(401).json({ message: 'Kod geçersiz veya süresi dolmuş.' });
        }

        // Kod doğruysa session oluştur
        const sessionToken = uuidv4();
        const sessionExpiry = new Date(Date.now() + (process.env.SESSION_EXPIRY || 60 * 60 * 1000));

        await Session.create({
            UUID: uuidv4(),
            userID: userId,
            token: sessionToken,
            expires_at: sessionExpiry,
        });

        res.cookie('sessionToken', sessionToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'Strict',
            maxAge: process.env.SESSION_EXPIRY || 60 * 60 * 1000,
        });

        const redirectPath = user.role === 'admin' ? '/admin' : '/index';
        res.status(200).json({ redirect: redirectPath });
    } catch (error) {
        console.error('2FA doğrulama hatası:', error);
        res.status(500).json({ message: 'Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyiniz.' });
    }
};



