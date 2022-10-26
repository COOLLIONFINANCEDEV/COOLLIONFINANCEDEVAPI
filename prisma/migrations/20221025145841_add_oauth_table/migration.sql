/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `code` to the `oauth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `oauth` ADD COLUMN `code` TEXT NOT NULL,
    ALTER COLUMN `code_challenge_method` DROP DEFAULT,
    MODIFY `refresh_token` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;
