/*
  Warnings:

  - Added the required column `collectionDate` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `investment` ADD COLUMN `collectionDate` DATETIME(3) NOT NULL;
