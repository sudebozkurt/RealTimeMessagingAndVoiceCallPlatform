-- Two-Factor Authentication table
CREATE TABLE `UserVerification` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT UNSIGNED NOT NULL,
    `tfaActive` TINYINT(1) NOT NULL DEFAULT 0, 
    `tfaMethod` ENUM('sms', 'app') DEFAULT NULL,
    `phoneNumber` VARCHAR(20) DEFAULT NULL, 
    `verificationCode` VARCHAR(6) DEFAULT NULL,
    `codeExpiration` TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (`userId`) REFERENCES Users(`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);