/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Room_name_key` ON `room`;

-- AlterTable
ALTER TABLE `room` ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Room_uuid_key` ON `Room`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Tenant_name_key` ON `Tenant`(`name`);

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_name_fkey` FOREIGN KEY (`name`) REFERENCES `Tenant`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
