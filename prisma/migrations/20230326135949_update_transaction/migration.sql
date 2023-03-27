/*
  Warnings:

  - You are about to drop the column `codeName` on the `paymentmethodtype` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codename]` on the table `PaymentMethodType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codename` to the `PaymentMethodType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodTypeCodename` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `usertenant` DROP FOREIGN KEY `UserTenant_userTenantId_fkey`;

-- AlterTable
ALTER TABLE `paymentmethodtype` DROP COLUMN `codeName`,
    ADD COLUMN `codename` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `treat` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `customerAddress` VARCHAR(191) NULL,
    ADD COLUMN `customerCity` VARCHAR(191) NULL,
    ADD COLUMN `customerCountry` VARCHAR(191) NULL,
    ADD COLUMN `customerEmail` VARCHAR(191) NULL,
    ADD COLUMN `customerName` VARCHAR(191) NULL,
    ADD COLUMN `customerPhoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `customerState` VARCHAR(191) NULL,
    ADD COLUMN `customerSurname` VARCHAR(191) NULL,
    ADD COLUMN `customerZipCode` VARCHAR(191) NULL,
    ADD COLUMN `operator` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethodTypeCodename` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usertenant` MODIFY `userTenantId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PaymentMethodType_codename_key` ON `PaymentMethodType`(`codename`);

-- AddForeignKey
ALTER TABLE `UserTenant` ADD CONSTRAINT `UserTenant_userTenantId_fkey` FOREIGN KEY (`userTenantId`) REFERENCES `Tenant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_paymentMethodTypeCodename_fkey` FOREIGN KEY (`paymentMethodTypeCodename`) REFERENCES `PaymentMethodType`(`codename`) ON DELETE RESTRICT ON UPDATE CASCADE;
