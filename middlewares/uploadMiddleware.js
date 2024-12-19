const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload.single('profile_pic');
