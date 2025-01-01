const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const authenticateUser = require('../../middlewares/authMiddleware'); // Yeni eklendi

// Ana sayfa yönlendirme rotası
router.get('/', async (req, res) => {
    try {
        const { sessionToken } = req.cookies;

        // Eğer çerez yoksa login sayfasına yönlendir
        if (!sessionToken) {
            return res.redirect('/login');
        }

        // Session veritabanında token kontrolü
        const session = await Session.findOne({ where: { token: sessionToken } });

        if (!session) {
            return res.redirect('/login'); // Geçersiz token
        }

        // Kullanıcı bilgilerini al
        const user = await User.findOne({ where: { id: session.userID } });

        if (!user) {
            return res.redirect('/login'); // Kullanıcı bulunamadı
        }

        // Kullanıcı rolüne göre yönlendir
        if (user.role === 'admin') {
            return res.redirect('/admin');
        } else if (user.role === 'user') {
            return res.redirect('/index');
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Oturum kontrol hatası:', error);
        return res.status(500).send('Bir hata oluştu.');
    }
});

// Oturum kapatma rotası
router.get('/logout', async (req, res) => {
    try {
        const { sessionToken } = req.cookies;

        if (sessionToken) {
            // Veritabanından oturumu sil
            await Session.destroy({ where: { token: sessionToken } });
        }

        // Çerezi temizle ve giriş sayfasına yönlendir
        res.clearCookie('sessionToken');
        return res.redirect('/login');
    } catch (error) {
        console.error('Logout işlemi sırasında bir hata oluştu:', error);
        return res.status(500).send('Logout işlemi sırasında bir hata oluştu.');
    }
});

// Public key alma rotası
router.get('/users/publicKey', authenticateUser, async (req, res) => {
    try {
        const { userID } = req.query;
        const user = await User.findByPk(userID);

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        res.json({ publicKey: user.publicKey });
    } catch (error) {
        console.error('Public key alma hatası:', error);
        res.status(500).json({ error: 'Public key alınamadı.' });
    }
});

module.exports = router;
