const { pool } = require('../config/database');

// Çağrı geçmişini getir
const getCallHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Kimliği doğrulanmış kullanıcı
    const [rows] = await pool.query(
      'SELECT * FROM Calls WHERE callerID = ? OR receiverID = ? ORDER BY call_start DESC',
      [userId, userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Çağrı geçmişi alınırken hata oluştu:', error);
    res.status(500).json({ message: 'Bir hata oluştu.' });
  }
};

module.exports = { getCallHistory };