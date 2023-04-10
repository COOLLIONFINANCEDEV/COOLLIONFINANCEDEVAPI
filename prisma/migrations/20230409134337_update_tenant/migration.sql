/*
  Warnings:

  - You are about to drop the column `sentAt` on the `message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AccountType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[term,benefit]` on the table `InvestmentTerm` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `sentAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `room` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `userroom` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AccountType_name_key` ON `AccountType`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `InvestmentTerm_term_benefit_key` ON `InvestmentTerm`(`term`, `benefit`);
