/*
  Warnings:

  - Added the required column `transactionId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `transactionId` VARCHAR(191) NOT NULL;
