-- CreateTable
CREATE TABLE `Information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `Education` VARCHAR(191) NULL,

    UNIQUE INDEX `Information_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `informationId` INTEGER NOT NULL,

    UNIQUE INDEX `Skills_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Skills` ADD CONSTRAINT `Skills_informationId_fkey` FOREIGN KEY (`informationId`) REFERENCES `Information`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
