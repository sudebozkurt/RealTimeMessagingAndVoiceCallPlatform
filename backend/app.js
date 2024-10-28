const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./config/database');
const callRoutes = require('../routes/callRoutes');
const callHandler = require('../socket/callHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // İzin verilen kaynaklar
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/calls', callRoutes); // Çağrı rotaları

// Socket.IO bağlantı olayı
io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı:', socket.id);
  callHandler(io, socket); // Socket olaylarını işleme

  socket.on('disconnect', () => {
    console.log('Kullanıcı bağlantısı kesildi:', socket.id);
    // Kullanıcının çevrimdışı olduğunu diğer kullanıcılara bildirme
  });
});

// Veritabanına bağlan ve server'ı başlat
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((error) => {
    console.error('Veritabanına bağlanırken hata oluştu:', error);
  });