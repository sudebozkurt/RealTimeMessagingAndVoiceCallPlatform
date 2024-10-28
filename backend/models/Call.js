class Call {
    constructor(callerID, receiverID) {
      this.callerID = callerID;
      this.receiverID = receiverID;
      this.call_start = new Date();
      this.call_end = null;
      this.duration = null;
      this.call_status = 'başlatıldı';
    }
  
    // Çağrıyı veritabanına kaydet
    async save() {
      try {
        const [result] = await pool.query(
          'INSERT INTO Calls (callerID, receiverID, call_status) VALUES (?, ?, ?)',
          [this.callerID, this.receiverID, this.call_status]
        );
        this.ID = result.insertId; // Yeni oluşturulan çağrı ID'sini al
      } catch (error) {
        console.error('Çağrı kaydedilirken hata oluştu:', error);
        throw error;
      }
    }
  
    // Çağrıyı güncelle (örneğin, durumunu veya bitiş zamanını güncellemek için)
    async update(data) {
      try {
        // ... (data'ya göre güncelleme sorgusu oluşturun)
        await pool.query(
          // ... (güncelleme sorgusu)
        );
      } catch (error) {
        console.error('Çağrı güncellenirken hata oluştu:', error);
        throw error;
      }
    }
  }
  
  module.exports = Call;