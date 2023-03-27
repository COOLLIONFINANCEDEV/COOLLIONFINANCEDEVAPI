/*
  Warnings:

  - You are about to drop the `accountstypespermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `accountstypesroles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `accountstypespermissions` DROP FOREIGN KEY `AccountsTypesPermissions_accountTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `accountstypespermissions` DROP FOREIGN KEY `AccountsTypesPermissions_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `accountstypesroles` DROP FOREIGN KEY `AccountsTypesRoles_accountTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `accountstypesroles` DROP FOREIGN KEY `AccountsTypesRoles_roleId_fkey`;

-- AlterTable
ALTER TABLE `userstenants` ADD COLUMN `manager` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `accountstypespermissions`;

-- DropTable
DROP TABLE `accountstypesroles`;

-- CreateTable
CREATE TABLE `AccountTypeRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `accountTypeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `AccountTypeRole_accountTypeId_roleId_key`(`accountTypeId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountTypePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NOT NULL,
    `accountTypeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `AccountTypePermission_accountTypeId_permissionId_key`(`accountTypeId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccountTypeRole` ADD CONSTRAINT `AccountTypeRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountTypeRole` ADD CONSTRAINT `AccountTypeRole_accountTypeId_fkey` FOREIGN KEY (`accountTypeId`) REFERENCES `AccountType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountTypePermission` ADD CONSTRAINT `AccountTypePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountTypePermission` ADD CONSTRAINT `AccountTypePermission_accountTypeId_fkey` FOREIGN KEY (`accountTypeId`) REFERENCES `AccountType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
