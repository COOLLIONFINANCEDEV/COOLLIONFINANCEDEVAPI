/*
  Warnings:

  - You are about to drop the column `description` on the `offer` table. All the data in the column will be lost.
  - You are about to drop the column `start_payment` on the `offer` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `offer` DROP COLUMN `description`,
    DROP COLUMN `start_payment`,
    DROP COLUMN `summary`;
