/*
  Warnings:

  - You are about to drop the column `project` on the `investment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dueAmount` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueGain` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `investment` DROP FOREIGN KEY `Investment_project_fkey`;

-- AlterTable
ALTER TABLE `investment` DROP COLUMN `project`,
    ADD COLUMN `dueAmount` DOUBLE NOT NULL,
    ADD COLUMN `dueGain` DOUBLE NOT NULL,
    ADD COLUMN `gainCollected` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `projectId` INTEGER NOT NULL,
    ADD COLUMN `term` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `paymentmethod` ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `InvestmentTerm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` INTEGER NOT NULL,
    `benefit` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `desabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Wallet_owner_key` ON `Wallet`(`owner`);

-- AddForeignKey
ALTER TABLE `Investment` ADD CONSTRAINT `Investment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Investment` ADD CONSTRAINT `Investment_term_fkey` FOREIGN KEY (`term`) REFERENCES `InvestmentTerm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
