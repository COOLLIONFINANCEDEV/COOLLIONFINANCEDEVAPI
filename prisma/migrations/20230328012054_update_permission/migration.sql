/*
  Warnings:

  - A unique constraint covering the columns `[codename]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Permission_codename_key` ON `Permission`(`codename`);
