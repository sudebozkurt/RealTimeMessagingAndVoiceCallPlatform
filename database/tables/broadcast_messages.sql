-- Broadcast Messages table
CREATE TABLE `BroadcastMessages` (
    `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `senderID` INT UNSIGNED NOT NULL,
    `message` TEXT,
    `type` VARCHAR(255) NOT NULL,
    `date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`senderID`) REFERENCES Users(`ID`) ON DELETE CASCADE
);