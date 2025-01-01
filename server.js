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
const authenticateUser = require('./middlewares/authMiddleware');
const { port } = require('./config/serverConfig');
const BroadcastMessage = require('./app/models/BroadcastMessage'); // BroadcastMessage modeli

// Socket.IO yapılandırması
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('broadcastMessage', async (message) => {
        console.log('Broadcast mesaj alındı:', message);
    
        try {
            const newMessage = await BroadcastMessage.create({
                senderID: message.senderID,
                message: message.content, // Mesajın kendisi
                type: 'broadcast',
            });
    
            console.log('Broadcast mesaj veritabanına kaydedildi:', newMessage);
            io.emit('receiveBroadcast', newMessage); // Mesajı tüm istemcilere gönder
        } catch (error) {
            console.error('Mesaj gönderim hatası:', error);
        }
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

// API Endpoint: Geçmiş broadcast mesajları al
app.get('/api/broadcastMessages', async (req, res) => {
    try {
        const messages = await BroadcastMessage.findAll({
            order: [['date', 'ASC']],
        });
        res.json(messages);
    } catch (error) {
        console.error('Mesajları alırken hata:', error);
        res.status(500).send('Mesajları alırken hata oluştu.');
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/login.html')));
app.use('/', indexRoutes);
app.get('/index', authenticateUser, (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/index.html')));
app.get('/admin', authenticateUser, (req, res) => res.sendFile(path.join(__dirname, '/public/assets/html/admin.html')));

// Veritabanı bağlantısı
sequelize.sync()
    .then(() => console.log('Veritabanı senkronize edildi'))
    .catch(err => console.log('Veritabanı senkronizasyon hatası: ', err));

// Sunucuyu başlat
server.listen(port, () => console.log(`Server ${port} portunda çalışıyor...`));
