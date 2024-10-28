-- Indexes for Messages table
CREATE INDEX `idx_messages_senderId` ON `Messages` (`senderID`);
CREATE INDEX `idx_messages_receiverId` ON `Messages` (`receiverID`);