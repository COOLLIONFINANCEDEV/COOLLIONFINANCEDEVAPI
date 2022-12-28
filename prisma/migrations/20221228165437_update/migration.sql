/*
  Warnings:

  - You are about to drop the column `investment_term` on the `offer` table. All the data in the column will be lost.
  - Changed the type of `loan_length` on the `offer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `offer` DROP COLUMN `investment_term`,
    DROP COLUMN `loan_length`,
    ADD COLUMN `loan_length` DATETIME(3) NOT NULL;
