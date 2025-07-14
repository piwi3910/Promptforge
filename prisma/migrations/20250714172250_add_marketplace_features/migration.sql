-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('CREATOR', 'POPULAR', 'HELPFUL', 'VERIFIED', 'MODERATOR', 'EARLY_ADOPTER');

-- CreateEnum
CREATE TYPE "PromptVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "ModerationSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('FLAG', 'BLOCK', 'REJECT', 'REQUIRE_REVIEW');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reputationScore" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedPrompt" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "PromptVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "copyCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionPrompt" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "sharedPromptId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedPromptId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptView" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sharedPromptId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptCopy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedPromptId" TEXT NOT NULL,
    "copiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pattern" TEXT NOT NULL,
    "severity" "ModerationSeverity" NOT NULL,
    "action" "ModerationAction" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModerationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "ruleId" TEXT,
    "action" "ModerationAction" NOT NULL,
    "reason" TEXT,
    "automated" BOOLEAN NOT NULL DEFAULT true,
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_type_key" ON "UserBadge"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_followerId_followingId_key" ON "UserFollow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedPrompt_promptId_key" ON "SharedPrompt"("promptId");

-- CreateIndex
CREATE INDEX "SharedPrompt_authorId_idx" ON "SharedPrompt"("authorId");

-- CreateIndex
CREATE INDEX "SharedPrompt_status_idx" ON "SharedPrompt"("status");

-- CreateIndex
CREATE INDEX "SharedPrompt_isPublished_idx" ON "SharedPrompt"("isPublished");

-- CreateIndex
CREATE INDEX "SharedPrompt_publishedAt_idx" ON "SharedPrompt"("publishedAt");

-- CreateIndex
CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");

-- CreateIndex
CREATE INDEX "Collection_isPublic_idx" ON "Collection"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionPrompt_collectionId_sharedPromptId_key" ON "CollectionPrompt"("collectionId", "sharedPromptId");

-- CreateIndex
CREATE INDEX "PromptComment_sharedPromptId_idx" ON "PromptComment"("sharedPromptId");

-- CreateIndex
CREATE INDEX "PromptComment_userId_idx" ON "PromptComment"("userId");

-- CreateIndex
CREATE INDEX "PromptComment_parentId_idx" ON "PromptComment"("parentId");

-- CreateIndex
CREATE INDEX "PromptView_sharedPromptId_idx" ON "PromptView"("sharedPromptId");

-- CreateIndex
CREATE INDEX "PromptView_userId_idx" ON "PromptView"("userId");

-- CreateIndex
CREATE INDEX "PromptCopy_sharedPromptId_idx" ON "PromptCopy"("sharedPromptId");

-- CreateIndex
CREATE INDEX "PromptCopy_userId_idx" ON "PromptCopy"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptCopy_userId_sharedPromptId_key" ON "PromptCopy"("userId", "sharedPromptId");

-- CreateIndex
CREATE INDEX "ModerationLog_contentType_contentId_idx" ON "ModerationLog"("contentType", "contentId");

-- CreateIndex
CREATE INDEX "ModerationLog_createdAt_idx" ON "ModerationLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPrompt" ADD CONSTRAINT "SharedPrompt_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPrompt" ADD CONSTRAINT "SharedPrompt_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPrompt" ADD CONSTRAINT "SharedPrompt_moderatedBy_fkey" FOREIGN KEY ("moderatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionPrompt" ADD CONSTRAINT "CollectionPrompt_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionPrompt" ADD CONSTRAINT "CollectionPrompt_sharedPromptId_fkey" FOREIGN KEY ("sharedPromptId") REFERENCES "SharedPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptComment" ADD CONSTRAINT "PromptComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptComment" ADD CONSTRAINT "PromptComment_sharedPromptId_fkey" FOREIGN KEY ("sharedPromptId") REFERENCES "SharedPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptComment" ADD CONSTRAINT "PromptComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PromptComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptView" ADD CONSTRAINT "PromptView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptView" ADD CONSTRAINT "PromptView_sharedPromptId_fkey" FOREIGN KEY ("sharedPromptId") REFERENCES "SharedPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptCopy" ADD CONSTRAINT "PromptCopy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptCopy" ADD CONSTRAINT "PromptCopy_sharedPromptId_fkey" FOREIGN KEY ("sharedPromptId") REFERENCES "SharedPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationLog" ADD CONSTRAINT "ModerationLog_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "ModerationRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
