const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Kullanıcı kayıt işlemi
exports.registerUser = async (req, res) => {
    try {
        const { name, surname, username, password, email, security_question, security_answer } = req.body;
        const profilePic = req.file; // Yüklenen fotoğraf dosyası

        // Tüm alanlar doldurulmuş mu kontrol et
        if (!name || !surname || !username || !password || !email || !security_question || !security_answer) {
            return res.status(400).json({ message: 'Tüm alanları doldurmanız gerekmektedir.' });
        }

        // Kullanıcı adı veya e-posta zaten kayıtlı mı kontrol et
        const existingUser = await User.findOne({ where: { username } });
        const existingEmail = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
        }
        if (existingEmail) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
        }

        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(password, 10);

        // UUID oluştur
        const uuid = uuidv4();

        // Profil fotoğrafını kaydet
        let photoPath = null;
        if (profilePic) {
            // Dosya ismini hash olmadan kaydet
            const fileExtension = path.extname(profilePic.originalname); // Dosya uzantısı
            const hashedFileName = `${uuid}${fileExtension}`;
            const uploadPath = path.join(__dirname, '../../uploads/profilePhotos', hashedFileName);

            // Dosya dizini kontrol et ve yoksa oluştur
            const directoryPath = path.join(__dirname, '../../uploads/profilePhotos');
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            fs.writeFileSync(uploadPath, profilePic.buffer); // Fotoğrafı kaydet
            photoPath = `/uploads/profilePhotos/${hashedFileName}`; // Fotoğraf yolunu belirle
        }

        // Yeni kullanıcı oluştur
        const newUser = await User.create({
            name,
            surname,
            username,
            password: hashedPassword,
            email,
            role: 'user', // Varsayılan rol "user"
            photo: photoPath, // Fotoğraf yolu
            uuid,
            security_question,
            security_answer,
        });

        // Başarı yanıtı döndür
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
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyiniz.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Kullanıcıyı bul
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                ],
            },
        });

        // Kullanıcı bulunamadıysa hata döndür
        if (!user) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya e-posta' });
        }

        // Şifre doğrulama
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz şifre' });
        }

        // Session Token oluştur
        const sessionToken = uuidv4();
        const sessionExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 saat geçerli

        // Session kaydı yap
        await Session.create({
            UUID: uuidv4(),
            userID: user.id,
            token: sessionToken,
            expires_at: sessionExpiry,
        });

        // Çereze token'ı ekle
        res.cookie('sessionToken', sessionToken, {
            httpOnly: true, // Çerez sadece sunucudan erişilebilir
            secure: process.env.NODE_ENV === 'production', // HTTPS üzerinde çalışır
            maxAge: 60 * 60 * 1000, // 1 saat geçerli
        });

        // Kullanıcı rolüne göre yönlendir
        if (user.role === 'admin') {
            return res.status(200).json({ redirect: '/admin' });
        } else {
            return res.status(200).json({ redirect: '/index' });
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası. Lütfen tekrar deneyin.' });
    }
};
