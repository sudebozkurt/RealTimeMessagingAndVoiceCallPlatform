const Session = require('../app/models/Session');

exports.sessionMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Oturum doğrulama hatası.' });
    }

    const session = await Session.findOne({ where: { token } });

    if (!session || new Date(session.expires_at) < new Date()) {
        return res.status(401).json({ message: 'Oturum süresi dolmuş veya geçersiz.' });
    }

    req.user = { id: session.userID };
    next();
};
