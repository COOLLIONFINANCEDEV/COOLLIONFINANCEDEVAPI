/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `is_deleted` on the `two_fa_code` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `two_fa_code` table. All the data in the column will be lost.
  - Added the required column `secret` to the `two_fa_code` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `two_fa_code` DROP COLUMN `is_deleted`,
    DROP COLUMN `value`,
    ADD COLUMN `secret` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `two_fa` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `oauth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code_challenge` VARCHAR(191) NOT NULL,
    `code_challenge_method` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
