/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `offer_repayment_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `offer_repayment_plans` DROP FOREIGN KEY `offer_repayment_plans_offer_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_wallet_id_fkey`;

-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE `offer_repayment_plans`;

-- DropTable
DROP TABLE `transactions`;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL DEFAULT 0.0,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `wallet_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_repayment_plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `expected_amount` DOUBLE NOT NULL,
    `received_amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `offer_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `permissions_name_key` ON `permissions`(`name`);

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_repayment_plan` ADD CONSTRAINT `offer_repayment_plan_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
