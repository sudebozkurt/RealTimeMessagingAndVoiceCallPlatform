const Session = require('../app/models/Session');
const User = require('../app/models/User');

const authenticateUser = async (req, res, next) => {
    try {
        const { sessionToken } = req.cookies;

        if (!sessionToken) {
            return res.redirect('/login');
        }

        const session = await Session.findOne({ where: { token: sessionToken } });

        if (!session) {
            return res.redirect('/login');
        }

        const user = await User.findOne({
            where: {
                id: session.userID,
                deleted_at: null, // Silinmiş kullanıcıları hariç tut
            },
        });

        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Oturum doğrulama hatası:', error);
        return res.status(500).send('Bir hata oluştu.');
    }
};

module.exports = authenticateUser;
