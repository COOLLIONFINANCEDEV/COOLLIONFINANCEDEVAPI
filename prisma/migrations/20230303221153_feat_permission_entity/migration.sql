/*
  Warnings:

  - A unique constraint covering the columns `[accountTypeId,permissionId]` on the table `AccountsTypesPermissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountTypeId,roleId]` on the table `AccountsTypesRoles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permissionId,roleId]` on the table `PermissionRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,permissionId]` on the table `UsersPermissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tenantId,roleId]` on the table `UsersTenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codename` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permission` ADD COLUMN `codename` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AccountsTypesPermissions_accountTypeId_permissionId_key` ON `AccountsTypesPermissions`(`accountTypeId`, `permissionId`);

-- CreateIndex
CREATE UNIQUE INDEX `AccountsTypesRoles_accountTypeId_roleId_key` ON `AccountsTypesRoles`(`accountTypeId`, `roleId`);

-- CreateIndex
CREATE UNIQUE INDEX `PermissionRole_permissionId_roleId_key` ON `PermissionRole`(`permissionId`, `roleId`);

-- CreateIndex
CREATE UNIQUE INDEX `UsersPermissions_userId_permissionId_key` ON `UsersPermissions`(`userId`, `permissionId`);

-- CreateIndex
CREATE UNIQUE INDEX `UsersTenants_userId_tenantId_roleId_key` ON `UsersTenants`(`userId`, `tenantId`, `roleId`);
