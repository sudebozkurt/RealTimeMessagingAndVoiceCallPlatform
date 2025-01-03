const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const LoginRegisterLog = require('../models/LoginRegisterLog')
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Op } = require('sequelize');
//require('dotenv').config();


exports.registerUser = async (req, res) => {
    try {
        const { name, surname, username, password, email, security_question, security_answer } = req.body;
        const profilePic = req.file;

        if (!name || !surname || !username || !password || !email || !security_question || !security_answer) {
            return res.status(400).json({ message: 'Tüm alanları doldurmanız gerekmektedir.' });
        }

        const [existingUser, existingEmail] = await Promise.all([
            User.findOne({ where: { username } }),
            User.findOne({ where: { email } }),
        ]);

        if (existingUser || existingEmail) {
            await logOperation(null, 'register', 'failure', req.ip);
            return res.status(400).json({ message: 'Kullanıcı adı veya e-posta zaten kayıtlı.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecurityAnswer = await bcrypt.hash(security_answer, 10);

        let photoPath = null;
        if (profilePic) {
            const md5Hash = crypto.createHash('md5').update(profilePic.originalname + Date.now()).digest('hex');
            const fileExtension = path.extname(profilePic.originalname);
            const hashedFileName = `${md5Hash}${fileExtension}`;
            const uploadPath = path.join(__dirname, '../../uploads/profilePhotos', hashedFileName);

            if (!fs.existsSync(path.join(__dirname, '../../uploads/profilePhotos'))) {
                fs.mkdirSync(path.join(__dirname, '../../uploads/profilePhotos'), { recursive: true });
            }

            fs.writeFileSync(uploadPath, profilePic.buffer);
            photoPath = `/uploads/profilePhotos/${hashedFileName}`;
        }

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
            where: {
                [Op.or]: [{ username }],
            },
        });

        if (!user) {
            await logOperation(null, 'login', 'failure', req.ip); // Başarısız giriş loglanır
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await logOperation(user.id, 'login', 'failure', req.ip); // Başarısız giriş loglanır
            return res.status(401).json({ message: 'Geçersiz giriş bilgileri' });
        }

        const sessionToken = uuidv4();
        const sessionExpiry = new Date(Date.now() + (process.env.SESSION_EXPIRY || 60 * 60 * 1000));

        await Session.create({
            UUID: uuidv4(),
            userID: user.id,
            token: sessionToken,
            expires_at: sessionExpiry,
        });

        res.cookie('sessionToken', sessionToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'Strict',
            maxAge: process.env.SESSION_EXPIRY || 60 * 60 * 1000,
        });

        await logOperation(user.id, 'login', 'success', req.ip); // Başarılı giriş loglanır

        const redirectPath = user.role === 'admin' ? '/admin' : '/index';
        return res.status(200).json({
            redirect: redirectPath,
            sessionToken,
        });
    } catch (error) {
        await logOperation(null, 'login', 'failure', req.ip); // Başarısız işlem loglanır
        console.error('Giriş hatası:', error);
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

