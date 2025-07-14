/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ModerationRule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ModerationRule_name_key" ON "ModerationRule"("name");
