-- Database creation
CREATE DATABASE IF NOT EXISTS chatapp_db;
USE chatapp_db;

-- Users table
CREATE TABLE Users (
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(255),
    photo TEXT,
    security_question VARCHAR(255) NOT NULL,
    security_answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Sessions table
CREATE TABLE Sessions (
    UUID VARCHAR(255) NOT NULL PRIMARY KEY,
    userID INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Messages table
CREATE TABLE Messages (
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    type VARCHAR(255) NOT NULL,
    receiverID INT UNSIGNED,
    senderID INT UNSIGNED NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255),
    FOREIGN KEY (receiverID) REFERENCES Users(ID) ON DELETE SET NULL,
    FOREIGN KEY (senderID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Two-Factor Authentication table
CREATE TABLE UserVerification (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT UNSIGNED NOT NULL,
    verificationCode VARCHAR(6) DEFAULT NULL,
    codeExpiration TIMESTAMP DEFAULT NULL,
    attemptCount INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Calls table
CREATE TABLE Calls (
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    callerID INT UNSIGNED NOT NULL,
    receiverID INT UNSIGNED NOT NULL,
    call_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    call_end TIMESTAMP NULL,
    duration INT UNSIGNED,
    call_status VARCHAR(255),
    FOREIGN KEY (callerID) REFERENCES Users(ID) ON DELETE CASCADE,
    FOREIGN KEY (receiverID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Broadcast Messages table
CREATE TABLE BroadcastMessages (
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    senderID INT UNSIGNED NOT NULL,
    message TEXT,
    type VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Broadcast Message Recipients table
CREATE TABLE BroadcastMessageRecipients (
    ID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    broadcastMessageID INT UNSIGNED NOT NULL,
    receiverID INT UNSIGNED NOT NULL,
    status VARCHAR(255) DEFAULT 'sent',  -- sent, delivered, seen
    deliveredAt TIMESTAMP NULL,
    seenAt TIMESTAMP NULL,
    FOREIGN KEY (broadcastMessageID) REFERENCES BroadcastMessages(ID) ON DELETE CASCADE,
    FOREIGN KEY (receiverID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_messages_senderId ON Messages (senderID);
CREATE INDEX idx_messages_receiverId ON Messages (receiverID);
CREATE INDEX idx_broadcastMessages_senderId ON BroadcastMessages (senderID);
CREATE INDEX idx_broadcastMessageRecipients_broadcastMessageId ON BroadcastMessageRecipients (broadcastMessageID);
CREATE INDEX idx_broadcastMessageRecipients_receiverId ON BroadcastMessageRecipients (receiverID);
CREATE INDEX idx_sessions_userId ON Sessions (userID);
CREATE INDEX idx_calls_callerId ON Calls (callerID);
CREATE INDEX idx_calls_receiverId ON Calls (receiverID);