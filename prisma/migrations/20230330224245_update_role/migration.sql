/*
  Warnings:

  - A unique constraint covering the columns `[codename]` on the table `AccountType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,owner]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_owner_fkey`;

-- AlterTable
ALTER TABLE `accounttype` ADD COLUMN `restricted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `role` MODIFY `owner` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AccountType_codename_key` ON `AccountType`(`codename`);

-- CreateIndex
CREATE UNIQUE INDEX `Role_name_owner_key` ON `Role`(`name`, `owner`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
