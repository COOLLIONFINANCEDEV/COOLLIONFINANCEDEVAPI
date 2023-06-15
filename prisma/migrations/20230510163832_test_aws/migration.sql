/*
  Warnings:

  - You are about to drop the `AccountType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountTypePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountTypeRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvestmentTerm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethodType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermissionRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersPermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AccountTypePermission` DROP FOREIGN KEY `AccountTypePermission_accountTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `AccountTypePermission` DROP FOREIGN KEY `AccountTypePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `AccountTypeRole` DROP FOREIGN KEY `AccountTypeRole_accountTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `AccountTypeRole` DROP FOREIGN KEY `AccountTypeRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Investment` DROP FOREIGN KEY `Investment_funder_fkey`;

-- DropForeignKey
ALTER TABLE `Investment` DROP FOREIGN KEY `Investment_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Investment` DROP FOREIGN KEY `Investment_term_fkey`;

-- DropForeignKey
ALTER TABLE `Investment` DROP FOREIGN KEY `Investment_transactionId_fkey`;

-- DropForeignKey
ALTER TABLE `Invitation` DROP FOREIGN KEY `Invitation_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Invitation` DROP FOREIGN KEY `Invitation_sender_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_replyTo_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PaymentMethod` DROP FOREIGN KEY `PaymentMethod_owner_fkey`;

-- DropForeignKey
ALTER TABLE `PaymentMethod` DROP FOREIGN KEY `PaymentMethod_paymentMethodTypeCodename_fkey`;

-- DropForeignKey
ALTER TABLE `PermissionRole` DROP FOREIGN KEY `PermissionRole_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `PermissionRole` DROP FOREIGN KEY `PermissionRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_owner_fkey`;

-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_owner_fkey`;

-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_host_fkey`;

-- DropForeignKey
ALTER TABLE `Tenant` DROP FOREIGN KEY `Tenant_accountTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_paymentMethodTypeCodename_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_recipient_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_sender_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoom` DROP FOREIGN KEY `UserRoom_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoom` DROP FOREIGN KEY `UserRoom_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTenant` DROP FOREIGN KEY `UserTenant_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTenant` DROP FOREIGN KEY `UserTenant_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTenant` DROP FOREIGN KEY `UserTenant_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserTenant` DROP FOREIGN KEY `UserTenant_userTenantId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersPermissions` DROP FOREIGN KEY `UsersPermissions_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersPermissions` DROP FOREIGN KEY `UsersPermissions_userId_fkey`;

-- DropTable
DROP TABLE `AccountType`;

-- DropTable
DROP TABLE `AccountTypePermission`;

-- DropTable
DROP TABLE `AccountTypeRole`;

-- DropTable
DROP TABLE `Investment`;

-- DropTable
DROP TABLE `InvestmentTerm`;

-- DropTable
DROP TABLE `Invitation`;

-- DropTable
DROP TABLE `Message`;

-- DropTable
DROP TABLE `PaymentMethod`;

-- DropTable
DROP TABLE `PaymentMethodType`;

-- DropTable
DROP TABLE `Permission`;

-- DropTable
DROP TABLE `PermissionRole`;

-- DropTable
DROP TABLE `Project`;

-- DropTable
DROP TABLE `Role`;

-- DropTable
DROP TABLE `Room`;

-- DropTable
DROP TABLE `Tenant`;

-- DropTable
DROP TABLE `Transaction`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `UserRole`;

-- DropTable
DROP TABLE `UserRoom`;

-- DropTable
DROP TABLE `UserTenant`;

-- DropTable
DROP TABLE `UsersPermissions`;

-- CreateTable
CREATE TABLE `tenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `email2` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `profilePhoto` LONGTEXT NULL,
    `address` VARCHAR(191) NULL,
    `preferredLoanCategories` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `phone2` VARCHAR(191) NULL,
    `businessSector` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `socialMedia` VARCHAR(191) NULL,
    `accountTypeId` INTEGER NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `tenant_name_email_key`(`name`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounttype` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `codename` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `restricted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `accounttype_name_key`(`name`),
    UNIQUE INDEX `accounttype_codename_key`(`codename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `phone2` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `phoneVerified` BOOLEAN NOT NULL DEFAULT false,
    `phone2Verified` BOOLEAN NOT NULL DEFAULT false,
    `accountActivated` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    UNIQUE INDEX `user_phone2_key`(`phone2`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usertenant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `userTenantId` INTEGER NULL,
    `roleId` INTEGER NOT NULL,
    `manager` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `usertenant_userId_tenantId_roleId_key`(`userId`, `tenantId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `owner` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `role_name_owner_key`(`name`, `owner`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `codename` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `permission_codename_key`(`codename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissionrole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `permissionrole_permissionId_roleId_key`(`permissionId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounttyperole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `accountTypeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `accounttyperole_accountTypeId_roleId_key`(`accountTypeId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounttypepermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NOT NULL,
    `accountTypeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `accounttypepermission_accountTypeId_permissionId_key`(`accountTypeId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userrole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `userrole_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userspermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `userspermissions_userId_permissionId_key`(`userId`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectTitle` VARCHAR(191) NOT NULL,
    `impactImage` LONGTEXT NOT NULL,
    `carouselImage` LONGTEXT NULL,
    `teaserTitle` VARCHAR(191) NOT NULL,
    `amountRequested` DOUBLE NOT NULL,
    `projectCountry` VARCHAR(191) NOT NULL,
    `story` TEXT NULL,
    `loanApplicationSpecial` TEXT NOT NULL,
    `loanInformation` TEXT NULL,
    `docs` LONGTEXT NOT NULL,
    `owner` INTEGER NOT NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT true,
    `treat` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `projectId` INTEGER NOT NULL,
    `funder` INTEGER NOT NULL,
    `term` INTEGER NOT NULL,
    `dueAmount` DOUBLE NOT NULL,
    `dueGain` DOUBLE NOT NULL,
    `collectionDate` DATETIME(3) NOT NULL,
    `gainCollected` BOOLEAN NOT NULL DEFAULT false,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `transactionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `investment_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `investmentterm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` INTEGER NOT NULL,
    `benefit` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `investmentterm_term_benefit_key`(`term`, `benefit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentmethod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentMethodTypeCodename` VARCHAR(191) NOT NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `owner` INTEGER NOT NULL,
    `customerName` VARCHAR(191) NULL,
    `customerSurname` VARCHAR(191) NULL,
    `customerEmail` VARCHAR(191) NULL,
    `customerPhoneNumber` VARCHAR(191) NULL,
    `customerAddress` VARCHAR(191) NULL,
    `customerCity` VARCHAR(191) NULL,
    `customerCountry` VARCHAR(191) NULL,
    `customerState` VARCHAR(191) NULL,
    `customerZipCode` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentmethodtype` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `codename` VARCHAR(191) NOT NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `paymentmethodtype_codename_key`(`codename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentMethodTypeCodename` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `recipient` INTEGER NOT NULL,
    `sender` INTEGER NOT NULL,
    `reason` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `operator` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NULL,
    `customerSurname` VARCHAR(191) NULL,
    `customerEmail` VARCHAR(191) NULL,
    `customerPhoneNumber` VARCHAR(191) NULL,
    `customerAddress` VARCHAR(191) NULL,
    `customerCity` VARCHAR(191) NULL,
    `customerCountry` VARCHAR(191) NULL,
    `customerState` VARCHAR(191) NULL,
    `customerZipCode` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    UNIQUE INDEX `transaction_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender` INTEGER NOT NULL,
    `receiverEmail` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `confirm` BOOLEAN NOT NULL DEFAULT false,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `host` INTEGER NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `room_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `userroom_userId_roomId_key`(`userId`, `roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL,
    `replyTo` INTEGER NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tenant` ADD CONSTRAINT `tenant_accountTypeId_fkey` FOREIGN KEY (`accountTypeId`) REFERENCES `accounttype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertenant` ADD CONSTRAINT `usertenant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertenant` ADD CONSTRAINT `usertenant_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertenant` ADD CONSTRAINT `usertenant_userTenantId_fkey` FOREIGN KEY (`userTenantId`) REFERENCES `tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usertenant` ADD CONSTRAINT `usertenant_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role` ADD CONSTRAINT `role_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissionrole` ADD CONSTRAINT `permissionrole_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissionrole` ADD CONSTRAINT `permissionrole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounttyperole` ADD CONSTRAINT `accounttyperole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounttyperole` ADD CONSTRAINT `accounttyperole_accountTypeId_fkey` FOREIGN KEY (`accountTypeId`) REFERENCES `accounttype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounttypepermission` ADD CONSTRAINT `accounttypepermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounttypepermission` ADD CONSTRAINT `accounttypepermission_accountTypeId_fkey` FOREIGN KEY (`accountTypeId`) REFERENCES `accounttype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userrole` ADD CONSTRAINT `userrole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userrole` ADD CONSTRAINT `userrole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userspermissions` ADD CONSTRAINT `userspermissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userspermissions` ADD CONSTRAINT `userspermissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investment` ADD CONSTRAINT `investment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investment` ADD CONSTRAINT `investment_funder_fkey` FOREIGN KEY (`funder`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investment` ADD CONSTRAINT `investment_term_fkey` FOREIGN KEY (`term`) REFERENCES `investmentterm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investment` ADD CONSTRAINT `investment_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transaction`(`transactionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentmethod` ADD CONSTRAINT `paymentmethod_paymentMethodTypeCodename_fkey` FOREIGN KEY (`paymentMethodTypeCodename`) REFERENCES `paymentmethodtype`(`codename`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paymentmethod` ADD CONSTRAINT `paymentmethod_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_paymentMethodTypeCodename_fkey` FOREIGN KEY (`paymentMethodTypeCodename`) REFERENCES `paymentmethodtype`(`codename`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_recipient_fkey` FOREIGN KEY (`recipient`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_sender_fkey` FOREIGN KEY (`sender`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_sender_fkey` FOREIGN KEY (`sender`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room` ADD CONSTRAINT `room_host_fkey` FOREIGN KEY (`host`) REFERENCES `tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userroom` ADD CONSTRAINT `userroom_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userroom` ADD CONSTRAINT `userroom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_replyTo_fkey` FOREIGN KEY (`replyTo`) REFERENCES `message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
