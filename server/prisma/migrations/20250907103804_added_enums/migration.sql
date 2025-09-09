/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `like` ADD COLUMN `type` ENUM('POST', 'COMMENT') NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX `Like_userId_idx` ON `Like`(`userId`);
