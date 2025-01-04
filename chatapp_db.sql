CREATE DATABASE IF NOT EXISTS chatapp_db;
USE chatapp_db;
-- Veritabanını oluştur
CREATE DATABASE IF NOT EXISTS chatapp_db;
USE chatapp_db;

-- 1. Users tablosunu oluştur
CREATE TABLE `users` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `photo` text,
  `uuid` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `security_question` varchar(255) NOT NULL,
  `security_answer` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. BroadcastMessages tablosunu oluştur
CREATE TABLE `broadcastmessages` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `senderID` int unsigned NOT NULL,
  `message` text,
  `type` varchar(255) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_broadcastMessages_senderId` (`senderID`),
  CONSTRAINT `BroadcastMessages_ibfk_1` FOREIGN KEY (`senderID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. BroadcastMessageRecipients tablosunu oluştur
CREATE TABLE `broadcastmessagerecipients` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `broadcastMessageID` int unsigned NOT NULL,
  `receiverID` int unsigned NOT NULL,
  `status` varchar(255) DEFAULT 'sent',
  `deliveredAt` timestamp NULL DEFAULT NULL,
  `seenAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_broadcastMessageRecipients_broadcastMessageId` (`broadcastMessageID`),
  KEY `idx_broadcastMessageRecipients_receiverId` (`receiverID`),
  CONSTRAINT `BroadcastMessageRecipients_ibfk_1` FOREIGN KEY (`broadcastMessageID`) REFERENCES `broadcastmessages` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `BroadcastMessageRecipients_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `calls` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `callerID` int unsigned NOT NULL,
  `receiverID` int unsigned NOT NULL,
  `call_start` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `call_end` timestamp NULL DEFAULT NULL,
  `duration` int unsigned DEFAULT NULL,
  `call_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_calls_receiverId` (`receiverID`),
  KEY `idx_calls_callerId` (`callerID`),
  CONSTRAINT `Calls_ibfk_1` FOREIGN KEY (`callerID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `Calls_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `loginregisterlogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `operation` varchar(50) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `loginregisterlogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messages` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `message` text,
  `type` varchar(255) NOT NULL,
  `receiverID` int unsigned DEFAULT NULL,
  `senderID` int unsigned NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_messages_senderId` (`senderID`),
  KEY `idx_messages_receiverId` (`receiverID`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`receiverID`) REFERENCES `users` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`senderID`) REFERENCES `users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sessions` (
  `UUID` varchar(255) NOT NULL,
  `userID` int unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UUID`),
  KEY `idx_sessions_userId` (`userID`),
  CONSTRAINT `Sessions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
