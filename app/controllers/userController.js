const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'name', 'surname', 'photo'], // Geri döndürülecek sütunlar
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Kullanıcıları getirirken hata:', error);
        res.status(500).json({ message: 'Kullanıcılar alınamadı.' });
    }
};

module.exports = { getAllUsers };
