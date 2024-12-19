-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: chatapp_db
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BroadcastMessageRecipients`
--

DROP TABLE IF EXISTS `BroadcastMessageRecipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BroadcastMessageRecipients`
--

LOCK TABLES `BroadcastMessageRecipients` WRITE;
/*!40000 ALTER TABLE `BroadcastMessageRecipients` DISABLE KEYS */;
/*!40000 ALTER TABLE `BroadcastMessageRecipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BroadcastMessages`
--

DROP TABLE IF EXISTS `BroadcastMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BroadcastMessages` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `senderID` int unsigned NOT NULL,
  `message` text,
  `type` varchar(255) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_broadcastMessages_senderId` (`senderID`),
  CONSTRAINT `BroadcastMessages_ibfk_1` FOREIGN KEY (`senderID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BroadcastMessages`
--

LOCK TABLES `BroadcastMessages` WRITE;
/*!40000 ALTER TABLE `BroadcastMessages` DISABLE KEYS */;
/*!40000 ALTER TABLE `BroadcastMessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Calls`
--

DROP TABLE IF EXISTS `Calls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Calls` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `callerID` int unsigned NOT NULL,
  `receiverID` int unsigned NOT NULL,
  `call_start` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `call_end` timestamp NULL DEFAULT NULL,
  `duration` int unsigned DEFAULT NULL,
  `call_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `receiverID` (`receiverID`),
  KEY `idx_calls_callerId` (`callerID`),
  CONSTRAINT `Calls_ibfk_1` FOREIGN KEY (`callerID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `Calls_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Calls`
--

LOCK TABLES `Calls` WRITE;
/*!40000 ALTER TABLE `Calls` DISABLE KEYS */;
/*!40000 ALTER TABLE `Calls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Messages`
--

DROP TABLE IF EXISTS `Messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Messages`
--

LOCK TABLES `Messages` WRITE;
/*!40000 ALTER TABLE `Messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `Messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sessions` (
  `UUID` varchar(255) NOT NULL,
  `userID` int unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UUID`),
  KEY `idx_sessions_userId` (`userID`),
  CONSTRAINT `Sessions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sessions`
--

LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;
INSERT INTO `Sessions` VALUES ('0863c7f8-6669-4ddb-8128-fc3db38784a5',14,'c4b9ff2a-c752-4ec2-b064-d6749482eaef','2024-12-19 14:10:09','2024-12-19 14:10:09'),('b6dfddd1-fb36-4426-83c8-f7bda092f87f',6,'3725594d-7ac7-401e-83a8-dda6d94b541b','2024-12-19 13:27:50','2024-12-19 13:27:50'),('bd80803d-1b67-4c08-b64f-031384c0d606',6,'f98e2cb2-ba71-4673-addc-96d635066934','2024-12-19 13:25:27','2024-12-19 13:25:27'),('efe3787f-9383-43c9-a0cb-4604386415f0',14,'f44eb77f-9f1b-4a07-a4b7-c21378550241','2024-12-19 14:11:19','2024-12-19 14:11:19');
/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserVerification`
--

DROP TABLE IF EXISTS `UserVerification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserVerification` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `verificationCode` varchar(6) DEFAULT NULL,
  `codeExpiration` timestamp NULL DEFAULT NULL,
  `attemptCount` int unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `UserVerification_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserVerification`
--

LOCK TABLES `UserVerification` WRITE;
/*!40000 ALTER TABLE `UserVerification` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserVerification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (6,'Ali','Veli','aliveli','$2a$10$BAzhcoGcrFDmDALbf0Fkn.oIAYFnFY8bfKpYSMXJvv3kHfTlvv1PG','ali.veli@example.com','user',NULL,'4e8f263c-a210-41e5-b36d-04dd5ecfde7d','2024-12-19 08:46:58',NULL,'pet','Kedi'),(7,'Sude','Bozkurt','sudeb','$2a$10$JxM8vlqqepH0Z81JfBhjwOtGouR6vhk2.ZJDEk9aHxFx1T0LuuH62','sude@ex.co','user','/uploads/npr.brightspotcdn.jpeg','ba4d3c47-a3b8-4155-b30f-a9a36a057125','2024-12-19 09:12:32',NULL,'city','ist'),(8,'Deneme','Deneme','deneme','$2a$10$/Xhc1W/6X51.3EGBKCarO.gLRSz/37w3VNMgcqCTNG.MmY67p5nAK','deneme@ex.co','user','/uploads/profilePhotos/516dd1c1aff3276652cc177ea5a11203.jpeg','f2034df2-e8cf-4737-8c99-7a4d73ac8cb9','2024-12-19 09:47:30',NULL,'city','Edirne'),(9,'Deneme2','Deneme2','deneme2','$2a$10$Aw4w.PAUwVUEVukjtl4W4eiCB1.JPflyD2xsBz1zuxdghPtss/RnG','deneme2@ex.co','user','/uploads/profilePhotos/e3681034c5a45543cc01135e424daceb.jpeg','ae887bba-0d57-45f0-8ed3-6fd79d7e9528','2024-12-19 09:53:43',NULL,'pet','Carl'),(10,'Deneme3','Deneme3','deneme3','$2a$10$e/xZbgC8xgLA7jGnrdkkW.z0ioSMFGR6ADnpyuAtgyzF6X.Vj2Hz.','deneme3@ex.co','user','/uploads/profilePhotos/c828906c61a5a90dd58a2b003740110a.jpeg','12e89f2c-1a15-4473-bcbb-f8d9921ecad7','2024-12-19 09:59:48',NULL,'school','Xxxx'),(11,'asd','asd','asd','$2a$10$q83jAqW90mLueXSJHjCAvech8dEJQ4BzfGST22lgBMXr.xDMdNO1O','asd@ex.co','user','/uploads/profilePhotos/af24581a7df037a2f70f17bf8fbf90fd.jpeg','ad259d0c-7995-4dad-a5e7-2c22b318a927','2024-12-19 10:03:20',NULL,'city','LA'),(12,'denemee','denemee','denemee','$2a$10$E0MJeVOH1cDgzMXpyeAdFO2q6JXvWImLy6KMZTVBjeqx6M3QecF0O','denemee@ex.co','user','/uploads/profilePhotos/f8f6f72bd0d2248316927b8bfad9bede.png','382bc531-8e4d-41d0-bf4a-af61a016e3d4','2024-12-19 10:18:14',NULL,'school','asdsada'),(13,'deneme4','deneme4','deneme4','$2a$10$p0z0VKNZFu1HigY2PAza4.ExwZ296cXWclPD27aeVDCi3WPnhZXK2','deneme4@ex.co','user','/uploads/profilePhotos/6765d5448170b4267f5e5f6a6a424796.jpg','7d1ed5e9-210e-4839-911c-ea585e411252','2024-12-19 13:13:08',NULL,'city','NY'),(14,'Admin','Admin','admin','$2a$10$I4Oa2a5BjGMBOxKe7n8WsO1PKEM9/cuxSg2tVcY/DjY6LuKo/kY1C','admin@example.com','admin','/uploads/profilePhotos/0555f2b92a578abe5ac1e99935daa073.png','e3ad9bae-1cb3-4686-a492-6361d50da4eb','2024-12-19 14:08:45',NULL,'pet','Turtle');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `u_u_i_d` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_i_d` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-19 17:42:21
