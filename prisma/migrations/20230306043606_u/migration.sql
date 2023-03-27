/*
  Warnings:

  - You are about to drop the column `accountDeleted` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tenant` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `accountDeleted`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;
