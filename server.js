const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/dbConfig');
const { port } = require('./config/serverConfig');

// Rota ve middleware modülleri
const authRoutes = require('./app/routes/authRoutes');
const uploadMiddleware = require('./middlewares/uploadMiddleware');
const indexRoutes = require('./app/routes/indexRoutes');
const messageRoutes = require('./app/routes/messageRoutes');
const userRoutes = require('./app/routes/userRoutes');
const authenticateUser = require('./middlewares/authMiddleware');
const sessionRoutes = require('./app/routes/sessionRoutes');
const broadcastRoutes = require('./app/routes/broadcastmessageRoutes');

// WebSocket modülleri
const handleMessagingSockets = require('./app/sockets/messageSocket');
// Sunucu ve socket.io yapılandırması
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware'ler
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public/assets')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(cookieParser());

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/broadcastMessages', broadcastRoutes);

// HTML sayfalarına yönlendirme
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/login.html')));
app.get('/index', authenticateUser, (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/index.html')));
app.get('/admin', authenticateUser, (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/admin.html')));
app.get('/testWebSocket', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/testWebSocket.html')));

// Ana index rotası
app.use('/', indexRoutes);

// Çıkış işlemleri
app.use('/logout', indexRoutes);

// WebSocket Events
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı bağlantıyı kesti:', socket.id);
    });
});

module.exports = { server, io };

// Veritabanı bağlantısı ve senkronizasyon
sequelize.sync()
    .then(() => console.log('Veritabanı senkronize edildi'))
    .catch(err => console.log('Veritabanı senkronizasyon hatası: ', err));

// Sunucuyu başlat
handleMessagingSockets(io);
server.listen(port, () => console.log(`Server ${port} portunda çalışıyor...`));
