-- AlterTable
ALTER TABLE `investment` MODIFY `amount_with_interest_rate` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `offer` MODIFY `funds_to_raise` DOUBLE NOT NULL DEFAULT 0.0;
