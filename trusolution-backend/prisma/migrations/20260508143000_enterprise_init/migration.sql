-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `firebaseUid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `profileMode` ENUM('GHOST', 'MASKED', 'OPEN') NOT NULL DEFAULT 'GHOST',
    `maskedNickname` VARCHAR(191) NULL,
    `maskedAvatarKey` VARCHAR(191) NULL,
    `sharingMode` ENUM('PUBLIC', 'FRIENDS', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC',
    `focusMode` ENUM('GUIDED', 'FREEFORM', 'MINDFUL') NOT NULL DEFAULT 'GUIDED',
    `role` ENUM('USER', 'THERAPIST', 'ADMIN') NOT NULL DEFAULT 'USER',
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `lastSeenAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_firebaseUid_key`(`firebaseUid`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_role_status_idx`(`role`, `status`),
    INDEX `User_createdAt_idx`(`createdAt`),
    INDEX `User_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPreference` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `defaultAnonymousPosting` BOOLEAN NOT NULL DEFAULT true,
    `profileVisibleInCommunity` BOOLEAN NOT NULL DEFAULT false,
    `wellnessInsightsSharing` BOOLEAN NOT NULL DEFAULT false,
    `pushEnabled` BOOLEAN NOT NULL DEFAULT true,
    `messageAlerts` BOOLEAN NOT NULL DEFAULT true,
    `communityAlerts` BOOLEAN NOT NULL DEFAULT true,
    `moodReminders` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserPreference_userId_key`(`userId`),
    INDEX `UserPreference_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Issue` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Issue_name_key`(`name`),
    UNIQUE INDEX `Issue_slug_key`(`slug`),
    INDEX `Issue_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    INDEX `Issue_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserIssue` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `issueId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserIssue_issueId_idx`(`issueId`),
    UNIQUE INDEX `UserIssue_userId_issueId_key`(`userId`, `issueId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Therapist` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `ratingAvg` DOUBLE NOT NULL DEFAULT 0,
    `sessionsCount` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Therapist_userId_key`(`userId`),
    INDEX `Therapist_isActive_idx`(`isActive`),
    INDEX `Therapist_specialty_idx`(`specialty`),
    INDEX `Therapist_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TherapistSlot` (
    `id` VARCHAR(191) NOT NULL,
    `therapistId` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `timezone` VARCHAR(191) NULL DEFAULT 'UTC',
    `status` ENUM('AVAILABLE', 'BOOKED', 'CANCELED') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `TherapistSlot_therapistId_status_startAt_idx`(`therapistId`, `status`, `startAt`),
    INDEX `TherapistSlot_deletedAt_idx`(`deletedAt`),
    UNIQUE INDEX `TherapistSlot_therapistId_startAt_key`(`therapistId`, `startAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `therapistId` VARCHAR(191) NOT NULL,
    `slotId` VARCHAR(191) NULL,
    `appointmentType` ENUM('CHAT', 'CALL', 'IN_PERSON') NOT NULL DEFAULT 'CHAT',
    `status` ENUM('SCHEDULED', 'CONFIRMED', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    `scheduledStartAt` DATETIME(3) NOT NULL,
    `scheduledEndAt` DATETIME(3) NOT NULL,
    `bookingCode` VARCHAR(191) NOT NULL,
    `canceledAt` DATETIME(3) NULL,
    `rescheduledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Appointment_slotId_key`(`slotId`),
    UNIQUE INDEX `Appointment_bookingCode_key`(`bookingCode`),
    INDEX `Appointment_userId_status_scheduledStartAt_idx`(`userId`, `status`, `scheduledStartAt`),
    INDEX `Appointment_therapistId_status_scheduledStartAt_idx`(`therapistId`, `status`, `scheduledStartAt`),
    INDEX `Appointment_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchRequest` (
    `id` VARCHAR(191) NOT NULL,
    `requesterUserId` VARCHAR(191) NOT NULL,
    `conversationStyle` ENUM('LISTENER', 'ADVICE', 'BOTH') NOT NULL DEFAULT 'BOTH',
    `topics` JSON NOT NULL,
    `status` ENUM('PENDING', 'MATCHED', 'CANCELED', 'EXPIRED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `matchedSessionId` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `canceledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MatchRequest_matchedSessionId_key`(`matchedSessionId`),
    INDEX `MatchRequest_requesterUserId_status_createdAt_idx`(`requesterUserId`, `status`, `createdAt`),
    INDEX `MatchRequest_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `requesterUserId` VARCHAR(191) NOT NULL,
    `peerUserId` VARCHAR(191) NULL,
    `conversationStyle` ENUM('LISTENER', 'ADVICE', 'BOTH') NOT NULL DEFAULT 'BOTH',
    `topics` JSON NOT NULL,
    `status` ENUM('ACTIVE', 'ENDED', 'CANCELED') NOT NULL DEFAULT 'ACTIVE',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Session_requesterUserId_status_startedAt_idx`(`requesterUserId`, `status`, `startedAt`),
    INDEX `Session_peerUserId_status_startedAt_idx`(`peerUserId`, `status`, `startedAt`),
    INDEX `Session_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeerRating` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `raterUserId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `feedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PeerRating_sessionId_key`(`sessionId`),
    INDEX `PeerRating_raterUserId_createdAt_idx`(`raterUserId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('PEER', 'THERAPIST') NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `appointmentId` VARCHAR(191) NULL,
    `therapistId` VARCHAR(191) NULL,
    `lastMessageAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Chat_sessionId_key`(`sessionId`),
    UNIQUE INDEX `Chat_appointmentId_key`(`appointmentId`),
    INDEX `Chat_type_lastMessageAt_idx`(`type`, `lastMessageAt`),
    INDEX `Chat_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatParticipant_userId_createdAt_idx`(`userId`, `createdAt`),
    UNIQUE INDEX `ChatParticipant_chatId_userId_key`(`chatId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `senderUserId` VARCHAR(191) NOT NULL,
    `messageType` ENUM('TEXT', 'SYSTEM') NOT NULL DEFAULT 'TEXT',
    `body` LONGTEXT NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Message_chatId_createdAt_idx`(`chatId`, `createdAt`),
    INDEX `Message_senderUserId_createdAt_idx`(`senderUserId`, `createdAt`),
    INDEX `Message_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MoodEntry` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `mood` ENUM('CALM', 'OKAY', 'LOW', 'SAD', 'ANXIOUS', 'ANGRY') NOT NULL,
    `severity` INTEGER NOT NULL,
    `score` DOUBLE NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `MoodEntry_userId_recordedAt_idx`(`userId`, `recordedAt`),
    INDEX `MoodEntry_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommunityPost` (
    `id` VARCHAR(191) NOT NULL,
    `authorUserId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `topics` JSON NOT NULL,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `CommunityPost_authorUserId_createdAt_idx`(`authorUserId`, `createdAt`),
    INDEX `CommunityPost_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostReaction` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `kind` ENUM('LIKE', 'REACTION') NOT NULL,
    `reaction` ENUM('SUPPORT', 'RELATE', 'HUG') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PostReaction_userId_createdAt_idx`(`userId`, `createdAt`),
    UNIQUE INDEX `PostReaction_postId_userId_kind_key`(`postId`, `userId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Comment_postId_createdAt_idx`(`postId`, `createdAt`),
    INDEX `Comment_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('MESSAGE', 'COMMUNITY', 'APPOINTMENT', 'MOOD', 'SYSTEM', 'SUPPORT') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `data` JSON NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Notification_userId_readAt_createdAt_idx`(`userId`, `readAt`, `createdAt`),
    INDEX `Notification_type_createdAt_idx`(`type`, `createdAt`),
    INDEX `Notification_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicket` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `message` LONGTEXT NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `closedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `SupportTicket_userId_status_createdAt_idx`(`userId`, `status`, `createdAt`),
    INDEX `SupportTicket_status_priority_createdAt_idx`(`status`, `priority`, `createdAt`),
    INDEX `SupportTicket_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserIssue` ADD CONSTRAINT `UserIssue_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserIssue` ADD CONSTRAINT `UserIssue_issueId_fkey` FOREIGN KEY (`issueId`) REFERENCES `Issue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Therapist` ADD CONSTRAINT `Therapist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapistSlot` ADD CONSTRAINT `TherapistSlot_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `Therapist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `Therapist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `TherapistSlot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchRequest` ADD CONSTRAINT `MatchRequest_requesterUserId_fkey` FOREIGN KEY (`requesterUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchRequest` ADD CONSTRAINT `MatchRequest_matchedSessionId_fkey` FOREIGN KEY (`matchedSessionId`) REFERENCES `Session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_requesterUserId_fkey` FOREIGN KEY (`requesterUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_peerUserId_fkey` FOREIGN KEY (`peerUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeerRating` ADD CONSTRAINT `PeerRating_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeerRating` ADD CONSTRAINT `PeerRating_raterUserId_fkey` FOREIGN KEY (`raterUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `Therapist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatParticipant` ADD CONSTRAINT `ChatParticipant_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatParticipant` ADD CONSTRAINT `ChatParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoodEntry` ADD CONSTRAINT `MoodEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommunityPost` ADD CONSTRAINT `CommunityPost_authorUserId_fkey` FOREIGN KEY (`authorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `CommunityPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `CommunityPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicket` ADD CONSTRAINT `SupportTicket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
