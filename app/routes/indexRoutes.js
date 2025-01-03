const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

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

        // Session'ın geçerliliğini kontrol et
        if (new Date() > new Date(session.expires_at)) {
            return res.redirect('/login'); // Token süresi dolmuş
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

        // Çerezi temizle
        res.clearCookie('sessionToken', {
            httpOnly: true, // Çerez sadece sunucuya erişilebilir
            secure: process.env.NODE_ENV === 'production', // HTTPS üzerinden çalışacak
            sameSite: 'Strict', // Aynı site üzerinde çalışmasını zorunlu kılar
        });
        
        // Giriş sayfasına yönlendir
        return res.redirect('/login');
    } catch (error) {
        console.error('Logout işlemi sırasında bir hata oluştu:', error);
        return res.status(500).send('Logout işlemi sırasında bir hata oluştu.');
    }
});

module.exports = router;
