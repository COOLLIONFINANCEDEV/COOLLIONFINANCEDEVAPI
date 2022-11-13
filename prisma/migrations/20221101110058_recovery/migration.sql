/*
  Warnings:

  - You are about to alter the column `investment_term` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `offer` MODIFY `investment_term` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `first_name` VARCHAR(191) NOT NULL DEFAULT 'Undefined',
    MODIFY `last_name` VARCHAR(191) NOT NULL DEFAULT 'Undefined',
    MODIFY `contact` VARCHAR(191) NOT NULL DEFAULT 'Undefined';
