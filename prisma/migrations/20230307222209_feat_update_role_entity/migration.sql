/*
  Warnings:

  - You are about to drop the `_accounttyperole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `owner` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_accounttyperole` DROP FOREIGN KEY `_AccountTypeRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_accounttyperole` DROP FOREIGN KEY `_AccountTypeRole_B_fkey`;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `owner` INTEGER NOT NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `_accounttyperole`;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
