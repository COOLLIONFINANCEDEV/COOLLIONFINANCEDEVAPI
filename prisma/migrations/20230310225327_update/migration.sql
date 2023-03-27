/*
  Warnings:

  - You are about to drop the column `desabled` on the `investmentterm` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `desabled` on the `paymentmethod` table. All the data in the column will be lost.
  - You are about to drop the column `desabled` on the `paymentmethodtype` table. All the data in the column will be lost.
  - You are about to drop the column `desabled` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the `acceptedcurrencies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `paymentmethod` DROP FOREIGN KEY `PaymentMethod_currencyId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_currencyId_fkey`;

-- AlterTable
ALTER TABLE `investmentterm` DROP COLUMN `desabled`,
    ADD COLUMN `disabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `paymentmethod` DROP COLUMN `currencyId`,
    DROP COLUMN `desabled`,
    ADD COLUMN `disabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `paymentmethodtype` DROP COLUMN `desabled`,
    ADD COLUMN `disabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `desabled`,
    ADD COLUMN `disabled` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `currencyId`;

-- DropTable
DROP TABLE `acceptedcurrencies`;
