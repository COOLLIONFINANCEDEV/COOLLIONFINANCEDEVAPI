/*
  Warnings:

  - You are about to drop the column `repayment_schedule` on the `offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `offer` DROP COLUMN `repayment_schedule`,
    ALTER COLUMN `expected_return` DROP DEFAULT;
