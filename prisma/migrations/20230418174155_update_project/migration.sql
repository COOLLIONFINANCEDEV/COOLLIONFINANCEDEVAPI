/*
  Warnings:

  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `amountRequested` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docs` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impactImage` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loanApplicationSpecial` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectCountry` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectTitle` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teaserTitle` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `title`,
    ADD COLUMN `amountRequested` DOUBLE NOT NULL,
    ADD COLUMN `carouselImage` TEXT NULL,
    ADD COLUMN `docs` TEXT NOT NULL,
    ADD COLUMN `impactImage` TEXT NOT NULL,
    ADD COLUMN `loanApplicationSpecial` VARCHAR(191) NOT NULL,
    ADD COLUMN `loanInformation` VARCHAR(191) NULL,
    ADD COLUMN `projectCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `projectTitle` VARCHAR(191) NOT NULL,
    ADD COLUMN `story` VARCHAR(191) NULL,
    ADD COLUMN `teaserTitle` VARCHAR(191) NOT NULL;
