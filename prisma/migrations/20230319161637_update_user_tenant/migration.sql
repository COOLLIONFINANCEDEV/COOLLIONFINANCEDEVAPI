/*
  Warnings:

  - You are about to drop the column `receiver` on the `invitation` table. All the data in the column will be lost.
  - You are about to drop the `userstenants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `Invitation_receiver_fkey`;

-- DropForeignKey
ALTER TABLE `userstenants` DROP FOREIGN KEY `UsersTenants_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `userstenants` DROP FOREIGN KEY `UsersTenants_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `userstenants` DROP FOREIGN KEY `UsersTenants_userId_fkey`;

-- AlterTable
ALTER TABLE `invitation` DROP COLUMN `receiver`,
    MODIFY `confirm` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `deleted` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `userstenants`;

-- CreateTable
CREATE TABLE `UserTenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `userTenantId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `manager` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `UserTenant_userId_tenantId_roleId_key`(`userId`, `tenantId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserTenant` ADD CONSTRAINT `UserTenant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTenant` ADD CONSTRAINT `UserTenant_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTenant` ADD CONSTRAINT `UserTenant_userTenantId_fkey` FOREIGN KEY (`userTenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTenant` ADD CONSTRAINT `UserTenant_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
