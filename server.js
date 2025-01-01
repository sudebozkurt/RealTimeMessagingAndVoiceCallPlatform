const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const sequelize = require('./config/dbConfig');
const authRoutes = require('./app/routes/authRoutes');
const indexRoutes = require('./app/routes/indexRoutes');
const broadcastRoutes = require('./app/routes/broadcastmessageRoutes'); 
const authenticateUser = require('./middlewares/authMiddleware');
const { port } = require('./config/serverConfig');
const broadcastmessageController = require('./app/controllers/broadcastmessageController'); 

// Socket.IO yapılandırması
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('broadcastMessage', async (message) => {
        await broadcastmessageController.sendBroadcastMessage(io, message);
    });

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı bağlantıyı kesti:', socket.id);
    });
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public/assets')));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/broadcastMessages', broadcastRoutes); 
app.use('/', indexRoutes);

app.get('/register', (req, res) =>res.sendFile(path.join(__dirname, '/public/assets/html/register.html')));
app.get('/login', (req, res) =>res.sendFile(path.join(__dirname, '/public/assets/html/login.html')));
app.get('/index', authenticateUser, (req, res) =>res.sendFile(path.join(__dirname, '/public/assets/html/index.html')));
app.get('/admin', authenticateUser, (req, res) =>res.sendFile(path.join(__dirname, '/public/assets/html/admin.html')));

// Veritabanı bağlantısı
sequelize.sync()
    .then(() => console.log('Veritabanı senkronize edildi'))
    .catch((err) => console.log('Veritabanı senkronizasyon hatası: ', err));

// Sunucuyu başlat
server.listen(port, () => console.log(`Server ${port} portunda çalışıyor...`));
