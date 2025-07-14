/*
  Warnings:

  - Added the required column `updatedAt` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "PromptVersion" ADD COLUMN     "changeMessage" TEXT,
ADD COLUMN     "version" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateTable
CREATE TABLE "PromptLike" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromptLike_promptId_idx" ON "PromptLike"("promptId");

-- CreateIndex
CREATE INDEX "PromptLike_userId_idx" ON "PromptLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptLike_promptId_userId_key" ON "PromptLike"("promptId", "userId");

-- AddForeignKey
ALTER TABLE "PromptLike" ADD CONSTRAINT "PromptLike_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptLike" ADD CONSTRAINT "PromptLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
