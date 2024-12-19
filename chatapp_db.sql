-- Drop tables in dependency order to avoid foreign key conflicts
DROP TABLE IF EXISTS `BroadcastMessageRecipients`;
DROP TABLE IF EXISTS `BroadcastMessages`;
DROP TABLE IF EXISTS `Calls`;
DROP TABLE IF EXISTS `Messages`;
DROP TABLE IF EXISTS `Sessions`;
DROP TABLE IF EXISTS `UserVerification`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `sessions`;

-- Users Table
CREATE TABLE `Users` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` text NOT NULL,
  `email` varchar(255) DEFAULT NULL UNIQUE,
  `role` varchar(255) DEFAULT NULL,
  `photo` text,
  `uuid` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `security_question` varchar(255) NOT NULL,
  `security_answer` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
);

-- BroadcastMessages Table
CREATE TABLE `BroadcastMessages` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `senderID` int unsigned NOT NULL,
  `message` text,
  `type` varchar(255) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_broadcastMessages_senderId` (`senderID`),
  CONSTRAINT `BroadcastMessages_ibfk_1` FOREIGN KEY (`senderID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
);

-- BroadcastMessageRecipients Table
CREATE TABLE `BroadcastMessageRecipients` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `broadcastMessageID` int unsigned NOT NULL,
  `receiverID` int unsigned NOT NULL,
  `status` varchar(255) DEFAULT 'sent',
  `deliveredAt` timestamp NULL DEFAULT NULL,
  `seenAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_broadcastMessageRecipients_broadcastMessageId` (`broadcastMessageID`),
  KEY `idx_broadcastMessageRecipients_receiverId` (`receiverID`),
  CONSTRAINT `BroadcastMessageRecipients_ibfk_1` FOREIGN KEY (`broadcastMessageID`) REFERENCES `BroadcastMessages` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `BroadcastMessageRecipients_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
);

-- Calls Table
CREATE TABLE `Calls` (
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
  CONSTRAINT `Calls_ibfk_1` FOREIGN KEY (`callerID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `Calls_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE `Messages` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `message` text,
  `type` varchar(255) NOT NULL,
  `receiverID` int unsigned DEFAULT NULL,
  `senderID` int unsigned NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_messages_senderId` (`senderID`),
  KEY `idx_messages_receiverId` (`receiverID`),
  CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`receiverID`) REFERENCES `Users` (`ID`) ON DELETE SET NULL,
  CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`senderID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
);

-- Sessions Table
CREATE TABLE `Sessions` (
  `UUID` varchar(255) NOT NULL,
  `userID` int unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UUID`),
  KEY `idx_sessions_userId` (`userID`),
  CONSTRAINT `Sessions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- UserVerification Table
CREATE TABLE `UserVerification` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `verificationCode` varchar(6) DEFAULT NULL,
  `codeExpiration` timestamp NULL DEFAULT NULL,
  `attemptCount` int unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_userVerification_userId` (`userId`),
  CONSTRAINT `UserVerification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO `Users` (`name`, `surname`, `username`, `password`, `email`, `role`, `photo`, `uuid`, `created_at`, `deleted_at`, `security_question`, `security_answer`) 
VALUES
('Admin', 'Admin', 'admin', '$2a$10$sTuDiYin1/vCDJpOJMipCuFU5IqmMKih5OrpRTK.ZfV.Iwf9eQz36', 'admin@example.com', 'admin', '/uploads/profilePhotos/9cb3eaecb4ea12ecabdf7307541c993a.png', 'a43c5520-e605-476c-af82-b9cf2d56e2fd', '2024-12-19 22:10:42', NULL, 'city', 'LA'),
('Sude', 'Bozkurt', 'sudeb', '$2a$10$E.9QJ9/y1PQNLnoGyvrNKeJ7WL1t6n/THMaXABDf9IatTUkLOP4i2', 'sude@ex.co', 'user', '/uploads/profilePhotos/3483f9ab99d9f0d959151f25d1f89339.jpeg', 'e0b00a87-9682-4660-ae59-69762a895f31', '2024-12-19 22:16:03', NULL, 'city', 'İst'),
('Ali', 'Veli', 'aliveli', '$2a$10$w9fzfJ3DI8qnYG2S8LD/S./LF93ti6sVBi/e7JFenVolgRNWz1h5O', 'aliveli@example.com', 'user', '/uploads/profilePhotos/10f7c293a453c391d991e98fdc6e34f2.jpeg', 'd7fb826f-3c41-4de8-96e1-c28331d0ad94', '2024-12-19 22:18:09', NULL, 'pet', 'Tekila'),
('deneme', 'deneme', 'deneme', '$2a$10$y/57.C3cCjiyB5KbVXh.9u7tyIL.g3UjPkM2I5XY2wDX8nfgw9Ola', 'deneme4@ex.co', 'user', '/uploads/profilePhotos/902efacad89654243d1fc948745d5706.jpeg', '079d38fa-c561-48f6-9da2-4754aa42d8e2', '2024-12-19 22:19:28', NULL, 'school', 'asd');

