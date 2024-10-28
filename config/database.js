const mysql = require('mysql2/promise');

// Veritabanı bağlantı ayarları (ortam değişkenlerinden okuyun)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectDB() {
  try {
    await pool.getConnection();
    console.log('Veritabanına başarıyla bağlanıldı.');
  } catch (error) {
    console.error('Veritabanına bağlanırken hata oluştu:', error);
    process.exit(1); // Uygulamayı sonlandır
  }
}

module.exports = { connectDB, pool };