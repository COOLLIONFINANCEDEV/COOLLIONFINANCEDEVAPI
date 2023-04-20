-- AlterTable
ALTER TABLE `Project` MODIFY `carouselImage` LONGTEXT NULL,
    MODIFY `docs` LONGTEXT NOT NULL,
    MODIFY `impactImage` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Tenant` MODIFY `profilePhoto` LONGTEXT NULL;
