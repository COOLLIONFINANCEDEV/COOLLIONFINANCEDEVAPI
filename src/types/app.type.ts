import { CanParameters, PureAbility, RawRule } from "@casl/ability";
import Joi from "@hapi/joi";
import { Prisma } from "@prisma/client";
import { Request } from "express";

export type TJoiValidationError = {
    message: string;
    context: {
        key: string;
    };
};

export type TJoiSimplifiedError = {
    field: string;
    message: string;
};


export namespace ICASL {
    export type Action = "manage" | "create" | "read" | "update" | "delete";
    export type Subjects = Prisma.ModelName;
    export type AppAbility = [Action, Subjects];
    export type CustomRawRule = RawRule<ICASL.AppAbility> & { mainRule?: boolean };
    export type CustomCanParameter = [
        ...param: CanParameters<ICASL.AppAbility>,
        options?: {
            /** Ignore field checking, default: false. */
            ignore?: boolean
        }
    ];
    export type AbilityVerb = (...args: ICASL.CustomCanParameter) => boolean;
}


interface IEndpoint {
    [x: string]: {
        method: "post" | "put" | "patch" | "get" | "delete",
        path: string,
        schema?: Joi.ObjectSchema<any>
        authorizationRules?: ICASL.CustomRawRule[]
    };
};
export type TEndpoint = IEndpoint;


export interface ICustomRequest extends Request {
    clientInfo?: {
        ip: string | string[] | undefined;
        browser: UAParser.IBrowser
        engine: UAParser.IEngine
        os: UAParser.IOS
        device: UAParser.IDevice
        cpu: UAParser.ICPU
    };

    auth?: {
        userId: number;
        tenantId: number;
        sessionId: string;

        /**
         * TenantsPermissions
         * 
         * [[tenantId, [permissionCodename, ...]], ...]
         */
        tenantPermissions: string[];

        /**
         * AppPermissions
         * 
         * [permissionCodename, read__user, ...]
        */
        userPermissions: string[];
        rooms: string[];
    }


    abilities?: {
        can: ICASL.AbilityVerb;
        relevantRuleFor: PureAbility["relevantRuleFor"];
        cannot: ICASL.AbilityVerb;
    }
}

export type TAccountTypesCodename = "ZERO" | "LENDER" | "LENDER_COMMUNITY" | "BORROWER" | "ADMIN";

export interface TenantStats {
    totalTenants: number;
    deletedTenants: number;
    tenantsCreatedPerDay: number;
    tenantsCreatedPerWeek: number;
    tenantsCreatedPerMonth: number;
    tenantsCreatedPerYear: number;
    transactionsReceivedPerTenant: { tenantId: number; transactionCount: number }[];
    transactionsSentPerTenant: { tenantId: number; transactionCount: number }[];
    projectsPerTenant: { tenantId: number; projectCount: number }[];
    investmentsPerTenant: { tenantId: number; investmentCount: number }[];
    walletPerTenant: { tenantId: number; walletCount: number }[];
    invitationsSentPerTenant: { tenantId: number; invitationCount: number }[];
    rolesPerTenant: { tenantId: number; roleCount: number }[];
    usersPerTenant: { tenantId: number; userCount: number }[];
    roomsPerTenant: { tenantId: number; roomCount: number }[];
}

export interface AccountTypeStats {
    totalAccountTypes: number;
    restrictedAccountTypes: number;
    accountTypesCreatedPerDay: number;
    accountTypesCreatedPerWeek: number;
    accountTypesCreatedPerMonth: number;
    accountTypesCreatedPerYear: number;
    tenantsPerAccountType: { accountTypeId: number; tenantCount: number }[];
    rolesPerAccountType: { accountTypeId: number; roleCount: number }[];
    permissionsPerAccountType: { accountTypeId: number; permissionCount: number }[];
}

export interface UserStats {
    totalUsers: number;
    deletedUsers: number;
    usersCreatedPerDay: number;
    usersCreatedPerWeek: number;
    usersCreatedPerMonth: number;
    usersCreatedPerYear: number;
    tenantsPerUser: { userId: number; tenantCount: number }[];
    permissionsPerUser: { userId: number; permissionCount: number }[];
    roomsPerUser: { userId: number; roomCount: number }[];
}

export interface UserTenantStats {
    totalUserTenantRelations: number;
    userTenantRelationsCreatedPerDay: number;
    userTenantRelationsCreatedPerWeek: number;
    userTenantRelationsCreatedPerMonth: number;
    userTenantRelationsCreatedPerYear: number;
    managersPerUserTenantRelation: { userTenantRelationId: number; managerCount: number }[];
}

export interface RoleStats {
    totalRoles: number;
    publishedRoles: number;
    rolesCreatedPerDay: number;
    rolesCreatedPerWeek: number;
    rolesCreatedPerMonth: number;
    rolesCreatedPerYear: number;
    tenantsPerRole: { roleId: number; tenantCount: number }[];
    permissionsPerRole: { roleId: number; permissionCount: number }[];
    invitationsPerRole: { roleId: number; invitationCount: number }[];
}

export interface PermissionStats {
    totalPermissions: number;
    permissionsCreatedPerDay: number;
    permissionsCreatedPerWeek: number;
    permissionsCreatedPerMonth: number;
    permissionsCreatedPerYear: number;
    accountTypesPerPermission: { permissionId: number; accountTypeCount: number }[];
    rolesPerPermission: { permissionId: number; roleCount: number }[];
    usersPerPermission: { permissionId: number; userCount: number }[];
}

export interface PermissionRoleStats {
    totalPermissionRoleRelations: number;
    permissionRoleRelationsCreatedPerDay: number;
    permissionRoleRelationsCreatedPerWeek: number;
    permissionRoleRelationsCreatedPerMonth: number;
    permissionRoleRelationsCreatedPerYear: number;
}

export interface AccountTypeRoleStats {
    totalAccountTypeRoleRelations: number;
    accountTypeRoleRelationsCreatedPerDay: number;
    accountTypeRoleRelationsCreatedPerWeek: number;
    accountTypeRoleRelationsCreatedPerMonth: number;
    accountTypeRoleRelationsCreatedPerYear: number;
}

export interface AccountTypePermissionStats {
    totalAccountTypePermissionRelations: number;
    accountTypePermissionRelationsCreatedPerDay: number;
    accountTypePermissionRelationsCreatedPerWeek: number;
    accountTypePermissionRelationsCreatedPerMonth: number;
    accountTypePermissionRelationsCreatedPerYear: number;
}

export interface UsersPermissionsStats {
    totalUsersPermissionsRelations: number;
    usersPermissionsRelationsCreatedPerDay: number;
    usersPermissionsRelationsCreatedPerWeek: number;
    usersPermissionsRelationsCreatedPerMonth: number;
    usersPermissionsRelationsCreatedPerYear: number;
}
