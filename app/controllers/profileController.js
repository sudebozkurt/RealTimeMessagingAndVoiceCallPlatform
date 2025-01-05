const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


// Profil bilgilerini güncelle
exports.updateProfile = async (req, res) => {
    try {
        const { name, surname, email } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ message: 'Profil güncellendi.', user });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Profil güncellenemedi.' });
    }
};

// Şifre değiştirme
exports.changePassword = async (req, res) => {
    console.log('Şifre değiştirme isteği alındı:', req.body);

    try {
        const { oldPassword, newPassword } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'Kullanıcı doğrulanamadı.' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Eski şifre yanlış.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Şifre başarıyla değiştirildi.' });
    } catch (error) {
        console.error('Şifre değiştirme hatası:', error);
        res.status(500).json({ message: 'Şifre değiştirilemedi.' });
    }
};



// Hesap silme (soft delete)
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        user.deleted_at = new Date();
        await user.save();

        res.status(200).json({ message: 'Hesap başarıyla silindi.' });
    } catch (error) {
        console.error('Hesap silme hatası:', error);
        res.status(500).json({ message: 'Hesap silinemedi.' });
    }
};

exports.updatePhoto = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Eski fotoğrafı kontrol et ve sil
        if (user.photo) {
            const oldPhotoPath = path.join(__dirname, '../../uploads/profilePhotos', user.photo);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath); // Eski dosyayı sil
            }
        }

        // Yeni fotoğrafı kaydet
        const photoPath = `../../uploads/profilePhotos/${req.file.filename}`;
        user.photo = photoPath;
        await user.save();

        res.status(200).json({
            message: 'Profil fotoğrafı başarıyla güncellendi.',
            photo: photoPath,
        });
    } catch (error) {
        console.error('Fotoğraf güncelleme hatası:', error);
        res.status(500).json({ message: 'Fotoğraf güncellenemedi.' });
    }
};
