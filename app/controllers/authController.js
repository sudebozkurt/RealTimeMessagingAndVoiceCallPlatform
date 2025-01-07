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
const { send2FACode } = require('./twoFactorController'); 
require('dotenv').config();

exports.registerUser = async (req, res) => {
    try {
        const { name, surname, username, password, email, security_question, security_answer } = req.body;
        const profilePic = req.file;

        // Gerekli alanların kontrolü
        if (!name || !surname || !username || !password || !email || !security_question || !security_answer) {
            return res.status(400).json({ message: 'Tüm alanları doldurmanız gerekmektedir.' });
        }

        // Kullanıcı ve e-posta kontrolü
        const [existingUser, existingEmail] = await Promise.all([
            User.findOne({ where: { username } }),
            User.findOne({ where: { email } }),
        ]);

        if (existingUser || existingEmail) {
            await logOperation(null, 'register', 'failure', req.ip);
            return res.status(400).json({ message: 'Kullanıcı adı veya e-posta zaten kayıtlı.' });
        }

        // Şifrelerin hashlenmesi
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecurityAnswer = await bcrypt.hash(security_answer, 10);

        // Fotoğraf yükleme ve dosya kaydetme işlemi
        let photoPath = null;

        if (profilePic) {
            console.log('Yüklenen Dosya:', profilePic);
        
            const hashedFileName = profilePic.filename; // Multer tarafından oluşturulan dosya adı
            const uploadPath = profilePic.path;
        
            // Kaydedilen dosyanın doğru bir şekilde işlendiğinden emin olun
            if (fs.existsSync(uploadPath)) {
                console.log('Dosya başarıyla kaydedildi:', uploadPath);
                photoPath = `/uploads/profilePhotos/${hashedFileName}`;
            } else {
                console.error('Dosya kaydedilemedi:', uploadPath);
                throw new Error('Dosya kaydedilemedi.');
            }
        } else {
            console.log('Dosya yüklenmedi. Fotoğraf null olarak kalacak.');
        }
               

        // Kullanıcı oluşturma
        const newUser = await User.create({
            name,
            surname,
            username,
            password: hashedPassword,
            email,
            role: 'user',
            photo: photoPath,
            uuid: uuidv4(),
            security_question,
            security_answer: hashedSecurityAnswer,
        });

        await logOperation(newUser.id, 'register', 'success', req.ip);

        // Yanıt
        res.status(201).json({
            redirect: '/login',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                uuid: newUser.uuid,
            },
        });
    } catch (error) {
        await logOperation(null, 'register', 'failure', req.ip);
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyiniz.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username, deleted_at: null },
        });

        if (!user) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
        }

        // 2FA kodu oluştur ve kaydet
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 2 * 60 * 1000); // 2 dakika geçerli

        await TwoFactorCode.destroy({ where: { userID: user.id } }); // Eski kodları sil
        await TwoFactorCode.create({
            userID: user.id,
            code,
            expires_at,
        });

        // Kullanıcının e-posta adresine 2FA kodu gönder
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '2FA Kodunuz',
            text: `Giriş yapabilmeniz için doğrulama kodunuz: ${code}. Bu kod 2 dakika geçerlidir.`,
        };

        await transporter.sendMail(mailOptions);

        // Kullanıcıyı 2FA sayfasına yönlendir
        res.status(200).json({
            redirect: '/2fa',
            userId: user.id,
        });
    } catch (error) {
        console.error('Login sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
};


async function logOperation(user_id, operation, status, ip_address) {
    try {
        await LoginRegisterLog.create({
            user_id,
            operation,
            status,
            ip_address,
        });
        console.log(`Log kaydedildi: ${operation} (${status})`);
    } catch (error) {
        console.error('Loglama hatası:', error);
    }
}

