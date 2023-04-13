/*
  Warnings:

  - You are about to drop the column `walletId` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Investment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `PaymentMethod` DROP FOREIGN KEY `PaymentMethod_walletId_fkey`;

-- DropForeignKey
ALTER TABLE `Wallet` DROP FOREIGN KEY `Wallet_owner_fkey`;

-- AlterTable
ALTER TABLE `Investment` ADD COLUMN `done` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `transactionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PaymentMethod` DROP COLUMN `walletId`,
    ADD COLUMN `owner` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Wallet`;

-- CreateIndex
CREATE UNIQUE INDEX `Investment_transactionId_key` ON `Investment`(`transactionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_transactionId_key` ON `Transaction`(`transactionId`);

-- AddForeignKey
ALTER TABLE `Investment` ADD CONSTRAINT `Investment_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`transactionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
