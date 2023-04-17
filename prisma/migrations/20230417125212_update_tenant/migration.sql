/*
  Warnings:

  - A unique constraint covering the columns `[name,email]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `host` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_name_fkey`;

-- DropIndex
DROP INDEX `Tenant_name_key` ON `Tenant`;

-- AlterTable
ALTER TABLE `Room` ADD COLUMN `host` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Tenant_name_email_key` ON `Tenant`(`name`, `email`);

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_host_fkey` FOREIGN KEY (`host`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
