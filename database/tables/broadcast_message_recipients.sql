-- Broadcast Message Recipients table
CREATE TABLE `BroadcastMessageRecipients` (
    `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `broadcastMessageID` INT UNSIGNED NOT NULL,
    `receiverID` INT UNSIGNED NOT NULL,
    `status` VARCHAR(255) DEFAULT 'sent',  -- sent, delivered, seen
    `deliveredAt` TIMESTAMP NULL,
    `seenAt` TIMESTAMP NULL,
    FOREIGN KEY (`broadcastMessageID`) REFERENCES BroadcastMessages(`ID`) ON DELETE CASCADE,
    FOREIGN KEY (`receiverID`) REFERENCES Users(`ID`) ON DELETE CASCADE
);