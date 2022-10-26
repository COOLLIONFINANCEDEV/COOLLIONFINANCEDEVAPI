/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `oauth` MODIFY `code_challenge_method` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;
