/*
  Warnings:

  - Added the required column `amount_with_interest_rate` to the `investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funds_to_raise` to the `offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `investment` ADD COLUMN `amount_with_interest_rate` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `offer` ADD COLUMN `funds_to_raise` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `variable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
