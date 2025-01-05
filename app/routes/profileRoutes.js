const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticateUser = require('../../middlewares/authMiddleware');
const uploadMiddleware = require('../../middlewares/uploadMiddleware');

// Profil bilgilerini güncelle
router.put('/update-profile', authenticateUser, profileController.updateProfile);

// Şifre değiştirme
router.put('/change-password', authenticateUser, profileController.changePassword);

// Hesap silme (soft delete)
router.delete('/delete-account', authenticateUser, profileController.deleteAccount);

router.get('/get-profile', authenticateUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['name', 'surname', 'email', 'photo'], // Döndürülecek bilgiler
        });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Profil bilgileri alınırken hata:', error);
        res.status(500).json({ message: 'Profil bilgileri alınamadı' });
    }
});

router.put('/update-photo', authenticateUser, uploadMiddleware.single('photo'), profileController.updatePhoto);

module.exports = router;
