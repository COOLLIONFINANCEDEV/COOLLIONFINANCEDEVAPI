import { PureAbility, RawRule } from '@casl/ability';
import { ICASL, ICustomRequest, TEndpoint } from '../types/app.type';
import { getPrismaModelField } from '../utils/get-prisma-model-field.helper';

export const loadPermissionsForUser = (auth: ICustomRequest["auth"]) => {
    if (auth === undefined)
        throw new Error("auth is undefined");

    const { userId, tenantId, tenantPermissions, userPermissions } = auth;
    const abilities: Set<RawRule<ICASL.AppAbility>> = new Set();

    tenantPermissions.forEach(permission => {
        const [action, subject, ...fields] = permission.split("__");
        abilities.add({
            action: action as ICASL.Action,
            subject: subject as ICASL.Subjects,
            fields: fields[0] !== "" || fields.length > 0 ? fields : undefined,
            // conditions: { tenantId }
        });
    });

    userPermissions.forEach(permission => {
        const [action, subject, ...fields] = permission.split("__");

        abilities.add({
            action: action as ICASL.Action,
            subject: subject as ICASL.Subjects,
            fields: fields.length > 0 ? fields : undefined,
            // conditions: { userId }
        });
    });

    const abilityChecker = new PureAbility<ICASL.AppAbility>([...abilities], {
        fieldMatcher: (fields: string[]) => (field) => fields.includes(field),
        conditionsMatcher: (conditions: any) => (rule) => {
            if (!rule.conditions) return true;

            const entries = Object.entries(rule.conditions);

            return entries.every(([key, value]) => conditions[key] === value);
        }
    });

    return {
        can: (...[action, subject, field, options]: ICASL.CustomCanParameter) => {
            const { ignore = false } = options || {};

            if (!ignore) {
                const subjectFields = getPrismaModelField(subject);
                // field = name || nameOther
                if (field !== undefined
                    && !subjectFields?.includes(field)
                    && !subjectFields?.includes(field.substring(0, field.lastIndexOf("O"))))
                    throw new Error(`Field "${field}" does not exist in model "${subject}"`);
            }
            return abilityChecker.can(action, subject, field);
        },
        cannot: (...[action, subject, field]: ICASL.CustomCanParameter) => {
            const subjectFields = getPrismaModelField(subject);
            if (!subjectFields?.includes(field)) throw new Error(`Field "${field}" does not exist in model" ${subject}"`);

            return abilityChecker.cannot(action, subject, field);
        },
        relevantRuleFor: abilityChecker.relevantRuleFor
    }
};


// const ability = loadPermissionsForUser({
//     userId: 1, tenantId: 2, sessionId: "8",
//     userPermissions: ["read__Tenant__nameOther", "read__Tenant__name", "update__Tenant__accountType", "manage__User__password"],
//     tenantPermissions: []
// });

// console.log(ability.can("create", "User", "firstName"));
// console.log(ability.can("read", "Tenant", "nameOther"));
// console.log(ability.can("read", "Tenant", "name"));
// console.log(ability.can("manage", "User", "password"));
// console.log(ability.can("manage", "User", "firstName"));
// console.log(ability.can("update", "User", "name"));

