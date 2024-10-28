-- Indexes for Calls table
CREATE INDEX `idx_calls_callerId` ON `Calls` (`callerID`);
CREATE INDEX `idx_calls_receiverId` ON `Calls` (`receiverID`);