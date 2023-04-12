/*
  Warnings:

  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `investment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offer_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `offer_repayment_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roleToPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `company_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `investment` DROP FOREIGN KEY `investment_offer_id_fkey`;

-- DropForeignKey
ALTER TABLE `investment` DROP FOREIGN KEY `investment_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `offer` DROP FOREIGN KEY `offer_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `offer_docs` DROP FOREIGN KEY `offer_docs_offer_id_fkey`;

-- DropForeignKey
ALTER TABLE `offer_repayment_plan` DROP FOREIGN KEY `offer_repayment_plan_offer_id_fkey`;

-- DropForeignKey
ALTER TABLE `roleToPermission` DROP FOREIGN KEY `roleToPermission_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `roleToPermission` DROP FOREIGN KEY `roleToPermission_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_wallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `users_docs` DROP FOREIGN KEY `users_docs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `wallet` DROP FOREIGN KEY `wallet_user_id_fkey`;

-- AlterTable
ALTER TABLE `Tenant` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `businessSector` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `email2` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `phone2` VARCHAR(191) NULL,
    ADD COLUMN `preferredLoanCategories` VARCHAR(191) NULL,
    ADD COLUMN `profilePhoto` TEXT NULL,
    ADD COLUMN `socialMedia` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `company`;

-- DropTable
DROP TABLE `investment`;

-- DropTable
DROP TABLE `offer`;

-- DropTable
DROP TABLE `offer_docs`;

-- DropTable
DROP TABLE `offer_repayment_plan`;

-- DropTable
DROP TABLE `permissions`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `roleToPermission`;

-- DropTable
DROP TABLE `transaction`;

-- DropTable
DROP TABLE `users`;

-- DropTable
DROP TABLE `users_docs`;

-- DropTable
DROP TABLE `variable`;

-- DropTable
DROP TABLE `wallet`;
