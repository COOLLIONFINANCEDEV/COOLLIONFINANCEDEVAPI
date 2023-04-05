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

