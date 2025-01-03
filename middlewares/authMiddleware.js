const Session = require('../app/models/Session');
const User = require('../app/models/User');

const authenticateUser = async (req, res, next) => {
    try {
        const { sessionToken } = req.cookies;

        // Eğer çerez yoksa login sayfasına yönlendir
        if (!sessionToken) {
            return res.redirect('/login');
        }

        // Session tablosunda token'ı kontrol et
        const session = await Session.findOne({ where: { token: sessionToken } });

        if (!session) {
            return res.redirect('/login'); // Geçersiz token
        }

        // Kullanıcı bilgilerini al
        const user = await User.findOne({ where: { id: session.userID } });

        if (!user) {
            return res.redirect('/login'); // Kullanıcı bulunamadı
        }

        // Kullanıcıyı request'e ekle
        req.user = user;
        next(); // Devam et
    } catch (error) {
        console.error('Oturum doğrulama hatası:', error);
        return res.status(500).send('Bir hata oluştu.');
    }
};

module.exports = authenticateUser;
