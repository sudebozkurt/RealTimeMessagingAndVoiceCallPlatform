//server.js
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const sequelize = require('./config/dbConfig');
const authRoutes = require('./app/routes/authRoutes');
const uploadMiddleware = require('./middlewares/uploadMiddleware');
const indexRoutes = require('./app/routes/indexRoutes');
const authenticateUser = require('./middlewares/authMiddleware'); // Middleware'i içe aktar
const { port } = require('./config/serverConfig');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public/assets')));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/login.html')));
app.use('/', indexRoutes);
app.get('/index', authenticateUser, (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/index.html')));
app.get('/admin', authenticateUser, (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/admin.html')));
app.use('/logout', indexRoutes);

// Veritabanı bağlantısı
sequelize.sync()
    .then(() => console.log('Veritabanı senkronize edildi'))
    .catch(err => console.log('Veritabanı senkronizasyon hatası: ', err));

// Sunucuyu başlat
app.listen(port, () => console.log(`Server ${port} portunda çalışıyor...`));
