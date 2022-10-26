/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `offer_repayment_plan` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
