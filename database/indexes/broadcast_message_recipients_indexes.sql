-- Indexes for BroadcastMessageRecipients table
CREATE INDEX `idx_broadcastMessageRecipients_broadcastMessageId` ON `BroadcastMessageRecipients` (`broadcastMessageID`);
CREATE INDEX `idx_broadcastMessageRecipients_receiverId` ON `BroadcastMessageRecipients` (`receiverID`);