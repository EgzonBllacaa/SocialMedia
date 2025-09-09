/*
  Warnings:

  - You are about to drop the column `Education` on the `information` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `information` DROP COLUMN `Education`,
    ADD COLUMN `education` VARCHAR(191) NULL;
