const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require("../models/User");

// sessionToken ile kullanıcıyı bulma
router.post('/getUserFromSession', async (req, res) => {
    try {
        const { sessionToken } = req.body;

        if (!sessionToken) {
            return res.status(400).json({ message: 'Session token is required' });
        }

        // Session tablosunda sessionToken'ı arıyoruz
        const session = await Session.findOne({
            where: { token: sessionToken },
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Kullanıcı bilgilerini alıyoruz
        const user = await User.findByPk(session.userID);  // Burada 'userID' kullanıyoruz

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kullanıcıyı döndürüyoruz
        res.status(200).json({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userPhoto: user.photo,
        });
    } catch (error) {
        console.error('Error fetching user from session:', error);  // Buradaki log daha detaylı hata verecek
        res.status(500).json({ message: 'Internal server error', error: error.message});
    }
});
 module.exports=router;
