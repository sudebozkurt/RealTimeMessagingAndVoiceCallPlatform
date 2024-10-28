const Call = require('./models/Call');

function callHandler(io, socket) {
  // Çağrı başlatma isteği
  socket.on('call:initiate', async (data) => {
    try {
      const { receiverID } = data;
      const callerID = socket.user.id; // Kimliği doğrulanmış kullanıcı
      const call = new Call(callerID, receiverID);
      await call.save(); // Çağrıyı veritabanına kaydet
      io.to(receiverID).emit('call:incoming', { callerID, callID: call.ID });
    } catch (error) {
      console.error('Çağrı başlatılırken hata oluştu:', error);
      socket.emit('call:error', { message: 'Çağrı başlatılamadı.' });
    }
  });

  // Çağrı cevaplama
  socket.on('call:answer', async (data) => {
    try {
      const { callID } = data;
      const receiverID = socket.user.id;
      // Çağrıyı veritabanında güncelle (durum: cevaplandı)
      const call = await Call.findById(callID); // Çağrıyı ID ile bul
      if (call) {
        call.call_status = 'cevaplandı';
        await call.update({ call_status: 'cevaplandı' });
        io.to(call.callerID).emit('call:accepted', { receiverID, callID });
      } else {
        socket.emit('call:error', { message: 'Çağrı bulunamadı.' });
      }
    } catch (error) {
      console.error('Çağrı cevaplanırken hata oluştu:', error);
      socket.emit('call:error', { message: 'Çağrı cevaplanamadı.' });
    }
  });

  // Çağrı reddetme
  socket.on('call:reject', async (data) => {
    try {
      const { callID } = data;
      const receiverID = socket.user.id;
      // Çağrıyı veritabanında güncelle (durum: reddedildi)
      const call = await Call.findById(callID);
      if (call) {
        call.call_status = 'reddedildi';
        await call.update({ call_status: 'reddedildi' });
        io.to(call.callerID).emit('call:rejected', { receiverID, callID });
      } else {
        socket.emit('call:error', { message: 'Çağrı bulunamadı.' });
      }
    } catch (error) {
      console.error('Çağrı reddedilirken hata oluştu:', error);
      socket.emit('call:error', { message: 'Çağrı reddedilemedi.' });
    }
  });

  // Çağrı sonlandırma
  socket.on('call:end', async (data) => {
    try {
      const { callID } = data;
      const userID = socket.user.id;
      // Çağrıyı veritabanında güncelle (durum: sonlandırıldı, bitiş zamanı, süre)
      const call = await Call.findById(callID);
      if (call) {
        call.call_status = 'sonlandırıldı';
        call.call_end = new Date();
        call.duration = Math.floor((call.call_end - call.call_start) / 1000); // Saniye cinsinden süre
        await call.update({ call_status: 'sonlandırıldı', call_end: call.call_end, duration: call.duration });
        io.to(call.callerID).emit('call:ended', { userID, callID });
        io.to(call.receiverID).emit('call:ended', { userID, callID });
      } else {
        socket.emit('call:error', { message: 'Çağrı bulunamadı.' });
      }
    } catch (error) {
      console.error('Çağrı sonlandırılırken hata oluştu:', error);
      socket.emit('call:error', { message: 'Çağrı sonlandırılamadı.' });
    }
  });
}

module.exports = callHandler;