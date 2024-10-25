-- Veritabanı Oluşturma
CREATE DATABASE IF NOT EXISTS whatsapp_klonu;
USE whatsapp_klonu;

-- Kullanıcılar tablosu
CREATE TABLE `Kullanicilar` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kullanici_adi` VARCHAR(256) NOT NULL UNIQUE,
    `sifre_hash` VARCHAR(256) NOT NULL,
    `email` VARCHAR(256) UNIQUE,
    `olusturma_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `guncelleme_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

-- Oturumlar tablosu
CREATE TABLE `Oturumlar` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `kullanici_id` INT UNSIGNED NOT NULL,
    `token` VARCHAR(256) NOT NULL,
    `sonlanma_zamani` TIMESTAMP,
    FOREIGN KEY (`kullanici_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Mesajlar tablosu (Özel Mesajlar)
CREATE TABLE `Mesajlar` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `gonderen_id` INT UNSIGNED NOT NULL,
    `alici_id` INT UNSIGNED NOT NULL,
    `icerik` TEXT,
    `tur` ENUM('metin', 'ses', 'video', 'dosya') NOT NULL,
    `durum` ENUM('gonderildi', 'teslim edildi', 'goruldu') NOT NULL DEFAULT 'gonderildi',
    `gonderim_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `teslim_zamani` TIMESTAMP NULL,
    FOREIGN KEY (`gonderen_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`alici_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE
);

-- Grup Mesajları tablosu
CREATE TABLE `GrupMesajlari` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `grup_id` INT UNSIGNED NOT NULL,
    `gonderen_id` INT UNSIGNED NOT NULL,
    `icerik` TEXT,
    `tur` ENUM('metin', 'ses', 'video', 'dosya') NOT NULL,
    `gonderim_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`grup_id`) REFERENCES Gruplar(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`gonderen_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE
);


-- Dosyalar tablosu
CREATE TABLE `Dosyalar` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `mesaj_id` INT UNSIGNED, -- Özel Mesaj ID'si (NULL olabilir)
    `grup_mesaj_id` INT UNSIGNED, -- Grup Mesaj ID'si (NULL olabilir)
    `ad` VARCHAR(255) NOT NULL,
    `tur` VARCHAR(50) NOT NULL,
    `boyut` INT UNSIGNED NOT NULL,
    `yol` VARCHAR(255) NOT NULL,
    `olusturma_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`mesaj_id`) REFERENCES Mesajlar(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`grup_mesaj_id`) REFERENCES GrupMesajlari(`id`) ON DELETE CASCADE
);

-- Çağrılar tablosu
CREATE TABLE `Cagrilar` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `arayan_id` INT UNSIGNED NOT NULL,
    `aranan_id` INT UNSIGNED NOT NULL,
    `sure` INT UNSIGNED DEFAULT 0,
    `baslangic_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `durum` ENUM('baslatildi', 'kabul_edildi', 'reddedildi', 'sonlandirildi') NOT NULL,
    FOREIGN KEY (`arayan_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`aranan_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE
);

-- Bildirimler tablosu
CREATE TABLE `Bildirimler` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `kullanici_id` INT UNSIGNED NOT NULL,
    `icerik` TEXT,
    `tur` ENUM('mesaj', 'cagri', 'sistem') NOT NULL,
    `okundu` TINYINT(1) NOT NULL DEFAULT 0, 
    `olusturma_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`kullanici_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE
);

-- Gruplar tablosu
CREATE TABLE `Gruplar` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ad` VARCHAR(100) NOT NULL,
    `aciklama` TEXT,
    `olusturma_zamani` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcı Grupları tablosu (Çoka Çok İlişki)
CREATE TABLE `KullaniciGruplar` (
    `kullanici_id` INT UNSIGNED NOT NULL,
    `grup_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`kullanici_id`, `grup_id`), 
    FOREIGN KEY (`kullanici_id`) REFERENCES Kullanicilar(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`grup_id`) REFERENCES Gruplar(`id`) ON DELETE CASCADE
);

-- İndeksler
CREATE INDEX idx_mesajlar_gonderen_id ON Mesajlar(`gonderen_id`);
CREATE INDEX idx_mesajlar_alici_id ON Mesajlar(`alici_id`);
CREATE INDEX idx_grup_mesajlari_grup_id ON GrupMesajlari(`grup_id`);
CREATE INDEX idx_grup_mesajlari_gonderen_id ON GrupMesajlari(`gonderen_id`);
CREATE INDEX idx_bildirimler_kullanici_id ON Bildirimler(`kullanici_id`);
CREATE INDEX idx_gruplar_ad ON Gruplar(`ad`);