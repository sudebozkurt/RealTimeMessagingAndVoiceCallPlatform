-- Users table
CREATE TABLE `Users` (
    `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `phone` VARCHAR(255),
    `role` VARCHAR(255),
    `photo` TEXT,
    `uuid` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL
);
