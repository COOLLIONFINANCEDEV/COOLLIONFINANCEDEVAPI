/*
  Warnings:

  - Added the required column `codename` to the `AccountType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounttype` ADD COLUMN `codename` VARCHAR(191) NOT NULL;
