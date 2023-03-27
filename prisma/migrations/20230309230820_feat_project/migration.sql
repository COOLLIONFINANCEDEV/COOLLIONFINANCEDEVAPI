-- DropIndex
DROP INDEX `Project_title_owner_key` ON `project`;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `desabled` BOOLEAN NOT NULL DEFAULT true;
