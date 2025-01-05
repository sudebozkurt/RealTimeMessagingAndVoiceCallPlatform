const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'profilePhotos');

        // Dizin var mı kontrol et, yoksa oluştur
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Dosya adı için hash oluştur
        const md5Hash = crypto.createHash('md5').update(file.originalname + Date.now()).digest('hex');
        const fileExtension = path.extname(file.originalname);
        const hashedFileName = `${md5Hash}${fileExtension}`;

        cb(null, hashedFileName); // Hash'i dosya adı olarak belirle
    },
});

const upload = multer({ storage });

module.exports = upload;
