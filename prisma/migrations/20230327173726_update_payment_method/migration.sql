/*
  Warnings:

  - You are about to drop the column `bank` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `iban` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodTypeId` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `rib` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `paymentMethodTypeCodename` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `paymentmethod` DROP FOREIGN KEY `PaymentMethod_paymentMethodTypeId_fkey`;

-- AlterTable
ALTER TABLE `paymentmethod` DROP COLUMN `bank`,
    DROP COLUMN `iban`,
    DROP COLUMN `paymentMethodTypeId`,
    DROP COLUMN `phone`,
    DROP COLUMN `rib`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `customerAddress` VARCHAR(191) NULL,
    ADD COLUMN `customerCity` VARCHAR(191) NULL,
    ADD COLUMN `customerCountry` VARCHAR(191) NULL,
    ADD COLUMN `customerEmail` VARCHAR(191) NULL,
    ADD COLUMN `customerName` VARCHAR(191) NULL,
    ADD COLUMN `customerPhoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `customerState` VARCHAR(191) NULL,
    ADD COLUMN `customerSurname` VARCHAR(191) NULL,
    ADD COLUMN `customerZipCode` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethodTypeCodename` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `phone`;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_paymentMethodTypeCodename_fkey` FOREIGN KEY (`paymentMethodTypeCodename`) REFERENCES `PaymentMethodType`(`codename`) ON DELETE RESTRICT ON UPDATE CASCADE;
