/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[name,phone]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,email]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,city]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,country]` on the table `company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `company` MODIFY `description` TEXT NOT NULL DEFAULT '',
    MODIFY `logo` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `country` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `city` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `company_name_phone_key` ON `company`(`name`, `phone`);

-- CreateIndex
CREATE UNIQUE INDEX `company_name_email_key` ON `company`(`name`, `email`);

-- CreateIndex
CREATE UNIQUE INDEX `company_name_city_key` ON `company`(`name`, `city`);

-- CreateIndex
CREATE UNIQUE INDEX `company_name_country_key` ON `company`(`name`, `country`);
