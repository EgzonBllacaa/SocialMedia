/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Information` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Information` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `information` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Information_userId_key` ON `Information`(`userId`);

-- AddForeignKey
ALTER TABLE `Information` ADD CONSTRAINT `Information_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
