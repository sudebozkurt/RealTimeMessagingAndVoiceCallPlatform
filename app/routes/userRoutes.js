const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const authenticateUser = require('../../middlewares/authMiddleware');
const User = require('../models/User');
const Message = require('../models/Messages');
const router = express.Router();


// Kullanıcı listeleme rotası
router.get('/all-users', authenticateUser, async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Varsayılan değerler

    try {
        const offset = (page - 1) * limit;
        const users = await User.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']], // Kullanıcılar en yeniye göre sıralanır
        });

        res.status(200).json({
            users: users.rows,
            totalPages: Math.ceil(users.count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});



module.exports = router;