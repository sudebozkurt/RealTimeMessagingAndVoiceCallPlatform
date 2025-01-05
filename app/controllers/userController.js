const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { deleted_at: null }, // Sadece silinmemiş kullanıcıları getir
            attributes: ['id', 'username', 'name', 'surname', 'photo'],
            order: [['created_at', 'DESC']],
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Kullanıcıları getirirken hata:', error);
        res.status(500).json({ message: 'Kullanıcılar alınamadı.' });
    }
};



module.exports = { getAllUsers };
